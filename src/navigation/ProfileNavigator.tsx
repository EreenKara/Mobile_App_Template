import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileStackParamList } from './types';
import Colors from '@styles/common/colors';
import NavBarTitle from '@screens/shared/navbar_title';
import ProfileScreen from '@screens/profile/Profile';
import SettingsScreen from '@screens/profile/Settings';
import PaymentScreen from '@screens/profile/Payment';
import AddCardScreen from '@screens/profile/Payment/add.card';
import PersonalInformationScreen from '@screens/profile/PersonalInformation';
import GroupsScreen from '@screens/profile/Groups';
import AddressInformationScreen from '@screens/profile/AddressInformation';
import CreateGroupScreen from '@screens/profile/CreateGroup';
import GroupScreen from '@screens/profile/Group';
import SharedNavigator from './SharedNavigator';
import { useThemeColors } from '@contexts/theme.provider';
import CreatedElectionsScreen from '@screens/profile/CreatedElections';
import AddressChangeScreen from '@screens/profile/AddressChange';
const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileNavigator: React.FC = () => {
   const { colors } = useThemeColors();
   return (
      <Stack.Navigator
         id={undefined}
         screenOptions={{
            headerShown: true,
            headerRight: () => <NavBarTitle />,
            headerTitleAlign: 'center',
            headerStyle: {
               backgroundColor: colors.transition,
            },
         }}>
         <Stack.Screen
            name="ProfileMain"
            component={ProfileScreen}
            options={{
               title: 'Profil',
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="AddressChange"
            component={AddressChangeScreen}
            options={{
               title: 'Addresi Değiştir',
            }}
         />
         <Stack.Screen name="Shared" component={SharedNavigator} options={{ headerShown: false }} />
         <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Ödeme' }} />
         <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ayarlar' }} />

         <Stack.Screen
            name="PersonalInformation"
            component={PersonalInformationScreen}
            options={{ title: 'Kişisel Bilgiler' }}
         />
         <Stack.Screen name="Groups" component={GroupsScreen} options={{ title: 'Gruplar' }} />
         <Stack.Screen name="Group" component={GroupScreen} options={{ title: 'Grup' }} />
         <Stack.Screen
            name="CreateGroup"
            component={CreateGroupScreen}
            options={{ title: 'Grup Oluştur' }}
         />

         <Stack.Screen
            name="AddressInformation"
            component={AddressInformationScreen}
            options={{ title: 'Adres Bilgileri' }}
         />
      </Stack.Navigator>
   );
};
export default ProfileNavigator;
