import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '@/styles/playground.module.css';

export const Canvas = ({ backgroundColor }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 600;
      const context = canvas.getContext('2d');
      setCtx(context);
    }
  }, []);

  useEffect(() => {
    if (ctx && backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [backgroundColor, ctx]);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
    />
  );
};

Canvas.propTypes = {
  backgroundColor: PropTypes.string.isRequired
};