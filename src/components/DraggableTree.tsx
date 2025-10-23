import React from 'react';
import { TreeDeciduous } from 'lucide-react';

interface DraggableTreeProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DraggableTree = ({ onDragStart }: DraggableTreeProps) => {
  return (
    <div className="flex justify-center mb-6">
      <div
        draggable
        onDragStart={onDragStart}
        className="bg-transparent text-green-600 rounded-2xl p-8 cursor-move transform hover:scale-110 transition-all"
      >
        <TreeDeciduous size={64} className="mx-auto animate-bounce mb-2"  />
        <p className="text-xl font-bold text-center">Drag Me to Plant!</p>
      </div>
    </div>
  );
};

export default DraggableTree;
