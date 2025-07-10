import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
   Auth: undefined;
   App: undefined;
};

export type AuthStackParamList = {
   Login: undefined;
   Register: undefined;
   ForgotPassword: undefined;
   EmailConfirm: { emailOrIdentity: string };
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
   Shared: NavigatorScreenParams<SharedStackParamList>;
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
