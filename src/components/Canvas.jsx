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
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Redraw image if exists
      if (currentImage) {
        drawImageToCanvas(currentImage);
      }
    }
  }, [backgroundColor, ctx, currentImage]);

  const drawImageToCanvas = (image) => {
    if (!ctx) return;

    // Calculate dimensions to maintain aspect ratio
    const scale = Math.min(
      canvasRef.current.width / image.width,
      canvasRef.current.height / image.height
    );
    const x = (canvasRef.current.width - image.width * scale) / 2;
    const y = (canvasRef.current.height - image.height * scale) / 2;

    // Set blend mode to difference for better visibility
    ctx.globalCompositeOperation = 'difference';
    
    // Draw image
    ctx.drawImage(
      image,
      x,
      y,
      image.width * scale,
      image.height * scale
    );

    // Reset blend mode
    ctx.globalCompositeOperation = 'source-over';
  };

  const drawImage = async (imageUrl) => {
    if (!ctx) return;

    try {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      // Use a CORS proxy to handle IPFS images
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
  };

  const startDrawing = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setCurrentPath([[x, y]]);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath(prev => [...prev, [x, y]]);

    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = 'difference';
      ctx.moveTo(currentPath[currentPath.length - 1][0], currentPath[currentPath.length - 1][1]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }, [isDrawing, ctx, currentPath]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setPaths(prev => [...prev, currentPath]);
      setCurrentPath([]);
      setIsDrawing(false);
    }
  }, [isDrawing, currentPath]);

  const undoLastPath = useCallback(() => {
    if (paths.length === 0) return;

    // Remove the last path from the paths array
    setPaths(prev => prev.slice(0, -1));

    // Redraw everything
    if (ctx) {
      // Clear and redraw background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Redraw image if exists
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
  }, [paths, ctx, backgroundColor, currentImage]);

  const saveCanvasAsPNG = useCallback(() => {
    if (!canvasRef.current) return;

    // Create a temporary link element
    const link = document.createElement('a');
    
    // Get the canvas data as a PNG
    const dataUrl = canvasRef.current.toDataURL('image/png');
    
    // Set up the download
    link.download = 'web3stick-creation.png';
    link.href = dataUrl;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [canvasRef]);

  return {
    canvasElement: (
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    ),
    drawImage,
    undoLastPath,
    saveCanvasAsPNG
  }
};

Canvas.propTypes = {
  backgroundColor: PropTypes.string.isRequired
};