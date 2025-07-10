import React from 'react';
import {
   createNativeStackNavigator,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { HomeStackParamList } from './NavigationTypes';
import { HomeScreen } from '@screens/home/index';
import NavBarTitle from '@screens/shared/navbar_title';
import { useElectionCreationContext, useThemeColors } from '@contexts/index';
import SharedNavigator from './SharedNavigator';
const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeNavigator: React.FC = () => {
   const { resetElectionCreation } = useElectionCreationContext();
   const { colors } = useThemeColors();

   return (
      <Stack.Navigator
         id={undefined}
         screenOptions={{
            headerShown: true,
            headerRight: () => <NavBarTitle />,
            headerTitleAlign: 'center',
            headerStyle: {
               backgroundColor: colors.bar,
            },
         }}>
         <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Ana Sayfa' }} />

         <Stack.Screen name="Shared" component={SharedNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
   );
};
export default HomeNavigator;
