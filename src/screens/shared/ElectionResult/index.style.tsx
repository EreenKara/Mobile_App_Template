import {ColorsSchema} from '@styles/common/colors';
import {StyleSheet} from 'react-native';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {Dimensions} from 'react-native';
const createStyles = (colors: ColorsSchema) => {
  const wHeight = Dimensions.get('window').height;

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingVertical: styleNumbers.space * 2,
    },
    headerText: {
      ...CommonStyles.textStyles.title,
      textAlign: 'center',
    },

    overlay: {
      width: '80%',
      alignSelf: 'center',
      backgroundColor: 'rgba(21, 121, 124, 0.49)', // arka planı koyulaştırmak için
      padding: 20,
      borderRadius: 10,
    },
    title: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    subtitle: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
      marginTop: 8,
    },
    podium: {},
    background: {
      width: '100%',
      height: wHeight * 0.5,
      resizeMode: 'cover',
      justifyContent: 'center',
    },
    first: {
      position: 'absolute',
      top: '18%', // tam rakamın altı
      left: '42%',
      width: 80,
      alignItems: 'center',
    },

    second: {
      position: 'absolute',
      top: '25%',
      left: '15%',
      width: 80,
      alignItems: 'center',
    },

    third: {
      position: 'absolute',
      top: '30%',
      left: '70%',
      width: 80,
      alignItems: 'center',
    },

    candidates: {
      marginTop: 80,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};

export default createStyles;
