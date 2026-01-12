import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import './MindMap.css';

// Register the layout
cytoscape.use(cola);

const MindMap = () => {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('glossary'); // 'glossary' or 'graph'

  // Fetch glossary terms from API
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/terms');
        if (!response.ok) {
          throw new Error('Failed to fetch terms');
        }
        const data = await response.json();
        setTerms(data.terms);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching terms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  // Initialize cytoscape graph only in graph mode
  useEffect(() => {
    if (viewMode !== 'graph' || !containerRef.current || terms.length === 0) return;

    // Create nodes from terms
    const nodes = terms.map(term => ({
      data: {
        id: term.id,
        label: term.term,
        tags: term.tags,
        shortDef: term.short_definition,
      },
    }));

    // Create edges based on shared tags
    const edges = [];
    const edgeSet = new Set(); // Prevent duplicate edges

    terms.forEach((term, i) => {
      terms.slice(i + 1).forEach(otherTerm => {
        const sharedTags = term.tags.filter(tag => otherTerm.tags.includes(tag));
        if (sharedTags.length > 0) {
          const edgeId = `${term.id}-${otherTerm.id}`;
          if (!edgeSet.has(edgeId)) {
            edges.push({
              data: {
                id: edgeId,
                source: term.id,
                target: otherTerm.id,
                weight: sharedTags.length,
                sharedTags,
              },
            });
            edgeSet.add(edgeId);
          }
        }
      });
    });

    // Initialize cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#ffffff',
            'label': 'data(label)',
            'color': '#667eea',
            'text-outline-color': '#ffffff',
            'text-outline-width': 3,
            'font-size': '16px',
            'font-weight': 'bold',
            'width': 'label',
            'height': 'label',
            'padding': '24px',
            'shape': 'roundrectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '180px',
            'border-width': 3,
            'border-color': '#667eea',
            'box-shadow': '0 6px 20px rgba(0, 0, 0, 0.2)',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#667eea',
            'color': '#ffffff',
            'text-outline-color': '#667eea',
            'border-width': 4,
            'border-color': '#fff',
            'box-shadow': '0 8px 30px rgba(102, 126, 234, 0.5)',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 'mapData(weight, 1, 5, 2, 6)',
            'line-color': 'rgba(255, 255, 255, 0.5)',
            'curve-style': 'bezier',
            'opacity': 0.7,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#764ba2',
            'color': '#ffffff',
            'text-outline-color': '#764ba2',
            'border-color': '#fff',
            'border-width': 4,
            'box-shadow': '0 8px 30px rgba(118, 75, 162, 0.5)',
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': 'rgba(255, 255, 255, 0.9)',
            'opacity': 1,
            'width': 5,
          },
        },
      ],
      layout: {
        name: 'cola',
        animate: true,
        maxSimulationTime: 4000,
        nodeSpacing: 80,
        edgeLength: 180,
        fit: true,
        padding: 80,
        convergenceThreshold: 0.01,
        refresh: 20,
      },
    });

    // Handle node clicks
    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const termData = terms.find(t => t.id === node.id());
      setSelectedTerm(termData);

      // Highlight connected nodes
      cy.elements().removeClass('highlighted');
      node.addClass('highlighted');
      node.connectedEdges().addClass('highlighted');
      node.connectedEdges().connectedNodes().addClass('highlighted');
    });

    // Handle background clicks
    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedTerm(null);
        cy.elements().removeClass('highlighted');
      }
    });

    cyRef.current = cy;

    // Cleanup
    return () => {
      if (cy) {
        cy.destroy();
      }
    };
  }, [terms, viewMode]);

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!cyRef.current) return;

    if (query.trim() === '') {
      cyRef.current.elements().removeClass('highlighted');
      setSelectedTerm(null);
      return;
    }

    const lowerQuery = query.toLowerCase();
    cyRef.current.elements().removeClass('highlighted');

    // Find and highlight matching nodes
    const matchingNodes = cyRef.current.nodes().filter(node => {
      const label = node.data('label').toLowerCase();
      const tags = node.data('tags');
      return label.includes(lowerQuery) || 
             tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    });

    if (matchingNodes.length > 0) {
      matchingNodes.addClass('highlighted');
      matchingNodes.connectedEdges().addClass('highlighted');
      
      // Fit to matching nodes
      cyRef.current.fit(matchingNodes, 50);
    }
  };

  const resetView = () => {
    if (cyRef.current && viewMode === 'graph') {
      cyRef.current.fit(undefined, 50);
      cyRef.current.elements().removeClass('highlighted');
    }
    setSearchQuery('');
    setSelectedTerm(null);
  };

  // Filter terms based on search
  const filteredTerms = terms.filter(term => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      term.term.toLowerCase().includes(lowerQuery) ||
      term.short_definition.toLowerCase().includes(lowerQuery) ||
      term.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });

  if (loading) {
    return (
      <div className="mindmap-container">
        <div className="loading">Loading glossary terms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mindmap-container">
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mindmap-container">
      <div className="mindmap-header">
        <div className="header-top">
          <a href="https://itmo.ru/" target="_blank" rel="noopener noreferrer" className="logo">ИТМО</a>
          <a href="https://github.com/CheikhEbeoumar" target="_blank" rel="noopener noreferrer" className="user-info">
            <div className="user-avatar">CE</div>
            <span className="user-name">Cheikh Ebeoumar</span>
          </a>
        </div>
        
        <div className="view-tabs">
          <button 
            className={`tab-button ${viewMode === 'glossary' ? 'active' : ''}`}
            onClick={() => setViewMode('glossary')}
          >
            📖 Glossary
          </button>
          <button 
            className={`tab-button ${viewMode === 'graph' ? 'active' : ''}`}
            onClick={() => setViewMode('graph')}
          >
            🔗 Semantic graph
          </button>
        </div>
      </div>
      
      <div className="mindmap-content">
        {viewMode === 'glossary' ? (
          <div className="glossary-view">
            <div className="glossary-grid">
              {filteredTerms.map((term) => (
                <div 
                  key={term.id} 
                  className="glossary-card"
                  onClick={() => setSelectedTerm(term)}
                >
                  <h3 className="card-title">{term.term}</h3>
                  <p className="card-description">{term.short_definition}</p>
                </div>
              ))}
            </div>
            
            {selectedTerm && (
              <div className="term-details-modal" onClick={() => setSelectedTerm(null)}>
                <div className="term-details-content" onClick={(e) => e.stopPropagation()}>
                  <button 
                    className="close-button"
                    onClick={() => setSelectedTerm(null)}
                  >
                    ×
                  </button>
                  <h2>{selectedTerm.term}</h2>
                  <div className="term-section">
                    <h3>Short Definition</h3>
                    <p>{selectedTerm.short_definition}</p>
                  </div>
                  <div className="term-section">
                    <h3>Detailed Explanation</h3>
                    <p>{selectedTerm.long_definition}</p>
                  </div>
                  <div className="term-section">
                    <h3>Tags</h3>
                    <div className="tags">
                      {selectedTerm.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="term-section">
                    <h3>References</h3>
                    <ul className="sources">
                      {selectedTerm.sources.map((source, idx) => (
                        <li key={idx}>
                          <a href={source} target="_blank" rel="noopener noreferrer">
                            {source}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div ref={containerRef} className="graph-container" />
            
            {selectedTerm && (
              <div className="term-details">
                <button 
                  className="close-button"
                  onClick={() => setSelectedTerm(null)}
                >
                  ×
                </button>
                <h2>{selectedTerm.term}</h2>
                <div className="term-section">
                  <h3>Short Definition</h3>
                  <p>{selectedTerm.short_definition}</p>
                </div>
                <div className="term-section">
                  <h3>Detailed Explanation</h3>
                  <p>{selectedTerm.long_definition}</p>
                </div>
                <div className="term-section">
                  <h3>Tags</h3>
                  <div className="tags">
                    {selectedTerm.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="term-section">
                  <h3>References</h3>
                  <ul className="sources">
                    {selectedTerm.sources.map((source, idx) => (
                      <li key={idx}>
                        <a href={source} target="_blank" rel="noopener noreferrer">
                          {source}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MindMap;
