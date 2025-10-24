import React from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import type { FormData } from '../types/tree.types';
import { darkenHex } from '../utils/treeUtils';

interface PlantTreeModalProps {
  showModal: boolean;
  formData: FormData;
  onClose: () => void;
  onFormChange: (data: Partial<FormData>) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isValidatingImage?: boolean;
}

const PlantTreeModal = ({
  showModal,
  formData,
  onClose,
  onFormChange,
  onImageUpload,
  onSubmit,
  isValidatingImage = false
}: PlantTreeModalProps) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">اغرس شجرتك! 🌳</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="إغلاق"
            title="إغلاق"
          >
            <X size={24} />
          </button>
        </div>
        <div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">اسمك</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onFormChange({ name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none"
              placeholder="أدخل اسمك"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">لون الشجرة 🎨</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  id="tree-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => onFormChange({ color: e.target.value })}
                  className="absolute inset-0 w-full h-full opacity-0"
                  title="اختر لون الشجرة"
                />
                <label
                  htmlFor="tree-color"
                  className="cursor-pointer block"
                  title="انقر لاختيار لون الشجرة"
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
            <label className="block text-gray-700 font-semibold mb-2">تحميل الصورة</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isValidatingImage}
              />
              <label htmlFor="image-upload" className={isValidatingImage ? "cursor-not-allowed" : "cursor-pointer"}>
                {isValidatingImage ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="mx-auto mb-2 text-green-600 animate-spin" size={48} />
                    <p className="text-gray-600 font-semibold">جاري التحقق من الصورة...</p>
                    <p className="text-gray-500 text-sm mt-1">فحص سلامة المحتوى</p>
                  </div>
                ) : formData.imagePreview ? (
                  <img
                    src={formData.imagePreview}
                    alt="معاينة"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                ) : (
                  <div>
                    <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                    <p className="text-gray-600">انقر لتحميل صورة الغرس</p>
                  </div>
                )}
              </label>
            </div>
          </div>
          <button
            onClick={onSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            اغرس شجرتي! 🌱
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantTreeModal;
