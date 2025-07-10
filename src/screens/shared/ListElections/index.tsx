// src/screens/home/CurrentElectionsScreen.tsx
import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import ActivityIndicatorComponent from '@screens/shared/activity.indicator';
import ElectionCardComponent from '@icomponents/ElectionCard/election.card';
import {SharedStackParamList} from '@navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSearchContext} from '@contexts/search.context';
import getElectionTexts from './text.screen.type';
import {useGetElectionsFunction} from './election.hook';
import LightElectionViewModel from '@viewmodels/light.election.viewmodel';
import {useElection} from '@hooks/use.election';
import {useStyles} from '@hooks/Modular/use.styles';
import {BaseElectionViewModel} from '@viewmodels/base.election.viewmodel';
import styleNumbers from '@styles/common/style.numbers';
type ListElectionsScreenProps = NativeStackScreenProps<
  SharedStackParamList,
  'ListElections'
>;

const ListElectionsScreen: React.FC<ListElectionsScreenProps> = ({
  route,
  navigation,
}) => {
  const styles = useStyles(createStyles);
  const {type} = route.params;
  const {title, description, errorTitle} = getElectionTexts(type);

  const {elections, loading, fetchElections} = useElection(type);
  const {search} = useSearchContext();
  // Her 30 saniyede bir seçimleri güncelle
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('Sehir ismi,' + search.city);

  //     fetchElections({city: search.city});
  //   }, 30000);
  //   navigation.setOptions({title: title});
  //   return () => clearInterval(interval);
  // }, []);

  if (loading) {
    return (
      <View style={CommonStyles.viewStyles.centerContainer}>
        <ActivityIndicatorComponent size="large" />
      </View>
    );
  }

  if (elections?.length === 0) {
    return (
      <View style={CommonStyles.viewStyles.centerContainer}>
        <Text style={CommonStyles.textStyles.title}>{errorTitle}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ElectionCardComponent
        title={`${search.city ?? ''} ${title}`}
        items={elections as BaseElectionViewModel[]}
      />
    </View>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      ...CommonStyles.viewStyles.container,
      backgroundColor: colors.background,
      paddingTop: styleNumbers.space * 2,
    },
    header: {
      padding: styleNumbers.space,
      borderBottomWidth: styleNumbers.borderWidth,
      borderBottomColor: colors.borderColor,
    },
    headerTitle: {
      textAlign: 'center',
      ...CommonStyles.textStyles.title,
      marginBottom: styleNumbers.space,
    },
  });

export default ListElectionsScreen;
