export function PointInside(point, vs) {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  var x = point[0],
    y = point[1];

  var inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0],
      yi = vs[i][1];
    var xj = vs[j][0],
      yj = vs[j][1];

    var intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

export function checkOverlap(R, Xc, Yc, X1, Y1, X2, Y2) {
  // Find the nearest point on the
  // rectangle to the center of
  // the circle
  let Xn = Math.max(X1, Math.min(Xc, X2));
  let Yn = Math.max(Y1, Math.min(Yc, Y2));

  // Find the distance between the
  // nearest point and the center
  // of the circle
  // Distance between 2 points,
  // (x1, y1) & (x2, y2) in
  // 2D Euclidean space is
  // ((x1-x2)**2 + (y1-y2)**2)**0.5
  let Dx = Xn - Xc;
  let Dy = Yn - Yc;
  return Dx * Dx + Dy * Dy <= R * R;
}
export const hasIntersection = ({x: cx, y: cy, r: cr}, {x, y, width, height}) => {
  const distX = Math.abs(cx - x - width / 2);
  const distY = Math.abs(cy - y - height / 2);

  if (distX > (width / 2 + cr)) {
    return false;
  }
  if (distY > (height / 2 + cr)) {
    return false;
  }

  if (distX <= (width / 2)) {
    return true;
  }
  if (distY <= (height / 2)) {
    return true;
  }

  const Δx = distX - width / 2;
  const Δy = distY - height / 2;
  return Δx * Δx + Δy * Δy <= cr * cr;
};