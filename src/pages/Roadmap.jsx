import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../compnents/Header';
import mermaid from 'mermaid';
import roadmapData from '../data/roadmapData.json';


export default function Roadmap() {
  const { facultyId } = useParams();
  const mermaidRef = useRef(null);
  const navigate = useNavigate();
  const [diagram, setDiagram] = useState('');

  const generateMermaidDiagram = (data) => {
    let diagram = 'graph TD;\n';
    
    const processNode = (node, parentId = null) => {
      const currentId = node.id;
      
      diagram += `${currentId}["${node.name}"];\n`;
      
      if (parentId) {
        diagram += `${parentId} --> ${currentId};\n`;
      }
      
      if (node.children) {
        node.children.forEach(child => processNode(child, currentId));
      }
    };

    const facultyData = data[facultyId];
    if (facultyData && facultyData.children) {
      facultyData.children.forEach(node => processNode(node));
    }

    return diagram;
  };

  const handleNodeClick = (nodeId, nodeName) => {
    navigate(`/chat/${facultyId}/${nodeId}`, { 
      state: { topic: nodeName } 
    });
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      flowchart: {
        nodeSpacing: 50,
        rankSpacing: 80,
        curve: 'basis',
        useMaxWidth: true,
        htmlLabels: true,
        padding: 20,
      },
      themeVariables: {
        primaryColor: '#2563EB',
        primaryTextColor: '#FFFFFF',
        primaryBorderColor: '#1E40AF',
        lineColor: '#94A3B8',
        secondaryColor: '#3B82F6',
        tertiaryColor: '#BFDBFE',
        mainBkg: 'transparent',
        nodeBorder: '#1E40AF',
        clusterBkg: 'transparent',
        clusterBorder: '#E2E8F0',
        edgeLabelBackground: '#FFFFFF',
      },
      securityLevel: 'loose',
    });

    const newDiagram = generateMermaidDiagram(roadmapData);
    setDiagram(newDiagram);

    const clickHandler = (e) => {
      const nodeElement = e.target.closest('.node');
      if (nodeElement) {
        const nodeId = nodeElement.id;
        const nodeLabelElement = nodeElement.querySelector('.nodeLabel');
        if (nodeLabelElement) {
          const nodeText = nodeLabelElement.textContent.replace(/['"]/g, '');
          handleNodeClick(nodeId, nodeText);
        }
      }
    };
    const mermaidContainer = mermaidRef.current;
    if (mermaidContainer) {
      mermaidContainer.addEventListener('click', clickHandler);
    }

    return () => {
      if (mermaidContainer) {
        mermaidContainer.removeEventListener('click', clickHandler);
      }
    };
  }, [facultyId, navigate]);

  useEffect(() => {
    if (diagram && mermaidRef.current) {
      mermaid.render('mermaid-diagram', diagram)
        .then(({ svg }) => {
          mermaidRef.current.innerHTML = svg;
          
          const styleElement = document.createElement('style');
          styleElement.textContent = `
            #mermaid-diagram-svg {
              background-color: transparent !important;
            }

            .node rect {
              rx: 15px !important;
              ry: 15px !important;
              fill: #2563EB !important;
              stroke: #1E40AF !important;
              stroke-width: 1px !important;
            }

            .node text {
              fill: #FFFFFF !important;
              font-family: Golos,Open Sans,Arial,sans-serif !important;
              font-weight: 600 !important;
              font-size: 14px !important;
              dominant-baseline: middle !important;
            }

            #mermaid-diagram .label text, #mermaid-diagram span {
              fill: #FFFFFF !important;
              color: #FFFFFF !important;
            }


            .edgePath path.path {
              stroke: #94A3B8 !important;
              stroke-width: 2px !important;
              marker-end: none !important;
            }

            .edgePath:nth-of-type(odd) path.path {
              stroke-dasharray: none !important;
            }

            .edgePath:nth-of-type(even) path.path {
              stroke-dasharray: 5, 5 !important;
            }

            .edgePath marker {
              display: none !important;
            }

            .edgeLabel {
              background-color: transparent !important;
            }

            .node:hover rect {
              fill: #3B82F6 !important;
              filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.07));
            }
          `;

          const svgElement = mermaidRef.current.querySelector('svg');
          svgElement.style.backgroundColor = 'transparent';
          svgElement.appendChild(styleElement);
        })
        .catch(error => {
          console.error('Ошибка при рендеринге диаграммы:', error);
        });
    }
  }, [diagram]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <Header />
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          План обучения: {facultyId}
        </h1>
        <div className="bg-transparent dark:bg-gray-800 rounded-lg shadow-sm">
          <div 
            ref={mermaidRef} 
            className="mermaid-diagram min-w-[800px] p-6"
            style={{
              backgroundColor: 'transparent',
            }}
          />
        </div>
      </div>
    </div>
  );
}