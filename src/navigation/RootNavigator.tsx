import React from 'react';
import {
   createNativeStackNavigator,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from './NavigationTypes';
import AuthNavigator from '@navigation/AuthNavigator';
import AppNavigator from '@navigation/AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
   return (
      <Stack.Navigator
         id={undefined}
         initialRouteName="Auth"
         screenOptions={{ headerShown: false }}>
         <Stack.Screen name="Auth" component={AuthNavigator} />
         <Stack.Screen name="App" component={AppNavigator} />
      </Stack.Navigator>
   );
};

export default RootNavigator;
