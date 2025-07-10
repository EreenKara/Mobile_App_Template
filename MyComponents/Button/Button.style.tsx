import {StyleSheet} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';

export const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    baseButton: {
      maxWidth: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: styleNumbers.space * 1.5,
      paddingHorizontal: styleNumbers.space * 2,
      borderRadius: styleNumbers.borderRadius,
      minWidth: styleNumbers.buttonSize * 1.5,
      ...CommonStyles.shadowStyle,
    },
    primaryButton: {
      backgroundColor: colors.button,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: styleNumbers.borderWidth,
      borderColor: colors.button,
    },
    primaryText: {
      color: colors.buttonText,
      fontSize: styleNumbers.textSize,
      fontWeight: styleNumbers.fontWeight,
    },
    outlineText: {
      color: colors.button,
      fontSize: styleNumbers.textSize,
      fontWeight: styleNumbers.fontWeight,
    },
    disabledButton: {
      opacity: 0.5,
      backgroundColor: colors.disabled,
    },
    icon: {
      marginRight: styleNumbers.space * 0.8,
    },
  });
