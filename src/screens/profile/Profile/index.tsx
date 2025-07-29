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
   Alert,
   RefreshControl,
   StatusBar,
   Platform,
   SafeAreaView,
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
   Shield,
} from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList, RootStackParamList } from '@navigation/NavigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootState } from '@contexts/store';
import { logoutAction } from '@contexts/slices/auth/authSlice';
import { Notification } from '@apptypes/entities/notification';

// Components & Hooks
import LoadingComponent from '@mycomponents/Loading/laoading';
import MenuItemComponent from '@components/MenuItem/menu.item';
import AvatarHeaderComponent from '@components/AvatarHeader/avatar.header';
import { useAsync } from '@hooks/modular/useAsync';
import userService from '@services/backend/userService';
import IconComponent from '@mycomponents/LucidImage';
import { useTheme } from '../../../../styles/theme.hook';

// Types
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;
type RootProps = NativeStackNavigationProp<RootStackParamList>;

// ==================== MAIN COMPONENT ====================

const ProfileScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const dispatch = useDispatch();
   const rootNavigation = useNavigation<RootProps>();

   // Redux state
   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

   // Theme hook for status bar
   const isDarkMode = useTheme();

   // Status bar height hesaplaması
   const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;

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

   // ==================== MOCK DATA ====================

   // Temporary mock notifications - bu gerçek bir projede API'dan veya Redux store'dan gelecek
   const mockNotifications: Notification[] = [
      {
         message: 'Yeni seçim daveti aldınız',
         sender: { name: 'Sistem', email: 'system@app.com' } as any,
         time: '2 dk önce',
         description: 'Arkadaşlarınızdan biri sizi bir seçime davet etti',
         type: 'info',
         isRead: false,
      },
      {
         message: 'Oy kullanma süreniz dolmak üzere',
         sender: { name: 'Sistem', email: 'system@app.com' } as any,
         time: '1 saat önce',
         description: 'Aktif seçimde oyunuzu kullanmayı unutmayın',
         type: 'warning',
         isRead: false,
      },
      {
         message: 'Profil güncellendi',
         sender: { name: 'Sistem', email: 'system@app.com' } as any,
         time: '1 gün önce',
         description: 'Profil bilgileriniz başarıyla güncellendi',
         type: 'success',
         isRead: true,
      },
   ];

   // ==================== HANDLERS ====================

   const handleAvatarPress = useCallback(() => {
      console.log('Avatar pressed - photo picker açılabilir');
      // Burada image picker açılabilir
   }, []);

   const handleEditPress = useCallback(() => {
      navigation.navigate('PersonalInformation');
   }, [navigation]);

   const handleSettingsPress = useCallback(() => {
      navigation.navigate('Settings');
   }, [navigation]);

   const handleNotificationPress = useCallback((notification: Notification, index: number) => {
      console.log('Notification pressed:', notification, index);
      // Burada notification detayına gidilebilir
   }, []);

   const handleMarkAllRead = useCallback(() => {
      console.log('Mark all notifications as read');
      // Burada tüm bildirimler okundu olarak işaretlenebilir
   }, []);

   const handleClearAll = useCallback(() => {
      console.log('Clear all notifications');
      // Burada tüm bildirimler temizlenebilir
   }, []);

   // ==================== RENDER FUNCTIONS ====================

   const renderUserHeader = () => {
      // Loading state kontrolü
      if (userLoading && !user) {
         return (
            <View className="bg-appCardBackground border-b border-appBorderColor p-6 items-center justify-center">
               <LoadingComponent variant="pulse" message="Kullanıcı bilgileri yükleniyor..." />
            </View>
         );
      }

      return (
         <View className="bg-appCardBackground border-b border-appBorderColor">
            {/* Avatar Header Component */}
            <AvatarHeaderComponent
               user={user}
               notifications={mockNotifications}
               onAvatarPress={handleAvatarPress}
               onEditPress={handleEditPress}
               onSettingsPress={handleSettingsPress}
               onNotificationPress={handleNotificationPress}
               onMarkAllRead={handleMarkAllRead}
               onClearAll={handleClearAll}
               variant="detailed"
               size="large"
               showNotifications={true}
               showEditButton={true}
               showSettingsButton={true}
            />

            {/* Quick Stats - AvatarHeaderComponent'te olmadığı için ayrı ekliyoruz */}
            <View className="px-6 pb-6">
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
                  iconLucide={item.icon}
                  textClassName="text-appCardText"
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

   // İlk yüklemede tam sayfa loading göster
   if (userLoading && !user && isAuthenticated) {
      return (
         <SafeAreaView className="flex-1 bg-appBackground" style={{ paddingTop: statusBarHeight }}>
            <StatusBar
               barStyle={isDarkMode === 'dark' ? 'light-content' : 'dark-content'}
               backgroundColor="transparent"
               translucent={true}
            />
            <View className="flex-1 items-center justify-center">
               <LoadingComponent variant="pulse" message="Profil yükleniyor..." size="lg" />
            </View>
         </SafeAreaView>
      );
   }

   // ==================== MAIN RENDER ====================

   return (
      <SafeAreaView className="flex-1 bg-appBackground" style={{ paddingTop: statusBarHeight }}>
         <StatusBar
            barStyle={isDarkMode === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent={true}
         />
         <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            refreshControl={
               <RefreshControl
                  refreshing={userLoading}
                  onRefresh={handleRefreshProfile}
                  className="text-appButton"
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
      </SafeAreaView>
   );
};

export default ProfileScreen;
