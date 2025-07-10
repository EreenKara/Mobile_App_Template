import React, {useState, useRef} from 'react';
import {StyleSheet, Text, View, TextInput, SafeAreaView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@navigation/types';
import createStyles from './index.style';
import CommonStyles from '@styles/common/commonStyles';
import ButtonComponent from '@components/Button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useAuth} from '@hooks/use.auth';
import {useThemeColors} from '@contexts/index';

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailConfirm'>;

const EmailConfirmScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors} = useThemeColors();
  const styles = createStyles(colors);

  const {emailOrIdentity} = route.params;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const codeLength = 6;
  const {submitError, submitEmailVerification} = useAuth();
  const inputs = useRef<Array<TextInput | null>>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

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
      console.log('calisti');
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
      // Yapıştırılan metnin her karakterini ayrı input'a yerleştir
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
  const handleSubmit = async () => {
    const verificationCode = code.join('');
    const result = await submitEmailVerification(
      emailOrIdentity,
      verificationCode,
    );
    if (result) {
      navigation.navigate('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.keyboardView}
        contentContainerStyle={[{flex: 1}]}>
        <View style={styles.content}>
          {submitError && <Text style={styles.errorText}>{submitError}</Text>}

          <Text style={[CommonStyles.textStyles.title, styles.title]}>
            Doğrulama
          </Text>
          <Text style={[CommonStyles.textStyles.paragraph, styles.description]}>
            {emailOrIdentity} adresine gönderilen{'\n'}
            {codeLength} haneli kodu giriniz
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputs.current[index] = ref)}
                style={styles.codeInput}
                value={digit}
                onChangeText={text => handleCodeChange(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <ButtonComponent
            title="Doğrula"
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EmailConfirmScreen;
