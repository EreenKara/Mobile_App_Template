import {StyleSheet} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import {useStyles} from '@hooks/Modular/use.styles';

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.transition,
      flex: 1,
    },
    listContainer: {
      backgroundColor: colors.background,
      flex: 1,
      paddingHorizontal: styleNumbers.space,
    },
    header: {
      padding: styleNumbers.space,
      borderBottomWidth: styleNumbers.borderWidth,
      borderBottomColor: colors.borderColor,
    },
    headerTitle: {
      textAlign: 'center',
      ...CommonStyles.textStyles.title,
      marginBottom: styleNumbers.space,
    },
    listContent: {
      paddingVertical: styleNumbers.space,
    },
    emptyList: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: styleNumbers.space * 2,
    },
    emptyText: {
      ...CommonStyles.textStyles.paragraph,
      textAlign: 'center',
    },
  });

export default createStyles;
