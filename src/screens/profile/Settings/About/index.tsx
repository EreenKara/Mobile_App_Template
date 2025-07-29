import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { ProfileStackParamList } from '@navigation/NavigationTypes';
import { RootState } from '@contexts/store';
import {
   Info,
   ExternalLink,
   Heart,
   Star,
   Shield,
   Code,
   Globe,
   Users,
   Award,
   Coffee,
   GitGraphIcon,
   Mail,
   Share2,
   Smartphone,
   Building,
   Calendar,
   CheckCircle,
   ChevronRight,
} from 'lucide-react-native';
import ImageComponent from '@mycomponents/Image';
import IconComponent from '@mycomponents/LucidImage';

type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'About'>;

interface InfoSection {
   id: string;
   title: string;
   items: {
      label: string;
      value: string;
      icon?: React.ComponentType<any>;
      action?: () => void;
   }[];
}

interface TeamMember {
   id: string;
   name: string;
   role: string;
   avatar?: string;
}

const AboutScreen: React.FC<ScreenProps> = ({ navigation }) => {
   const { darkMode, language } = useSelector((state: RootState) => state.settings);

   // App information sections
   const infoSections: InfoSection[] = [
      {
         id: 'app',
         title: 'Uygulama Bilgileri',
         items: [
            { label: 'Versiyon', value: '1.0.0 (Beta)', icon: Smartphone },
            { label: 'Build', value: '2025.01.15', icon: Code },
            { label: 'Platform', value: 'React Native', icon: Globe },
            { label: 'Geliştirme Dili', value: 'TypeScript', icon: Code },
            { label: 'Son Güncelleme', value: '15 Ocak 2025', icon: Calendar },
         ],
      },
      {
         id: 'company',
         title: 'Şirket Bilgileri',
         items: [
            { label: 'Geliştirici', value: 'MyApp Technologies', icon: Building },
            { label: 'Kuruluş Yılı', value: '2024', icon: Calendar },
            { label: 'Lokasyon', value: 'İstanbul, Türkiye', icon: Globe },
            {
               label: 'Web Sitesi',
               value: 'www.myapp.com',
               icon: ExternalLink,
               action: () =>
                  Alert.alert('Web Sitesi', 'www.myapp.com\n\nWeb sitesi bilgisi gösterildi.'),
            },
            {
               label: 'E-posta',
               value: 'info@myapp.com',
               icon: Mail,
               action: () =>
                  Alert.alert(
                     'İletişim E-postası',
                     'info@myapp.com\n\nE-posta adresi bilgisi gösterildi.',
                  ),
            },
         ],
      },
      {
         id: 'legal',
         title: 'Yasal Bilgiler',
         items: [
            {
               label: 'Gizlilik Politikası',
               value: 'Görüntüle',
               icon: Shield,
               action: () => handleLegalDocument('privacy'),
            },
            {
               label: 'Kullanım Şartları',
               value: 'Görüntüle',
               icon: Shield,
               action: () => handleLegalDocument('terms'),
            },
            {
               label: 'Lisanslar',
               value: 'Açık Kaynak',
               icon: Code,
               action: () => handleLegalDocument('licenses'),
            },
            {
               label: 'KVKK',
               value: 'Uyumluluk',
               icon: CheckCircle,
               action: () => handleLegalDocument('kvkk'),
            },
         ],
      },
   ];

   // Team members
   const teamMembers: TeamMember[] = [
      { id: '1', name: 'Ahmet Yılmaz', role: 'Lead Developer' },
      { id: '2', name: 'Zeynep Kaya', role: 'UI/UX Designer' },
      { id: '3', name: 'Mehmet Demir', role: 'Backend Developer' },
      { id: '4', name: 'Ayşe Şahin', role: 'QA Engineer' },
   ];

   // Social media links
   const socialLinks = [
      { icon: Mail, url: 'https://github.com/myapp', label: 'GitHub' },
      { icon: Mail, url: 'https://twitter.com/myapp', label: 'Twitter' },
      { icon: Mail, url: 'mailto:social@myapp.com', label: 'E-posta' },
   ];

   // Handle legal document viewing
   const handleLegalDocument = useCallback((type: string) => {
      const documents = {
         privacy: {
            title: 'Gizlilik Politikası',
            content:
               'Kişisel verilerinizi korumak için gerekli tüm önlemleri alıyoruz. Verileriniz güvenle saklanır ve üçüncü taraflarla paylaşılmaz.',
         },
         terms: {
            title: 'Kullanım Şartları',
            content:
               'Uygulamayı kullanarak bu şartları kabul etmiş sayılırsınız. Uygulama sadece yasal amaçlar için kullanılmalıdır.',
         },
         licenses: {
            title: 'Açık Kaynak Lisansları',
            content:
               'Bu uygulama React Native, Lucide Icons ve diğer açık kaynak kütüphaneleri kullanmaktadır. MIT lisansı altında geliştirilmiştir.',
         },
         kvkk: {
            title: 'KVKK Uyumluluğu',
            content:
               'Uygulamamız KVKK (Kişisel Verilerin Korunması Kanunu) gerekliliklerine tam uyumludur. Verileriniz güvenle işlenir.',
         },
      };

      const doc = documents[type as keyof typeof documents];
      Alert.alert(doc.title, doc.content, [{ text: 'Tamam', style: 'default' }]);
   }, []);

   // Handle app sharing
   const handleShareApp = useCallback(() => {
      Alert.alert(
         'Uygulamayı Paylaş',
         'MyApp - Harika bir mobil uygulama!\n\nPaylaşım özelliği aktif edildi.',
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   // Handle app rating
   const handleRateApp = useCallback(() => {
      Alert.alert(
         'Uygulamayı Değerlendir',
         "MyApp'i beğendiniz mi? Değerlendirmeniz bizim için çok önemli!\n\nDeğerlendirme özelliği aktif edildi.",
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   // Handle feedback
   const handleSendFeedback = useCallback(() => {
      Alert.alert(
         'Geri Bildirim Gönder',
         'Görüşlerinizi bizimle paylaşın!\n\nE-posta: feedback@myapp.com\n\nGeri bildirim özelliği aktif edildi.',
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   // Handle social media links
   const handleSocialLink = useCallback((social: { label: string; url: string }) => {
      Alert.alert(
         social.label,
         `${social.label} sayfamızı ziyaret edin!\n\n${social.url}\n\nSosyal medya bağlantısı gösterildi.`,
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   // Handle acknowledgments
   const handleAcknowledments = useCallback(() => {
      Alert.alert(
         'Teşekkürler & Kaynaklar',
         'Bu uygulamanın geliştirilmesinde emeği geçen herkese teşekkür ederiz.\n\n• React Native Community\n• Lucide Icons\n• NativeWind\n• Ve tüm açık kaynak katkıcıları',
         [{ text: 'Tamam', style: 'default' }],
      );
   }, []);

   return (
      // ✨ CSS Variables - Otomatik tema switching
      <ScrollView className="flex-1 bg-appBackground">
         {/* Header with Logo - Otomatik tema switching */}
         <View className="items-center px-4 pt-6 pb-6">
            <View className="w-24 h-24 rounded-3xl items-center justify-center mb-4 bg-appTransition">
               <ImageComponent
                  source={require('@assets/images/nav_logo.png')}
                  className="text-appIcon w-24 h-24 rounded-3xl items-center justify-center mb-4 bg-appTransition"
                  resizeMode="contain"
               />
            </View>

            <Text className="text-appText font-appFont font-bold text-3xl text-center">MyApp</Text>

            <Text className="text-appIcon font-appFont text-lg text-center mt-2">
               Modern ve kullanıcı dostu mobil deneyim
            </Text>

            <View className="bg-appButton px-4 py-2 rounded-full mt-3">
               <Text className="text-appButtonText font-appFont font-medium">v1.0.0 Beta</Text>
            </View>
         </View>

         {/* Quick Actions - Otomatik tema switching */}
         <View className="px-4 mb-6">
            <View className="flex-row justify-around">
               <TouchableOpacity
                  className="shadow-md border border-appBorder flex-1 mx-1 p-4 rounded-xl items-center bg-appCardBackground"
                  onPress={handleRateApp}
                  activeOpacity={0.7}>
                  <IconComponent Icon={Star} size={24} className="text-appIcon" />
                  <Text className="text-appCardText font-appFont font-medium text-sm mt-2 text-center">
                     Değerlendir
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity
                  className="shadow-md border border-appBorder flex-1 mx-1 p-4 rounded-xl items-center bg-appCardBackground"
                  onPress={handleShareApp}
                  activeOpacity={0.7}>
                  <IconComponent Icon={Share2} size={24} className="text-appIcon" />
                  <Text className="text-appCardText font-appFont font-medium text-sm mt-2 text-center">
                     Paylaş
                  </Text>
               </TouchableOpacity>

               <TouchableOpacity
                  className="shadow-md border border-appBorder flex-1 mx-1 p-4 rounded-xl items-center bg-appCardBackground"
                  onPress={handleSendFeedback}
                  activeOpacity={0.7}>
                  <IconComponent Icon={Heart} size={24} className="text-appError" />
                  <Text className="text-appCardText font-appFont font-medium text-sm mt-2 text-center">
                     Geri Bildirim
                  </Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Information Sections - Otomatik tema switching */}
         {infoSections.map(section => (
            <View key={section.id} className="px-4 mb-6">
               <Text className="text-appText font-appFont font-semibold text-lg mb-4">
                  {section.title}
               </Text>

               <View className="shadow-md border border-appBorder bg-appCardBackground rounded-xl p-4">
                  {section.items.map((item, index) => {
                     const IconComponent = item.icon;

                     return (
                        <TouchableOpacity
                           key={index}
                           className={`
                              flex-row items-center justify-between py-3
                              ${index < section.items.length - 1 ? 'border-b border-appBorderColor/20' : ''}
                           `}
                           onPress={item.action}
                           disabled={!item.action}
                           activeOpacity={item.action ? 0.7 : 1}>
                           <View className="flex-row items-center flex-1">
                              {IconComponent && (
                                 <View className="mr-3">
                                    <IconComponent
                                       Icon={item.icon}
                                       size={18}
                                       className="text-appCardText"
                                    />
                                 </View>
                              )}

                              <View className="flex-1">
                                 <Text className="text-appCardText font-appFont font-medium text-base">
                                    {item.label}
                                 </Text>
                              </View>
                           </View>

                           <View className="flex-row items-center">
                              <Text
                                 className={`
                                 font-appFont text-sm mr-2
                                 ${item.action ? 'text-appButton' : 'text-appCardText/70'}
                              `}>
                                 {item.value}
                              </Text>

                              {item.action && (
                                 <IconComponent
                                    Icon={ChevronRight}
                                    size={16}
                                    className="text-appButton"
                                 />
                              )}
                           </View>
                        </TouchableOpacity>
                     );
                  })}
               </View>
            </View>
         ))}

         {/* Team Section - Otomatik tema switching */}
         <View className="px-4 mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               Geliştirici Ekibi
            </Text>

            <View className="shadow-md border border-appBorder bg-appCardBackground rounded-xl p-4">
               {teamMembers.map((member, index) => (
                  <View
                     key={member.id}
                     className={`
                        flex-row items-center py-3
                        ${index < teamMembers.length - 1 ? 'border-b border-appBorderColor/20' : ''}
                     `}>
                     <View className="w-10 h-10 rounded-full items-center justify-center mr-3 bg-appTransition">
                        <IconComponent Icon={Users} size={18} className="text-appIcon" />
                     </View>

                     <View className="flex-1">
                        <Text className="text-appCardText font-appFont font-medium text-base">
                           {member.name}
                        </Text>
                        <Text className="text-appCardText/70 font-appFont text-sm">
                           {member.role}
                        </Text>
                     </View>
                  </View>
               ))}
            </View>
         </View>

         {/* Social Media Links - Otomatik tema switching */}
         <View className="px-4 mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               Sosyal Medya
            </Text>

            <View className="flex-row justify-around">
               {socialLinks.map((social, index) => {
                  const Icon = social.icon;

                  return (
                     <TouchableOpacity
                        key={index}
                        className="shadow-md border border-appBorder flex-1 mx-1 p-4 rounded-xl items-center bg-appCardBackground"
                        onPress={() => handleSocialLink(social)}
                        activeOpacity={0.7}>
                        <IconComponent Icon={Icon} size={24} className="text-appIcon" />
                        <Text className="text-appCardText font-appFont font-medium text-sm mt-2 text-center">
                           {social.label}
                        </Text>
                     </TouchableOpacity>
                  );
               })}
            </View>
         </View>

         {/* Footer - Otomatik tema switching */}
         <View className="px-4 py-8 items-center">
            <View className="flex-row items-center justify-center mb-2">
               <Text className="text-appIcon font-appFont text-center text-base">Made with </Text>
               <IconComponent Icon={Heart} size={16} className="text-appError" />
               <Text className="text-appIcon font-appFont text-center text-base"> in Istanbul</Text>
            </View>

            <Text className="text-appPlaceholder font-appFont text-center text-sm">
               © 2025 MyApp Technologies. Tüm hakları saklıdır.
            </Text>

            <TouchableOpacity className="mt-4" onPress={handleAcknowledments}>
               <Text className="text-appButton font-appFont font-medium">
                  Teşekkürler & Kaynaklar →
               </Text>
            </TouchableOpacity>
         </View>
      </ScrollView>
   );
};

export default AboutScreen;
