export default function VectorPoint({point, angle, radius, centerX, centerY}) {
  let theta = point + angle;
  theta = (Math.PI * theta) / 180; // convert to radians.
  // const radius = 1.4142;
  // const centerX = 3;
  //const centerY = 3;
  const p = {};
  p.x = Math.round(centerX + radius * Math.cos(theta));
  p.y = Math.round(centerY - radius * Math.sin(theta));
  return [p.x, p.y];
}
