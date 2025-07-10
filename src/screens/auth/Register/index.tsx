import React, { useCallback } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Button } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { AuthStackParamList } from '@navigation/NavigationTypes';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import { registerUserSchema } from '@utility/validations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Register } from '@apptypes/entities/register';
import { useAuth } from '@hooks/use.auth';
import { useStyles } from '@hooks/Modular/use.styles';
import createStyles from './index.style';
import styleNumbers from '@styles/common/style.numbers';
type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
   const styles = useStyles(createStyles);
   const { submitRegister, submitError } = useAuth(false);

   const handleRegister = useCallback(
      async (values: Register) => {
         const result = await submitRegister(values);
         if (result === true) {
            navigation.navigate('EmailConfirm', { emailOrIdentity: values.email });
         }
      },
      [submitRegister, navigation],
   );
   return (
      <SafeAreaView style={{ flex: 1 }}>
         <Formik
            initialValues={{
               username: '',
               name: '',
               surname: '',
               identityNumber: '',
               phoneNumber: '',
               email: '',
               password: '',
               passwordConfirm: '',
            }}
            validationSchema={registerUserSchema}
            onSubmit={handleRegister}>
            {({
               setFieldValue,
               handleChange,
               handleBlur,
               handleSubmit,
               values,
               errors,
               touched,
            }) => (
               <KeyboardAwareScrollView style={styles.container}>
                  {submitError && <Text style={styles.errorText}>{submitError}</Text>}
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Kullanıcı Adı"
                        value={values.username}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        error={touched.username && errors.username ? errors.username : undefined}
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Ad"
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                        error={touched.name && errors.name ? errors.name : undefined}
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Soyad"
                        value={values.surname}
                        onChangeText={handleChange('surname')}
                        onBlur={handleBlur('surname')}
                        error={touched.surname && errors.surname ? errors.surname : undefined}
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Kimlik Numarası"
                        value={values.identityNumber}
                        onChangeText={handleChange('identityNumber')}
                        onBlur={handleBlur('identityNumber')}
                        error={
                           touched.identityNumber && errors.identityNumber
                              ? errors.identityNumber
                              : undefined
                        }
                        keyboardType="numeric"
                        maxLength={11}
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Telefon Numarası"
                        value={values.phoneNumber}
                        onChangeText={value => {
                           setFieldValue('phoneNumber', value);
                        }}
                        onBlur={handleBlur('phoneNumber')}
                        error={
                           touched.phoneNumber && errors.phoneNumber
                              ? errors.phoneNumber
                              : undefined
                        }
                        keyboardType="phone-pad"
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="E-mail"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        error={touched.email && errors.email ? errors.email : undefined}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Şifre"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        error={touched.password && errors.password ? errors.password : undefined}
                        secureTextEntry
                        style={styles.input}
                     />
                  </View>
                  <View style={styles.viewTextInput}>
                     <TextInputComponent
                        label="Şifre Tekrar"
                        value={values.passwordConfirm}
                        onChangeText={handleChange('passwordConfirm')}
                        onBlur={() => {
                           handleBlur('passwordConfirm');
                           //if (values.password !== values.passwordConfirm) {
                           //  setFieldError('passwordConfirm', 'Şifreler eşleşmiyor');
                           //}
                        }}
                        error={
                           touched.passwordConfirm && errors.passwordConfirm
                              ? errors.passwordConfirm
                              : undefined
                        }
                        secureTextEntry
                        style={styles.input}
                     />
                  </View>
                  <ButtonComponent title="Kayıt Ol" onPress={handleSubmit} style={styles.button} />
                  <Button
                     mode="text"
                     onPress={() => navigation.navigate('Login')}
                     style={[styles.button, { marginBottom: styleNumbers.space * 4 }]}>
                     Zaten hesabın var mı? Giriş Yap
                  </Button>
               </KeyboardAwareScrollView>
            )}
         </Formik>
      </SafeAreaView>
   );
};

export default RegisterScreen;
