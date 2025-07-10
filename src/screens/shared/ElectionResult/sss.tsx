import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Image} from 'react-native';
import {SharedStackParamList} from '@navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useStyles} from '@hooks/Modular/use.styles';
import createStyles from './index.style';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import PodiumComponent from '@icomponents/Podium/podium';

type ElectionResultScreenProps = NativeStackScreenProps<
  SharedStackParamList,
  'ElectionResult'
>;
const candidates: CandidateViewModel[] = [
  {
    id: '',
    name: 'John Doe',
    votes: 100,
    color: 'red',
  },
  {
    id: '',
    name: 'Jane Doe',
    votes: 50,
    color: 'blue',
  },
  {
    id: '',
    name: 'Jim Doe',
    votes: 20,
    color: 'green',
  },
];
const ElectionResultScreennnd: React.FC<ElectionResultScreenProps> = ({
  route,
}) => {
  const styles = useStyles(createStyles);
  const {election} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{election.name} Sonuçları</Text>
      <PodiumComponent candidates={candidates} />
    </View>
  );
};

export default ElectionResultScreennnd;
