import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
  StyleProp,
} from 'react-native';
import {createStyles} from './Button.style';
import Colors from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
  leftIcon?: React.ReactNode;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  variant = Colors.getThemeName(),
  leftIcon,
  ...props
}) => {
  const styles = useStyles(createStyles);

  const getButtonStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}>
      {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;
