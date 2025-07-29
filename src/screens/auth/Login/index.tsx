import React, { useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import type {
   NativeStackScreenProps,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { AuthStackParamList, RootStackParamList } from '@navigation/NavigationTypes';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import { loginUserSchema } from '@utility/validations';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useAuth } from '@hooks/auth/useAuth';
import { useNavigation } from '@react-navigation/native';
import { LoginCredentials } from '@apptypes/entities/loginCredentials';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type RootProps = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
   const homeNavigation = useNavigation<RootProps>();
   const lastEmailRef = useRef<string>('');

   const {
      loading,
      error,
      login,
      reset,
      isEmailNotVerified,
      isInvalidCredentials,
      isNetworkError,
   } = useAuth({
      onLoginSuccess: user => {
         // Login başarılı olursa ana sayfaya yönlendir
         homeNavigation.reset({
            index: 0,
            routes: [{ name: 'App' }],
         });
      },
      onLoginError: error => {
         // Email verification için özel handling
         if (error.statusCode === 403 || error.code === 'EMAIL_NOT_VERIFIED') {
            navigation.navigate('EmailConfirm', {
               emailOrIdentity: lastEmailRef.current,
            });
         }
      },
   });

   // Initial values
   const initialValues: LoginCredentials = {
      email: '',
      password: '',
   };

   const handleLogin = useCallback(
      async (values: LoginCredentials) => {
         // Email'i ref'te sakla
         lastEmailRef.current = values.email;

         // Reset previous errors
         reset();

         // Login attempt - error handling hook içinde yapılacak
         await login(values);
      },
      [login, reset],
   );

   // Loading state'inde loading component göster
   if (loading) {
      return <LoadingComponent />;
   }

   return (
      <SafeAreaView className="flex-1 justify-center px-6 bg-appBackground">
         {/* Logo Container - Responsive spacing */}
         <View className="items-center mb-12 sm:mb-16 md:mb-20">
            <Image
               source={require('@assets/images/nav_logo.png')}
               className="w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 mb-8"
               style={{ tintColor: '#345C6F' }} // appIcon color
            />
         </View>

         <Formik
            initialValues={initialValues}
            validationSchema={loginUserSchema}
            onSubmit={handleLogin}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
               <View className="w-full">
                  {/* Backend Error Message with conditional styling */}
                  {error && (
                     <View
                        className={`mb-4 sm:mb-6 p-3 rounded-lg ${
                           isEmailNotVerified()
                              ? 'bg-appWarning border border-appWarningBorder'
                              : 'bg-appWarning border border-appWarningBorder'
                        }`}>
                        <Text
                           className={`text-center font-appFont text-base sm:text-lg ${
                              isEmailNotVerified() ? 'text-appWarningText' : 'text-appError'
                           }`}>
                           {isEmailNotVerified()
                              ? 'Email adresinizi doğrulamanız gerekiyor.'
                              : error.message}
                        </Text>

                        {/* Email verification için özel buton */}
                        {isEmailNotVerified() && (
                           <ButtonComponent
                              title="Email Doğrulama Sayfasına Git"
                              onPress={() =>
                                 navigation.navigate('EmailConfirm', {
                                    emailOrIdentity: values.email,
                                 })
                              }
                              variant="text"
                              size="small"
                              className="mt-2"
                           />
                        )}
                     </View>
                  )}

                  {/* Email Input */}
                  <View className="mt-6 sm:mt-8 md:mt-10">
                     <TextInputComponent
                        label="Email"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        error={touched.email && errors.email ? errors.email : undefined}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        variant="outlined"
                        size="medium"
                        className="mb-4 sm:mb-6"
                        editable={!loading}
                     />
                  </View>

                  {/* Password Input */}
                  <View className="mt-6 sm:mt-8 md:mt-10">
                     <TextInputComponent
                        label="Şifre"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        error={touched.password && errors.password ? errors.password : undefined}
                        secureTextEntry
                        variant="outlined"
                        size="medium"
                        className="mb-4 sm:mb-6"
                        editable={!loading}
                     />
                  </View>

                  {/* Login Button */}
                  <View className="mt-2 sm:mt-4 md:mt-6">
                     <ButtonComponent
                        title="Giriş Yap"
                        onPress={handleSubmit}
                        variant="primary"
                        size="medium"
                        fullWidth
                        className="mb-3 sm:mb-4"
                        disabled={loading}
                     />
                  </View>

                  {/* Network error için retry button */}
                  {isNetworkError() && (
                     <View className="mt-2">
                        <ButtonComponent
                           title="Tekrar Dene"
                           onPress={() => handleSubmit()}
                           variant="outlined"
                           size="medium"
                           fullWidth
                           className="mb-3 sm:mb-4"
                        />
                     </View>
                  )}

                  {/* Forgot Password Button */}
                  <View className="mt-2 sm:mt-3">
                     <ButtonComponent
                        title="Şifremi Unuttum"
                        onPress={() => navigation.navigate('ForgotPassword')}
                        variant="text"
                        size="medium"
                        fullWidth
                        className="mb-2 sm:mb-3"
                        disabled={loading}
                     />
                  </View>

                  {/* Register Button */}
                  <View className="mt-2 sm:mt-3">
                     <ButtonComponent
                        title="Hesabın yok mu? Kayıt Ol"
                        onPress={() => navigation.navigate('Register')}
                        variant="text"
                        size="medium"
                        fullWidth
                        disabled={loading}
                     />
                  </View>
                  <View className="mt-2 sm:mt-3">
                     <ButtonComponent
                        title="Ana Sayfaya Git"
                        onPress={() => homeNavigation.navigate('App')}
                        variant="text"
                        size="medium"
                        fullWidth
                        disabled={loading}
                     />
                  </View>
               </View>
            )}
         </Formik>
      </SafeAreaView>
   );
};

export default LoginScreen;
