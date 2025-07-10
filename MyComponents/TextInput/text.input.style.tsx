import {StyleSheet} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import {useStyles} from '@hooks/Modular/use.styles';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      marginVertical: styleNumbers.space,
      width: '100%',
      position: 'relative',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: styleNumbers.borderWidth,
      borderColor: colors.borderColor,
      borderRadius: styleNumbers.borderRadius,
      backgroundColor: colors.background,
      ...CommonStyles.shadowStyle,
    },
    input: {
      flex: 1,
      height: styleNumbers.buttonSize,
      paddingHorizontal: styleNumbers.space,
      color: colors.text,
      fontSize: styleNumbers.textSize,
    },
    labelContainer: {
      position: 'absolute',
      top: -styleNumbers.buttonSize / 2,
      left: styleNumbers.space,
      zIndex: 1,
    },
    label: {
      fontSize: styleNumbers.textSize * 0.85,
      color: colors.text,
      fontWeight: styleNumbers.fontWeight,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: styleNumbers.space / 2,
      paddingHorizontal: styleNumbers.space / 2,
    },
    error: {
      color: colors.error || 'red',
      fontSize: styleNumbers.textSize * 0.8,
      fontWeight: styleNumbers.fontWeight,
    },
    icon: {
      padding: styleNumbers.space,
      paddingHorizontal: styleNumbers.space * 2,
      color: colors.icon,
    },
    focusedInput: {
      borderColor: colors.button,
    },
    errorInput: {
      borderColor: colors.error || 'red',
    },
  });

export default createStyles;
