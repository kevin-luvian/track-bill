import React, { useRef, useEffect } from "react";

const Canvas = ({ width=100, height=100, ...props }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    setSizes(canvas, width, height);

    const scale = window.devicePixelRatio;
    context.scale(scale, scale);
  }, []);

  const setSizes = (canvas, width, height) => {
    // Set display size (css pixels).
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;
  };

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
