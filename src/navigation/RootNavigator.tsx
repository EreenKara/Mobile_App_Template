import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {RootStackParamList} from './NavigationTypes';
import {HomeScreen} from '@screens/home/index';
import BlockchainOrDbScreen from '@screens/home/CreateElection/blockchain.or.db';
import {ElectionInfoScreen} from '@screens/home/index';
import {BeCandidateScreen} from '@screens/home/index';
import {ElectionsScreen} from '@screens/home/index';
import {SpecificElectionScreen} from '@screens/home/index';
import NavBarTitle from '@screens/shared/navbar_title';
import DiscardButtonComponent from '@screens/shared/discard.buttont';
import {useElectionCreationContext, useThemeColors} from '@contexts/index';
import ElectionResultScreen from '@screens/shared/ElectionResult';
import VoteScreen from '@screens/home/Vote';
import SharedNavigator from './SharedNavigator';
import PrivateElectionsScreen from '@screens/home/PrivateElections';
import PastCurrentUpcomingScreen from '@screens/shared/past.current.upcoming';
const Stack = createNativeStackNavigator<RootStackParamList>();

const ProfileNavigator: React.FC = () => {
  const {colors} = useThemeColors();
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};
