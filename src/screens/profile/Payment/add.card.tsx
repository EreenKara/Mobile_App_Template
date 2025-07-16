import React, { useState, useCallback } from 'react';
import {
   View,
   ScrollView,
   Text,
   TouchableOpacity,
   Image,
   Alert,
   KeyboardAvoidingView,
   Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, FormikProps } from 'formik';
import { cardValidationSchema } from '@utility/validations';
import {
   CreditCard,
   User,
   Calendar,
   Shield,
   CheckCircle,
   AlertCircle,
   ArrowLeft,
   Scan,
} from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';

// Components & Hooks
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useAsync } from '@hooks/modular/useAsync';

// Types
type Props = NativeStackScreenProps<ProfileStackParamList, 'AddCard'>;

interface CardFormData {
   cardHolder: string;
   cardNumber: string;
   expiryDate: string;
   cvc: string;
   saveCard: boolean;
}

// Kart tipini belirle
const getCardType = (cardNumber: string): string => {
   const number = cardNumber.replace(/\s/g, '');
   if (number.startsWith('4')) return 'visa';
   if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
   if (number.startsWith('3')) return 'amex';
   return 'unknown';
};

// Kart numarası formatla
const formatCardNumber = (text: string): string => {
   const numbers = text.replace(/\D/g, '');
   const formatted = numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
   return formatted.slice(0, 19); // 16 digit + 3 spaces
};

// Son kullanma tarihi formatla
const formatExpiryDate = (text: string): string => {
   const numbers = text.replace(/\D/g, '');
   if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
   }
   return numbers;
};

// ==================== MAIN COMPONENT ====================

