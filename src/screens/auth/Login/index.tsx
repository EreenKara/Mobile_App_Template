import React, { useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import { Button, Checkbox } from 'react-native-paper';
import type {
   NativeStackScreenProps,
   NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Formik } from 'formik';
import { AuthStackParamList, RootStackParamList } from '@navigation/NavigationTypes';
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import { bosSchema, loginUserSchema } from '@utility/validations';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useAuth } from '@hooks/use.auth';
import { useNavigation } from '@react-navigation/native';
import { useStyles } from '@hooks/Modular/use.styles';
import createStyles from './index.style';
type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type RootProps = NativeStackNavigationProp<RootStackParamList>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
   const homeNavigation = useNavigation<RootProps>();
   const styles = useStyles(createStyles);
   const { loading, submitError, submitLogin, emailOrIdentity } = useAuth(true);

   const handleLogin = useCallback(
      async (values: { emailOrIdentity: string; password: string; rememberMe: boolean }) => {
         const result = await submitLogin(values);
         if (result.ok === true) {
            homeNavigation.reset({
               index: 0,
               routes: [{ name: 'App' }],
            });
         } else if (result.status === 403) {
            navigation.navigate('EmailConfirm', {
               emailOrIdentity: values.emailOrIdentity,
            });
         }
      },
      [submitLogin, homeNavigation],
   );

   const initialValues = {
      emailOrIdentity: emailOrIdentity,
      password: '',
      rememberMe: emailOrIdentity ? true : false,
   };

   if (loading) {
      return <LoadingComponent />;
   }
   return (
      <SafeAreaView style={[styles.container]}>
         <View style={styles.logoContainer}>
            <Image source={require('@assets/images/nav_logo.png')} style={styles.logo} />
         </View>
         <Formik
            initialValues={initialValues}
            validationSchema={loginUserSchema}
            onSubmit={handleLogin}>
            {({
               handleChange,
               handleBlur,
               handleSubmit,
               values,
               errors,
               touched,
               setFieldValue,
            }) => (
               <>
                  {submitError && <Text style={styles.errorText}>{submitError}</Text>}
                  <View style={styles.viewText}>
                     <TextInputComponent
                        label="Email"
                        value={values.emailOrIdentity}
                        onChangeText={handleChange('emailOrIdentity')}
                        onBlur={handleBlur('emailOrIdentity')}
                        error={
                           touched.emailOrIdentity && errors.emailOrIdentity
                              ? errors.emailOrIdentity
                              : undefined
                        }
                        style={styles.input}
                        autoCapitalize="none"
                     />
                  </View>
                  <View style={styles.viewText}>
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
                  <View style={styles.checkboxContainer}>
                     <Checkbox
                        status={values.rememberMe ? 'checked' : 'unchecked'}
                        onPress={() => setFieldValue('rememberMe', !values.rememberMe)}
                     />
                     <Text style={styles.checkboxLabel}>Beni Hatırla</Text>
                  </View>
                  <ButtonComponent title="Giriş Yap" onPress={handleSubmit} style={styles.button} />
                  <Button
                     labelStyle={styles.buttonLabel}
                     onPress={() => navigation.navigate('ForgotPassword')}
                     style={styles.button}>
                     Şifremi Unuttum
                  </Button>
                  <Button
                     labelStyle={styles.buttonLabel}
                     onPress={() => navigation.navigate('Register')}
                     style={styles.button}>
                     Hesabın yok mu? Kayıt Ol
                  </Button>
               </>
            )}
         </Formik>
      </SafeAreaView>
   );
};

export default LoginScreen;
