import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {StyleSheet} from 'react-native';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: styleNumbers.space * 2,
    },
    title: {
      marginBottom: styleNumbers.space,
      textAlign: 'center',
    },
    description: {
      textAlign: 'center',
      marginBottom: styleNumbers.space * 3,
      color: colors.text,
    },
    codeContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: styleNumbers.space * 3,
      gap: styleNumbers.space,
    },
    codeInput: {
      width: 50,
      height: 50,
      borderWidth: 2,
      borderRadius: styleNumbers.borderRadius,
      borderColor: colors.borderColor,
      textAlign: 'center',
      fontSize: styleNumbers.textSize * 1.5,
      color: colors.text,
      backgroundColor: colors.background,
    },
    button: {
      width: '100%',
    },
    errorText: {
      ...CommonStyles.textStyles.error,
      textAlign: 'center',
    },
  });

export default createStyles;