const AddCardScreen: React.FC<Props> = ({ navigation }) => {
   const dispatch = useDispatch();

   // Redux state
   const { user } = useSelector((state: RootState) => state.auth);

   // Local state
   const [cardType, setCardType] = useState<string>('unknown');

   // Card addition
   const {
      execute: addCard,
      loading: addingCard,
      error: addCardError,
   } = useAsync(
      async (cardData: CardFormData) => {
         // TODO: Implement actual API call
         return new Promise((resolve, reject) => {
            setTimeout(() => {
               if (Math.random() > 0.1) {
                  // 90% success rate
                  resolve(cardData);
               } else {
                  reject(new Error('Kart eklenirken bir hata oluştu'));
               }
            }, 2000);
         });
      },
      {
         onSuccess: result => {
            Alert.alert('Başarılı', 'Kart başarıyla eklendi!', [
               {
                  text: 'Tamam',
                  onPress: () => navigation.goBack(),
               },
            ]);
         },
         onError: error => {
            Alert.alert('Hata', error.message || 'Kart eklenirken bir hata oluştu.');
         },
         showNotificationOnError: true,
      },
   );

   // ==================== HANDLERS ====================

   const handleSubmit = useCallback(
      async (values: CardFormData) => {
         await addCard(values);
      },
      [addCard],
   );

   const handleCardNumberChange = useCallback((text: string, setFieldValue: any) => {
      const formatted = formatCardNumber(text);
      setFieldValue('cardNumber', formatted);
      setCardType(getCardType(formatted));
   }, []);

   const handleExpiryDateChange = useCallback((text: string, setFieldValue: any) => {
      const formatted = formatExpiryDate(text);
      setFieldValue('expiryDate', formatted);
   }, []);

   const handleScanCard = useCallback(() => {
      // TODO: Implement card scanning
      Alert.alert('Bilgi', 'Kart tarama özelliği yakında eklenecek.');
   }, []);

   // ==================== RENDER FUNCTIONS ====================

   const renderHeader = () => (
      <View className="flex-row items-center p-4 bg-appCardBackground border-b border-appBorderColor">
         <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center mr-4"
            activeOpacity={0.7}>
            <ArrowLeft size={24} color="rgb(var(--color-app-text))" />
         </TouchableOpacity>

         <View className="flex-1">
            <Text className="text-appText font-bold text-xl">Yeni Kart Ekle</Text>
            <Text className="text-appText/60 text-sm">Ödeme kartı bilgilerini girin</Text>
         </View>

         <TouchableOpacity
            onPress={handleScanCard}
            className="w-10 h-10 bg-appButton/10 rounded-full items-center justify-center"
            activeOpacity={0.7}>
            <Scan size={20} color="rgb(var(--color-app-button))" />
         </TouchableOpacity>
      </View>
   );

   const renderCardPreview = (values: CardFormData) => (
      <View className="p-6 bg-appCardBackground">
         <Text className="text-appText font-bold text-lg mb-4">Kart Önizleme</Text>

         <View className="bg-gradient-to-r from-appButton to-appButton/80 rounded-2xl p-6 mb-4">
            {/* Card Type */}
            <View className="flex-row justify-between items-center mb-4">
               <Text className="text-appButtonText text-sm font-medium">
                  {cardType === 'visa'
                     ? 'VISA'
                     : cardType === 'mastercard'
                       ? 'MASTERCARD'
                       : cardType === 'amex'
                         ? 'AMERICAN EXPRESS'
                         : 'KART'}
               </Text>
               <View className="flex-row items-center">
                  <Shield size={16} color="rgb(var(--color-app-button-text))" />
                  <Text className="text-appButtonText text-xs ml-1">Güvenli</Text>
               </View>
            </View>

            {/* Card Number */}
            <Text className="text-appButtonText text-xl font-mono mb-4 tracking-wider">
               {values.cardNumber || '•••• •••• •••• ••••'}
            </Text>

            {/* Card Details */}
            <View className="flex-row justify-between items-end">
               <View>
                  <Text className="text-appButtonText/60 text-xs">KART SAHİBİ</Text>
                  <Text className="text-appButtonText text-sm font-medium">
                     {values.cardHolder || 'AD SOYAD'}
                  </Text>
               </View>
               <View>
                  <Text className="text-appButtonText/60 text-xs">SON KULLANMA</Text>
                  <Text className="text-appButtonText text-sm font-medium">
                     {values.expiryDate || 'MM/YY'}
                  </Text>
               </View>
            </View>
         </View>
      </View>
   );

   const renderForm = (formik: FormikProps<CardFormData>) => (
      <View className="p-4">
         <Text className="text-appText font-bold text-lg mb-4">Kart Bilgileri</Text>

         {/* Card Holder Name */}
         <View className="mb-4">
            <TextInputComponent
               label="Kart Sahibinin Adı"
               value={formik.values.cardHolder}
               onChangeText={formik.handleChange('cardHolder')}
               onBlur={formik.handleBlur('cardHolder')}
               error={formik.touched.cardHolder ? formik.errors.cardHolder : undefined}
               placeholder="Ad Soyad"
               leftIcon={<User size={20} color="rgb(var(--color-app-icon))" />}
               className="mb-2"
               autoCapitalize="words"
            />
         </View>

         {/* Card Number */}
         <View className="mb-4">
            <TextInputComponent
               label="Kart Numarası"
               value={formik.values.cardNumber}
               onChangeText={text => handleCardNumberChange(text, formik.setFieldValue)}
               onBlur={formik.handleBlur('cardNumber')}
               error={formik.touched.cardNumber ? formik.errors.cardNumber : undefined}
               placeholder="1234 5678 9012 3456"
               leftIcon={<CreditCard size={20} color="rgb(var(--color-app-icon))" />}
               rightIcon={
                  cardType !== 'unknown' && (
                     <CheckCircle size={20} color="rgb(var(--color-app-success))" />
                  )
               }
               keyboardType="numeric"
               maxLength={19}
               className="mb-2"
            />
         </View>

         {/* Expiry Date and CVC */}
         <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
               <TextInputComponent
                  label="Son Kullanma Tarihi"
                  value={formik.values.expiryDate}
                  onChangeText={text => handleExpiryDateChange(text, formik.setFieldValue)}
                  onBlur={formik.handleBlur('expiryDate')}
                  error={formik.touched.expiryDate ? formik.errors.expiryDate : undefined}
                  placeholder="MM/YY"
                  leftIcon={<Calendar size={20} color="rgb(var(--color-app-icon))" />}
                  keyboardType="numeric"
                  maxLength={5}
                  className="mb-2"
               />
            </View>

            <View className="flex-1">
               <TextInputComponent
                  label="CVC"
                  value={formik.values.cvc}
                  onChangeText={formik.handleChange('cvc')}
                  onBlur={formik.handleBlur('cvc')}
                  error={formik.touched.cvc ? formik.errors.cvc : undefined}
                  placeholder="123"
                  leftIcon={<Shield size={20} color="rgb(var(--color-app-icon))" />}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  className="mb-2"
               />
            </View>
         </View>

         {/* Save Card Option */}
         <TouchableOpacity
            onPress={() => formik.setFieldValue('saveCard', !formik.values.saveCard)}
            className="flex-row items-center p-4 bg-appCardBackground rounded-lg mb-6"
            activeOpacity={0.7}>
            <View
               className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                  formik.values.saveCard ? 'bg-appButton border-appButton' : 'border-appBorderColor'
               }`}>
               {formik.values.saveCard && (
                  <CheckCircle size={16} color="rgb(var(--color-app-button-text))" />
               )}
            </View>
            <View className="flex-1">
               <Text className="text-appText font-medium">Kartı Kaydet</Text>
               <Text className="text-appText/60 text-sm">
                  Gelecekteki ödemeler için kartı kaydet
               </Text>
            </View>
         </TouchableOpacity>

         {/* Security Notice */}
         <View className="flex-row items-center p-4 bg-appSuccess/10 rounded-lg mb-6">
            <Shield size={20} color="rgb(var(--color-app-success))" />
            <Text className="text-appSuccess text-sm ml-2 flex-1">
               Kart bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.
            </Text>
         </View>
      </View>
   );

   // ==================== MAIN RENDER ====================

   return (
      <KeyboardAvoidingView
         className="flex-1 bg-appBackground"
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
         {/* Header */}
         {renderHeader()}

         <Formik
            initialValues={{
               cardHolder: '',
               cardNumber: '',
               expiryDate: '',
               cvc: '',
               saveCard: true,
            }}
            validationSchema={cardValidationSchema}
            onSubmit={handleSubmit}>
            {formik => (
               <ScrollView
                  className="flex-1"
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled">
                  {/* Card Preview */}
                  {renderCardPreview(formik.values)}

                  {/* Form */}
                  {renderForm(formik)}

                  {/* Submit Button */}
                  <View className="p-4 pb-8">
                     <ButtonComponent
                        title="Kartı Ekle"
                        onPress={formik.handleSubmit}
                        variant="primary"
                        size="large"
                        fullWidth
                        loading={addingCard}
                        disabled={!formik.isValid || addingCard}
                     />
                  </View>
               </ScrollView>
            )}
         </Formik>
      </KeyboardAvoidingView>
   );
};

export default AddCardScreen;
