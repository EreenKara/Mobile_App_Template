import React from 'react';
import {StyleSheet, Dimensions, View, ViewStyle} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import TRMapComponent from './TRMap.js';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = 300;

interface MapAnimationComponentProps {
  onPress: (sehir: string) => void;
}

const MapAnimationComponent: React.FC<MapAnimationComponentProps> = ({
  onPress,
}) => {
  const scale = useSharedValue<number>(1);
  const savedScale = useSharedValue<number>(1);

  const focalX = useSharedValue<number>(0);
  const focalY = useSharedValue<number>(0);
  const savedTranslateX = useSharedValue<number>(0);
  const savedTranslateY = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const svgWidth = useSharedValue<number>(WIDTH);
  const svgHeight = useSharedValue<number>(HEIGHT);

  const panGesture = Gesture.Pan()
    .onStart(event => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    })
    .onUpdate(event => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(event => {
      savedScale.value = scale.value;
    })
    .onUpdate(event => {
      const newScale = Math.min(Math.max(savedScale.value * event.scale, 1), 3);
      focalX.value = event.focalX;
      focalY.value = event.focalY;

      // Scale'i güncelle
      scale.value = newScale;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: focalX.value},
        {translateY: focalY.value},
        {translateX: -svgWidth.value / 2},
        {translateY: -svgHeight.value / 2},
        {scale: scale.value},
        {translateX: -focalX.value},
        {translateY: -focalY.value},
        {translateX: svgWidth.value / 2},
        {translateY: svgHeight.value / 2},
      ],
    };
  });

  const composedGestures = Gesture.Simultaneous(pinchGesture);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGestures}>
        <Animated.View style={[styles.map, animatedStyle]}>
          <TRMapComponent onPress={onPress} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

interface Styles {
  container: ViewStyle;
  map: ViewStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  map: {
    width: WIDTH,
    height: HEIGHT,
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 10,
  },
});

export default MapAnimationComponent;
