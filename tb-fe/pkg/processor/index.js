/**
 * @param {[{x:number,y:number}]} points
 * @param {{x:number,y:number}} offset
 * @param {{width:number,height:number}} canvas
 */
function pointsToCanvas(points, offset, canvas) {
  const pxs = points.map((p, _i, _a) => p.x);
  const pys = points.map((p, _i, _a) => p.y);

  const rxs = convertPoints(pxs, offset.x, canvas.width - offset.x, false);
  const rys = convertPoints(pys, offset.y, canvas.height - offset.y, true);

  const mPoints = [];
  for (let i = 0; i < rxs.length; i++) {
    mPoints.push({ ...points[i], x: rxs[i], y: canvas.height - rys[i] }); // flip y axis
  }
  return mPoints;
}

/**
 * @param {[number]} points
 * @param {number} start
 * @param {number} end
 * @param {boolean} shouldStartZero
 */
function convertPoints(points, start, end, shouldStartZero) {
  const from = getMinMax(points);
  if (shouldStartZero && from.min > 0) {
    from.min = 0;
  }

  const to = { min: start, max: end };

  const results = [];
  for (let i = 0; i < points.length; i++) {
    results.push(rescale(points[i], from, to));
  }

  return results;
}

/**
 * @param {number} p
 * @param {{min:number,max:number}} from
 * @param {{min:number,max:number}} to
 * @return {number}
 */
function rescale(p, from, to) {
  return ((to.max - to.min) * (p - from.min)) / (from.max - from.min) + to.min;
}

/**
 * @param {[number]} points
 */
function getMinMax(points) {
  const result = { min: 0, max: 0 };

  switch (points.length) {
    case 0:
      return result;
    case 1:
      return {
        min: points[0],
        max: points[0],
      };
    default:
      result.min = points[0];
      result.max = points[0];
  }

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p < result.min) {
      result.min = p;
    }
    if (p > result.max) {
      result.max = p;
    }
  }

  return result;
}

/**
 * @param {{x:number,y:number}} a
 * @param {{x:number,y:number}} b
 */
function gradient(a, b) {
  return (b.y - a.y) / (b.x - a.x);
}

module.exports = { pointsToCanvas, convertPoints, gradient };
