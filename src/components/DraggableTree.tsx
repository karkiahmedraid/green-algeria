import React from "react";


interface DraggableTreeProps {
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const DraggableTree = ({ onDragStart }: DraggableTreeProps) => {
  return (
    <div className="flex  justify-center " dir="rtl">
      <div
        draggable
        onDragStart={onDragStart}
        className="text-green-600 rounded-2xl p-8 cursor-move transform hover:scale-110 transition-all"
      >
        {/* <TreeDeciduous size={64} className="mx-auto animate-bounce mb-2"  /> */}

        <div className="flex animate-bounce justify-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            className="hover:scale-110 transition-transform"
          >
            {/* Tree shadow */}
            <ellipse cx="42" cy="64" rx="12" ry="6" fill="rgba(0,0,0,0.2)" />

            {/* Tree trunk */}
            <rect x="36" y="50" width="8" height="18" fill="#92400e" rx="2" />

            {/* Tree foliage - base layer (darker) */}
            <circle cx="40" cy="40" r="14" fill={"#3a8730"} />

            {/* Tree foliage - top layers (main color) */}
            <circle cx="33" cy="36" r="11" fill={"green"} />
            <circle cx="47" cy="36" r="11" fill={"green"} />
          </svg>
        </div>
        <p className="text-xl font-bold text-center">اسحبني لغرسي! 🌱</p>
      </div>
    </div>
  );
};

export default DraggableTree;
