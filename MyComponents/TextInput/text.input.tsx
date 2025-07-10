import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  ViewProps,
  TextProps,
  TouchableOpacity,
} from 'react-native';
import {useStyles} from '@hooks/Modular/use.styles';
import createStyles from './text.input.style';
import Colors from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';

interface TextInputComponentProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  style?: TextInputProps['style'];
  viewStyle?: ViewProps['style'];
  labelStyle?: TextProps['style'];
  multiline?: boolean;
}

const TextInputComponent: React.FC<TextInputComponentProps> = ({
  label = '',
  error,
  leftIcon,
  rightIcon,
  style,
  viewStyle,
  labelStyle,
  onFocus,
  onBlur,
  onPress,
  placeholderTextColor = Colors.getTheme().text + '80',
  multiline = false,
  ...restProps
}) => {
  const styles = useStyles(createStyles);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
        </View>
      )}

      {/* Input Container */}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
          viewStyle,
        ]}>
        {leftIcon && (
          <TouchableOpacity onPress={onPress}>
            <View style={styles.icon}>{leftIcon}</View>
          </TouchableOpacity>
        )}

        <TextInput
          {...restProps}
          style={[styles.input, style]}
          onFocus={e => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholderTextColor={placeholderTextColor}
          multiline={multiline}
        />

        {rightIcon && (
          <TouchableOpacity onPress={onPress}>
            <View style={styles.icon}>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text
            style={{
              color: Colors.getTheme().error || 'red',
            }}>
            ❗
          </Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default TextInputComponent;
