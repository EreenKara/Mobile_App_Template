import {TextStyle} from 'react-native';
import Colors from '../common/colors';
import styleNumbers from '../common/style.numbers';

const baseText: TextStyle = {
  fontSize: styleNumbers.textSize,
  fontWeight: '500',
  color: Colors.getTheme().text,
};
interface TextStylesSchema {
  title: TextStyle;
  subtitle: TextStyle;
  paragraph: TextStyle;
  small: TextStyle;
  link: TextStyle;
  error: TextStyle;
}
const textStyles: TextStylesSchema = {
  // Başlık stilleri

  title: {
    ...baseText,
    fontSize: styleNumbers.textSize * 1.5,
    fontWeight: 'bold',
  },

  subtitle: {
    ...baseText,
    fontSize: styleNumbers.textSize * 1.2,
    fontWeight: '600',
  },

  // Paragraf stilleri
  paragraph: {
    ...baseText,
    lineHeight: styleNumbers.textSize * 1.5,
  },

  // Küçük yazı stilleri

  small: {
    ...baseText,
    fontSize: styleNumbers.textSize * 0.8,
  },

  // Link stilleri
  link: {
    ...baseText,
    color: Colors.getTheme().button,
    textDecorationLine: 'underline',
  },
  error: {
    ...baseText,
    color: Colors.getTheme().error,
    fontSize: styleNumbers.textSize,
  },
};

export default textStyles;
export type {TextStylesSchema};
