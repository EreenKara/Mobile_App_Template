import {StyleSheet} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import {Dimensions} from 'react-native';

const cardHeight = Dimensions.get('window').height * 0.15;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: cardHeight,
      padding: styleNumbers.spaceLarge,
      backgroundColor: colors.cardBackground,
      borderRadius: styleNumbers.borderRadius,
      marginVertical: styleNumbers.space / 2,
      alignItems: 'center',
      ...CommonStyles.shadowStyle,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: styleNumbers.borderRadius,
      marginRight: styleNumbers.space,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
      paddingHorizontal: styleNumbers.spaceLarge * 1.4,
    },

    title: {
      ...CommonStyles.textStyles.subtitle,
      marginBottom: styleNumbers.spaceLittle,
      color: colors.cardText,
    },

    text: {
      ...CommonStyles.textStyles.paragraph,
      marginBottom: styleNumbers.spaceLittle,
      color: colors.cardText,
    },

    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    quantityButton: {
      width: styleNumbers.buttonSize * 0.8,
      height: styleNumbers.buttonSize * 0.8,
      borderRadius: styleNumbers.borderRadius,
      backgroundColor: colors.background,
      borderWidth: styleNumbers.borderWidth,
      borderColor: colors.borderColor,
      justifyContent: 'center',

      alignItems: 'center',
    },
    buttonIcon: {
      width: styleNumbers.buttonSize * 0.4,
      height: styleNumbers.buttonSize * 0.4,
      tintColor: colors.text,
    },
    quantityText: {
      marginHorizontal: styleNumbers.space,
      ...CommonStyles.textStyles.paragraph,
    },

    rightContainer: {
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      height: '100%',
      paddingVertical: styleNumbers.spaceLittle,
    },
    removeButton: {
      padding: styleNumbers.spaceLittle,
      color: colors.text,
    },

    price: {
      ...CommonStyles.textStyles.paragraph,
      marginTop: styleNumbers.space,
    },
  });

export default createStyles;
