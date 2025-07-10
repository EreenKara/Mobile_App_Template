import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import {Text} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@navigation/types';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import TextInputComponent from '@components/TextInput/text.input';
import ButtonComponent from '@components/Button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useStyles} from '@hooks/Modular/use.styles';
type Props = NativeStackScreenProps<ProfileStackParamList, 'AddCard'>;

const AddCardScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [cvc, setCvc] = useState('');

  const formatCardNumber = (text: string) => {
    // Sadece sayıları al ve boşlukları kaldır
    const numbers = text.replace(/\D/g, '');
    // Her 4 karakterde bir boşluk ekle
    const formatted = numbers.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // 16 rakam + 3 boşluk = 19 karakter
  };

  const formatExpireDate = (text: string) => {
    // Sadece sayıları al
    const numbers = text.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 6);
    }
    return numbers;
  };

  const handleSubmit = () => {
    // Kart ekleme işlemi
    console.log({cardHolder, cardNumber, expireDate, cvc});
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        {false && (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
            <Text style={[CommonStyles.textStyles.title, styles.title]}>
              Kart Ekle
            </Text>
          </View>
        )}
        <View style={styles.creditCard}>
          <Image
            source={require('@assets/images/credit-card.png')}
            style={styles.creditCardImage}
          />
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInputComponent
              label="KART SAHİBİNİN ADI"
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="İsim Soyisim"
              viewStyle={styles.inputView}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInputComponent
              label="KART NUMARASI"
              value={cardNumber}
              onChangeText={text => setCardNumber(formatCardNumber(text))}
              placeholder="2134 ____ ____ ____"
              keyboardType="numeric"
              maxLength={19}
              viewStyle={styles.inputView}
              style={styles.input}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, {flex: 1, marginRight: 10}]}>
              <TextInputComponent
                label="SON KULLANMA TARİHİ"
                value={expireDate}
                onChangeText={text => setExpireDate(formatExpireDate(text))}
                placeholder="AA/YY"
                keyboardType="numeric"
                maxLength={5}
                viewStyle={styles.inputView}
                style={styles.input}
              />
            </View>

            <View style={[styles.inputContainer, {flex: 1, marginLeft: 10}]}>
              <TextInputComponent
                label="CVC"
                value={cvc}
                onChangeText={setCvc}
                placeholder="***"
                keyboardType="numeric"
                maxLength={3}
                viewStyle={styles.inputView}
                style={styles.input}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <ButtonComponent
          title="Kart Ekle"
          onPress={() => navigation.navigate('AddCard')}
          textStyle={styles.continueButtonText}
          style={styles.continueButton}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      padding: styleNumbers.space * 2,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: styleNumbers.space * 3,
      backgroundColor: colors.transition,
    },
    creditCard: {
      width: '100%',
      height: 300,
      alignItems: 'center',
      justifyContent: 'center',
    },
    creditCardImage: {
      width: '100%',
      resizeMode: 'contain',
      height: '100%',
    },
    closeButton: {
      fontSize: styleNumbers.textSize * 2,
      marginRight: styleNumbers.space * 2,
      color: colors.text,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      marginRight: styleNumbers.space * 4,
    },
    form: {
      flex: 1,
      alignContent: 'center',
      justifyContent: 'center',
      marginTop: styleNumbers.space * 2,
      marginBottom: styleNumbers.space * 2,
    },
    inputContainer: {
      padding: styleNumbers.space * 2,
      width: '100%',
      marginBottom: styleNumbers.space * 2,
    },
    label: {
      ...CommonStyles.textStyles.paragraph,
      marginBottom: styleNumbers.space,
      color: colors.text,
    },
    inputView: {
      borderWidth: 0,
      borderRadius: styleNumbers.borderRadius * 0.2,
    },
    input: {
      fontSize: styleNumbers.textSize * 1.3,
      borderRadius: styleNumbers.borderRadius * 0.2,
      backgroundColor: colors.creditCard,
      height: 70,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      marginTop: 'auto',
      marginBottom: styleNumbers.space * 2,
    },
    continueButton: {
      borderWidth: 2,
      borderColor: colors.borderColor,
      backgroundColor: colors.button,
      borderRadius: styleNumbers.borderRadius,
      paddingVertical: styleNumbers.space * 2,
      marginBottom: styleNumbers.space * 2,
      width: '60%',
      alignSelf: 'center',
    },
    continueButtonText: {
      ...CommonStyles.textStyles.subtitle,
      color: colors.cardText,
    },
  });

export default AddCardScreen;
