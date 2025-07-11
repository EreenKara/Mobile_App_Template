import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  PanGestureChangeEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';

import {Canvas, Circle, SweepGradient, vec} from '@shopify/react-native-skia';

/** Asenkron (Promise) tabanlı HSV -> RGB dönüşümü. */
async function hsvToHexAsync(
  h: number,
  s: number = 1,
  v: number = 1,
): Promise<string> {
  return new Promise(resolve => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r1 = 0,
      g1 = 0,
      b1 = 0;

    if (h >= 0 && h < 60) [r1, g1, b1] = [c, x, 0];
    else if (h >= 60 && h < 120) [r1, g1, b1] = [x, c, 0];
    else if (h >= 120 && h < 180) [r1, g1, b1] = [0, c, x];
    else if (h >= 180 && h < 240) [r1, g1, b1] = [0, x, c];
    else if (h >= 240 && h < 300) [r1, g1, b1] = [x, 0, c];
    else [r1, g1, b1] = [c, 0, x];

    const R = Math.round((r1 + m) * 255);
    const G = Math.round((g1 + m) * 255);
    const B = Math.round((b1 + m) * 255);

    resolve(`rgb(${R}, ${G}, ${B})`);
  });
}

interface ColorWheelPickerProps {
  /** Boyut (genişlik / yükseklik) */
  size?: number;
  /** Renk değiştiğinde çağrılacak callback. */
  onColorChange?: (color: string) => void;
}

const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({
  size = 300,
  onColorChange,
}) => {
  // Tüm daire yarıçapı
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Pointer konumunu (x,y) paylaşılan değerlerde saklıyoruz
  const pointerX = useSharedValue(centerX);
  const pointerY = useSharedValue(centerY);

  // React state ile “Canvas’ta pointer’ın çizileceği konum”u yönetiyoruz
  const [renderedX, setRenderedX] = useState(centerX);
  const [renderedY, setRenderedY] = useState(centerY);

  // Asenkron renk hesaplamasını UI thread’den JS thread’e taşıyacağız
  // runOnJS ile çağrılacak bir fonksiyon
  const computeAndSetColor = async (angle: number) => {
    const degrees = (angle * 180) / Math.PI;
    const color = await hsvToHexAsync(degrees, 1, 1);
    onColorChange?.(color);
  };

  // Pan Gesture
  const panGesture = Gesture.Pan()
    .onChange((e: PanGestureChangeEventPayload) => {
      // Parmağın hareketi (delta) kadar ekleyelim
      pointerX.value += e.changeX;
      pointerY.value += e.changeY;

      // Merkezden dx, dy
      let dx = pointerX.value - centerX;
      let dy = pointerY.value - centerY;

      // Mesafe clamp: dairenin dışına çıkmasın
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) dist = radius;

      // Açı
      let angle = Math.atan2(dy, dx);
      if (angle < 0) angle += 2 * Math.PI;

      // Sınırlandırılmış x,y
      pointerX.value = centerX + dist * Math.cos(angle);
      pointerY.value = centerY + dist * Math.sin(angle);

      // Rengi hesapla (asenkron)
      runOnJS(computeAndSetColor)(angle);

      // Pointer’ı anlık UI’da güncellemek için JS state’e aktarıyoruz.
      runOnJS(setRenderedX)(pointerX.value);
      runOnJS(setRenderedY)(pointerY.value);
    })
    .onEnd(e => {
      // Parmak bırakınca inersiyel hareket veriyoruz.
      // “Çarkın” dışına gitmemesi için clamp ekliyoruz
      pointerX.value = withDecay({
        velocity: e.velocityX,
        clamp: [centerX - radius, centerX + radius],
      });
      pointerY.value = withDecay({
        velocity: e.velocityY,
        clamp: [centerY - radius, centerY + radius],
      });
    });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <GestureDetector gesture={panGesture}>
        <View style={{width: size, height: size}}>
          <Canvas style={StyleSheet.absoluteFill}>
            {/* Renk çarkı */}
            <Circle c={vec(centerX, centerY)} r={radius}>
              <SweepGradient
                c={vec(centerX, centerY)}
                colors={[
                  '#FF0000',
                  '#FFFF00',
                  '#00FF00',
                  '#00FFFF',
                  '#0000FF',
                  '#FF00FF',
                  '#FF0000',
                ]}
              />
            </Circle>

            {/* Pointer: Skia Circle */}
            <Circle c={vec(renderedX, renderedY)} r={10} color="white" />
            <Circle c={vec(renderedX, renderedY)} r={6} color="black" />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ColorWheelPicker;
