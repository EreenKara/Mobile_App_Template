import {StyleSheet, Text, View, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import CommonStyles from '@styles/common/commonStyles';
import {CandidateViewModel} from '@viewmodels/candidate.viewmodel';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';

interface ChartLegendComponentProps {
  candidates: CandidateViewModel[];
}

const ChartLegendComponent: React.FC<ChartLegendComponentProps> = ({
  candidates,
}) => {
  const styles = useStyles(createStyles);
  const fadeAnims = useRef(candidates.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(
    candidates.map(() => new Animated.Value(-50)),
  ).current;

  useEffect(() => {
    const animations = candidates.map((_, index) => {
      const delay = index * 150; // Her öğe için 150ms gecikme
      return Animated.parallel([
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(slideAnims[index], {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          delay,
        }),
      ]);
    });

    Animated.stagger(100, animations).start();
  }, [candidates]);

  return (
    <View style={[styles.pieChartLegend]}>
      {candidates.map((candidate, index) => (
        <Animated.View
          key={index}
          style={[
            styles.legendItem,
            {
              opacity: fadeAnims[index],
              transform: [{translateX: slideAnims[index]}],
            },
          ]}>
          <View
            style={[
              styles.colorBox,
              {
                backgroundColor: candidate.color,
              },
            ]}
          />
          <Text style={CommonStyles.textStyles.title}>
            {candidate.name} : {candidate.votes}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

export default ChartLegendComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    pieChartLegend: {
      width: '100%',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: styleNumbers.space,
      backgroundColor: colors.transition,
      ...CommonStyles.shadowStyle,
    },
    legendItem: {
      margin: styleNumbers.space,
      marginRight: styleNumbers.space * 5,
      flexDirection: 'row',
      alignItems: 'center',
      gap: styleNumbers.space,
    },
    colorBox: {
      height: 30,
      width: 30,
      borderRadius: styleNumbers.borderRadius * 0.5,
    },
  });
