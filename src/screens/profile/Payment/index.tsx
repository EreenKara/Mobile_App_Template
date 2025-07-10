import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@navigation/types';
import ButtonComponent from '@components/Button/Button';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import CommonStyles from '@styles/common/commonStyles';
import {RadioButton} from 'react-native-paper';
import {useStyles} from '@hooks/Modular/use.styles';
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Payment'>;

const PaymentScreen: React.FC<ScreenProps> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const [selectedCard, setSelectedCard] = React.useState('AddCard');
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => setSelectedCard('visa')}
        style={styles.cardContainer}>
        <RadioButton
          value="visa"
          status={selectedCard === 'visa' ? 'checked' : 'unchecked'}
        />
        <Image
          source={require('@assets/images/payment.png')}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>VISA **** 1829</Text>
      </Pressable>
      <Pressable
        onPress={() => setSelectedCard('mastercard')}
        style={styles.cardContainer}>
        <RadioButton
          value="mastercard"
          status={selectedCard === 'mastercard' ? 'checked' : 'unchecked'}
        />
        <Image
          source={require('@assets/images/payment.png')}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>MasterCard **** 2319</Text>
      </Pressable>
      <Pressable
        onPress={() => setSelectedCard('AddCard')}
        style={styles.cardContainer}>
        <RadioButton
          value="AddCard"
          status={selectedCard === 'AddCard' ? 'checked' : 'unchecked'}
        />
        <Image
          source={require('@assets/images/payment.png')}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>Add Card</Text>
      </Pressable>
      <ButtonComponent
        title="Devam Et"
        onPress={() => navigation.navigate('AddCard')}
        textStyle={styles.continueButtonText}
        style={styles.continueButton}
      />
    </SafeAreaView>
  );
};

export default PaymentScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: styleNumbers.space * 2,
      paddingHorizontal: styleNumbers.space * 4,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: styleNumbers.space * 3,
      width: '100%',
      borderWidth: 2,
      borderRadius: styleNumbers.borderRadius,
      padding: styleNumbers.space,
      borderColor: colors.cardBackground,
      backgroundColor: colors.background,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 10,
      color: colors.text,
    },
    continueButton: {
      borderWidth: 2,
      width: '100%',
      borderColor: colors.cardBackground,
      backgroundColor: colors.background,
      borderRadius: styleNumbers.borderRadius,
      marginTop: styleNumbers.space * 2,
      paddingVertical: styleNumbers.space * 2,
    },
    continueButtonText: {
      ...CommonStyles.textStyles.subtitle,
      color: colors.text,
    },
    cardImage: {
      width: 30,
      height: 30,
      marginRight: styleNumbers.space,
    },
  });
