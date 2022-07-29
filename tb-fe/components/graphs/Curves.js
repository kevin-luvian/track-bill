import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { convertPoints, gradient, pointsToCanvas } from "~/pkg/processor";
import { roundRect } from "~/pkg/processor/draw";

const defData = [
  { x: 10, y: -10, d: "-10" },
  { x: 25, y: -50, d: "-50" },
  { x: 37, y: 80, d: "80" },
  { x: 50, y: 10, d: "10" },
  { x: 70, y: 27, d: "27" },
  { x: 90, y: 0, d: "0" },
];

/**
 * @returns {CanvasRenderingContext2D}
 */
function getContext(canvas) {
  const context = canvas.getContext("2d");
  return context;
}

const Curves = ({ width = 0, height = 0, points = defData, ...props }) => {
  const coverRef = useRef(null);
  const canvasRef = useRef(null);
  const bgcolor = "#2D1674";
  const fgcolor = "white";
  const lineWidth = 3;

  const getPoints = useCallback(() => {
    if (width == 0) return [];
    const offset = { x: 30, y: 50 };
    const canvas = { width, height };
    return pointsToCanvas(points, offset, canvas);
  }, [points, width, height]);

  useEffect(() => {
    const canvas = coverRef.current;
    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [getPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    setup(canvas, width, height);

    const cover = coverRef.current;
    setup(cover, width, height);

    const context = canvas.getContext("2d");
    draw(context);
  }, [width, height]);

  const setup = (canvas, width, height) => {
    const context = canvas.getContext("2d");

    // Set display size (css pixels).
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    const scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
    canvas.width = width * scale;
    canvas.height = height * scale;

    context.scale(scale, scale);
  };

  /**
   * draw loop
   * @param {CanvasRenderingContext2D} ctx
   */
  const draw = (ctx) => {
    const mPoints = getPoints();
    if (mPoints.length == 0) return;

    ctx.lineWidth = lineWidth;

    // draw curved lines
    const f = -0.25;
    const t = 0.02;

    let m = 0;
    let dx1 = 0;
    let dx2 = 0;
    let dy1 = 0;
    let dy2 = 0;
    let preP = mPoints[0];

    ctx.beginPath();
    ctx.moveTo(mPoints[0].x, mPoints[0].y);

    mPoints.forEach((curP, i, arr) => {
      const nexP = points[i + 1];
      if (nexP) {
        m = gradient(preP, nexP);
        dx2 = (nexP.x - curP.x) * -f;
        dy2 = dx2 * m * t;
      } else {
        dx2 = 0;
        dy2 = 0;
      }

      ctx.bezierCurveTo(
        preP.x - dx1,
        preP.y - dy1,
        curP.x + dx2,
        curP.y + dy2,
        curP.x,
        curP.y
      );

      dx1 = dx2;
      dy1 = dy2;
      preP = curP;
    });

    ctx.fillStyle = fgcolor;
    ctx.fill();

    ctx.strokeStyle = bgcolor;
    ctx.stroke();

    // draw points
    const radius = 7;
    mPoints.forEach(({ x, y }, i, arr) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fillStyle = bgcolor;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius - 3, 0, Math.PI * 2, true);
      ctx.fillStyle = fgcolor;
      ctx.fill();
    });
  };

  // show tooltip when mouse hovers over dot
  function handleMouseMove(e) {
    const cover = coverRef.current;
    const ctx = getContext(cover);

    const coverRect = cover.getBoundingClientRect();
    const mouseX = parseInt(e.clientX - coverRect.left);
    const mouseY = parseInt(e.clientY - coverRect.top);

    const mPoints = getPoints();
    const radius = 10;
    const rXr = Math.pow(radius, 2);

    // Put your mousemove stuff here
    let hit = false;
    for (var i = 0; i < mPoints.length; i++) {
      var p = mPoints[i];
      var dx = mouseX - p.x;
      var dy = mouseY - p.y;

      if (dx * dx + dy * dy < rXr) {
        ctx.clearRect(0, 0, cover.width, cover.height);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, true);
        ctx.fillStyle = bgcolor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius - 3, 0, Math.PI * 2, true);
        ctx.fillStyle = fgcolor;
        ctx.fill();

        const boxSize = { w: 80, h: 30, px: 10, py: 5 };

        // flip up-down
        if (p.y < height / 2) {
          p.y = p.y + 2 * radius + boxSize.h;
        }
        // flip left-right
        if (p.x > width / 2) {
          p.x = p.x - 2 * radius - boxSize.w;
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        roundRect(
          ctx,
          p.x + radius,
          p.y - radius - boxSize.h,
          boxSize.w,
          boxSize.h,
          7
        );

        ctx.font =
          "15px SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace";
        ctx.fillStyle = fgcolor;
        ctx.fillText(
          p.d,
          p.x + radius + boxSize.px,
          p.y - radius - boxSize.h + boxSize.py + 15
        );
        hit = true;
      }
    }
    if (!hit) {
      ctx.clearRect(0, 0, cover.width, cover.height);
    }
  }

  return (
    <div className="position-relative">
      <canvas ref={coverRef} {...props} style={{ position: "absolute" }} />
      <canvas ref={canvasRef} {...props} />
    </div>
  );
};

export default Curves;
