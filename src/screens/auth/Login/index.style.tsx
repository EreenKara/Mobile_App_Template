import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {StyleSheet} from 'react-native';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      paddingHorizontal: styleNumbers.spaceLarge,
      ...CommonStyles.viewStyles.container,
      ...CommonStyles.safearea,
      backgroundColor: colors.background,
    },
    errorText: {
      ...CommonStyles.textStyles.error,
      textAlign: 'center',
    },
    buttonLabel: {
      ...CommonStyles.textStyles.paragraph,
      color: colors.button,
    },
    input: {
      marginBottom: styleNumbers.space,
    },
    viewText: {
      marginTop: styleNumbers.spaceLarge,
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: styleNumbers.space,
    },
    checkboxLabel: {
      ...CommonStyles.textStyles.paragraph,
      marginLeft: styleNumbers.spaceLittle,
    },
    button: {
      ...CommonStyles.textStyles.paragraph,
      marginTop: styleNumbers.spaceLittle,
    },

    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      tintColor: colors.icon,
      marginBottom: styleNumbers.spaceLarge * 2,
      width: 200,
      height: 200,
    },
  });

export default createStyles;
