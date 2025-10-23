import React, { useState } from 'react';
import type { FormData } from '../types/tree.types';
import { isPointInAlgeria } from '../utils/treeUtils';
import { useTreeStorage } from '../hooks/useTreeStorage';
import { useZoomPan } from '../hooks/useZoomPan';
import Header from '../components/Header';
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

  // Drag and drop handlers
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

    // Transform client coordinates to canvas world coordinates
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const x = (mouseX - panX) / zoom;
    const y = (mouseY - panY) / zoom;

    // Check if drop is within Algeria boundaries
    if (isPointInAlgeria(x, y)) {
      setCurrentTree({ x, y, id: Date.now() });
      setShowModal(true);
    }
  };

  // Canvas interaction handlers
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;

    const hoveredTreeItem = trees.find(tree => {
      const distance = Math.sqrt((tree.x - worldX) ** 2 + (tree.y - worldY) ** 2);
      const hitRadius = 15 / zoom;
      return distance < hitRadius;
    });

    setHoveredTree(hoveredTreeItem ? hoveredTreeItem.id : null);

    // Handle panning
    if (isPanning) {
      setPanX(e.clientX - panStart.x);
      setPanY(e.clientY - panStart.y);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(0.5, zoom * delta), 5);

    const worldX = (mouseX - panX) / zoom;
    const worldY = (mouseY - panY) / zoom;

    setPanX(mouseX - worldX * newZoom);
    setPanY(mouseY - worldY * newZoom);
    setZoom(newZoom);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  // Form handlers
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

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentTree(null);
  };

  const handleFormChange = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header treesCount={trees.length} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main content with sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - How to Participate (vertical on desktop, horizontal on mobile) */}
          <aside className="lg:w-80 flex-shrink-0">
            <HowToParticipate />
          </aside>

          {/* Main content area */}
          <main className="flex-1 space-y-6">
            
            <DraggableTree onDragStart={handleDragStart} />
            
            <MapCanvas
              trees={trees}
              isDragging={isDragging}
              hoveredTree={hoveredTree}
              zoom={zoom}
              panX={panX}
              panY={panY}
              isPanning={isPanning}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onMouseMove={handleCanvasMouseMove}
              onMouseDown={handleCanvasMouseDown}
              onMouseUp={handleCanvasMouseUp}
              onWheel={handleWheel}
            />
          </main>
        </div>
      </div>

      <PlantTreeModal
        showModal={showModal}
        formData={formData}
        onClose={handleModalClose}
        onFormChange={handleFormChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
      />

      <Footer />
    </div>
  );
};

export default AlgeriaTreeCampaign;
