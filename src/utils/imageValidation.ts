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
 * Ensures image meets minimum resolution requirements
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

/**
 * Compress image to reduce file size to target maximum
 * Uses iterative compression to achieve target size
 * @param file - Original image file
 * @param targetSizeKB - Target maximum size in KB (default 50KB)
 * @returns Compressed image as base64 string
 */
export async function compressImage(
  file: File,
  targetSizeKB: number = 50
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      
      const targetBytes = targetSizeKB * 1024;
      
      // Start with reasonable dimensions and quality
      let maxDimension = 800;
      let quality = 0.8;
      let attempts = 0;
      const maxAttempts = 10;
      
      const compress = (): string => {
        attempts++;
        
        // Calculate dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }
        
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('فشل إنشاء سياق الرسم'));
          return '';
        }
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 with compression
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate actual size (base64 is ~33% larger than binary)
        const base64Length = compressedBase64.length - 'data:image/jpeg;base64,'.length;
        const sizeBytes = (base64Length * 3) / 4;
        
        // If size is acceptable or we've tried too many times, return
        if (sizeBytes <= targetBytes || attempts >= maxAttempts) {
          console.log(`ضغط الصورة: ${Math.round(sizeBytes / 1024)}KB (الهدف: ${targetSizeKB}KB), المحاولة: ${attempts}`);
          return compressedBase64;
        }
        
        // Adjust compression parameters for next attempt
        if (sizeBytes > targetBytes * 1.5) {
          // Way too large - reduce dimensions significantly
          maxDimension = Math.floor(maxDimension * 0.8);
          quality = Math.max(0.5, quality * 0.9);
        } else {
          // Close to target - just reduce quality
          quality = Math.max(0.3, quality * 0.85);
        }
        
        // Try again
        return compress();
      };
      
      const result = compress();
      resolve(result);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('فشل تحميل الصورة للضغط'));
    };

    img.src = url;
  });
}
