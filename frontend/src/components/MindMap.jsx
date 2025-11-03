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

  // Initialize cytoscape graph
  useEffect(() => {
    if (!containerRef.current || terms.length === 0) return;

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
            'background-color': '#4A90E2',
            'label': 'data(label)',
            'color': '#fff',
            'text-outline-color': '#4A90E2',
            'text-outline-width': 2,
            'font-size': '12px',
            'width': 'label',
            'height': 'label',
            'padding': '12px',
            'shape': 'roundrectangle',
            'text-valign': 'center',
            'text-halign': 'center',
            'text-wrap': 'wrap',
            'text-max-width': '120px',
          },
        },
        {
          selector: 'node:selected',
          style: {
            'background-color': '#E94B3C',
            'text-outline-color': '#E94B3C',
            'border-width': 3,
            'border-color': '#fff',
          },
        },
        {
          selector: 'edge',
          style: {
            'width': 'data(weight)',
            'line-color': '#9CA8B8',
            'curve-style': 'bezier',
            'opacity': 0.5,
          },
        },
        {
          selector: 'node.highlighted',
          style: {
            'background-color': '#F39C12',
            'text-outline-color': '#F39C12',
          },
        },
        {
          selector: 'edge.highlighted',
          style: {
            'line-color': '#F39C12',
            'opacity': 0.8,
            'width': 3,
          },
        },
      ],
      layout: {
        name: 'cola',
        animate: true,
        maxSimulationTime: 3000,
        nodeSpacing: 40,
        edgeLength: 100,
        fit: true,
        padding: 50,
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
      cy.destroy();
    };
  }, [terms]);

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
    if (cyRef.current) {
      cyRef.current.fit(undefined, 50);
      cyRef.current.elements().removeClass('highlighted');
    }
    setSearchQuery('');
    setSelectedTerm(null);
  };

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
        <h1>SSR/SSG/CSR Glossary MindMap</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search terms or tags..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          <button onClick={resetView} className="reset-button">
            Reset View
          </button>
        </div>
      </div>
      
      <div className="mindmap-content">
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
      </div>
      
      <div className="mindmap-footer">
        <p>Click on nodes to view details • Search to filter • Connected nodes share tags</p>
      </div>
    </div>
  );
};

export default MindMap;
