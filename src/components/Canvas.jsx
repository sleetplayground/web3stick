import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/playground.module.css';

export const Canvas = ({ backgroundColor }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);

  const drawImageToCanvas = useCallback((image) => {
    if (!ctx || !canvasRef.current) return;

    const scale = Math.min(
      canvasRef.current.width / image.width,
      canvasRef.current.height / image.height
    );
    const x = (canvasRef.current.width - image.width * scale) / 2;
    const y = (canvasRef.current.height - image.height * scale) / 2;

    ctx.globalCompositeOperation = 'difference';
    ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
    ctx.globalCompositeOperation = 'source-over';
  }, [ctx]);

  const drawImage = useCallback(async (imageUrl) => {
    if (!ctx) return;

    try {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      const proxyUrl = imageUrl.includes('ipfs.io')
        ? `https://cors-anywhere.herokuapp.com/${imageUrl}`
        : imageUrl;

      await new Promise((resolve, reject) => {
        image.onload = () => {
          setCurrentImage(image);
          resolve();
        };
        image.onerror = (error) => reject(error || new Error('Failed to load image'));
        image.src = proxyUrl;
      });
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  }, [ctx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1080;
      canvas.height = 1080;
      const context = canvas.getContext('2d');
      setCtx(context);
    }
  }, []);

  useEffect(() => {
    if (ctx && backgroundColor) {
      // Clear and set background
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw image if exists
      if (currentImage) {
        ctx.globalCompositeOperation = 'difference';
        drawImageToCanvas(currentImage);
      }

      // Draw paths
      paths.forEach(path => {
        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.globalCompositeOperation = 'difference';
        path.forEach(([x, y], i) => {
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
    }
  }, [backgroundColor, ctx, currentImage, paths, drawImageToCanvas]);

  const undoLastPath = useCallback(() => {
    if (paths.length > 0) {
      setPaths(prev => prev.slice(0, -1));
      // Redraw canvas
      if (ctx) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if (currentImage) {
          drawImageToCanvas(currentImage);
        }
        // Redraw remaining paths
        paths.slice(0, -1).forEach(path => {
          ctx.beginPath();
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.globalCompositeOperation = 'difference';
          path.forEach(([x, y], i) => {
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          });
          ctx.stroke();
        });
      }
    }
  }, [paths, ctx, backgroundColor, currentImage, drawImageToCanvas]);

  const getCanvasCoordinates = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.style.overflow = 'hidden';
    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([[x, y]]);
  }, [getCanvasCoordinates]);

  const draw = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDrawing) return;
    const { x, y } = getCanvasCoordinates(e);
    setCurrentPath(prev => [...prev, [x, y]]);

    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = 'difference';
      ctx.moveTo(currentPath[currentPath.length - 1][0], currentPath[currentPath.length - 1][1]);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    }
  }, [isDrawing, ctx, currentPath, getCanvasCoordinates]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      document.body.style.overflow = '';
      setPaths(prev => [...prev, currentPath]);
      setCurrentPath([]);
      setIsDrawing(false);
    }
  }, [isDrawing, currentPath]);

  const saveCanvasAsPNG = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'web3stick.png';
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  }, []);

  return {
    canvasElement: (
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        onTouchCancel={stopDrawing}
      />
    ),
    drawImage,
    saveCanvasAsPNG,
    undoLastPath
  };
};

Canvas.propTypes = {
  backgroundColor: PropTypes.string.isRequired
};