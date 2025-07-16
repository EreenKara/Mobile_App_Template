/**
 * ProfileScreen
 *
 * Modern profile sayfası - Redux store ile user yönetimi
 * NativeWind ile responsive tasarım
 * Global state'te user verilerini yönetir
 *
 * @author Frontend Developer
 */

import React, { useEffect, useCallback } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import {
   User,
   Settings,
   CreditCard,
   MapPin,
   Users,
   Vote,
   UserCheck,
   Crown,
   LogOut,
   Bell,
   Shield,
} from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList, RootStackParamList } from '@navigation/NavigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '@contexts/store';
import { logoutAction } from '@contexts/slices/auth/authSlice';

// Components & Hooks
import LoadingComponent from '@mycomponents/Loading/laoading';
import MenuItemComponent from '@components/MenuItem/menu.item';
import { useAsync } from '@hooks/modular/useAsync';
import userService from '@services/backend/userService';

// Types
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;
type RootProps = NativeStackNavigationProp<RootStackParamList>;

// ==================== MAIN COMPONENT ====================

const ProfileScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const dispatch = useDispatch();
   const rootNavigation = useNavigation<RootProps>();

   // Redux state
   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

   // User data fetching
   const {
      execute: fetchUserData,
      loading: userLoading,
      error: userError,
   } = useAsync(userService.me, {
      onSuccess: userData => {
         // User verilerini Redux store'a kaydet
         console.log('User data fetched:', userData);
      },
      onError: error => {
         console.error('User fetch error:', error);
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

   const handleLogout = useCallback(() => {
      Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?', [
         {
            text: 'İptal',
            style: 'cancel',
         },
         {
            text: 'Çıkış Yap',
            style: 'destructive',
            onPress: () => {
               dispatch(logoutAction());
               rootNavigation.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
               });
            },
         },
      ]);
   }, [dispatch, rootNavigation]);

   const handleRefreshProfile = useCallback(() => {
      fetchUserData();
   }, [fetchUserData]);

   // ==================== RENDER FUNCTIONS ====================

   const renderUserHeader = () => {
      if (!user) {
         return (
            <View className="bg-appCardBackground border-b border-appBorderColor p-6">
               <View className="flex-row items-center">
                  <View className="w-20 h-20 bg-appTransition rounded-full items-center justify-center mr-4">
                     <User size={32} color="rgb(var(--color-app-icon))" />
                  </View>
                  <View className="flex-1">
                     <Text className="text-appText font-bold text-xl">Kullanıcı Bilgileri</Text>
                     <Text className="text-appText/60 text-sm mt-1">Bilgiler yükleniyor...</Text>
                  </View>
               </View>
            </View>
         );
      }

      return (
         <View className="bg-appCardBackground border-b border-appBorderColor p-6">
            <View className="flex-row items-center mb-4">
               {/* Avatar */}
               <View className="w-20 h-20 bg-appButton rounded-full items-center justify-center mr-4">
                  {(user as any).avatar || (user as any).profileImage ? (
                     <Image
                        source={{ uri: (user as any).avatar || (user as any).profileImage }}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                     />
                  ) : (
                     <Text className="text-appButtonText font-bold text-2xl">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                     </Text>
                  )}
               </View>

               {/* User Info */}
               <View className="flex-1">
                  <Text className="text-appText font-bold text-xl">{user.name || 'Kullanıcı'}</Text>
                  <Text className="text-appText/60 text-sm mt-1">
                     {user.email || 'E-posta yok'}
                  </Text>
                  {((user as any).phoneNumber || (user as any).phone) && (
                     <Text className="text-appText/60 text-sm">
                        {(user as any).phoneNumber || (user as any).phone}
                     </Text>
                  )}
               </View>

               {/* Notification Badge */}
               <TouchableOpacity
                  className="w-10 h-10 bg-appButton/10 rounded-full items-center justify-center"
                  onPress={() => {
                     /* Notification handler */
                  }}>
                  <Bell size={20} color="rgb(var(--color-app-button))" />
                  <View className="absolute -top-1 -right-1 w-5 h-5 bg-appError rounded-full items-center justify-center">
                     <Text className="text-appButtonText text-xs font-bold">3</Text>
                  </View>
               </TouchableOpacity>
            </View>

            {/* Quick Stats */}
            <View className="flex-row justify-between bg-appTransition rounded-lg p-4">
               <View className="items-center">
                  <Text className="text-appText font-bold text-lg">12</Text>
                  <Text className="text-appText/60 text-xs">Oluşturulan</Text>
               </View>
               <View className="items-center">
                  <Text className="text-appText font-bold text-lg">8</Text>
                  <Text className="text-appText/60 text-xs">Katılınan</Text>
               </View>
               <View className="items-center">
                  <Text className="text-appText font-bold text-lg">3</Text>
                  <Text className="text-appText/60 text-xs">Gruplar</Text>
               </View>
            </View>
         </View>
      );
   };

   const renderMenuSection = (title: string, items: any[]) => (
      <View className="mb-6">
         <Text className="text-appText/60 font-medium text-sm mb-3 px-4">{title}</Text>
         <View className="bg-appCardBackground border border-appBorderColor rounded-lg overflow-hidden">
            {items.map((item, index) => (
               <MenuItemComponent
                  key={index}
                  iconComponent={
                     typeof item.icon === 'function' ? item.icon({ size: 24 }) : item.icon
                  }
                  title={item.title}
                  subtitle={item.subtitle}
                  onPress={item.onPress}
                  showBadge={item.showBadge}
                  badgeCount={item.badgeCount}
                  variant={item.variant}
                  className={`border-b border-appBorderColor/30 active:bg-appTransition ${
                     index === items.length - 1 ? 'border-b-0' : ''
                  }`}
               />
            ))}
         </View>
      </View>
   );

   // ==================== LOADING STATE ====================

   if (userLoading) {
      return (
         <View className="flex-1 bg-appBackground items-center justify-center">
            <LoadingComponent variant="pulse" message="Profil yükleniyor..." size="lg" />
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
                  onRefresh={handleRefreshProfile}
                  tintColor="rgb(var(--color-app-button))"
               />
            }>
            {/* User Header */}
            {renderUserHeader()}

            {/* Menu Sections */}
            <View className="p-4">
               {/* Kişisel Bilgiler */}
               {renderMenuSection('KİŞİSEL', [
                  {
                     icon: User,
                     title: 'Kişisel Bilgiler',
                     subtitle: 'Ad, soyad, telefon bilgileri',
                     onPress: () => navigation.navigate('PersonalInformation'),
                  },
                  {
                     icon: MapPin,
                     title: 'Adres Bilgileri',
                     subtitle: 'Ev ve iş adresleri',
                     onPress: () => navigation.navigate('AddressInformation'),
                  },
                  {
                     icon: CreditCard,
                     title: 'Ödeme Yöntemleri',
                     subtitle: 'Kartlar ve ödeme seçenekleri',
                     onPress: () => navigation.navigate('Payment'),
                  },
               ])}

               {/* Seçimler */}
               {renderMenuSection('SEÇİMLER', [
                  {
                     icon: Crown,
                     title: 'Oluşturduğum Seçimler',
                     subtitle: '12 seçim oluşturuldu',
                     onPress: () => {
                        // Navigation logic will be handled separately
                        console.log('Navigate to created elections');
                     },
                  },
                  {
                     icon: Vote,
                     title: 'Oy Kullandığım Seçimler',
                     subtitle: '8 seçimde oy kullandı',
                     onPress: () => {
                        // Navigation logic will be handled separately
                        console.log('Navigate to casted elections');
                     },
                  },
                  {
                     icon: UserCheck,
                     title: 'Aday Olduğum Seçimler',
                     subtitle: '3 seçimde aday',
                     onPress: () => {
                        // Navigation logic will be handled separately
                        console.log('Navigate to candidate elections');
                     },
                  },
               ])}

               {/* Sosyal */}
               {renderMenuSection('SOSYAL', [
                  {
                     icon: Users,
                     title: 'Gruplarım',
                     subtitle: '3 grup üyesi',
                     onPress: () => navigation.navigate('Groups'),
                     showBadge: true,
                     badgeCount: 2,
                  },
               ])}

               {/* Ayarlar */}
               {renderMenuSection('AYARLAR', [
                  {
                     icon: Settings,
                     title: 'Uygulama Ayarları',
                     subtitle: 'Tema, dil, bildirimler',
                     onPress: () => navigation.navigate('Settings'),
                  },
                  {
                     icon: Shield,
                     title: 'Güvenlik',
                     subtitle: 'Şifre, iki faktörlü doğrulama',
                     onPress: () => navigation.navigate('Security'),
                  },
               ])}

               {/* Çıkış */}
               {renderMenuSection('HESAP', [
                  {
                     icon: LogOut,
                     title: 'Çıkış Yap',
                     onPress: handleLogout,
                     variant: 'danger',
                  },
               ])}
            </View>
         </ScrollView>
      </View>
   );
};

export default ProfileScreen;
