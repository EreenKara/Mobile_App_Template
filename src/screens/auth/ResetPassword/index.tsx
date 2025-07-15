// screens/ResetPasswordScreen.tsx
import React, { useCallback } from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { AuthStackParamList } from '@navigation/NavigationTypes';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useForgotPassword } from '@hooks/auth/useForgotPassword';
import { resetPasswordValidationSchema } from '@utility/validations';
type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

// Validation Schema

interface ResetPasswordFormValues {
   newPassword: string;
   confirmPassword: string;
}

const ResetPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
   // Route'dan token'ı al (deep link veya navigation parameter'dan gelecek)
   const { token } = route.params || {};

   const {
      loading,
      error,
      isEmailSent,
      isPasswordReset,
      resetPassword,
      reset,
      isInvalidToken,
      isTokenExpired,
      isWeakPassword,
      isNetworkError,
   } = useForgotPassword({
      onResetSuccess: response => {
         console.log('Password reset successful:', response);
         // 2 saniye sonra login sayfasına yönlendir
         setTimeout(() => {
            navigation.navigate('Login');
         }, 2000);
      },
      onResetError: error => {
         console.log('Password reset error:', error);
      },
   });

   // Initial values
   const initialValues: ResetPasswordFormValues = {
      newPassword: '',
      confirmPassword: '',
   };

   const handleResetPassword = useCallback(
      async (values: ResetPasswordFormValues) => {
         if (!token) {
            console.error('Reset token is missing');
            return;
         }

         await resetPassword(token, values.newPassword, values.confirmPassword);
      },
      [resetPassword, token],
   );

   const handleBackToLogin = useCallback(() => {
      reset();
      navigation.navigate('Login');
   }, [reset, navigation]);

   const handleBackToForgotPassword = useCallback(() => {
      reset();
      navigation.navigate('ForgotPassword');
   }, [reset, navigation]);

   // Token yoksa hata göster
   if (!token) {
      return (
         <SafeAreaView className="flex-1 justify-center px-6 bg-appBackground">
            <View className="items-center">
               <Text className="text-xl font-bold text-red-600 mb-4 text-center">
                  Geçersiz Sıfırlama Linki
               </Text>
               <Text className="text-base text-gray-600 text-center mb-6">
                  Sıfırlama linki geçersiz veya eksik. Lütfen yeni bir sıfırlama linki talep edin.
               </Text>
               <ButtonComponent
                  title="Yeni Link Talep Et"
                  onPress={handleBackToForgotPassword}
                  variant="primary"
                  size="medium"
                  fullWidth
               />
            </View>
         </SafeAreaView>
      );
   }

   // Loading state'inde loading component göster
   if (loading) {
      return <LoadingComponent />;
   }

   return (
      <SafeAreaView className="flex-1 justify-center px-6 bg-appBackground">
         {/* Logo Container */}
         <View className="items-center mb-12">
            <Image
               source={require('@assets/images/nav_logo.png')}
               className="w-32 h-32 mb-4"
               style={{ tintColor: '#345C6F' }}
            />
            <Text className="text-2xl font-bold text-appText mb-2">Yeni Şifre Belirle</Text>
            <Text className="text-base text-gray-600 text-center">
               {isPasswordReset
                  ? 'Şifreniz başarıyla güncellendi'
                  : 'Hesabınız için yeni bir şifre belirleyin'}
            </Text>
         </View>

         {/* Reset Completed Success State */}
         {isPasswordReset && !error && (
            <View className="w-full">
               <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <Text className="text-green-700 text-center font-appFont text-lg font-semibold">
                     ✅ Şifre Güncellendi!
                  </Text>
                  <Text className="text-green-600 text-center text-base mt-2">
                     Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
                  </Text>
               </View>

               {/* Manual Login Button */}
               <View>
                  <ButtonComponent
                     title="Hemen Giriş Yap"
                     onPress={handleBackToLogin}
                     variant="primary"
                     size="medium"
                     fullWidth
                  />
               </View>
            </View>
         )}

         {/* Reset Password Form */}
         {!isPasswordReset && (
            <Formik
               initialValues={initialValues}
               validationSchema={resetPasswordValidationSchema}
               onSubmit={handleResetPassword}>
               {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View className="w-full">
                     {/* Backend Error Message */}
                     {error && (
                        <View
                           className={`mb-4 p-3 rounded-lg ${
                              isInvalidToken() || isTokenExpired()
                                 ? 'bg-orange-50 border border-orange-200'
                                 : 'bg-red-50 border border-red-200'
                           }`}>
                           <Text
                              className={`text-center font-appFont text-base ${
                                 isInvalidToken() || isTokenExpired()
                                    ? 'text-orange-700'
                                    : 'text-red-600'
                              }`}>
                              {isInvalidToken()
                                 ? "Geçersiz sıfırlama token'ı. Yeni bir link talep edin."
                                 : isTokenExpired()
                                   ? 'Sıfırlama linki süresi dolmuş. Yeni bir link talep edin.'
                                   : error.message}
                           </Text>

                           {/* Token error için yeni link talep et butonu */}
                           {(isInvalidToken() || isTokenExpired()) && (
                              <ButtonComponent
                                 title="Yeni Link Talep Et"
                                 onPress={handleBackToForgotPassword}
                                 variant="text"
                                 size="small"
                                 className="mt-2"
                              />
                           )}
                        </View>
                     )}

                     {/* New Password Input */}
                     <View className="mb-4">
                        <TextInputComponent
                           label="Yeni Şifre"
                           value={values.newPassword}
                           onChangeText={handleChange('newPassword')}
                           onBlur={handleBlur('newPassword')}
                           error={
                              touched.newPassword && errors.newPassword
                                 ? errors.newPassword
                                 : undefined
                           }
                           secureTextEntry
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>

                     {/* Confirm Password Input */}
                     <View className="mb-6">
                        <TextInputComponent
                           label="Yeni Şifre Tekrarı"
                           value={values.confirmPassword}
                           onChangeText={handleChange('confirmPassword')}
                           onBlur={handleBlur('confirmPassword')}
                           error={
                              touched.confirmPassword && errors.confirmPassword
                                 ? errors.confirmPassword
                                 : undefined
                           }
                           secureTextEntry
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>

                     {/* Password Requirements */}
                     <View className="mb-6 p-3 bg-gray-50 rounded-lg">
                        <Text className="text-sm text-gray-600 mb-2 font-semibold">
                           Şifre Gereksinimleri:
                        </Text>
                        <Text className="text-xs text-gray-500">• En az 8 karakter</Text>
                        <Text className="text-xs text-gray-500">• En az 1 büyük harf</Text>
                        <Text className="text-xs text-gray-500">• En az 1 küçük harf</Text>
                        <Text className="text-xs text-gray-500">• En az 1 rakam</Text>
                     </View>

                     {/* Reset Password Button */}
                     <View className="mb-4">
                        <ButtonComponent
                           title="Şifremi Güncelle"
                           onPress={handleSubmit}
                           variant="primary"
                           size="medium"
                           fullWidth
                           disabled={loading}
                        />
                     </View>

                     {/* Network error için retry button */}
                     {isNetworkError() && (
                        <View className="mb-4">
                           <ButtonComponent
                              title="Tekrar Dene"
                              onPress={() => handleSubmit()}
                              variant="outlined"
                              size="medium"
                              fullWidth
                           />
                        </View>
                     )}

                     {/* Back to Login Button */}
                     <View>
                        <ButtonComponent
                           title="Giriş Sayfasına Dön"
                           onPress={handleBackToLogin}
                           variant="text"
                           size="medium"
                           fullWidth
                           disabled={loading}
                        />
                     </View>
                  </View>
               )}
            </Formik>
         )}
      </SafeAreaView>
   );
};

export default ResetPasswordScreen;
