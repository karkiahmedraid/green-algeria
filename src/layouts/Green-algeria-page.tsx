import React, { useState } from 'react';
import type { Tree, FormData } from '../types/tree.types';
import { isPointInAlgeria } from '../utils/treeUtils';
import { useTreeStorage } from '../hooks/useTreeStorage';
import { useZoomPan } from '../hooks/useZoomPan';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import HowToParticipate from '../components/HowToParticipate';
import DraggableTree from '../components/DraggableTree';
import MapCanvas from '../components/MapCanvas';
import PlantTreeModal from '../components/PlantTreeModal';
import Footer from '../components/Footer';

const AlgeriaTreeCampaign = () => {
  // Use custom hooks for state management
  const { trees, setTrees } = useTreeStorage();
  const {
    zoom,
    setZoom,
    panX,
    setPanX,
    panY,
    setPanY,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart
  } = useZoomPan();

  // Local component state
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTree, setCurrentTree] = useState<{ x: number; y: number; id: number } | null>(null);
  const [hoveredTree, setHoveredTree] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', image: null, imagePreview: null, color: '#16a34a' });

  // Accurate Algeria border coordinates extracted from actual SVG
  const getAlgeriaBorderPath = () => {
    // Scaled coordinates from the SVG viewBox (0 0 912 1024) to canvas (800x600)
    const scale = (x: number, y: number) => ({
      x: (x / 912) * 800,
      y: (y / 1024) * 600
    });
    
    return [
      // Starting from northwest, going clockwise around Algeria
      scale(345, 80),    // Northwest corner near Morocco
      scale(407, 48),    // 
      scale(457, 31),    //
      scale(492, 28),    //
      scale(526, 19),    //
      scale(572, 13),    // Northern coast area
      scale(603, 20),    //
      scale(634, 13),    //
      scale(671, 10),    //
      scale(696, 6),     //
      scale(731, 11),    // Northeast area
      scale(750, 8),     //
      scale(740, 70),    // Eastern border start
      scale(741, 125),   //
      scale(721, 160),   //
      scale(710, 207),   //
      scale(738, 240),   //
      scale(777, 282),   //
      scale(795, 374),   //
      scale(792, 385),   //
      scale(809, 448),   //
      scale(818, 523),   //
      scale(817, 592),   // Eastern border middle
      scale(813, 598),   //
      scale(822, 644),   //
      scale(832, 672),   //
      scale(841, 693),   //
      scale(892, 710),   // Southeast corner
      scale(901, 763),   //
      scale(893, 783),   //
      scale(748, 899),   // Southern border
      scale(711, 933),   //
      scale(648, 991),   //
      scale(540, 1023),  // Southwest area
      scale(529, 1020),  //
      scale(498, 963),   //
      scale(476, 948),   //
      scale(458, 935),   //
      scale(438, 919),   //
      scale(430, 908),   //
      scale(416, 885),   //
      scale(227, 733),   // Western border
      scale(7, 557),     //
      scale(2, 466),     //
      scale(8, 454),     //
      scale(40, 428),    //
      scale(88, 409),    //
      scale(104, 397),   //
      scale(135, 394),   //
      scale(155, 382),   //
      scale(169, 363),   //
      scale(215, 340),   //
      scale(215, 316),   //
      scale(214, 312),   //
      scale(247, 290),   //
      scale(254, 283),   //
      scale(268, 271),   //
      scale(323, 270),   //
      scale(328, 265),   //
      scale(330, 251),   //
      scale(310, 212),   //
      scale(310, 210),   //
      scale(307, 188),   //
      scale(307, 176),   //
      scale(307, 160),   //
      scale(306, 146),   //
      scale(300, 132),   //
      scale(292, 123),   // Back to northwest
      scale(302, 111),   //
    ];
  };

  const isPointInAlgeria = (x: number, y: number) => {
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
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Save the context state
    ctx.save();

    // Apply zoom and pan transformations
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#dbeafe');
    gradient.addColorStop(1, '#fef9c3');
    ctx.fillStyle = gradient;
    ctx.fillRect(-panX / zoom, -panY / zoom, width / zoom, height / zoom);

    // Draw Algeria with accurate borders
    const borderPath = getAlgeriaBorderPath();
    
    ctx.save();
    
    // Shadow for 3D effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 25 / zoom;
    ctx.shadowOffsetX = 8 / zoom;
    ctx.shadowOffsetY = 8 / zoom;

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
    ctx.lineWidth = 4 / zoom;
    ctx.beginPath();
    ctx.moveTo(borderPath[0].x, borderPath[0].y);
    borderPath.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();

    // Draw planted trees at their exact positions
    trees.forEach(tree => {
      // Adjust tree size inversely to zoom - smaller when zoomed out, larger when zoomed in
      const treeScale = 1 / zoom;
      
      // Tree shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(tree.x + 2 * treeScale, tree.y + 22 * treeScale, 8 * treeScale, 4 * treeScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tree trunk
      ctx.fillStyle = '#92400e';
      ctx.fillRect(tree.x - 2 * treeScale, tree.y + 10 * treeScale, 4 * treeScale, 12 * treeScale);

      // Tree foliage (use selected color)
      const foliageColor = (tree as any).color || '#16a34a';
      const darker = darkenHex(foliageColor, 18);
      ctx.fillStyle = darker;
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, 8 * treeScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = foliageColor;
      ctx.beginPath();
      ctx.arc(tree.x - 3 * treeScale, tree.y - 2 * treeScale, 6 * treeScale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(tree.x + 3 * treeScale, tree.y - 2 * treeScale, 6 * treeScale, 0, Math.PI * 2);
      ctx.fill();

      // Highlight hovered tree
      if (hoveredTree === tree.id) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3 / zoom;
        ctx.beginPath();
        ctx.arc(tree.x, tree.y, 15 * treeScale, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Restore the context state
    ctx.restore();
  }, [trees, hoveredTree, zoom, panX, panY]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Get mouse position in canvas space
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    // Transform to world coordinates accounting for zoom and pan
    const x = (mouseX - panX) / zoom;
    const y = (mouseY - panY) / zoom;

    // Check if drop is within Algeria boundaries
    if (isPointInAlgeria(x, y)) {
      setCurrentTree({ x, y, id: Date.now() });
      setShowModal(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Transform mouse coordinates to canvas space accounting for zoom and pan
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    
    // Convert to world coordinates
    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;

    const hoveredTreeItem = trees.find(tree => {
      const distance = Math.sqrt((tree.x - worldX) ** 2 + (tree.y - worldY) ** 2);
      // Adjust hit detection radius based on tree scale (which is 1/zoom)
      const hitRadius = 15 / zoom;
      return distance < hitRadius;
    });

    setHoveredTree(hoveredTreeItem ? hoveredTreeItem.id : null);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Zoom factor
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(0.5, zoom * delta), 5);

    // Adjust pan to zoom towards mouse position
    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;
    
    setPanX(mouseX - worldX * newZoom);
    setPanY(mouseY - worldY * newZoom);
    setZoom(newZoom);
  };

  // Handle canvas mouse down for panning
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) { // Left click
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  // Handle canvas mouse up
  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  // Handle panning
  const handlePan = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, imagePreview: reader.result as string });
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
        color: formData.color,
        timestamp: new Date().toISOString()
      };
      setTrees([...trees, newTree]);
      setShowModal(false);
      setFormData({ name: '', image: null, imagePreview: null, color: '#16a34a' });
      setCurrentTree(null);
    }
  };

  // Small helper to darken a hex color for shading/highlight
  const darkenHex = (hex: string, amount = 20) => {
    const c = hex.replace('#','');
    const num = parseInt(c,16);
    let r = (num >> 16) - amount;
    let g = ((num >> 8) & 0x00FF) - amount;
    let b = (num & 0x0000FF) - amount;
    r = Math.max(0, r); g = Math.max(0, g); b = Math.max(0, b);
    return '#' + ( (r << 16) | (g << 8) | b ).toString(16).padStart(6,'0');
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
          <p className="text-center text-gray-600 mb-4">
            Drop your tree in your region - Use mouse wheel to zoom, click and drag to pan
          </p>
          
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMouseMove={(e) => {
                handleCanvasMouseMove(e);
                handlePan(e);
              }}
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onWheel={handleWheel}
              className={`w-full h-auto border-4 border-green-200 rounded-xl ${
                isDragging ? 'ring-4 ring-green-400' : ''
              } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                aria-label="Close"
                title="Close"
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
                <label className="block text-gray-700 font-semibold mb-2">Tree Color 🎨</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      id="tree-color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="absolute inset-0 w-full h-full opacity-0"
                      title="Choose tree color"
                    />
                    <label 
                      htmlFor="tree-color" 
                      className="cursor-pointer block"
                      title="Click to choose tree color"
                    >
                      <svg width="80" height="80" viewBox="0 0 80 80" className="hover:scale-110 transition-transform">
                        {/* Tree shadow */}
                        <ellipse cx="42" cy="64" rx="12" ry="6" fill="rgba(0,0,0,0.2)" />
                        
                        {/* Tree trunk */}
                        <rect x="36" y="50" width="8" height="18" fill="#92400e" rx="2" />
                        
                        {/* Tree foliage - base layer (darker) */}
                        <circle cx="40" cy="40" r="14" fill={darkenHex(formData.color, 18)} />
                        
                        {/* Tree foliage - top layers (main color) */}
                        <circle cx="33" cy="36" r="11" fill={formData.color} />
                        <circle cx="47" cy="36" r="11" fill={formData.color} />
                      </svg>
                    </label>
                  </div>
                
                </div>
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