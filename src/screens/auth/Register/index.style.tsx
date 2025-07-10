import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {StyleSheet} from 'react-native';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      paddingVertical: styleNumbers.space * 2,
      paddingHorizontal: styleNumbers.space * 3,
      ...CommonStyles.viewStyles.container,
      flexGrow: 1,
      backgroundColor: colors.background,
    },
    input: {
      marginBottom: styleNumbers.space,
      ...CommonStyles.textStyles.paragraph,
    },
    errorText: {
      ...CommonStyles.textStyles.error,
      textAlign: 'center',
    },
    button: {
      ...CommonStyles.textStyles.paragraph,
      marginTop: styleNumbers.spaceLittle,
      marginBottom: styleNumbers.space,
    },
    viewTextInput: {
      marginTop: styleNumbers.spaceLarge,
    },
  });

export default createStyles;
