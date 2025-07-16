import React, { useState, useEffect, useCallback } from 'react';
import {
   View,
   ScrollView,
   Text,
   TouchableOpacity,
   Image,
   Alert,
   RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import {
   CreditCard,
   Plus,
   Trash2,
   Edit3,
   Shield,
   CheckCircle,
   AlertCircle,
   Wallet,
} from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';

// Components & Hooks
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useAsync } from '@hooks/modular/useAsync';

// Types
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Payment'>;

interface PaymentCard {
   id: string;
   type: 'visa' | 'mastercard' | 'amex' | 'other';
   lastFour: string;
   expiryDate: string;
   holderName: string;
   isDefault: boolean;
   isActive: boolean;
}

// Mock data - gerçek projede API'dan gelecek
const MOCK_CARDS: PaymentCard[] = [
   {
      id: '1',
      type: 'visa',
      lastFour: '1829',
      expiryDate: '12/25',
      holderName: 'John Doe',
      isDefault: true,
      isActive: true,
   },
   {
      id: '2',
      type: 'mastercard',
      lastFour: '2319',
      expiryDate: '08/24',
      holderName: 'John Doe',
      isDefault: false,
      isActive: true,
   },
];

// ==================== MAIN COMPONENT ====================

const PaymentScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const dispatch = useDispatch();

   // Redux state
   const { user } = useSelector((state: RootState) => state.auth);

   // Local state
   const [selectedCard, setSelectedCard] = useState<string>('');
   const [paymentCards, setPaymentCards] = useState<PaymentCard[]>(MOCK_CARDS);

   // Payment cards fetching
   const {
      execute: fetchPaymentCards,
      loading: cardsLoading,
      error: cardsError,
   } = useAsync(
      async () => {
         // TODO: Implement actual API call
         return new Promise<PaymentCard[]>(resolve => {
            setTimeout(() => resolve(MOCK_CARDS), 1000);
         });
      },
      {
         onSuccess: cards => {
            setPaymentCards(cards);
            // Set default card as selected
            const defaultCard = cards.find(card => card.isDefault);
            if (defaultCard) {
               setSelectedCard(defaultCard.id);
            }
         },
         onError: error => {
            console.error('Payment cards fetch error:', error);
            Alert.alert('Hata', 'Ödeme kartları yüklenirken bir hata oluştu.');
         },
         showNotificationOnError: true,
      },
   );

   // ==================== EFFECTS ====================

   useEffect(() => {
      fetchPaymentCards();
   }, []);

   // ==================== HANDLERS ====================

   const handleRefresh = useCallback(() => {
      fetchPaymentCards();
   }, [fetchPaymentCards]);

   const handleCardSelect = useCallback((cardId: string) => {
      setSelectedCard(cardId);
   }, []);

   const handleAddCard = useCallback(() => {
      navigation.navigate('AddCard');
   }, [navigation]);

   const handleEditCard = useCallback((card: PaymentCard) => {
      // TODO: Navigate to edit card screen
      Alert.alert('Bilgi', 'Kart düzenleme özelliği yakında eklenecek.');
   }, []);

   const handleDeleteCard = useCallback(
      (card: PaymentCard) => {
         Alert.alert(
            'Kartı Sil',
            `${card.type.toUpperCase()} **** ${card.lastFour} kartını silmek istediğinizden emin misiniz?`,
            [
               { text: 'İptal', style: 'cancel' },
               {
                  text: 'Sil',
                  style: 'destructive',
                  onPress: () => {
                     setPaymentCards(prev => prev.filter(c => c.id !== card.id));
                     if (selectedCard === card.id) {
                        setSelectedCard('');
                     }
                  },
               },
            ],
         );
      },
      [selectedCard],
   );

   const handleSetDefault = useCallback((cardId: string) => {
      setPaymentCards(prev =>
         prev.map(card => ({
            ...card,
            isDefault: card.id === cardId,
         })),
      );
      setSelectedCard(cardId);
   }, []);

   const handleContinue = useCallback(() => {
      if (!selectedCard) {
         Alert.alert('Uyarı', 'Lütfen bir ödeme kartı seçin.');
         return;
      }

      const selected = paymentCards.find(card => card.id === selectedCard);
      if (selected) {
         Alert.alert(
            'Seçilen Kart',
            `${selected.type.toUpperCase()} **** ${selected.lastFour} kartı seçildi.`,
         );
      }
   }, [selectedCard, paymentCards]);

   // ==================== RENDER FUNCTIONS ====================

   const getCardIcon = (type: string) => {
      switch (type.toLowerCase()) {
         case 'visa':
            return '💳';
         case 'mastercard':
            return '🔴';
         case 'amex':
            return '🟦';
         default:
            return '💳';
      }
   };

   const renderEmptyState = () => (
      <View className="flex-1 items-center justify-center p-8">
         <View className="w-24 h-24 bg-appButton/10 rounded-full items-center justify-center mb-6">
            <Wallet size={48} color="rgb(var(--color-app-button))" />
         </View>
         <Text className="text-appText font-bold text-xl mb-2">Kayıtlı Kart Yok</Text>
         <Text className="text-appText/60 text-center mb-6">
            Henüz kayıtlı ödeme kartınız bulunmuyor. İlk kartınızı eklemek için aşağıdaki butonu
            kullanın.
         </Text>
         <TouchableOpacity
            onPress={handleAddCard}
            className="bg-appButton px-6 py-3 rounded-lg flex-row items-center"
            activeOpacity={0.7}>
            <Plus size={20} color="rgb(var(--color-app-button-text))" />
            <Text className="text-appButtonText font-medium ml-2">İlk Kartı Ekle</Text>
         </TouchableOpacity>
      </View>
   );

   const renderPaymentCard = (card: PaymentCard) => {
      const isSelected = selectedCard === card.id;

      return (
         <TouchableOpacity
            key={card.id}
            onPress={() => handleCardSelect(card.id)}
            className={`
               bg-appCardBackground p-4 mb-4 rounded-xl border-2 
               ${isSelected ? 'border-appButton' : 'border-appBorderColor'}
               ${!card.isActive ? 'opacity-50' : ''}
            `}
            activeOpacity={0.7}>
            {/* Card Header */}
            <View className="flex-row items-center justify-between mb-3">
               <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">{getCardIcon(card.type)}</Text>
                  <View>
                     <Text className="text-appText font-bold text-lg">
                        {card.type.toUpperCase()} **** {card.lastFour}
                     </Text>
                     <Text className="text-appText/60 text-sm">
                        {card.holderName} • {card.expiryDate}
                     </Text>
                  </View>
               </View>

               {/* Selection Indicator */}
               <View className="flex-row items-center">
                  {card.isDefault && (
                     <View className="bg-appSuccess/10 px-2 py-1 rounded mr-2">
                        <Text className="text-appSuccess text-xs font-medium">Varsayılan</Text>
                     </View>
                  )}
                  <View
                     className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        isSelected ? 'border-appButton bg-appButton' : 'border-appBorderColor'
                     }`}>
                     {isSelected && (
                        <CheckCircle size={16} color="rgb(var(--color-app-button-text))" />
                     )}
                  </View>
               </View>
            </View>

            {/* Card Actions */}
            <View className="flex-row items-center justify-between pt-3 border-t border-appBorderColor/30">
               <View className="flex-row items-center">
                  <Shield size={16} color="rgb(var(--color-app-success))" />
                  <Text className="text-appSuccess text-sm ml-1">Güvenli</Text>
               </View>

               <View className="flex-row items-center space-x-4">
                  {!card.isDefault && (
                     <TouchableOpacity
                        onPress={() => handleSetDefault(card.id)}
                        className="flex-row items-center"
                        activeOpacity={0.7}>
                        <Text className="text-appButton text-sm">Varsayılan Yap</Text>
                     </TouchableOpacity>
                  )}

                  <TouchableOpacity onPress={() => handleEditCard(card)} activeOpacity={0.7}>
                     <Edit3 size={16} color="rgb(var(--color-app-icon))" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleDeleteCard(card)} activeOpacity={0.7}>
                     <Trash2 size={16} color="rgb(var(--color-app-error))" />
                  </TouchableOpacity>
               </View>
            </View>
         </TouchableOpacity>
      );
   };

   const renderHeader = () => (
      <View className="p-6 bg-appCardBackground border-b border-appBorderColor">
         <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-appButton/10 rounded-full items-center justify-center mr-4">
               <CreditCard size={24} color="rgb(var(--color-app-button))" />
            </View>
            <View>
               <Text className="text-appText font-bold text-xl">Ödeme Yöntemleri</Text>
               <Text className="text-appText/60 text-sm">Kayıtlı kartlarınızı yönetin</Text>
            </View>
         </View>

         {/* Stats */}
         <View className="flex-row justify-between bg-appTransition rounded-lg p-4">
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">{paymentCards.length}</Text>
               <Text className="text-appText/60 text-xs">Toplam Kart</Text>
            </View>
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">
                  {paymentCards.filter(c => c.isActive).length}
               </Text>
               <Text className="text-appText/60 text-xs">Aktif</Text>
            </View>
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">1</Text>
               <Text className="text-appText/60 text-xs">Varsayılan</Text>
            </View>
         </View>
      </View>
   );

   // ==================== LOADING STATE ====================

   if (cardsLoading) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center">
            <LoadingComponent variant="pulse" message="Ödeme kartları yükleniyor..." size="lg" />
         </View>
      );
   }

   // ==================== ERROR STATE ====================

   if (cardsError && paymentCards.length === 0) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center p-6">
            <AlertCircle size={48} color="rgb(var(--color-app-error))" />
            <Text className="text-appError text-center text-lg mb-4 mt-4">
               Ödeme kartları yüklenirken bir hata oluştu.
            </Text>
            <TouchableOpacity
               onPress={handleRefresh}
               className="bg-appButton px-6 py-3 rounded-lg"
               activeOpacity={0.7}>
               <Text className="text-appButtonText font-medium">Tekrar Dene</Text>
            </TouchableOpacity>
         </View>
      );
   }

   // ==================== MAIN RENDER ====================

   return (
      <View className="flex-1 bg-appBackground">
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            refreshControl={
               <RefreshControl
                  refreshing={cardsLoading}
                  onRefresh={handleRefresh}
                  tintColor="rgb(var(--color-app-button))"
               />
            }>
            {/* Header */}
            {renderHeader()}

            {/* Content */}
            <View className="p-4">
               {paymentCards.length === 0 ? (
                  renderEmptyState()
               ) : (
                  <>
                     {/* Cards List */}
                     <View className="mb-6">
                        <Text className="text-appText font-bold text-lg mb-4">
                           Kayıtlı Kartlar ({paymentCards.length})
                        </Text>
                        {paymentCards.map(renderPaymentCard)}
                     </View>

                     {/* Add New Card Button */}
                     <TouchableOpacity
                        onPress={handleAddCard}
                        className="bg-appButton/10 border-2 border-dashed border-appButton p-4 rounded-xl items-center justify-center mb-6"
                        activeOpacity={0.7}>
                        <Plus size={32} color="rgb(var(--color-app-button))" />
                        <Text className="text-appButton font-medium text-lg mt-2">
                           Yeni Kart Ekle
                        </Text>
                     </TouchableOpacity>
                  </>
               )}
            </View>
         </ScrollView>

         {/* Bottom Action Button */}
         {paymentCards.length > 0 && (
            <View className="p-4 bg-appCardBackground border-t border-appBorderColor">
               <ButtonComponent
                  title="Seçili Kartla Devam Et"
                  onPress={handleContinue}
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={!selectedCard}
               />
            </View>
         )}
      </View>
   );
};

export default PaymentScreen;
