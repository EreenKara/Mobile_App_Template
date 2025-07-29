// screens/RegisterScreen.tsx
import React, { useCallback, useRef } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as yup from 'yup';
import { AuthStackParamList } from '@navigation/NavigationTypes';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useRegister } from '@hooks/auth/useRegister';
import { RegisterCredentials } from '@apptypes/index';
import { registerValidationSchema } from '@utility/validations';
import ImageComponent from '@mycomponents/Image';
type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
   const lastEmailRef = useRef<string>('');
   const {
      loading,
      error,
      register,
      reset,
      isEmailAlreadyExists,
      isPhoneAlreadyExists,
      isNetworkError,
   } = useRegister({
      onRegisterSuccess: response => {
         // Register başarılı, email verification sayfasına yönlendir
         navigation.navigate('EmailConfirm', {
            emailOrIdentity: lastEmailRef.current,
         });
      },
      onRegisterError: error => {
         console.log('Register error:', error);
      },
      onEmailAlreadyExists: error => {
         // Email zaten kayıtlı ise login sayfasına yönlendir seçeneği sunabiliriz
         console.log('Email already exists:', error);
      },
      onPhoneAlreadyExists: error => {
         console.log('Phone already exists:', error);
      },
   });

   // Initial values
   const initialValues: RegisterCredentials = {
      name: '',
      surname: '',
      email: '',
      phoneNumber: '',
      password: '',
      termsAccepted: false,
   };

   const handleRegister = useCallback(
      async (values: RegisterCredentials) => {
         // Email'i ref'te sakla
         lastEmailRef.current = values.email;

         // Reset previous errors
         reset();

         // Register credentials (passwordConfirmation çıkarılıyor)
         const credentials: RegisterCredentials = {
            name: values.name,
            surname: values.surname,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
            termsAccepted: values.termsAccepted,
         };

         await register(credentials);
      },
      [register, reset],
   );

   // Loading state'inde loading component göster
   if (loading) {
      return <LoadingComponent />;
   }

   return (
      <SafeAreaView className="flex-1 bg-appBackground">
         <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Logo Container */}
            <View className="items-center mt-8 mb-8">
               <ImageComponent
                  source={require('@assets/images/nav_logo.png')}
                  className="w-32 h-32 mb-4 text-appIcon"
               />
               <Text className="text-2xl font-bold text-appText">Hesap Oluştur</Text>
            </View>

            <Formik
               initialValues={initialValues}
               validationSchema={registerValidationSchema}
               onSubmit={handleRegister}>
               {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
               }) => (
                  <View className="w-full">
                     {/* Backend Error Message with conditional styling */}
                     {error && (
                        <View
                           className={`mb-4 p-3 rounded-lg ${
                              isEmailAlreadyExists() || isPhoneAlreadyExists()
                                 ? 'bg-orange-50 border border-orange-200'
                                 : 'bg-red-50 border border-red-200'
                           }`}>
                           <Text
                              className={`text-center font-appFont text-base ${
                                 isEmailAlreadyExists() || isPhoneAlreadyExists()
                                    ? 'text-orange-700'
                                    : 'text-red-600'
                              }`}>
                              {error.message}
                           </Text>

                           {/* Email already exists için login sayfasına git butonu */}
                           {isEmailAlreadyExists() && (
                              <ButtonComponent
                                 title="Giriş Sayfasına Git"
                                 onPress={() => navigation.navigate('Login')}
                                 variant="text"
                                 size="small"
                                 className="mt-2"
                              />
                           )}
                        </View>
                     )}

                     {/* Name Input */}
                     <View className="mb-4">
                        <TextInputComponent
                           label="Ad"
                           value={values.name}
                           onChangeText={handleChange('name')}
                           onBlur={handleBlur('name')}
                           error={touched.name && errors.name ? errors.name : undefined}
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>
                     {/* Surname Input */}
                     <View className="mb-4">
                        <TextInputComponent
                           label="Soyad"
                           value={values.surname}
                           onChangeText={handleChange('surname')}
                           onBlur={handleBlur('surname')}
                           error={touched.surname && errors.surname ? errors.surname : undefined}
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>

                     {/* Email Input */}
                     <View className="mb-4">
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
                           editable={!loading}
                        />
                     </View>

                     {/* Phone Input */}
                     <View className="mb-4">
                        <TextInputComponent
                           label="Telefon Numarası"
                           value={values.phoneNumber}
                           onChangeText={handleChange('phoneNumber')}
                           onBlur={handleBlur('phoneNumber')}
                           error={
                              touched.phoneNumber && errors.phoneNumber
                                 ? errors.phoneNumber
                                 : undefined
                           }
                           keyboardType="phone-pad"
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>

                     {/* Password Input */}
                     <View className="mb-4">
                        <TextInputComponent
                           label="Şifre"
                           value={values.password}
                           onChangeText={handleChange('password')}
                           onBlur={handleBlur('password')}
                           error={touched.password && errors.password ? errors.password : undefined}
                           secureTextEntry
                           variant="outlined"
                           size="medium"
                           editable={!loading}
                        />
                     </View>

                     {/* Terms and Conditions Checkbox */}
                     <View className="flex-row items-center mb-6">
                        <Checkbox
                           status={values.termsAccepted ? 'checked' : 'unchecked'}
                           onPress={() => setFieldValue('termsAccepted', !values.termsAccepted)}
                           disabled={loading}
                        />
                        <Text className="flex-1 text-appText font-appFont text-sm ml-2">
                           <Text>Kullanım koşullarını ve </Text>
                           <Text
                              className="text-blue-600 underline"
                              onPress={() => {
                                 /* Navigate to terms */
                              }}>
                              gizlilik politikasını
                           </Text>
                           <Text> kabul ediyorum.</Text>
                        </Text>
                     </View>

                     {/* Terms validation error */}
                     {touched.termsAccepted && errors.termsAccepted && (
                        <Text className="text-red-500 text-sm mb-4 -mt-2">
                           {errors.termsAccepted}
                        </Text>
                     )}

                     {/* Register Button */}
                     <View className="mt-2">
                        <ButtonComponent
                           title="Kayıt Ol"
                           onPress={handleSubmit}
                           variant="primary"
                           size="medium"
                           fullWidth
                           className="mb-4"
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
                              className="mb-4"
                           />
                        </View>
                     )}

                     {/* Login Button */}
                     <View className="mt-2 mb-8">
                        <ButtonComponent
                           title="Zaten hesabın var mı? Giriş Yap"
                           onPress={() => navigation.navigate('Login')}
                           variant="text"
                           size="medium"
                           fullWidth
                           disabled={loading}
                        />
                     </View>
                  </View>
               )}
            </Formik>
         </ScrollView>
      </SafeAreaView>
   );
};

export default RegisterScreen;
