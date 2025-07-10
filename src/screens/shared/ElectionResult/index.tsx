import React, {useEffect, useMemo, useState} from 'react';
import {ImageBackground, View, Text, Image} from 'react-native';
import {
  HomeStackParamList,
  RootStackParamList,
  SharedStackParamList,
} from '@navigation/types';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {useStyles} from '@hooks/Modular/use.styles';
import createStyles from './index.style';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import PodiumComponent from '@icomponents/Podium/podium';
import useWinner from '@hooks/use.winner';
import ActivityIndicatorComponent from '../activity.indicator';
import {NavigationContainer, useNavigation} from '@react-navigation/native';

type ElectionResultScreenProps = NativeStackScreenProps<
  SharedStackParamList,
  'ElectionResult'
>;
type HomeProps = NativeStackNavigationProp<HomeStackParamList>;

const ElectionResultScreen: React.FC<ElectionResultScreenProps> = ({
  navigation,
  route,
}) => {
  const styles = useStyles(createStyles);
  const {election} = route.params;
  const homeNavigation = useNavigation<HomeProps>();

  const {candidates, fetchTopThree, loading, success, error, retry, reset} =
    useWinner();
  useEffect(() => {
    fetchTopThree(election.id);
  }, []);
  useEffect(() => {
    console.log('eeror', error);
    if (error) {
      homeNavigation.navigate('HomeMain');
    }
  }, [error]);

  if (!candidates) {
    return <ActivityIndicatorComponent></ActivityIndicatorComponent>;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}></Text>
        <View style={styles.overlay}>
          <Text style={styles.title}>{election.name} Sonuçları</Text>
        </View>
        <ImageBackground
          source={require('@assets/images/winning-places.png')} // veya require('./path/to/image.jpg')
          style={styles.background}>
          <View style={styles.candidates}>
            <View style={styles.second}>
              <Text style={{fontWeight: 'bold'}}>
                {candidates?.at(1)?.name}
              </Text>
              <Text style={{fontSize: 12}}>{candidates?.at(1)?.votes} oy</Text>
            </View>
            <View style={styles.first}>
              <Text style={{fontWeight: 'bold'}}>
                {candidates?.at(0)?.name}
              </Text>
              <Text style={{fontSize: 12}}>{candidates?.at(0)?.votes} oy</Text>
            </View>
            <View style={styles.third}>
              <Text style={{fontWeight: 'bold'}}>
                {candidates?.at(2)?.name}
              </Text>
              <Text style={{fontSize: 12}}>{candidates?.at(2)?.votes} oy</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
};

export default ElectionResultScreen;
