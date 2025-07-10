import {StyleSheet} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import {useStyles} from '@hooks/Modular/use.styles';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      padding: styleNumbers.space,
      marginHorizontal: styleNumbers.space,
      marginVertical: styleNumbers.space / 2,
      backgroundColor: colors.cardBackground,
      borderRadius: styleNumbers.borderRadius,
      ...CommonStyles.shadowStyle,
    },
    itemText: {
      ...CommonStyles.textStyles.paragraph,
    },
  });

export default createStyles;
