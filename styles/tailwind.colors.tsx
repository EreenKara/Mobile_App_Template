import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../tailwind.config.js';
import colors from 'tailwindcss/colors';

const fullConfig = resolveConfig(tailwindConfig);
const customColors = fullConfig.theme?.colors;

export const defaultColors = colors;
export default customColors;
