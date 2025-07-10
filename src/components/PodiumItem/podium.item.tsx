import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Animated, // Animated eklendi
  ImageStyle,
  StyleProp,
  ViewStyle,
  TextStyle,
  Easing,
} from 'react-native';
import CommonStyles from '@styles/common/commonStyles';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';

// Animated Image oluşturuyoruz
const AnimatedImage = Animated.createAnimatedComponent(View);

type PodiumItemProps = {
  rank: number;
  candidate?: CandidateViewModel | null;
  height: number;
  containerStyle?: StyleProp<ViewStyle>;
  trophyStyle?: StyleProp<ImageStyle>;
  podiumStyle?: StyleProp<ViewStyle>;
  podiumTextStyle?: StyleProp<TextStyle>;
  underPodiumTextStyle?: StyleProp<TextStyle>;
};

const PodiumItemComponent: React.FC<PodiumItemProps> = ({
  rank,
  candidate,
  height,
  containerStyle,
  trophyStyle,
  podiumStyle,
  podiumTextStyle,
  underPodiumTextStyle,
}) => {
  // Döndürme değerini yönetmek için Animated.Value tanımlıyoruz.
  const rotationValue = useRef(new Animated.Value(0)).current;

  // Bileşen yüklendiğinde animasyonu başlatır.
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.bezier(0.5, 0.25, 0.25, 1.0),
          useNativeDriver: true,
        }),
        Animated.timing(rotationValue, {
          toValue: -1,
          duration: 1000,
          easing: Easing.bezier(0.5, 0.25, 0.25, 1.0),
          useNativeDriver: true,
        }),
        Animated.timing(rotationValue, {
          toValue: 0,
          duration: 500,
          easing: Easing.bezier(0.5, 0.25, 0.25, 1.0),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [rotationValue]);

  // rotationValue -1 ile 1 arasında gidip gelirken,
  // bunu -90 ve 90 dereceye çeviriyoruz.
  const rotate = rotationValue.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg'],
  });

  // Kupa görseli için Animated.View ya da Animated.Image kullanabilirsiniz.
  // Mevcut yapı View + Image tarzında ise Image'ı Animated.Image'e çevirmeniz yeterlidir.
  // Aşağıda AnimatedImage örnek olsun diye gösterilmiştir.
  // İsterseniz direkt <Animated.Image> şeklinde de kullanabilirsiniz.
  const Trophy: React.FC = () => {
    return (
      <Animated.Image
        source={require('@assets/images/trophy.png')}
        style={[trophyStyle, {transform: [{rotate}]}]}
      />
    );
  };

  if (!candidate) {
    return (
      <View style={containerStyle}>
        <Trophy />
        <View style={[podiumStyle, {height: 0}]}>
          <Text style={[CommonStyles.textStyles.subtitle, podiumTextStyle]}>
            {rank}
          </Text>
          <Text style={[CommonStyles.textStyles.paragraph, podiumTextStyle]}>
            0%
          </Text>
        </View>
        <Text style={[CommonStyles.textStyles.subtitle, underPodiumTextStyle]}>
          -
        </Text>
        <Text style={[CommonStyles.textStyles.paragraph, underPodiumTextStyle]}>
          0 oy
        </Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Trophy />
      <View style={[podiumStyle, {height}]}>
        <Text style={[CommonStyles.textStyles.subtitle, podiumTextStyle]}>
          {rank}
        </Text>
        <Text style={[CommonStyles.textStyles.paragraph, podiumTextStyle]}>
          {candidate.votes} oy
        </Text>
      </View>
      <Text style={[CommonStyles.textStyles.subtitle, underPodiumTextStyle]}>
        {candidate.name}
      </Text>
      <Text style={[CommonStyles.textStyles.paragraph, underPodiumTextStyle]}>
        {candidate.votes} oy
      </Text>
    </View>
  );
};

export default PodiumItemComponent;
