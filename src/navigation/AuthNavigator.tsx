// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './NavigationTypes';
import { LoginScreen } from '@screens/auth/index';
import { RegisterScreen } from '@screens/auth/index';
import { ForgotPasswordScreen } from '@screens/auth/index';
import Colors from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import EmailConfirmScreen from '@screens/auth/EmailConfirm';
import DenemeScreen from '@screens/auth/Deneme';
import { useThemeColors } from '@contexts/index';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
   const { colors } = useThemeColors();
   return (
      <Stack.Navigator
         id={undefined}
         initialRouteName="Login"
         screenOptions={{
            headerStyle: {
               backgroundColor: colors.transition,
            },
            headerTintColor: '#000',
            headerTitleStyle: {
               ...CommonStyles.textStyles.title,
               color: Colors.getTheme().text,
            },
            headerShadowVisible: false,
            headerShown: true,
            headerTitleAlign: 'center',
         }}>
         <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
               title: 'Giriş Yap',
               headerShown: false,
            }}
         />
         <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
               title: 'Kayıt Ol',
               headerShown: true,
            }}
         />
         <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
               title: 'Şifremi Unuttum',

               presentation: 'modal',
            }}
         />
         <Stack.Screen
            name="EmailConfirm"
            component={EmailConfirmScreen}
            options={{
               title: 'Doğrulama',
               presentation: 'modal',
            }}
         />
         <Stack.Screen
            name="Deneme"
            component={DenemeScreen}
            options={{
               title: 'Deneme',
               presentation: 'modal',
            }}
         />
      </Stack.Navigator>
   );
};

export default AuthNavigator;
