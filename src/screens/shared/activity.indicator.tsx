import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator as RNActivityIndicator,
} from 'react-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useStyles} from '@hooks/Modular/use.styles';
interface ActivityIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const ActivityIndicatorComponent: React.FC<ActivityIndicatorProps> = ({
  size = 'large',
  color = Colors.getTheme().button,
  fullScreen = false,
}) => {
  const styles = useStyles(createStyles);
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <RNActivityIndicator size={size} color={color} />
    </View>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      ...CommonStyles.viewStyles.centerContainer,
      padding: styleNumbers.space,
    },
    fullScreen: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background,
      zIndex: 999,
    },
  });

export default ActivityIndicatorComponent;
