import React, { useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
   MapPin,
   Home,
   Building,
   Plus,
   Edit3,
   Trash2,
   Star,
   Navigation,
   AlertCircle,
} from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList } from '@navigation/NavigationTypes';

// Components & Hooks
import LoadingComponent from '@mycomponents/Loading/laoading';
import ButtonComponent from '@mycomponents/Button/Button';
import { useUserAddress, UserAddress } from '@hooks/profile/useUserAddress';

// Types
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'AddressInformation'>;

// ==================== MAIN COMPONENT ====================

const AddressInformationScreen: React.FC<ScreenProps> = ({ navigation }) => {
   // Address hook
   const {
      addresses,
      defaultAddress,
      loading,
      error,
      deleteLoading,
      setDefaultLoading,
      fetchAddresses,
      deleteAddress,
      setDefaultAddress,
      formatAddress,
      hasAddresses,
      homeAddresses,
      workAddresses,
      otherAddresses,
   } = useUserAddress();

   // ==================== HANDLERS ====================

   const handleRefresh = useCallback(() => {
      fetchAddresses();
   }, [fetchAddresses]);

   const handleAddAddress = useCallback(() => {
      (navigation as any).navigate('AddressChange', {
         mode: 'create',
      });
   }, [navigation]);

   const handleEditAddress = useCallback(
      (address: UserAddress) => {
         (navigation as any).navigate('AddressChange', {
            mode: 'edit',
            address: address,
         });
      },
      [navigation],
   );

   const handleDeleteAddress = useCallback(
      (address: UserAddress) => {
         Alert.alert(
            'Adresi Sil',
            `"${address.title}" adresini silmek istediğinizden emin misiniz?`,
            [
               { text: 'İptal', style: 'cancel' },
               {
                  text: 'Sil',
                  style: 'destructive',
                  onPress: () => {
                     if (address.id) {
                        deleteAddress(address.id);
                     }
                  },
               },
            ],
         );
      },
      [deleteAddress],
   );

   const handleSetDefault = useCallback(
      (address: UserAddress) => {
         if (address.id) {
            setDefaultAddress(address.id);
         }
      },
      [setDefaultAddress],
   );

   // ==================== RENDER FUNCTIONS ====================

   const getAddressIcon = (type: string) => {
      switch (type) {
         case 'home':
            return <Home size={24} color="rgb(var(--color-app-button))" />;
         case 'work':
            return <Building size={24} color="rgb(var(--color-app-button))" />;
         default:
            return <MapPin size={24} color="rgb(var(--color-app-button))" />;
      }
   };

   const getAddressTypeLabel = (type: string) => {
      switch (type) {
         case 'home':
            return 'Ev';
         case 'work':
            return 'İş';
         default:
            return 'Diğer';
      }
   };

   const renderAddressCard = (address: UserAddress) => (
      <View
         key={address.id}
         className="bg-appCardBackground p-4 mb-4 rounded-xl border border-appBorderColor">
         {/* Header */}
         <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
               <View className="w-10 h-10 bg-appButton/10 rounded-full items-center justify-center mr-3">
                  {getAddressIcon(address.type)}
               </View>
               <View>
                  <Text className="text-appText font-bold text-lg">{address.title}</Text>
                  <Text className="text-appText/60 text-sm">
                     {getAddressTypeLabel(address.type)}
                  </Text>
               </View>
            </View>

            {/* Default Badge */}
            {address.isDefault && (
               <View className="bg-appSuccess/10 px-3 py-1 rounded-full flex-row items-center">
                  <Star size={14} color="rgb(var(--color-app-success))" />
                  <Text className="text-appSuccess text-xs font-medium ml-1">Varsayılan</Text>
               </View>
            )}
         </View>

         {/* Address Details */}
         <View className="mb-4">
            <Text className="text-appText text-base mb-2">{formatAddress(address)}</Text>

            {/* City & District */}
            <View className="flex-row items-center">
               <Navigation size={16} color="rgb(var(--color-app-icon))" />
               <Text className="text-appText/60 text-sm ml-1">
                  {address.districtName}, {address.cityName}
               </Text>
            </View>
         </View>

         {/* Actions */}
         <View className="flex-row items-center justify-between pt-3 border-t border-appBorderColor/30">
            <View className="flex-row items-center space-x-4">
               {!address.isDefault && (
                  <TouchableOpacity
                     onPress={() => handleSetDefault(address)}
                     className="flex-row items-center"
                     activeOpacity={0.7}
                     disabled={setDefaultLoading}>
                     <Star size={16} color="rgb(var(--color-app-button))" />
                     <Text className="text-appButton text-sm ml-1">Varsayılan Yap</Text>
                  </TouchableOpacity>
               )}
            </View>

            <View className="flex-row items-center space-x-4">
               <TouchableOpacity onPress={() => handleEditAddress(address)} activeOpacity={0.7}>
                  <Edit3 size={18} color="rgb(var(--color-app-icon))" />
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={() => handleDeleteAddress(address)}
                  activeOpacity={0.7}
                  disabled={deleteLoading}>
                  <Trash2 size={18} color="rgb(var(--color-app-error))" />
               </TouchableOpacity>
            </View>
         </View>
      </View>
   );

   const renderHeader = () => (
      <View className="p-6 bg-appCardBackground border-b border-appBorderColor">
         <View className="flex-row items-center mb-4">
            <View className="w-12 h-12 bg-appButton/10 rounded-full items-center justify-center mr-4">
               <MapPin size={24} color="rgb(var(--color-app-button))" />
            </View>
            <View>
               <Text className="text-appText font-bold text-xl">Adres Bilgileri</Text>
               <Text className="text-appText/60 text-sm">Kayıtlı adreslerinizi yönetin</Text>
            </View>
         </View>

         {/* Stats */}
         <View className="flex-row justify-between bg-appTransition rounded-lg p-4">
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">{addresses.length}</Text>
               <Text className="text-appText/60 text-xs">Toplam</Text>
            </View>
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">{homeAddresses.length}</Text>
               <Text className="text-appText/60 text-xs">Ev</Text>
            </View>
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">{workAddresses.length}</Text>
               <Text className="text-appText/60 text-xs">İş</Text>
            </View>
            <View className="items-center">
               <Text className="text-appText font-bold text-lg">{otherAddresses.length}</Text>
               <Text className="text-appText/60 text-xs">Diğer</Text>
            </View>
         </View>
      </View>
   );

   const renderEmptyState = () => (
      <View className="flex-1 items-center justify-center p-8">
         <View className="w-24 h-24 bg-appButton/10 rounded-full items-center justify-center mb-6">
            <MapPin size={48} color="rgb(var(--color-app-button))" />
         </View>
         <Text className="text-appText font-bold text-xl mb-2">Kayıtlı Adres Yok</Text>
         <Text className="text-appText/60 text-center mb-6">
            Henüz kayıtlı adresiniz bulunmuyor. İlk adresinizi eklemek için aşağıdaki butonu
            kullanın.
         </Text>
         <TouchableOpacity
            onPress={handleAddAddress}
            className="bg-appButton px-6 py-3 rounded-lg flex-row items-center"
            activeOpacity={0.7}>
            <Plus size={20} color="rgb(var(--color-app-button-text))" />
            <Text className="text-appButtonText font-medium ml-2">İlk Adresi Ekle</Text>
         </TouchableOpacity>
      </View>
   );

   const renderAddressSection = (title: string, addressList: UserAddress[]) => {
      if (addressList.length === 0) return null;

      return (
         <View className="mb-6">
            <Text className="text-appText font-bold text-lg mb-4 px-4">{title}</Text>
            <View className="px-4">{addressList.map(renderAddressCard)}</View>
         </View>
      );
   };

   // ==================== LOADING STATE ====================

   if (loading) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center">
            <LoadingComponent variant="pulse" message="Adres bilgileri yükleniyor..." size="lg" />
         </View>
      );
   }

   // ==================== ERROR STATE ====================

   if (error && !hasAddresses) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center p-6">
            <AlertCircle size={48} color="rgb(var(--color-app-error))" />
            <Text className="text-appError text-center text-lg mb-4 mt-4">
               Adres bilgileri yüklenirken bir hata oluştu.
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
                  refreshing={loading}
                  onRefresh={handleRefresh}
                  tintColor="rgb(var(--color-app-button))"
               />
            }>
            {/* Header */}
            {renderHeader()}

            {/* Content */}
            {!hasAddresses ? (
               renderEmptyState()
            ) : (
               <View className="py-4">
                  {/* Default Address */}
                  {defaultAddress && (
                     <View className="mb-6">
                        <Text className="text-appText font-bold text-lg mb-4 px-4">
                           Varsayılan Adres
                        </Text>
                        <View className="px-4">{renderAddressCard(defaultAddress)}</View>
                     </View>
                  )}

                  {/* Address Sections */}
                  {renderAddressSection('Ev Adresleri', homeAddresses)}
                  {renderAddressSection('İş Adresleri', workAddresses)}
                  {renderAddressSection('Diğer Adresler', otherAddresses)}

                  {/* Add New Address Button */}
                  <View className="px-4 mb-6">
                     <TouchableOpacity
                        onPress={handleAddAddress}
                        className="bg-appButton/10 border-2 border-dashed border-appButton p-4 rounded-xl items-center justify-center"
                        activeOpacity={0.7}>
                        <Plus size={32} color="rgb(var(--color-app-button))" />
                        <Text className="text-appButton font-medium text-lg mt-2">
                           Yeni Adres Ekle
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            )}
         </ScrollView>

         {/* Bottom Action Button */}
         {hasAddresses && (
            <View className="p-4 bg-appCardBackground border-t border-appBorderColor">
               <ButtonComponent
                  title="Yeni Adres Ekle"
                  onPress={handleAddAddress}
                  variant="primary"
                  size="large"
                  fullWidth
                  leftIcon={<Plus size={20} color="rgb(var(--color-app-button-text))" />}
               />
            </View>
         )}
      </View>
   );
};

export default AddressInformationScreen;
