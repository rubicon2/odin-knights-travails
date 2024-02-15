export function getRangedRandom(min, max) {
  const range = max - min;
  return min + Math.random() * range;
}

export function getRangedRandomInt(min, max) {
  return Math.round(getRangedRandom(min, max));
}
