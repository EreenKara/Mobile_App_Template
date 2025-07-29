import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
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
   LucideIcon,
} from 'lucide-react-native';
import IconComponent from '@mycomponents/LucidImage';
import { useTailwindColors } from '@styles/tailwind.colors';

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
   icon: LucideIcon;
   action: () => void;
   colorVar: string;
}

const HelpScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const colors = useTailwindColors();
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
      Alert.alert(
         'E-posta Desteği',
         `Destek ekibimizle iletişime geçin:\n\n📧 E-posta: support@myapp.com\n\n📱 Uygulama Versiyonu: 1.0.0\n🎨 Tema: ${darkMode === 'dark' ? 'Karanlık' : 'Açık'}\n🌐 Dil: ${language}\n\nE-posta desteği bilgisi gösterildi.`,
         [{ text: 'Tamam', style: 'default' }],
      );
   }, [darkMode, language]);

   const handlePhoneContact = useCallback(() => {
      Alert.alert(
         'Telefon Desteği',
         '📞 Telefon: +90 (212) 555-0123\n\n⏰ Çalışma Saatleri:\nPazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 16:00\nPazar: Kapalı\n\nTelefon desteği bilgisi gösterildi.',
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   const handleLiveChat = useCallback(() => {
      Alert.alert(
         'Canlı Destek',
         '💬 Canlı destek hattımız yakında açılacaktır.\n\n📧 Şimdilik e-posta desteği kullanabilirsiniz: support@myapp.com\n📞 Veya telefon desteğimizi arayabilirsiniz: +90 (212) 555-0123\n\nCanlı destek bilgisi gösterildi.',
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   const handleCommunityForum = useCallback(() => {
      Alert.alert(
         'Topluluk Forumu',
         '👥 Topluluk Forumu: community.myapp.com\n\n🗣️ Diğer kullanıcılarla deneyimlerinizi paylaşın\n❓ Sorularınıza cevap bulun\n💡 İpuçları ve püf noktaları keşfedin\n\nTopluluk forumu bilgisi gösterildi.',
         [{ text: 'Tamam', style: 'default' }],
      );
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
            `📝 Geri bildiriminiz:\n"${feedbackText.trim()}"\n\n✅ Değerli geri bildiriminiz için teşekkür ederiz!\n🔍 En kısa sürede inceleyeceğiz.\n📧 Gerekirse size dönüş yapacağız.\n\nGeri bildirim başarıyla kaydedildi.`,
            [{ text: 'Tamam', style: 'default' }],
         );
         setFeedbackText('');
      } else {
         Alert.alert('Eksik Bilgi', 'Lütfen geri bildirim mesajınızı yazın.', [
            { text: 'Tamam', style: 'default' },
         ]);
      }
   }, [feedbackText]);

   // Handle help center
   const handleHelpCenter = useCallback(() => {
      Alert.alert(
         'Detaylı Yardım Merkezi',
         '📚 Yardım Merkezi: help.myapp.com\n\n📖 Detaylı kılavuzlar\n🎥 Video eğitimleri\n📋 Adım adım talimatlar\n🔧 Sorun giderme rehberi\n\nYardım merkezi bilgisi gösterildi.',
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

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
                  const Icon = option.icon;
                  return (
                     <TouchableOpacity
                        key={option.id}
                        className="shadow-md w-[48%] mb-3 p-4 rounded-xl items-center bg-appCardBackground"
                        onPress={option.action}
                        activeOpacity={0.7}>
                        <View
                           className=" w-12 h-12 rounded-full items-center justify-center mb-3"
                           style={{ backgroundColor: colors[option.colorVar] }}>
                           <IconComponent Icon={Icon} size={24} className="text-appButtonText" />
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
                     const Icon = category.icon;
                     const isSelected = selectedCategory === category.id;

                     return (
                        <TouchableOpacity
                           key={category.id}
                           className={`
                              flex-row items-center px-4 py-2 rounded-full mr-2
                              ${isSelected ? 'bg-appButton' : 'bg-appTransition'}
                           `}
                           onPress={() => setSelectedCategory(category.id)}>
                           <IconComponent Icon={Icon} size={16} className="text-appIcon" />

                           <Text className="text-appCardText font-appFont font-medium text-sm ml-2">
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
                  className="shadow-md border border-appBorder bg-appCardBackground mb-3 p-4 rounded-xl"
                  activeOpacity={0.7}>
                  <View className="flex-row items-center justify-between">
                     <Text className="text-appCardText flex-1 font-appFont font-medium text-base pr-2">
                        {faq.question}
                     </Text>

                     {expandedFAQ === faq.id ? (
                        <IconComponent Icon={ChevronDown} size={20} className="text-appCardText" />
                     ) : (
                        <IconComponent Icon={ChevronRight} size={20} className="text-appCardText" />
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

            <View className="shadow-md border border-appBorder bg-appCardBackground p-4 rounded-xl">
               <TextInput
                  className="bg-appTransition text-appText font-appFont text-base h-24 p-3 rounded-lg"
                  placeholder="Görüşlerinizi ve önerilerinizi paylaşın..."
                  placeholderTextColor={colors.appPlaceholder}
                  multiline
                  textAlignVertical="top"
                  value={feedbackText}
                  onChangeText={setFeedbackText}
               />

               <TouchableOpacity
                  className="bg-appButton rounded-lg p-3 mt-3 flex-row items-center justify-center"
                  onPress={handleSendFeedback}
                  activeOpacity={0.8}>
                  <IconComponent Icon={Send} size={18} className="text-appButtonText mr-2" />
                  <Text className="text-appButtonText font-appFont font-semibold ml-2">Gönder</Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Footer */}
         <View className="px-4 py-6 items-center">
            <Text className="text-appPlaceholder font-appFont text-sm text-center">
               Daha fazla yardıma mı ihtiyacınız var?
            </Text>
            <TouchableOpacity className="mt-2" onPress={handleHelpCenter}>
               <Text className="text-appButton font-appFont font-medium">
                  Detaylı Yardım Merkezi →
               </Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
};

export default HelpScreen;
