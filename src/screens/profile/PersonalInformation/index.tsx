import React, { useEffect, useCallback } from 'react';
import {
   View,
   ScrollView,
   Text,
   Image,
   TouchableOpacity,
   RefreshControl,
   Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, IdCard, Edit3, Camera, UserCheck } from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';

// Components & Hooks
import LoadingComponent from '@mycomponents/Loading/laoading';
import { useAsync } from '@hooks/modular/useAsync';
import userService from '@services/backend/userService';

// Types
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'PersonalInformation'>;

// ==================== MAIN COMPONENT ====================

const PersonalInformationScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const dispatch = useDispatch();

   // Redux state
   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

   // User data fetching
   const {
      execute: fetchUserData,
      loading: userLoading,
      error: userError,
   } = useAsync(userService.me, {
      onSuccess: userData => {
         console.log('User data refreshed:', userData);
      },
      onError: error => {
         console.error('User fetch error:', error);
         Alert.alert('Hata', 'Kullanıcı bilgileri yüklenirken bir hata oluştu.');
      },
      showNotificationOnError: true,
   });

   // ==================== EFFECTS ====================

   useEffect(() => {
      // Eğer user yoksa veya user verileri eksikse, tekrar çek
      if (isAuthenticated && !user) {
         fetchUserData();
      }
   }, [isAuthenticated, user, fetchUserData]);

   // ==================== HANDLERS ====================

   const handleRefresh = useCallback(() => {
      fetchUserData();
   }, [fetchUserData]);

   const handleEditProfile = useCallback(() => {
      // TODO: Edit profile navigation
      Alert.alert('Bilgi', 'Profil düzenleme özelliği yakında eklenecek.');
   }, []);

   const handleChangePhoto = useCallback(() => {
      // TODO: Photo change functionality
      Alert.alert('Bilgi', 'Fotoğraf değiştirme özelliği yakında eklenecek.');
   }, []);

   // ==================== RENDER FUNCTIONS ====================

   const renderProfileHeader = () => {
      const avatarUri =
         (user as any)?.image || (user as any)?.avatar || (user as any)?.profileImage;

      return (
         <View className="items-center py-8 bg-appCardBackground">
            {/* Profile Image */}
            <View className="relative mb-6">
               <View className="w-32 h-32 bg-appButton rounded-full items-center justify-center">
                  {avatarUri ? (
                     <Image
                        source={{ uri: avatarUri }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                     />
                  ) : (
                     <User size={64} color="rgb(var(--color-app-button-text))" />
                  )}
               </View>

               {/* Change Photo Button */}
               <TouchableOpacity
                  onPress={handleChangePhoto}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-appButton rounded-full items-center justify-center border-2 border-appCardBackground"
                  activeOpacity={0.7}>
                  <Camera size={20} color="rgb(var(--color-app-button-text))" />
               </TouchableOpacity>
            </View>

            {/* User Name */}
            <Text className="text-appText font-bold text-2xl mb-2">
               {user?.name && user?.surname
                  ? `${user.name} ${user.surname}`
                  : user?.name || 'Kullanıcı'}
            </Text>

            {/* User Email */}
            <Text className="text-appText/60 text-base mb-4">
               {user?.email || 'E-posta bilgisi yok'}
            </Text>

            {/* Edit Profile Button */}
            <TouchableOpacity
               onPress={handleEditProfile}
               className="flex-row items-center bg-appButton/10 px-6 py-3 rounded-lg"
               activeOpacity={0.7}>
               <Edit3 size={18} color="rgb(var(--color-app-button))" />
               <Text className="text-appButton font-medium ml-2">Profili Düzenle</Text>
            </TouchableOpacity>
         </View>
      );
   };

   const renderInfoItem = (
      icon: React.ReactNode,
      title: string,
      value: string | undefined,
      placeholder: string = 'Bilgi girilmemiş',
   ) => (
      <View className="flex-row items-center bg-appCardBackground p-4 mb-3 rounded-lg border border-appBorderColor">
         {/* Icon */}
         <View className="w-12 h-12 bg-appButton/10 rounded-full items-center justify-center mr-4">
            {icon}
         </View>

         {/* Content */}
         <View className="flex-1">
            <Text className="text-appText/60 text-sm font-medium mb-1">{title}</Text>
            <Text className="text-appText text-base font-medium">{value || placeholder}</Text>
         </View>

         {/* Status Icon */}
         <View className="ml-2">
            {value ? (
               <UserCheck size={20} color="rgb(var(--color-app-success))" />
            ) : (
               <Edit3 size={20} color="rgb(var(--color-app-icon))" />
            )}
         </View>
      </View>
   );

   const renderPersonalInfo = () => (
      <View className="p-4">
         <Text className="text-appText font-bold text-lg mb-4">Kişisel Bilgiler</Text>

         {renderInfoItem(
            <Mail size={24} color="rgb(var(--color-app-button))" />,
            'E-posta Adresi',
            user?.email,
            'E-posta adresi girilmemiş',
         )}

         {renderInfoItem(
            <User size={24} color="rgb(var(--color-app-button))" />,
            'Ad Soyad',
            user?.name && user?.surname ? `${user.name} ${user.surname}` : user?.name,
            'Ad soyad bilgisi girilmemiş',
         )}

         {renderInfoItem(
            <Phone size={24} color="rgb(var(--color-app-button))" />,
            'Telefon Numarası',
            user?.phoneNumber,
            'Telefon numarası girilmemiş',
         )}

         {renderInfoItem(
            <IdCard size={24} color="rgb(var(--color-app-button))" />,
            'TC Kimlik No',
            (user as any)?.identityNumber,
            'TC kimlik numarası girilmemiş',
         )}
      </View>
   );

   // ==================== LOADING STATE ====================

   if (userLoading) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center">
            <LoadingComponent variant="pulse" message="Kişisel bilgiler yükleniyor..." size="lg" />
         </View>
      );
   }

   // ==================== ERROR STATE ====================

   if (userError && !user) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center p-6">
            <Text className="text-appError text-center text-lg mb-4">
               Kişisel bilgiler yüklenirken bir hata oluştu.
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
                  refreshing={userLoading}
                  onRefresh={handleRefresh}
                  tintColor="rgb(var(--color-app-button))"
               />
            }>
            {/* Profile Header */}
            {renderProfileHeader()}

            {/* Personal Information */}
            {renderPersonalInfo()}

            {/* Bottom Spacing */}
            <View className="h-8" />
         </ScrollView>
      </View>
   );
};

export default PersonalInformationScreen;
