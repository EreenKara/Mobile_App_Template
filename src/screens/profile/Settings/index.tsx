import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { ProfileStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';
import { toggleDarkMode, setLanguage } from '@contexts/slices/settings/settingsSlice';
import {
   Moon,
   Sun,
   Bell,
   Lock,
   Globe,
   HelpCircle,
   Info,
   ChevronRight,
   Smartphone,
   Volume2,
} from 'lucide-react-native';

type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

interface SettingItem {
   id: string;
   title: string;
   subtitle?: string;
   icon: React.ComponentType<any>;
   type: 'switch' | 'navigation' | 'action';
   value?: boolean;
   onPress?: () => void;
   onToggle?: (value: boolean) => void;
}

const SettingsScreen: React.FC<ScreenProps> = ({ navigation }) => {
   // Redux state management
   const dispatch = useDispatch();
   const { darkMode, language } = useSelector((state: RootState) => state.settings);

   // Local state for non-global settings
   const [notifications, setNotifications] = useState(true);
   const [sounds, setSounds] = useState(true);

   // Language options mapping
   const languageOptions = {
      tr: 'Türkçe',
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
   };

   // Enhanced theme toggle with Redux
   const handleThemeToggle = useCallback(() => {
      dispatch(toggleDarkMode());
      // NativeWind manipulation Redux slice'ta yapılıyor!
   }, [dispatch]);

   // Language selection handler
   const handleLanguagePress = useCallback(() => {
      Alert.alert('Dil Seçimi', 'Hangi dili seçmek istiyorsunuz?', [
         { text: 'Türkçe', onPress: () => dispatch(setLanguage('tr')) },
         { text: 'English', onPress: () => dispatch(setLanguage('en')) },
         { text: 'Deutsch', onPress: () => dispatch(setLanguage('de')) },
         { text: 'Français', onPress: () => dispatch(setLanguage('fr')) },
         { text: 'İptal', style: 'cancel' },
      ]);
   }, [dispatch]);

   // Enhanced settings configuration with Redux integration
   const settingsData: SettingItem[] = useMemo(
      () => [
         {
            id: 'theme',
            title: 'Tema Seçimi',
            subtitle: darkMode ? 'Karanlık Tema' : 'Açık Tema',
            icon: darkMode ? Moon : Sun,
            type: 'switch',
            value: darkMode,
            onToggle: handleThemeToggle,
         },
         {
            id: 'notifications',
            title: 'Bildirimler',
            subtitle: 'Push bildirimleri yönet',
            icon: Bell,
            type: 'switch',
            value: notifications,
            onToggle: setNotifications,
         },
         {
            id: 'sounds',
            title: 'Sesler',
            subtitle: 'Uygulama seslerini kontrol et',
            icon: Volume2,
            type: 'switch',
            value: sounds,
            onToggle: setSounds,
         },
         {
            id: 'security',
            title: 'Güvenlik',
            subtitle: 'Şifre ve güvenlik ayarları',
            icon: Lock,
            type: 'navigation',
            onPress: () => navigation.navigate('Security'),
         },
         {
            id: 'language',
            title: 'Dil Seçimi',
            subtitle: languageOptions[language as keyof typeof languageOptions] || 'Türkçe',
            icon: Globe,
            type: 'navigation',
            onPress: handleLanguagePress,
         },
         {
            id: 'device',
            title: 'Cihaz Bilgileri',
            subtitle: 'Uygulama ve cihaz detayları',
            icon: Smartphone,
            type: 'navigation',
            onPress: () => showDeviceInfo(),
         },
         {
            id: 'help',
            title: 'Yardım & Destek',
            subtitle: 'SSS ve iletişim',
            icon: HelpCircle,
            type: 'navigation',
            onPress: () => navigation.navigate('Help'),
         },
         {
            id: 'about',
            title: 'Hakkında',
            subtitle: 'Uygulama bilgileri',
            icon: Info,
            type: 'navigation',
            onPress: () => navigation.navigate('About'),
         },
      ],
      [
         darkMode,
         language,
         notifications,
         sounds,
         navigation,
         handleThemeToggle,
         handleLanguagePress,
      ],
   );

   // Enhanced device info display
   const showDeviceInfo = useCallback(() => {
      Alert.alert(
         'Cihaz Bilgileri',
         `Uygulama Versiyonu: 1.0.0\nSürüm: Beta\nSon Güncelleme: 2025\nTema: ${darkMode ? 'Karanlık' : 'Açık'}\nDil: ${languageOptions[language as keyof typeof languageOptions]}`,
         [{ text: 'Tamam', style: 'default' }],
      );
   }, [darkMode, language]);

   // Enhanced setting item renderer - CSS Variables ile otomatik tema
   const renderSettingItem = useCallback(({ item }: { item: SettingItem }) => {
      const IconComponent = item.icon;

      return (
         <TouchableOpacity
            key={item.id}
            // ✨ CSS Variables - Otomatik tema switching, hiç darkMode conditional yok
            className="bg-appCardBackground rounded-xl mx-4 mb-3 p-4 sm:p-5 md:p-6 shadow-sm"
            style={{
               // CSS variables kullanıldığı için customColors'a gerek yok
               shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
               elevation: 2,
            }}
            onPress={item.type === 'navigation' ? item.onPress : undefined}
            activeOpacity={item.type === 'navigation' ? 0.7 : 1}>
            <View className="flex-row items-center justify-between">
               {/* Left Side - Icon & Text */}
               <View className="flex-row items-center flex-1">
                  {/* Icon Container - Otomatik tema switching */}
                  <View className="w-10 h-10 sm:w-12 sm:h-12 rounded-full items-center justify-center mr-4 bg-appTransition">
                     <IconComponent
                        size={20}
                        color="rgb(var(--color-app-icon))" // CSS variable
                        strokeWidth={2}
                     />
                  </View>

                  {/* Text Content - Otomatik tema switching */}
                  <View className="flex-1">
                     <Text className="text-appCardText font-appFont font-semibold text-base sm:text-lg">
                        {item.title}
                     </Text>
                     {item.subtitle && (
                        <Text className="text-appCardText/70 font-appFont text-sm sm:text-base mt-1">
                           {item.subtitle}
                        </Text>
                     )}
                  </View>
               </View>

               {/* Right Side - Control */}
               {item.type === 'switch' && (
                  <Switch
                     value={item.value}
                     onValueChange={item.onToggle}
                     trackColor={{
                        false: 'rgb(var(--color-app-disabled))',
                        true: 'rgb(var(--color-app-button))',
                     }}
                     thumbColor={
                        item.value
                           ? 'rgb(var(--color-app-button-text))'
                           : 'rgb(var(--color-app-placeholder))'
                     }
                     ios_backgroundColor="rgb(var(--color-app-disabled))"
                  />
               )}

               {item.type === 'navigation' && (
                  <ChevronRight
                     size={20}
                     color="rgb(var(--color-app-card-text))" // CSS variable
                     strokeWidth={2}
                  />
               )}
            </View>
         </TouchableOpacity>
      );
   }, []); // darkMode dependency kaldırıldı - CSS variables otomatik hallediyor

   return (
      // ✨ Otomatik tema switching - hiç conditional yok
      <ScrollView className="flex-1 bg-appBackground">
         {/* Header Section - Otomatik tema switching */}
         <View className="px-4 pt-6 pb-4 sm:pt-8 sm:pb-6">
            <Text className="text-appText font-appFont font-bold text-2xl sm:text-3xl md:text-4xl">
               Ayarlar
            </Text>
            <Text className="text-appIcon font-appFont text-base sm:text-lg mt-2">
               Uygulama tercihlerinizi yönetin
            </Text>
         </View>

         {/* Settings List */}
         <View className="pb-6">{settingsData.map(item => renderSettingItem({ item }))}</View>

         {/* Footer - Otomatik tema switching */}
         <View className="px-4 py-6 items-center">
            <Text className="text-appPlaceholder font-appFont text-sm sm:text-base text-center">
               MyApp v1.0.0 (Beta)
            </Text>
            <Text className="text-appPlaceholder font-appFont text-xs sm:text-sm text-center mt-1">
               © 2025 Tüm hakları saklıdır
            </Text>
            <Text className="text-appPlaceholder font-appFont text-xs text-center mt-2">
               {darkMode ? '🌙 Karanlık Tema Aktif' : '☀️ Açık Tema Aktif'}
            </Text>
         </View>
      </ScrollView>
   );
};

export default SettingsScreen;
