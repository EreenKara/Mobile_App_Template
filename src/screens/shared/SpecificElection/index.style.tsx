import {Dimensions, StyleSheet} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useStyles} from '@hooks/Modular/use.styles';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      ...CommonStyles.viewStyles.container,
      backgroundColor: colors.background,
      padding: styleNumbers.space,
      borderRadius: styleNumbers.borderRadius,
    },
    header: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    pieChartContainer: {},
    legendItem: {
      margin: styleNumbers.space,
      marginRight: styleNumbers.space * 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: styleNumbers.space,
    },
    candidateContainer: {
      marginTop: styleNumbers.space * 2,
      width: '100%',
      alignItems: 'center',
    },
    candidateItem: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      ...CommonStyles.shadowStyle,
      marginBottom: styleNumbers.space * 2,
      marginTop: styleNumbers.space,
    },
    progressView: {
      width: '100%',
    },
    voteButton: {
      width: 'auto',
      backgroundColor: colors.errorButton,
    },
    iconss: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: styleNumbers.space * 2,
    },
  });

export default createStyles;
