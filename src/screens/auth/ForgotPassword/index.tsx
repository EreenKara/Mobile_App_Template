// screens/ForgotPasswordScreen.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AuthStackParamList } from '@navigation/NavigationTypes';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useForgotPassword } from '@hooks/auth/useForgotPassword';
import { forgotPasswordValidationSchema } from '@utility/validations';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

interface ForgotPasswordFormValues {
   email: string;
}

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
   const [countdown, setCountdown] = useState(0);

   const {
      loading,
      error,
      isEmailSent,
      isPasswordReset,
      sendResetEmail,
      reset,
      resetEmailSentState,
      isEmailNotFound,
      isTooManyRequests,
      isNetworkError,
   } = useForgotPassword({
      onEmailSentSuccess: response => {
         console.log('Reset email sent successfully:', response);
         // Countdown timer başlat (tekrar gönderme için)
         startCountdown();
      },
      onEmailSentError: error => {
         console.log('Reset email send error:', error);
      },
      onEmailNotFound: error => {
         console.log('Email not found:', error);
         // Register sayfasına yönlendirme seçeneği sunabilirsin
      },
      onTooManyRequests: error => {
         console.log('Too many requests:', error);
         // Countdown timer başlat
         startCountdown();
      },
   });

   // Initial values
   const initialValues: ForgotPasswordFormValues = {
      email: '',
   };

   // Countdown timer için
   const startCountdown = useCallback(() => {
      setCountdown(60); // 60 saniye
      const timer = setInterval(() => {
         setCountdown(prev => {
            if (prev <= 1) {
               clearInterval(timer);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
   }, []);

   const handleSendResetEmail = useCallback(
      async (values: ForgotPasswordFormValues) => {
         await sendResetEmail(values.email);
      },
      [sendResetEmail],
   );

   const handleResendEmail = useCallback(
      async (email: string) => {
         resetEmailSentState();
         await sendResetEmail(email);
      },
      [sendResetEmail, resetEmailSentState],
   );

   const handleBackToLogin = useCallback(() => {
      reset();
      navigation.goBack();
   }, [reset, navigation]);

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
            <Text className="text-2xl font-bold text-appText mb-2">Şifremi Unuttum</Text>
            <Text className="text-base text-gray-600 text-center">
               {isEmailSent
                  ? 'Email adresinizi kontrol edin'
                  : 'Email adresinizi girin, size şifre sıfırlama linki gönderelim'}
            </Text>
         </View>

         {/* Email Sent Success State */}
         {isEmailSent && !error && (
            <View className="w-full">
               <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <Text className="text-green-700 text-center font-appFont text-base">
                     ✅ Şifre sıfırlama linki email adresinize gönderildi.
                  </Text>
                  <Text className="text-green-600 text-center text-sm mt-2">
                     Email gelmedi mi? Spam klasörünü kontrol edin.
                  </Text>
               </View>

               {/* Resend Button with Countdown */}
               <View className="mb-4">
                  <ButtonComponent
                     title={countdown > 0 ? `Tekrar Gönder (${countdown})` : 'Tekrar Gönder'}
                     onPress={() => handleResendEmail(initialValues.email)}
                     variant="outlined"
                     size="medium"
                     fullWidth
                     disabled={countdown > 0 || loading}
                     className="mb-3"
                  />
               </View>

               {/* Back to Login Button */}
               <View>
                  <ButtonComponent
                     title="Giriş Sayfasına Dön"
                     onPress={handleBackToLogin}
                     variant="text"
                     size="medium"
                     fullWidth
                  />
               </View>
            </View>
         )}

         {/* Email Input Form */}
         {!isEmailSent && (
            <Formik
               initialValues={initialValues}
               validationSchema={forgotPasswordValidationSchema}
               onSubmit={handleSendResetEmail}>
               {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                  <View className="w-full">
                     {/* Backend Error Message */}
                     {error && (
                        <View
                           className={`mb-4 p-3 rounded-lg ${
                              isEmailNotFound()
                                 ? 'bg-orange-50 border border-orange-200'
                                 : isTooManyRequests()
                                   ? 'bg-yellow-50 border border-yellow-200'
                                   : 'bg-red-50 border border-red-200'
                           }`}>
                           <Text
                              className={`text-center font-appFont text-base ${
                                 isEmailNotFound()
                                    ? 'text-orange-700'
                                    : isTooManyRequests()
                                      ? 'text-yellow-700'
                                      : 'text-red-600'
                              }`}>
                              {isEmailNotFound()
                                 ? 'Bu email adresi ile kayıtlı hesap bulunamadı.'
                                 : isTooManyRequests()
                                   ? 'Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.'
                                   : error.message}
                           </Text>

                           {/* Email not found için register butonu */}
                           {isEmailNotFound() && (
                              <ButtonComponent
                                 title="Yeni Hesap Oluştur"
                                 onPress={() => navigation.navigate('Register')}
                                 variant="text"
                                 size="small"
                                 className="mt-2"
                              />
                           )}
                        </View>
                     )}

                     {/* Email Input */}
                     <View className="mb-6">
                        <TextInputComponent
                           label="Email Adresi"
                           value={values.email}
                           onChangeText={handleChange('email')}
                           onBlur={handleBlur('email')}
                           error={touched.email && errors.email ? errors.email : undefined}
                           keyboardType="email-address"
                           autoCapitalize="none"
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>

                     {/* Send Reset Email Button */}
                     <View className="mb-4">
                        <ButtonComponent
                           title="Sıfırlama Linki Gönder"
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

export default ForgotPasswordScreen;
