import {ViewStyle} from 'react-native';
import Colors from '../common/colors';
import shadowStyle from '../individual/shadow.style';
import styleNumbers from '../common/style.numbers';

interface ViewStylesSchema {
  container: ViewStyle;
  centerContainer: ViewStyle;
  card: ViewStyle;
  roundedContainer: ViewStyle;
}

const viewStyles: ViewStylesSchema = {
  // Tam ekran konteyner
  container: {
    flex: 1,
    padding: styleNumbers.spaceLittle,
    backgroundColor: Colors.getTheme().background,
  },

  // Ortalanmış içerik konteyner
  centerContainer: {
    flex: 1,
    padding: styleNumbers.space,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.getTheme().background,
  },

  // Kartlı görünüm
  card: {
    paddingHorizontal: styleNumbers.spaceLittle,
    backgroundColor: Colors.getTheme().cardBackground,
    borderRadius: styleNumbers.borderRadius,
    ...shadowStyle,
  },

  // Kenarları yuvarlatılmış konteyner
  roundedContainer: {
    borderRadius: styleNumbers.borderRadius,
    backgroundColor: Colors.getTheme().background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: styleNumbers.space,
    ...shadowStyle,
  },
};

export default viewStyles;
export type {ViewStylesSchema};
