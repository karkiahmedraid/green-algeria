export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

/**
 * Basic client-side image validation
 * Checks file type, size, and basic properties
 */
export function basicImageValidation(file: File): ValidationResult {
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return { 
      isValid: false, 
      reason: 'نوع الملف غير صالح. يرجى تحميل صور JPEG أو PNG أو WebP.' 
    };
  }

  // Check maximum file size (5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      reason: 'الصورة كبيرة جداً. الحد الأقصى للحجم هو 5 ميغابايت.' 
    };
  }

  // Check minimum file size (10KB to prevent tiny/placeholder images)
  const minSize = 10 * 1024;
  if (file.size < minSize) {
    return { 
      isValid: false, 
      reason: 'الصورة صغيرة جداً. يرجى تحميل صورة واضحة.' 
    };
  }

  return { isValid: true };
}

/**
 * Validate image dimensions
 * Ensures image meets minimum and maximum resolution requirements
 */
export async function validateImageDimensions(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      // Check minimum dimensions
      if (img.width < 200 || img.height < 200) {
        resolve({ 
          isValid: false, 
          reason: 'دقة الصورة منخفضة جداً. الحد الأدنى المطلوب 200×200 بكسل.' 
        });
        return;
      }

      // Check maximum dimensions
      if (img.width > 4000 || img.height > 4000) {
        resolve({ 
          isValid: false, 
          reason: 'دقة الصورة عالية جداً. الحد الأقصى المسموح 4000×4000 بكسل.' 
        });
        return;
      }

      resolve({ isValid: true });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ 
        isValid: false, 
        reason: 'ملف صورة غير صالح أو تالف.' 
      });
    };

    img.src = url;
  });
}
