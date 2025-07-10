export function hexToRgba(color: string, alpha: number = 1): string {
  // Eğer color zaten rgba formatındaysa: rgba(255, 255, 255, 0.5)
  if (color.startsWith('rgba')) {
    return color.replace(/rgba\(([^)]+),\s*[\d.]+\)/, `rgba($1, ${alpha})`);
  }

  // Eğer color rgb formatındaysa: rgb(255, 255, 255)
  if (color.startsWith('rgb')) {
    return color.replace(/rgb\(([^)]+)\)/, `rgba($1, ${alpha})`);
  }

  // HEX ise: #fff veya #ffffff
  let hex = color.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }

  if (hex.length !== 6) {
    throw new Error('Geçersiz hex kodu');
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default hexToRgba;
