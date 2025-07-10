import {StyleSheet, Text, View, Image, Animated, Easing} from 'react-native';
import React, {useEffect, useRef} from 'react';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useStyles} from '@hooks/Modular/use.styles';
interface CandidateItemComponentProps {
  candidate: CandidateViewModel;
}

const CandidateItemComponent: React.FC<CandidateItemComponentProps> = ({
  candidate,
}) => {
  const styles = useStyles(createStyles);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{translateX: slideAnim}],
        },
      ]}>
      <Animated.View style={styles.imageContainer}>
        <Image
          source={{uri: candidate.image}}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={styles.infoContainer}>
        <Text style={CommonStyles.textStyles.title}>
          Aday ismi: {candidate.name}
        </Text>
        <Text style={CommonStyles.textStyles.subtitle}>
          Oy sayisi: {candidate.votes}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

export default CandidateItemComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      paddingVertical: styleNumbers.space,
      width: '100%',
      flexWrap: 'wrap',
      alignItems: 'center',
      backgroundColor: colors.transition,
      ...CommonStyles.shadowStyle,
      borderRadius: styleNumbers.borderRadius,
    },
    imageContainer: {
      width: '70%',
      marginRight: styleNumbers.space * 2,

      overflow: 'hidden',
    },
    image: {
      height: 350,
    },
    infoContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: styleNumbers.space,
      width: '100%',
      gap: styleNumbers.space * 2,
    },
  });
