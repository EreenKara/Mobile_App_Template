import ElectionAccessScreen from '@screens/home/ElectionAccess';
import {
   createNativeStackNavigator,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { HomeStackParamList, SharedStackParamList } from './NavigationTypes';
import React from 'react';
import PublicOrPrivateScreen from '@screens/home/CreateElection/public.or.private';
import { useElectionCreationContext } from '@contexts/election.creation.context';
import DiscardButtonComponent from '@screens/shared/discard.buttont';
import DefaultCustomScreen from '@screens/home/CreateElection/default.or.custom';
import ElectionCandidatesScreen from '@screens/home/ElectionCandidates';
import ElectionChoicesScreen from '@screens/home/ElectionChoices';
import { useNavigation } from '@react-navigation/native';
import Colors from '@styles/common/colors';
import NavBarTitle from '@screens/shared/navbar_title';
import ElectionResultScreen from '@screens/shared/ElectionResult';
import SpecificElectionScreen from '@screens/shared/SpecificElection';
import ListElectionsScreen from '@screens/shared/ListElections';
import VoteScreen from '@screens/home/Vote';
import ElectionConfirmScreen from '@screens/home/ElectionConfirm';

const Stack = createNativeStackNavigator<SharedStackParamList>();

const SharedNavigator: React.FC = () => {
   const { resetElectionCreation } = useElectionCreationContext();
   const homeNavigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
   return (
      <Stack.Navigator
         id={undefined}
         screenOptions={{
            headerShown: true,
            headerRight: () => <NavBarTitle />,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: Colors.getTheme().bar },
         }}>
         <Stack.Screen name="Error" component={ErrorScreen} />
         <Stack.Screen name="Success" component={SuccessScreen} />
      </Stack.Navigator>
   );
};

export default SharedNavigator;
