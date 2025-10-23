import React, { useRef, useEffect } from 'react';
import type { Tree } from '../types/tree.types';
import { getAlgeriaBorderPath, darkenHex } from '../utils/treeUtils';
import TreeInfoTooltip from './TreeInfoTooltip';

interface MapCanvasProps {
  trees: Tree[];
  isDragging: boolean;
  hoveredTree: number | null;
  zoom: number;
  panX: number;
  panY: number;
  isPanning: boolean;
  onDragOver: (e: React.DragEvent<HTMLCanvasElement>) => void;
  onDrop: (e: React.DragEvent<HTMLCanvasElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  onWheel: (e: React.WheelEvent<HTMLCanvasElement>) => void;
}

const MapCanvas = ({
  trees,
  isDragging,
  hoveredTree,
  zoom,
  panX,
  panY,
  isPanning,
  onDragOver,
  onDrop,
  onMouseMove,
  onMouseDown,
  onMouseUp,
  onWheel
}: MapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Prevent page scroll when mouse is over canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('wheel', preventScroll, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', preventScroll);
    };
  }, []);

  // Canvas rendering effect
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
      const foliageColor = tree.color || '#16a34a';
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

  const hoveredTreeData = trees.find(t => t.id === hoveredTree);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Together we make algeria green</h2>
      <p className="text-center text-gray-600 mb-4">
        Drop your tree in your region - Use mouse wheel to zoom, click and drag to pan
      </p>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onWheel={onWheel}
          className={`w-full h-auto border-4 border-green-200 rounded-xl ${
            isDragging ? 'ring-4 ring-green-400' : ''
          } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        />
        <TreeInfoTooltip tree={hoveredTreeData} />
      </div>
    </div>
  );
};

export default MapCanvas;
