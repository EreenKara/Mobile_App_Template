// screens/EmailConfirmScreen.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Text, View, TextInput, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/NavigationTypes';
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useEmailConfirm } from '@hooks/auth/useEmailConfirm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailConfirm'>;

const EmailConfirmScreen: React.FC<Props> = ({ navigation, route }) => {
   const { emailOrIdentity } = route.params;
   const [code, setCode] = useState(['', '', '', '', '', '']);
   const [countdown, setCountdown] = useState(0);
   const codeLength = 6;
   const inputs = useRef<Array<TextInput | null>>([null, null, null, null, null, null]);

   const {
      loading,
      error,
      isEmailConfirmed,
      isCodeResent,
      confirmEmail,
      resendCode,
      reset,
      resetResendState,
      isInvalidCode,
      isCodeExpired,
      isTooManyAttempts,
      isTooManyRequests,
      isEmailAlreadyVerified,
      isNetworkError,
   } = useEmailConfirm({
      onConfirmSuccess: response => {
         console.log('Email confirmed successfully:', response);
         // Email doğrulandıktan sonra login sayfasına yönlendir
         setTimeout(() => {
            navigation.navigate('Login');
         }, 2000);
      },
      onConfirmError: error => {
         console.log('Email confirm error:', error);
      },
      onResendSuccess: response => {
         console.log('Code resent successfully:', response);
         startCountdown();
      },
      onInvalidCode: error => {
         console.log('Invalid code:', error);
         // Code'u temizle
         setCode(['', '', '', '', '', '']);
         inputs.current[0]?.focus();
      },
      onCodeExpired: error => {
         console.log('Code expired:', error);
      },
      onEmailAlreadyVerified: error => {
         console.log('Email already verified:', error);
         // Login sayfasına yönlendir
         navigation.navigate('Login');
      },
      onTooManyAttempts: error => {
         console.log('Too many attempts:', error);
         startCountdown();
      },
   });

   // Countdown timer başlat
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

   const focusPrevious = (index: number) => {
      if (index > 0) {
         inputs.current[index - 1]?.focus();
      }
   };

   const focusNext = (index: number) => {
      if (index < codeLength - 1) {
         inputs.current[index + 1]?.focus();
      }
   };

   const handleCodeChange = (text: string, index: number) => {
      const newCode = [...code];

      // Silme işlemi kontrolü
      if (text === '') {
         newCode[index] = '';
         setCode(newCode);
         focusPrevious(index);
         return;
      }

      // Sadece sayısal değerlere izin ver
      if (!text.match(/^[0-9]+$/)) {
         return;
      }

      // Yapıştırılan metin için kontrol
      if (text.length > 1) {
         const pastedText = text.slice(0, codeLength - index);
         for (let i = 0; i < pastedText.length; i++) {
            if (index + i < codeLength) {
               newCode[index + i] = pastedText[i];
            }
         }
         setCode(newCode);

         // Son doldurulan input'a focus
         const nextIndex = Math.min(index + pastedText.length, codeLength - 1);
         inputs.current[nextIndex]?.focus();
         return;
      }

      // Tek karakter girişi
      newCode[index] = text;
      setCode(newCode);

      // Otomatik olarak sonraki input'a geç
      if (text !== '') {
         focusNext(index);
      }
   };

   const handleKeyPress = (e: any, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
         const newCode = [...code];
         newCode[index] = '';
         setCode(newCode);
         focusPrevious(index);
      }
   };

   const handleSubmit = useCallback(async () => {
      const verificationCode = code.join('');

      if (verificationCode.length !== 6) {
         // 6 haneli kod girilmemiş
         return;
      }

      await confirmEmail(emailOrIdentity, verificationCode);
   }, [code, emailOrIdentity, confirmEmail]);

   const handleResendCode = useCallback(async () => {
      resetResendState();
      setCode(['', '', '', '', '', '']); // Code'u temizle
      await resendCode(emailOrIdentity);
   }, [emailOrIdentity, resendCode, resetResendState]);

   const handleBackToLogin = useCallback(() => {
      reset();
      navigation.navigate('Login');
   }, [reset, navigation]);

   // Loading state'inde loading component göster
   if (loading) {
      return <LoadingComponent />;
   }

   return (
      <SafeAreaView className="flex-1 bg-appBackground">
         <KeyboardAwareScrollView
            className="flex-1"
            contentContainerClassName="flex-1"
            showsVerticalScrollIndicator={false}>
            <View className="flex-1 justify-center px-6">
               {/* Email Confirmed Success State */}
               {isEmailConfirmed && !error && (
                  <View className="items-center">
                     <View className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 w-full">
                        <Text className="text-green-700 text-center font-appFont text-xl font-bold">
                           ✅ Email Doğrulandı!
                        </Text>
                        <Text className="text-green-600 text-center text-base mt-3">
                           Email adresiniz başarıyla doğrulandı. Giriş sayfasına
                           yönlendiriliyorsunuz...
                        </Text>
                     </View>

                     <ButtonComponent
                        title="Hemen Giriş Yap"
                        onPress={handleBackToLogin}
                        variant="primary"
                        size="medium"
                        fullWidth
                     />
                  </View>
               )}

               {/* Code Resent Success Message */}
               {isCodeResent && !isEmailConfirmed && (
                  <View className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                     <Text className="text-blue-700 text-center font-appFont text-base">
                        ✅ Doğrulama kodu tekrar gönderildi.
                     </Text>
                  </View>
               )}

               {/* Main Form */}
               {!isEmailConfirmed && (
                  <>
                     {/* Title and Description */}
                     <View className="items-center mb-8">
                        <Text className="text-2xl font-bold text-appText mb-4">
                           Email Doğrulama
                        </Text>
                        <Text className="text-base text-gray-600 text-center leading-6">
                           <Text className="font-semibold">{emailOrIdentity}</Text> adresine
                           gönderilen{'\n'}
                           {codeLength} haneli doğrulama kodunu giriniz
                        </Text>
                     </View>

                     {/* Backend Error Message */}
                     {error && (
                        <View
                           className={`mb-6 p-4 rounded-lg ${
                              isInvalidCode()
                                 ? 'bg-red-50 border border-red-200'
                                 : isCodeExpired()
                                   ? 'bg-orange-50 border border-orange-200'
                                   : isTooManyAttempts()
                                     ? 'bg-yellow-50 border border-yellow-200'
                                     : isEmailAlreadyVerified()
                                       ? 'bg-green-50 border border-green-200'
                                       : 'bg-red-50 border border-red-200'
                           }`}>
                           <Text
                              className={`text-center font-appFont text-base ${
                                 isInvalidCode()
                                    ? 'text-red-600'
                                    : isCodeExpired()
                                      ? 'text-orange-700'
                                      : isTooManyAttempts()
                                        ? 'text-yellow-700'
                                        : isEmailAlreadyVerified()
                                          ? 'text-green-700'
                                          : 'text-red-600'
                              }`}>
                              {isInvalidCode()
                                 ? 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.'
                                 : isCodeExpired()
                                   ? 'Doğrulama kodu süresi dolmuş. Yeni kod talep edin.'
                                   : isTooManyAttempts()
                                     ? 'Çok fazla yanlış deneme. Lütfen biraz bekleyin.'
                                     : isEmailAlreadyVerified()
                                       ? 'Email adresiniz zaten doğrulanmış.'
                                       : error.message}
                           </Text>
                        </View>
                     )}

                     {/* Code Input Container */}
                     <View className="flex-row justify-between mb-8 px-4">
                        {code.map((digit, index) => (
                           <TextInput
                              key={index}
                              ref={ref => {
                                 inputs.current[index] = ref;
                              }}
                              className={`w-12 h-12 border-2 rounded-lg text-center text-xl font-bold ${
                                 digit
                                    ? 'border-blue-500 bg-blue-50'
                                    : error && isInvalidCode()
                                      ? 'border-red-500 bg-red-50'
                                      : 'border-gray-300 bg-white'
                              }`}
                              value={digit}
                              onChangeText={text => handleCodeChange(text, index)}
                              onKeyPress={e => handleKeyPress(e, index)}
                              keyboardType="number-pad"
                              maxLength={1}
                              selectTextOnFocus
                              editable={!loading}
                           />
                        ))}
                     </View>

                     {/* Submit Button */}
                     <View className="mb-4">
                        <ButtonComponent
                           title="Doğrula"
                           onPress={handleSubmit}
                           variant="primary"
                           size="medium"
                           fullWidth
                           disabled={loading || code.join('').length !== 6}
                           className="mb-4"
                        />
                     </View>

                     {/* Resend Code Button */}
                     <View className="mb-4">
                        <ButtonComponent
                           title={
                              countdown > 0
                                 ? `Kodu Tekrar Gönder (${countdown})`
                                 : 'Kodu Tekrar Gönder'
                           }
                           onPress={handleResendCode}
                           variant="outlined"
                           size="medium"
                           fullWidth
                           disabled={countdown > 0 || loading}
                           className="mb-3"
                        />
                     </View>

                     {/* Network Error Retry */}
                     {isNetworkError() && (
                        <View className="mb-4">
                           <ButtonComponent
                              title="Tekrar Dene"
                              onPress={handleSubmit}
                              variant="outlined"
                              size="medium"
                              fullWidth
                           />
                        </View>
                     )}

                     {/* Back to Login */}
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

                     {/* Help Text */}
                     <View className="mt-6 p-3 bg-gray-50 rounded-lg">
                        <Text className="text-sm text-gray-600 text-center">
                           Kod gelmedi mi? Spam klasörünü kontrol edin veya{'\n'}
                           "Kodu Tekrar Gönder" butonuna tıklayın.
                        </Text>
                     </View>
                  </>
               )}
            </View>
         </KeyboardAwareScrollView>
      </SafeAreaView>
   );
};

export default EmailConfirmScreen;
