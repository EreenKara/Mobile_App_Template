import {ColorsSchema} from '@styles/common/colors';
import {StyleSheet} from 'react-native';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      width: '100%',
      padding: styleNumbers.space * 2,
    },
    headerText: {
      textAlign: 'center',
      marginBottom: styleNumbers.space * 4,
    },
    podiumContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end',
      marginTop: styleNumbers.space * 4,
    },
    podiumItemContainer: {
      alignItems: 'center',
      marginHorizontal: styleNumbers.space,
      width: 100,
    },
    podiumItem: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderTopLeftRadius: styleNumbers.borderRadius,
      borderTopRightRadius: styleNumbers.borderRadius,
    },
    firstPlace: {
      height: 200,
      backgroundColor: colors.button,
    },
    secondPlace: {
      height: 150,
      backgroundColor: colors.button,
    },
    thirdPlace: {
      height: 100,
      backgroundColor: colors.button,
    },
    trophyImage: {
      width: 50,
      height: 50,
      marginBottom: styleNumbers.space,
      tintColor: colors.icon,
    },
    firstTrophy: {
      width: 60,
      height: 60,
      tintColor: 'gold',
    },
    secondTrophy: {
      tintColor: 'silver',
    },
    thirdTrophy: {
      tintColor: '#cd7f32',
    },
    rankText: {
      color: colors.cardText,
    },
    podiumText: {
      marginTop: styleNumbers.space,
      textAlign: 'center',
      color: colors.cardText,
    },

    underPodiumText: {
      marginTop: styleNumbers.space / 2,
      color: colors.text,
    },
  });

export default createStyles;
