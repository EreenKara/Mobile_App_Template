import React, {useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import {
  Canvas,
  Circle,
  Shadow,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';

/** Basit (Hue tabanlı) HSV -> RGB fonksiyonu. */
function hsvToHex(h: number, s: number = 1, v: number = 1) {
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

  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

interface ColorWheelPickerProps {
  /** Renk çarkının kapsayacağı kare alanın boyutu (width/height). */
  size?: number;
  /** Her renk değiştiğinde çalışacak callback.  */
  onColorChange?: (color: string) => void;
}

/**
 * PanResponder ile pointer konumu hesaplanıyor,
 * Skia Canvas içerisinde hem renk çarkı hem pointer Circle çiziliyor.
 */
const ColorWheelPicker: React.FC<ColorWheelPickerProps> = ({
  size = 300,
  onColorChange,
}) => {
  // Dairenin yarıçapı:
  const radius = size / 2;
  const centerX = radius;
  const centerY = radius;

  // Pointer’ın açı (angle) ve merkezden uzaklık (dist)
  const [angle, setAngle] = useState(0);
  const [dist, setDist] = useState(0);

  // PanResponder: dokunma koordinatlarından angle & dist hesapları
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (
        evt: GestureResponderEvent,
        gesture: PanResponderGestureState,
      ) => {
        const {locationX, locationY} = evt.nativeEvent;
        // dx, dy
        const dx = locationX - centerX;
        const dy = locationY - centerY;

        // Mesafe (0 - radius)
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > radius) distance = radius;

        // Açı (0 - 2π)
        let a = Math.atan2(dy, dx);
        if (a < 0) a += 2 * Math.PI;

        setAngle(a);
        setDist(distance);

        // Renk hesabı (sadece Hue)
        const degrees = (a * 180) / Math.PI;
        const color = hsvToHex(degrees, 1, 1);
        onColorChange?.(color);
      },
    }),
  ).current;

  // Pointer koordinatı (Skia Canvas içinde çizeceğiz)
  const pointerX = centerX + dist * Math.cos(angle);
  const pointerY = centerY + dist * Math.sin(angle);

  return (
    <View style={{width: size, height: size + 20}}>
      {/* Tüm çizim işlemi Skia Canvas'ta */}
      <Canvas style={[StyleSheet.absoluteFill]}>
        {/* Renk çarkı */}

        <Circle c={vec(centerX, centerY)} r={radius}>
          <Shadow dx={0} dy={20} blur={5} color="rgba(0, 0, 0, 0.1)" />

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
        <Circle c={vec(pointerX, pointerY)} r={10} color="white" />
        {/* İkinci küçük daire (daha koyu) */}
        <Circle c={vec(pointerX, pointerY)} r={6} color="black" />
      </Canvas>

      {/* Dokunma yüzeyi: şeffaf View */}
      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} />
    </View>
  );
};

export default ColorWheelPicker;
