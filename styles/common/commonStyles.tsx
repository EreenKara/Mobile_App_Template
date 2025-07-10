import textStyles, {TextStylesSchema} from '../individual/text.styles';
import viewStyles, {ViewStylesSchema} from '../individual/view.styles';
import shadowStyle from '../individual/shadow.style';
import safearea from '../individual/safearea.style';
import {ShadowStyleIOS, ViewStyle} from 'react-native';

interface CommonStylesSchema {
  shadowStyle: any;
  textStyles: TextStylesSchema;
  viewStyles: ViewStylesSchema;
  safearea: ViewStyle;
}

const CommonStyles: CommonStylesSchema = {
  shadowStyle, // ios ve android için shadow style
  textStyles, // text'i kullanırken textStyles'ı kullanmaya özen göster.
  viewStyles, // view'i isteğe bağlı kullan veya kullanma
  safearea, // Android'de safe area view çalışmıadığından bunla düzenliyoruz.
};

export default CommonStyles;
