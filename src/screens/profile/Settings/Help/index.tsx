import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { ProfileStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';
import {
   HelpCircle,
   MessageCircle,
   Mail,
   Phone,
   ExternalLink,
   ChevronDown,
   ChevronRight,
   Send,
   Book,
   Video,
   Users,
   Star,
   MessageSquare,
} from 'lucide-react-native';

type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Help'>;

interface FAQItem {
   id: string;
   question: string;
   answer: string;
   category: 'general' | 'account' | 'payment' | 'technical';
}

interface ContactOption {
   id: string;
   title: string;
   subtitle: string;
   icon: React.ComponentType<any>;
   action: () => void;
   colorVar: string;
}

const HelpScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const { darkMode, language } = useSelector((state: RootState) => state.settings);
   const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
   const [feedbackText, setFeedbackText] = useState('');
   const [selectedCategory, setSelectedCategory] = useState<string>('all');

   // FAQ Data
   const faqData: FAQItem[] = [
      {
         id: '1',
         question: 'Şifremi nasıl değiştirebilirim?',
         answer:
            'Ayarlar > Güvenlik bölümünden şifrenizi değiştirebilirsiniz. Mevcut şifrenizi girdikten sonra yeni şifrenizi belirleyebilirsiniz.',
         category: 'account',
      },
      {
         id: '2',
         question: 'Karanlık tema nasıl aktif edilir?',
         answer:
            'Ayarlar > Tema Seçimi bölümünden karanlık temayı aktif edebilirsiniz. Bu ayar tüm uygulama için geçerli olacaktır.',
         category: 'general',
      },
      {
         id: '3',
         question: 'Bildirimleri nasıl kapatırım?',
         answer:
            'Ayarlar > Bildirimler bölümünden push bildirimlerini kapatabilir veya özelleştirebilirsiniz.',
         category: 'general',
      },
      {
         id: '4',
         question: 'Hesabımı nasıl silebilirim?',
         answer:
            'Hesap silme işlemi için müşteri hizmetlerimizle iletişime geçmeniz gerekmektedir. Bu işlem geri alınamaz.',
         category: 'account',
      },
      {
         id: '5',
         question: 'Uygulama donuyor, ne yapmalıyım?',
         answer:
            'Uygulamayı tamamen kapatıp yeniden açmayı deneyin. Sorun devam ederse cihazınızı yeniden başlatın veya uygulamayı güncelleyin.',
         category: 'technical',
      },
   ];

   // Contact options with CSS variables
   const contactOptions: ContactOption[] = [
      {
         id: 'email',
         title: 'E-posta Gönder',
         subtitle: 'support@myapp.com',
         icon: Mail,
         action: () => handleEmailContact(),
         colorVar: '--color-app-button',
      },
      {
         id: 'phone',
         title: 'Telefon Desteği',
         subtitle: '+90 (212) 555-0123',
         icon: Phone,
         action: () => handlePhoneContact(),
         colorVar: '--color-app-card-button',
      },
      {
         id: 'chat',
         title: 'Canlı Destek',
         subtitle: 'Online sohbet başlat',
         icon: MessageCircle,
         action: () => handleLiveChat(),
         colorVar: '--color-app-indicator',
      },
      {
         id: 'community',
         title: 'Topluluk Forumu',
         subtitle: 'Diğer kullanıcılarla etkileşim',
         icon: Users,
         action: () => handleCommunityForum(),
         colorVar: '--color-app-icon',
      },
   ];

   // Category filters
   const categories = [
      { id: 'all', title: 'Tümü', icon: Book },
      { id: 'general', title: 'Genel', icon: HelpCircle },
      { id: 'account', title: 'Hesap', icon: Users },
      { id: 'technical', title: 'Teknik', icon: MessageSquare },
   ];

   // Filter FAQ by category
   const filteredFAQ =
      selectedCategory === 'all'
         ? faqData
         : faqData.filter(item => item.category === selectedCategory);

   // Contact handlers
   const handleEmailContact = useCallback(() => {
      const email = 'support@myapp.com';
      const subject = 'MyApp Destek Talebi';
      const body = `Merhaba,\n\nUygulama Versiyonu: 1.0.0\nTema: ${darkMode ? 'Karanlık' : 'Açık'}\nDil: ${language}\n\nSorunum:\n`;

      Linking.openURL(
         `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
   }, [darkMode, language]);

   const handlePhoneContact = useCallback(() => {
      Alert.alert(
         'Telefon Desteği',
         'Telefon desteğimiz Pazartesi-Cuma 09:00-18:00 saatleri arasında hizmet vermektedir.',
         [
            { text: 'Ara', onPress: () => Linking.openURL('tel:+902125550123') },
            { text: 'İptal', style: 'cancel' },
         ],
      );
   }, []);

   const handleLiveChat = useCallback(() => {
      Alert.alert(
         'Canlı Destek',
         'Canlı destek hattımız yakında açılacaktır. Şimdilik e-posta veya telefon ile iletişime geçebilirsiniz.',
         [{ text: 'Tamam' }],
      );
   }, []);

   const handleCommunityForum = useCallback(() => {
      Linking.openURL('https://community.myapp.com');
   }, []);

   // FAQ toggle
   const toggleFAQ = useCallback(
      (id: string) => {
         setExpandedFAQ(expandedFAQ === id ? null : id);
      },
      [expandedFAQ],
   );

   // Send feedback
   const handleSendFeedback = useCallback(() => {
      if (feedbackText.trim()) {
         Alert.alert(
            'Geri Bildirim Gönderildi',
            'Değerli geri bildiriminiz için teşekkür ederiz. En kısa sürede inceleyeceğiz.',
            [{ text: 'Tamam' }],
         );
         setFeedbackText('');
      }
   }, [feedbackText]);

   return (
      <ScrollView className="flex-1 bg-appBackground">
         {/* Header */}
         <View className="px-4 pt-6 pb-4 sm:pt-8 sm:pb-6">
            <Text className="text-appText font-appFont font-bold text-2xl sm:text-3xl md:text-4xl">
               Yardım & Destek
            </Text>
            <Text className="text-appIcon font-appFont text-base sm:text-lg mt-2">
               Size nasıl yardımcı olabiliriz?
            </Text>
         </View>

         {/* Quick Contact Options */}
         <View className="px-4 mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               İletişim Seçenekleri
            </Text>

            <View className="flex-row flex-wrap justify-between">
               {contactOptions.map(option => {
                  const IconComponent = option.icon;
                  return (
                     <TouchableOpacity
                        key={option.id}
                        className="w-[48%] mb-3 p-4 rounded-xl items-center bg-appCardBackground"
                        style={{
                           shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                           elevation: 2,
                           borderWidth: 1,
                           borderColor: 'rgb(var(--color-app-border))',
                        }}
                        onPress={option.action}
                        activeOpacity={0.7}>
                        <View
                           className="w-12 h-12 rounded-full items-center justify-center mb-3"
                           style={{ backgroundColor: `rgb(var(${option.colorVar}))` }}>
                           <IconComponent size={24} color="white" strokeWidth={2} />
                        </View>

                        <Text className="text-appCardText font-appFont font-semibold text-center text-sm">
                           {option.title}
                        </Text>

                        <Text className="text-appCardText/60 font-appFont text-center text-xs mt-1">
                           {option.subtitle}
                        </Text>
                     </TouchableOpacity>
                  );
               })}
            </View>
         </View>

         {/* FAQ Section */}
         <View className="px-4 mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               Sık Sorulan Sorular
            </Text>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
               <View className="flex-row space-x-2">
                  {categories.map(category => {
                     const IconComponent = category.icon;
                     const isSelected = selectedCategory === category.id;

                     return (
                        <TouchableOpacity
                           key={category.id}
                           className={`
                              flex-row items-center px-4 py-2 rounded-full mr-2
                              ${isSelected ? 'bg-appButton' : 'bg-appTransition'}
                           `}
                           onPress={() => setSelectedCategory(category.id)}>
                           <IconComponent
                              size={16}
                              color={
                                 isSelected
                                    ? 'rgb(var(--color-app-button-text))'
                                    : 'rgb(var(--color-app-icon))'
                              }
                              strokeWidth={2}
                           />

                           <Text
                              className={`
                              font-appFont font-medium text-sm ml-2
                              ${isSelected ? 'text-appButtonText' : 'text-appIcon'}
                           `}>
                              {category.title}
                           </Text>
                        </TouchableOpacity>
                     );
                  })}
               </View>
            </ScrollView>

            {/* FAQ List */}
            {filteredFAQ.map(faq => (
               <TouchableOpacity
                  key={faq.id}
                  className="bg-appCardBackground mb-3 p-4 rounded-xl"
                  style={{
                     shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                     elevation: 1,
                     borderWidth: 1,
                     borderColor: 'rgb(var(--color-app-border))',
                  }}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}>
                  <View className="flex-row items-center justify-between">
                     <Text className="text-appCardText flex-1 font-appFont font-medium text-base pr-2">
                        {faq.question}
                     </Text>

                     {expandedFAQ === faq.id ? (
                        <ChevronDown size={20} color="rgb(var(--color-app-card-text))" />
                     ) : (
                        <ChevronRight size={20} color="rgb(var(--color-app-card-text))" />
                     )}
                  </View>

                  {expandedFAQ === faq.id && (
                     <Text className="text-appCardText/80 font-appFont text-sm mt-3 leading-6">
                        {faq.answer}
                     </Text>
                  )}
               </TouchableOpacity>
            ))}
         </View>

         {/* Feedback Section */}
         <View className="px-4 mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               Geri Bildirim Gönder
            </Text>

            <View
               className="bg-appCardBackground p-4 rounded-xl"
               style={{
                  shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: 'rgb(var(--color-app-border))',
               }}>
               <TextInput
                  className="bg-appTransition text-appText font-appFont text-base h-24 p-3 rounded-lg"
                  placeholder="Görüşlerinizi ve önerilerinizi paylaşın..."
                  placeholderTextColor="rgb(var(--color-app-placeholder))"
                  multiline
                  textAlignVertical="top"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
               />

               <TouchableOpacity
                  className="bg-appButton rounded-lg p-3 mt-3 flex-row items-center justify-center"
                  onPress={handleSendFeedback}
                  activeOpacity={0.8}>
                  <Send size={18} color="rgb(var(--color-app-button-text))" strokeWidth={2} />
                  <Text className="text-appButtonText font-appFont font-semibold ml-2">Gönder</Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Footer */}
         <View className="px-4 py-6 items-center">
            <Text className="text-appPlaceholder font-appFont text-sm text-center">
               Daha fazla yardıma mı ihtiyacınız var?
            </Text>
            <TouchableOpacity
               className="mt-2"
               onPress={() => Linking.openURL('https://help.myapp.com')}>
               <Text className="text-appButton font-appFont font-medium">
                  Detaylı Yardım Merkezi →
               </Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
};

export default HelpScreen;
