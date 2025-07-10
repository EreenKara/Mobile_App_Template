import {
  Pressable,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  Animated,
} from 'react-native';
import React, {useRef} from 'react';
import CommonStyles from '@styles/common/commonStyles';
import {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import {useStyles} from '@hooks/Modular/use.styles';
interface ChoiceCardComponentProps {
  title: string;
  image: any;
  onPress: () => void;
  height?: number;
  description?: string;
  tintColor?: string;
  disabled?: boolean;
}

const ChoiceCardComponent = ({
  title,
  image,
  description,
  onPress,
  tintColor,
  height = windowWidth * 0.8,
  disabled = false,
}: ChoiceCardComponentProps) => {
  const styles = useStyles(createStyles);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          margin: 0,
          padding: 0,
          transform: [{scale: scaleValue}],
        },
      ]}>
      <Pressable
        style={[styles.container]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}>
        <Text
          style={[
            CommonStyles.textStyles.title,
            {marginBottom: styleNumbers.space, textAlign: 'center'},
          ]}>
          {title}
        </Text>
        <Image
          source={image}
          style={[
            styles.image,
            {
              height: height * 0.77,
              tintColor: tintColor,
            },
          ]}
        />
        <Text
          style={[
            CommonStyles.textStyles.paragraph,
            {marginTop: styleNumbers.spaceLittle, textAlign: 'center'},
          ]}>
          {description}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export default ChoiceCardComponent;
const windowWidth = Dimensions.get('window').width;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: styleNumbers.space,
      borderRadius: styleNumbers.borderRadius,
      margin: styleNumbers.space,
      borderWidth: 4,
      borderColor: colors.borderColor,
      ...CommonStyles.shadowStyle,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    image: {
      width: '100%',
      resizeMode: 'contain',
    },
  });
