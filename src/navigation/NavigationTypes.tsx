import { NavigatorScreenParams } from '@react-navigation/native';
import { UserAddress } from '@apptypes/index';

export type RootStackParamList = {
   Auth: undefined;
   App: undefined;
};

export type AuthStackParamList = {
   Login: undefined;
   Register: undefined;
   ForgotPassword: undefined;
   ResetPassword: { token: string };
   EmailConfirm: { emailOrIdentity: string };
   Deneme: undefined;
};

export type AppTabParamList = {
   Home: undefined;
   Profile: undefined;
};

export type HomeStackParamList = {
   HomeMain: undefined;
   Shared: NavigatorScreenParams<SharedStackParamList>;
};

export type ProfileStackParamList = {
   ProfileMain: undefined;
   PersonalInformation: undefined;
   AddressInformation: undefined;
   AddressChange: {
      mode?: 'create' | 'edit';
      address?: UserAddress;
   };
   Payment: undefined;
   AddCard: undefined;
   Groups: undefined;
   CreateGroup: undefined;
   Group: { groupId: string };
   Shared: NavigatorScreenParams<SharedStackParamList>;
   // Settings Altındakiler
   Settings: undefined;
   Help: undefined;
   About: undefined;
   Security: undefined;
};

export type SharedStackParamList = {
   Error: {
      error: string;
      fromScreen: string;
      toScreen: string;
   };
   Success: {
      success: string;
      fromScreen: string;
      toScreen: string;
   };
};
