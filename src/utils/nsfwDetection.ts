import * as nsfwjs from 'nsfwjs';
import * as tf from '@tensorflow/tfjs';

// Cache the model to avoid reloading
let model: nsfwjs.NSFWJS | null = null;
let modelLoading: Promise<nsfwjs.NSFWJS> | null = null;

/**
 * Load the NSFW detection model
 * Model is cached after first load
 */
async function loadModel(): Promise<nsfwjs.NSFWJS> {
  if (model) return model;
  
  // If already loading, return the existing promise
  if (modelLoading) return modelLoading;
  
  modelLoading = (async () => {
    try {
      console.log('جاري تحميل نموذج الكشف عن المحتوى...');
      await tf.ready();
      model = await nsfwjs.load();
      console.log('تم تحميل نموذج الكشف عن المحتوى بنجاح');
      return model;
    } catch (error) {
      console.error('فشل تحميل نموذج الكشف:', error);
      modelLoading = null;
      throw error;
    }
  })();
  
  return modelLoading;
}

export interface NSFWResult {
  isSafe: boolean;
  predictions: {
    className: string;
    probability: number;
  }[];
  reason?: string;
  maxNSFWScore?: number;
}

/**
 * Check if an image contains NSFW content
 * @param imageElement - HTMLImageElement to analyze
 * @param threshold - NSFW threshold (0-1), default 0.5
 * @returns Promise with safety result and predictions
 */
export async function checkImageNSFW(
  imageElement: HTMLImageElement,
  threshold: number = 0.5
): Promise<NSFWResult> {
  try {
    const nsfwModel = await loadModel();
    const predictions = await nsfwModel.classify(imageElement);
    
    // Get scores for NSFW categories
    const pornScore = predictions.find(p => p.className === 'Porn')?.probability || 0;
    const hentaiScore = predictions.find(p => p.className === 'Hentai')?.probability || 0;
    const sexyScore = predictions.find(p => p.className === 'Sexy')?.probability || 0;
    
    // Calculate maximum NSFW score
    const maxNSFW = Math.max(pornScore, hentaiScore, sexyScore);
    const isSafe = maxNSFW < threshold;
    
    // Find the problematic category if unsafe
    let detectedCategory = '';
    if (!isSafe) {
      if (pornScore === maxNSFW) detectedCategory = 'محتوى للبالغين';
      else if (hentaiScore === maxNSFW) detectedCategory = 'محتوى غير لائق';
      else if (sexyScore === maxNSFW) detectedCategory = 'محتوى إيحائي';
    }
    
    return {
      isSafe,
      predictions,
      maxNSFWScore: maxNSFW,
      reason: isSafe 
        ? undefined 
        : `يبدو أن الصورة تحتوي على ${detectedCategory} (${(maxNSFW * 100).toFixed(0)}% ثقة). يرجى تحميل صورة عائلية مناسبة متعلقة بغرس الأشجار.`
    };
  } catch (error) {
    console.error('فشل فحص المحتوى:', error);
    // Fail open - allow image if check fails (network issues, etc)
    return { 
      isSafe: true, 
      predictions: [],
      reason: 'فحص المحتوى غير متاح، المتابعة بحذر.'
    };
  }
}

/**
 * Preload the NSFW model in the background
 * Call this on app initialization to speed up first check
 */
export async function preloadNSFWModel(): Promise<void> {
  try {
    await loadModel();
  } catch (error) {
    console.error('فشل التحميل المسبق لنموذج الكشف:', error);
  }
}
