import { useEffect, useState } from 'react';
import { useAuthContext } from '@contexts/index';
import { userService } from '@services/backend/service.container.instances';
import { useNotification } from '@contexts/notification.context';
const codeLength = 6;

//login page or not gibi düşün.
export const useAuth = (login: boolean = true) => {
   const { login: authLogin, rememberUser, getUserMail } = useAuthContext();
   const { showNotification } = useNotification();
   const [submitError, setSubmitError] = useState('');
   const [loading, setLoading] = useState(false);
   const [emailOrIdentity, setEmailOrIdentity] = useState('');

   useEffect(() => {
      if (login) {
         // login page ise kullaniciyi getir
         setLoading(true);
         getUserMail().then(userMail => {
            setEmailOrIdentity(userMail || '');
            setLoading(false);
         });
      }
   }, [login]);

   const submitLogin = async (values: {
      emailOrIdentity: string;
      password: string;
      rememberMe: boolean;
   }) => {
      setSubmitError('');
      try {
         const token = await userService.login({
            emailOrIdentity: values.emailOrIdentity,
            password: values.password,
         });
         console.log('login view hook token :', token);
         if (values.rememberMe === true) {
            rememberUser(values.emailOrIdentity);
         }
         authLogin(token);

         return { ok: true };
      } catch (error: any) {
         setSubmitError(error.message);
         return { ok: false, status: error.response?.status };
      }
   };

   const submitRegister = async (values: RegisterViewModel) => {
      try {
         const message = await userService.register(values);

         return true;
      } catch (error: any) {
         setSubmitError(error.message);
         return false;
      }
   };

   const submitEmailVerification = async (emailOrIdentity: string, verificationCode: string) => {
      if (verificationCode.length !== codeLength) {
         showNotification({
            message: 'Lütfen 6 haneli kodu eksiksiz giriniz.',
            type: 'error',
            modalType: 'snackbar',
         });
         return false;
      }
      try {
         const response = await userService.verifyEmail(emailOrIdentity, verificationCode);
         return true;
      } catch (error: any) {
         setSubmitError('Doğrulama başarısız oldu. Lütfen tekrar deneyiniz.');
         return false;
      }
   };

   return {
      emailOrIdentity,
      submitLogin,
      submitRegister,
      submitEmailVerification,
      submitError,
      loading,
      setLoading,
   };
};
