import type { Tree } from '../types/tree.types';

interface TreeInfoTooltipProps {
  tree: Tree | undefined;
}

const TreeInfoTooltip = ({ tree }: TreeInfoTooltipProps) => {
  if (!tree) return null;

  return (
    <div className="absolute top-4 left-4 bg-white rounded-xl shadow-2xl p-4 max-w-sm border-4 border-yellow-400 z-10" dir="rtl">
      <div className="flex items-start gap-4">
        {tree.image && (
          <img
            src={tree.image}
            alt={tree.name}
            className="w-24 h-24 rounded-lg object-cover border-2 border-green-500"
          />
        )}
        <div className="flex-1">
          <p className="font-bold text-lg text-green-600 mb-1">🌳 {tree.name}</p>
          <p className="text-sm text-gray-600">
            تاريخ الغرس: {new Date(tree.timestamp).toLocaleDateString('ar-DZ', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreeInfoTooltip;
