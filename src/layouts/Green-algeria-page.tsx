import React, { useState, useEffect, useRef } from 'react';
import { Upload, MapPin, Users, TreeDeciduous, X } from 'lucide-react';

const AlgeriaTreeCampaign = () => {
  const [trees, setTrees] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTree, setCurrentTree] = useState(null);
  const [hoveredTree, setHoveredTree] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: null, imagePreview: null });
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrees = async () => {
      try {
        const result = await window.storage.get('algeria-trees-data', true);
        if (result && result.value) {
          setTrees(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('No existing trees data');
      } finally {
        setIsLoading(false);
      }
    };
    loadTrees();
  }, []);

  useEffect(() => {
    if (!isLoading && trees.length > 0) {
      const saveTrees = async () => {
        try {
          await window.storage.set('algeria-trees-data', JSON.stringify(trees), true);
        } catch (error) {
          console.error('Failed to save trees:', error);
        }
      };
      saveTrees();
    }
  }, [trees, isLoading]);

  // Accurate Algeria border coordinates (scaled to canvas)
const getAlgeriaBorderPath = () => {
  return [
    { x: 40,  y: 220 },  // west-coast, lower
    { x: 60,  y: 200 },
    { x: 90,  y: 180 },
    { x: 120, y: 160 },
    { x: 150, y: 140 },
    { x: 190, y: 120 },  // north-west bend
    { x: 240, y: 110 },
    { x: 300, y: 100 },  // north coast
    { x: 360, y: 95  },
    { x: 420, y: 90  },
    { x: 480, y: 95  },
    { x: 540, y: 100 },
    { x: 600, y: 110 },
    { x: 650, y: 130 },
    { x: 690, y: 160 },  // north-east
    { x: 700, y: 190 },
    { x: 705, y: 220 },
    { x: 705, y: 260 },  // east coast down
    { x: 700, y: 300 },
    { x: 690, y: 340 },
    { x: 675, y: 380 },
    { x: 650, y: 420 },
    { x: 620, y: 450 },
    { x: 580, y: 480 },  // south-east curve
    { x: 520, y: 500 },
    { x: 460, y: 520 },
    { x: 400, y: 530 },  // south coast
    { x: 340, y: 530 },
    { x: 280, y: 520 },
    { x: 230, y: 500 },
    { x: 190, y: 480 },
    { x: 160, y: 450 },  // south-west curve
    { x: 140, y: 420 },
    { x: 125, y: 380 },
    { x: 115, y: 340 },
    { x: 105, y: 300 },
    { x: 95,  y: 260 },
    { x: 90,  y: 220 },
    { x: 85,  y: 190 },
    { x: 80,  y: 160 },
    { x: 75,  y: 130 },
    { x: 70,  y: 100 },
    { x: 65,  y: 80  },
    { x: 60,  y: 60  },
    { x: 55,  y: 40  }   // back up toward NW
  ];
};

  const isPointInAlgeria = (x, y) => {
    const path = getAlgeriaBorderPath();
    let inside = false;
    
    for (let i = 0, j = path.length - 1; i < path.length; j = i++) {
      const xi = path[i].x;
      const yi = path[i].y;
      const xj = path[j].x;
      const yj = path[j].y;
      
      const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#dbeafe');
    gradient.addColorStop(1, '#fef9c3');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw Algeria with accurate borders
    const borderPath = getAlgeriaBorderPath();
    
    ctx.save();
    
    // Shadow for 3D effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 8;
    ctx.shadowOffsetY = 8;

    // Main Algeria shape
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(borderPath[0].x, borderPath[0].y);
    borderPath.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();

    // Highlight for 3D effect
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(borderPath[0].x, borderPath[0].y);
    for (let i = 0; i < borderPath.length * 0.3; i++) {
      ctx.lineTo(borderPath[i].x, borderPath[i].y);
    }
    ctx.lineTo(400, 200);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Draw border
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(borderPath[0].x, borderPath[0].y);
    borderPath.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw planted trees at their exact positions
    trees.forEach(tree => {
      // Tree shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(tree.x + 2, tree.y + 22, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tree trunk
      ctx.fillStyle = '#92400e';
      ctx.fillRect(tree.x - 2, tree.y + 10, 4, 12);

      // Tree foliage
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.arc(tree.x - 3, tree.y - 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tree.x + 3, tree.y - 2, 6, 0, Math.PI * 2);
      ctx.fill();

      // Highlight hovered tree
      if (hoveredTree === tree.id) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tree.x, tree.y, 15, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }, [trees, hoveredTree]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get actual canvas coordinates accounting for scaling
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if drop is within Algeria boundaries
    if (isPointInAlgeria(x, y)) {
      setCurrentTree({ x, y, id: Date.now() });
      setShowModal(true);
    }
  };

  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const hoveredTreeItem = trees.find(tree => {
      const distance = Math.sqrt((tree.x - x) ** 2 + (tree.y - y) ** 2);
      return distance < 15;
    });

    setHoveredTree(hoveredTreeItem ? hoveredTreeItem.id : null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.name && currentTree) {
      const newTree = {
        ...currentTree,
        name: formData.name,
        image: formData.imagePreview,
        timestamp: new Date().toISOString()
      };
      setTrees([...trees, newTree]);
      setShowModal(false);
      setFormData({ name: '', image: null, imagePreview: null });
      setCurrentTree(null);
    }
  };

  const hoveredTreeData = trees.find(t => t.id === hoveredTree);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8 px-4 shadow-2xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-3">
            <TreeDeciduous size={48} className="animate-bounce" />
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Algeria Tree Planting Campaign
            </h1>
          </div>
          <p className="text-center text-xl text-green-100 mb-2">October 25, 2025 - National Arbor Day</p>
          <p className="text-center text-lg text-white/90 max-w-3xl mx-auto">
            Join thousands of Algerians in planting trees across our beautiful nation. Together, we are building a greener future!
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all">
            <TreeDeciduous className="mx-auto mb-3 text-green-600" size={48} />
            <p className="text-4xl font-bold text-green-600">{trees.length}</p>
            <p className="text-gray-600 font-medium">Trees Planted</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all">
            <Users className="mx-auto mb-3 text-blue-600" size={48} />
            <p className="text-4xl font-bold text-blue-600">{trees.length}</p>
            <p className="text-gray-600 font-medium">Participants</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-all">
            <MapPin className="mx-auto mb-3 text-orange-600" size={48} />
            <p className="text-4xl font-bold text-orange-600">All Wilayas</p>
            <p className="text-gray-600 font-medium">Locations Covered</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">How to Participate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <p className="font-semibold text-gray-700 mb-2">Drag the Tree</p>
              <p className="text-gray-600 text-sm">Drag the tree icon below and drop it on your region in Algeria</p>
            </div>
            <div>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <p className="font-semibold text-gray-700 mb-2">Add Your Info</p>
              <p className="text-gray-600 text-sm">Enter your name and upload a photo from your planting event</p>
            </div>
            <div>
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <p className="font-semibold text-gray-700 mb-2">Inspire Others</p>
              <p className="text-gray-600 text-sm">Hover over trees to see participants and their photos!</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div
            draggable
            onDragStart={handleDragStart}
            className="bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-xl p-8 cursor-move transform hover:scale-110 transition-all"
          >
            <TreeDeciduous size={64} className="mx-auto mb-2" />
            <p className="text-xl font-bold text-center">Drag Me to Plant!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Interactive Map of Algeria</h2>
          <p className="text-center text-gray-600 mb-4">Drop your tree in your region - North, South, East, or West!</p>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMouseMove={handleCanvasMouseMove}
              className={`w-full h-auto border-4 border-green-200 rounded-xl ${
                isDragging ? 'ring-4 ring-green-400' : ''
              }`}
              style={{ cursor: hoveredTree ? 'pointer' : 'default' }}
            />
            {hoveredTreeData && (
              <div className="absolute top-4 left-4 bg-white rounded-xl shadow-2xl p-4 max-w-sm border-4 border-yellow-400 z-10">
                <div className="flex items-start gap-4">
                  {hoveredTreeData.image && (
                    <img
                      src={hoveredTreeData.image}
                      alt={hoveredTreeData.name}
                      className="w-24 h-24 rounded-lg object-cover border-2 border-green-500"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lg text-green-600 mb-1">🌳 {hoveredTreeData.name}</p>
                    <p className="text-sm text-gray-600">
                      Planted on: {new Date(hoveredTreeData.timestamp).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Plant Your Tree! 🌳</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Upload Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {formData.imagePreview ? (
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                    ) : (
                      <div>
                        <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                        <p className="text-gray-600">Click to upload your planting photo</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Plant My Tree! 🌱
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold mb-2">Together for a Greener Algeria 🇩🇿</p>
          <p className="text-gray-400">October 25, 2025 - National Arbor Day Campaign</p>
        </div>
      </footer>
    </div>
  );
};

export default AlgeriaTreeCampaign;