import React, { useRef, useEffect } from "react";
import { convertPoints } from "~/pkg/processor";

const defData = [
  { x: 10, y: 0 },
  { x: 25, y: -50 },
  { x: 37, y: 80 },
  { x: 50, y: 10 },
  { x: 70, y: 27 },
  { x: 90, y: 0 },
];

const Lines = ({ width = 100, height = 100, points = defData, ...props }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    setSizes(canvas, width, height);

    const scale = window.devicePixelRatio;
    context.scale(scale, scale);

    draw(context, points);
  }, [width, height]);

  const setSizes = (canvas, width, height) => {
    // Set display size (css pixels).
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;
  };

  /**
   * draw loop
   * @param {CanvasRenderingContext2D} ctx
   * @param {[{x:number,y:number}]} data
   */
  const draw = (ctx, data) => {
    const offsets = { x: 30, y: 30 };

    const pxs = data.map((v, _i, _a) => v.x);
    const pys = data.map((v, _i, _a) => v.y);

    const rxs = convertPoints(pxs, offsets.x, width - offsets.x, false);
    const rys = convertPoints(pys, offsets.y, height - offsets.y, true);

    const mPoints = [];
    for (let i = 0; i < rxs.length; i++) {
      mPoints.push({ x: rxs[i], y: height - rys[i] });
    }

    ctx.lineWidth = 3;

    const radius = 7;
    const mlen = mPoints.length;
    mPoints.forEach(({ x, y }, i, arr) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();

      if (i < mlen - 1) {
        const next = arr[i + 1];
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    });
  };

  return <canvas ref={canvasRef} {...props} />;
};

export default Lines;
