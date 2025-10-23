import React from 'react';
import { Upload, X } from 'lucide-react';
import type { FormData } from '../types/tree.types';
import { darkenHex } from '../utils/treeUtils';

interface PlantTreeModalProps {
  showModal: boolean;
  formData: FormData;
  onClose: () => void;
  onFormChange: (data: Partial<FormData>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const PlantTreeModal = ({
  showModal,
  formData,
  onClose,
  onFormChange,
  onImageUpload,
  onSubmit
}: PlantTreeModalProps) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Plant Your Tree! 🌳</h3>
          <button
            onClick={onClose}
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
              onChange={(e) => onFormChange({ name: e.target.value })}
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
                  onChange={(e) => onFormChange({ color: e.target.value })}
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
                onChange={onImageUpload}
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
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Plant My Tree! 🌱
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantTreeModal;
