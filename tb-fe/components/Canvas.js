import React, { useRef, useEffect } from "react";

const Canvas = ({ width, height, ...props }) => {
  const canvasRef = useRef(null);

  const setSizes = (canvas, props) => {
    let width = props.width;
    let height = props.height;
    if (!width) {
      width = 100;
    }
    if (!height) {
      height = 100;
    }

    // Set display size (css pixels).
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;
  };

  const handleMouseMove = (e, mid, context) => {
    const canvas = canvasRef.current;
    const r = canvas.getBoundingClientRect();
    const offset = {
      w: r.x,
      h: r.y,
    };

    const mouseX = parseInt(e.clientX - offset.w);
    const mouseY = parseInt(e.clientY - offset.h);

    const rectX = mid.w / 2;
    const rectY = mid.h / 2;

    let hit = false;
    if (
      mouseX - rectX > 0 &&
      mouseX - rectX < mid.w &&
      mouseY - rectY > 0 &&
      mouseY - rectY < mid.h
    ) {
      hit = true;
    }

    const log = {
      mouse: "x: " + mouseX + " y: " + mouseY,
      rect: "x: " + (mouseX - rectX) + " y: " + (mouseY - rectY),
      hit: "x: " + (mouseX - rectX < mid.w) + " y: " + (mouseY - rectY < mid.h),
      box: "x: " + mid.w + " y: " + mid.h,
    };
    console.log(log);

    if (hit) {
      context.clearRect(mid.w - 50, mid.h - 10, 50, 15);
      context.fillText("bruhh", mid.w - 50, mid.h);
    } else {
      context.clearRect(mid.w - 50, mid.h - 10, 50, 15);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    setSizes(canvas, { width, height });

    // Normalize coordinate system to use css pixels.
    const scale = window.devicePixelRatio;
    context.scale(scale, scale);

    //Our first draw
    context.fillStyle = "#ffffff";
    const mid = {
      w: canvas.width / 2,
      h: canvas.height / 2,
    };
    context.fillRect(mid.w / 2, mid.h / 2, mid.w, mid.h);

    canvas.addEventListener("mousemove", function (e) {
      handleMouseMove(e, mid, context);
    });
  }, []);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
