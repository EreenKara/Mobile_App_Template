import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import Colors, {ColorsSchema} from '@styles/common/colors';
import TextInputComponent from '@components/TextInput/text.input';
import {useStyles} from '@hooks/Modular/use.styles';
import {useNotification} from '@contexts/notification.context';
type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const [email, setEmail] = useState('');
  const {showNotification} = useNotification();
  const handleResetPassword = useCallback(async () => {
    if (!email) {
      showNotification({
        message: 'Email adresi gereklidir',
        type: 'error',
        modalType: 'snackbar',
      });
      return;
    }

    if (!email.includes('@')) {
      showNotification({
        message: 'Geçerli bir email adresi giriniz',
        type: 'error',
        modalType: 'snackbar',
      });
      return;
    }

    // İleride API entegrasyonu için yer tutucu
    showNotification({
      message: 'Şifre sıfırlama bağlantısı gönderildi',
      type: 'success',
      modalType: 'snackbar',
    });

    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Şifrenizi sıfırlamak için kayıtlı email adresinizi giriniz. Size şifre
        sıfırlama bağlantısı göndereceğiz.
      </Text>
      <View style={styles.viewTextInput}>
        <TextInputComponent
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>
      <Button
        labelStyle={[
          CommonStyles.textStyles.paragraph,
          {color: Colors.getTheme().button},
        ]}
        onPress={handleResetPassword}
        style={styles.button}>
        Şifre Sıfırlama Bağlantısı Gönder
      </Button>
      <Button
        labelStyle={[
          CommonStyles.textStyles.paragraph,
          {color: Colors.getTheme().button},
        ]}
        onPress={() => navigation.goBack()}
        style={styles.button}>
        Giriş Ekranına Dön
      </Button>
    </View>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      ...CommonStyles.viewStyles.container,
      padding: styleNumbers.space,
    },
    description: {
      ...CommonStyles.textStyles.paragraph,
      marginBottom: styleNumbers.space,
      color: colors.text,
    },
    input: {
      marginBottom: styleNumbers.spaceLittle,
    },
    button: {
      marginTop: styleNumbers.spaceLittle,
    },

    viewTextInput: {
      marginTop: styleNumbers.space * 3,
    },
  });

export default ForgotPasswordScreen;
