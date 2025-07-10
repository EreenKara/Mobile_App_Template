import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated as RNAnimated,
  Easing,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Pie, PolarChart} from 'victory-native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {CandidateViewModel} from '@viewmodels/candidate.viewmodel';
import {useStyles} from '@hooks/Modular/use.styles';

interface PieChartComponentProps {
  chartSize?: number;
  data?: CandidateViewModel[];
}
const PieChartComponent: React.FC<PieChartComponentProps> = ({
  chartSize = 350,
  data = [
    {name: '1', color: '#FF6B6B', votes: 35},
    {name: '2', color: '#4ECDC4', votes: 25},
    {name: '3', color: '#45B7D1', votes: 20},
    {name: '4', color: '#96CEB4', votes: 10},
    {name: '5', color: '#ffffff', votes: 10},
  ],
}) => {
  const styles = useStyles(createStyles);
  const scaleAnimation = useRef(new RNAnimated.Value(0.6)).current;
  const fadeAnimation = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      RNAnimated.sequence([
        RNAnimated.timing(scaleAnimation, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        RNAnimated.spring(scaleAnimation, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const chartHeight = chartSize;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <RNAnimated.View
        style={[
          styles.container,
          {
            height: chartHeight,
            transform: [{scale: scaleAnimation}],
            opacity: fadeAnimation,
          },
        ]}>
        <PolarChart
          data={data}
          labelKey="name"
          valueKey="votes"
          colorKey="color">
          <Pie.Chart innerRadius="40%" circleSweepDegrees={360} startAngle={0}>
            {({slice}: any) => (
              <Pie.Slice>
                <Pie.Label color={'white'} />
              </Pie.Slice>
            )}
          </Pie.Chart>
        </PolarChart>
      </RNAnimated.View>
    </GestureHandlerRootView>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.transition,
      padding: styleNumbers.space,
    },
  });

export default PieChartComponent;
