import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface Props {
  onPress: () => void;
  source?: any;
  size?: number;
  label?: string;
}

const AnimatedBallotBoxComponent: React.FC<Props> = ({
  onPress,
  source = require('@assets/images/my_logo.png'),
  size = 100,
  label = 'Oy Ver',
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startAnimation = () => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    );
    animationRef.current.start();
  };

  useEffect(() => {
    startAnimation();
    return () => {
      animationRef.current?.stop();
    };
  }, []);

  const handlePressIn = () => {
    animationRef.current?.stop(); // animasyonu durdur
    scaleAnim.setValue(1); // küçük boyutta sabitle
  };

  const handlePressOut = () => {
    startAnimation(); // tekrar başlat
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Image
          source={source}
          style={{width: size, height: size, resizeMode: 'contain'}}
        />
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AnimatedBallotBoxComponent;
