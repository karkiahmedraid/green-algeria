import React, { useState, useRef, useEffect } from "react";
import type { FormData } from "../types/tree.types";
import { isPointInAlgeria } from "../utils/treeUtils";
import { useTreeStorage } from "../hooks/useTreeStorage";
import { useZoomPan } from "../hooks/useZoomPan";
import {
  basicImageValidation,
  validateImageDimensions,
  compressImage,
} from "../utils/imageValidation";
import { checkImageNSFW } from "../utils/nsfwDetection";
import { treeService } from "../services/treeService";
import Header from "../components/Header";
import HowToParticipate from "../components/HowToParticipate";
import HadithSection from "../components/HadithSection";
import DraggableTree from "../components/DraggableTree";
import MapCanvas from "../components/MapCanvas";
import PlantTreeModal from "../components/PlantTreeModal";
import Footer from "../components/Footer";

const AlgeriaTreeCampaign = () => {
  // Use custom hooks for state management
  const { trees, addTree } = useTreeStorage();
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
    setPanStart,
  } = useZoomPan();

  // Local component state
  const [isDragging, setIsDragging] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTree, setCurrentTree] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const [hoveredTree, setHoveredTree] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    image: null,
    imagePreview: null,
    color: "#16a34a",
  });
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  
  // Image cache and hover timeout for lazy loading
  const [imageCache, setImageCache] = useState<Map<number, string>>(new Map());
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTreesRef = useRef<Set<number>>(new Set());

  // Lazy load tree image on hover
  useEffect(() => {
    if (!hoveredTree) {
      // Clear timeout if hover ends
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      return;
    }

    // If image is already cached, no need to load
    if (imageCache.has(hoveredTree)) {
      return;
    }

    // If already loading this tree, don't load again
    if (loadingTreesRef.current.has(hoveredTree)) {
      return;
    }

    // Set timeout to load image after 2 seconds of hover
    hoverTimeoutRef.current = setTimeout(async () => {
      try {
        loadingTreesRef.current.add(hoveredTree);
        console.log(`جاري تحميل صورة الشجرة ${hoveredTree}...`);
        
        const treeWithImage = await treeService.fetchTreeById(hoveredTree);
        
        if (treeWithImage && treeWithImage.image) {
          setImageCache(prev => {
            const newCache = new Map(prev);
            newCache.set(hoveredTree, treeWithImage.image!);
            return newCache;
          });
          
          // Update the tree in the list with the loaded image
          const treeIndex = trees.findIndex(t => t.id === hoveredTree);
          if (treeIndex !== -1) {
            trees[treeIndex].image = treeWithImage.image;
          }
        }
      } catch (error) {
        console.error(`فشل تحميل صورة الشجرة ${hoveredTree}:`, error);
      } finally {
        loadingTreesRef.current.delete(hoveredTree);
      }
    }, 2000); // 2 seconds delay

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [hoveredTree, imageCache, trees]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
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

    const hoveredTreeItem = trees.find((tree) => {
      const distance = Math.sqrt(
        (tree.x - worldX) ** 2 + (tree.y - worldY) ** 2
      );
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

  // Touch handlers for mobile pinch-to-zoom
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
    null
  );
  const [touchStartZoom, setTouchStartZoom] = useState<number>(1);

  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (
    touches: React.TouchList,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const centerX =
      ((touches[0].clientX + touches[1].clientX) / 2 - rect.left) * scaleX;
    const centerY =
      ((touches[0].clientY + touches[1].clientY) / 2 - rect.top) * scaleY;

    return { x: centerX, y: centerY };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setLastTouchDistance(getTouchDistance(e.touches));
      setTouchStartZoom(zoom);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      setPanStart({ x: touch.clientX - panX, y: touch.clientY - panY });
      setIsPanning(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2 && lastTouchDistance !== null) {
      e.preventDefault();

      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / lastTouchDistance;
      const newZoom = Math.min(Math.max(0.5, touchStartZoom * scale), 5);

      const canvas = e.currentTarget;
      const center = getTouchCenter(e.touches, canvas);

      const worldX = (center.x - panX) / zoom;
      const worldY = (center.y - panY) / zoom;

      setPanX(center.x - worldX * newZoom);
      setPanY(center.y - worldY * newZoom);
      setZoom(newZoom);
    } else if (e.touches.length === 1 && isPanning) {
      const touch = e.touches[0];
      setPanX(touch.clientX - panStart.x);
      setPanY(touch.clientY - panStart.y);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length < 2) {
      setLastTouchDistance(null);
    }
    if (e.touches.length === 0) {
      setIsPanning(false);
    }
  };

  // Form handlers
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Step 1: Basic validation (instant - file type and size)
    const basicCheck = basicImageValidation(file);
    if (!basicCheck.isValid) {
      alert(basicCheck.reason);
      e.target.value = ""; // Reset input
      return;
    }

    // Step 2: Dimension check (instant - resolution validation)
    const dimensionCheck = await validateImageDimensions(file);
    if (!dimensionCheck.isValid) {
      alert(dimensionCheck.reason);
      e.target.value = ""; // Reset input
      return;
    }

    try {
      setIsValidatingImage(true);
      
      // Step 3: Compress image to 50KB maximum
      console.log("جاري ضغط الصورة...");
      const compressedBase64 = await compressImage(file, 50);
      
      // Step 4: Create image element for NSFW detection
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = async () => {
          try {
            // Step 5: NSFW Detection (1-2 seconds - content safety check)
            console.log("جاري فحص محتوى الصورة...");
            const nsfwCheck = await checkImageNSFW(img);

            if (!nsfwCheck.isSafe) {
              setIsValidatingImage(false);
              alert(
                nsfwCheck.reason ||
                  "يبدو أن هذه الصورة تحتوي على محتوى غير لائق. يرجى تحميل صورة عائلية مناسبة متعلقة بغرس الأشجار."
              );
              e.target.value = ""; // Reset input
              reject(new Error("NSFW content detected"));
              return;
            }

            // All checks passed - set the compressed image
            console.log("تم التحقق من الصورة وضغطها بنجاح!");
            setFormData({
              ...formData,
              image: file,
              imagePreview: compressedBase64,
            });
            setIsValidatingImage(false);
            resolve();
          } catch (error) {
            setIsValidatingImage(false);
            reject(error);
          }
        };

        img.onerror = () => {
          setIsValidatingImage(false);
          alert("فشل تحميل الصورة. يرجى تجربة ملف آخر.");
          e.target.value = ""; // Reset input
          reject(new Error("Failed to load image"));
        };

        img.src = compressedBase64;
      });
    } catch (error) {
      console.error("خطأ في معالجة الصورة:", error);
      setIsValidatingImage(false);
      alert("حدث خطأ أثناء معالجة الصورة. يرجى تجربة صورة أخرى.");
      e.target.value = ""; // Reset input
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      alert("يرجى إدخال اسمك");
      return;
    }

    if (!formData.imagePreview) {
      alert("يرجى تحميل صورة من حدث الغرس");
      return;
    }

    if (currentTree) {
      try {
        const newTree = {
          x: currentTree.x,
          y: currentTree.y,
          name: formData.name,
          image: formData.imagePreview,
          color: formData.color,
          timestamp: new Date().toISOString(),
        };

        // Add tree to database
        await addTree(newTree);

        setShowModal(false);
        setFormData({
          name: "",
          image: null,
          imagePreview: null,
          color: "#16a34a",
        });
        setCurrentTree(null);
      } catch (err) {
        console.error("فشل غرس الشجرة:", err);
        alert("فشل غرس الشجرة. يرجى المحاولة مرة أخرى.");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" dir="rtl">
      <Header treesCount={trees.length} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main content with sidebar layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - How to Participate (vertical on desktop, horizontal on mobile) */}
          <aside className="lg:w-[20%] flex-shrink-0">
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
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </main>
          <aside className="lg:w-[20%] flex-shrink-0">
            <HadithSection/>
          </aside>
        </div>
      </div>

      <PlantTreeModal
        showModal={showModal}
        formData={formData}
        onClose={handleModalClose}
        onFormChange={handleFormChange}
        onImageUpload={handleImageUpload}
        onSubmit={handleSubmit}
        isValidatingImage={isValidatingImage}
      />

      <Footer />
    </div>
  );
};

export default AlgeriaTreeCampaign;
