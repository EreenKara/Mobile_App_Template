import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@navigation/NavigationTypes';
import ButtonComponent from '@mycomponents/Button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '@contexts/store';
import { Star, MessageCircle } from 'lucide-react-native';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
   const { darkMode, language } = useSelector((state: RootState) => state.settings);
   return (
      <View className="flex-1 bg-appBackground p-4">
         {/* Header */}
         <View className="mb-6">
            <Text className="text-appText font-appFont font-bold text-2xl sm:text-3xl">
               Ana Sayfa
            </Text>
            <Text className="text-appIcon font-appFont text-base sm:text-lg mt-1">
               Hoş geldiniz
            </Text>
         </View>

         {/* Welcome Card */}
         <View
            className="bg-appCardBackground rounded-xl p-6 mb-6"
            style={{
               shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
               elevation: 2,
               borderWidth: 1,
               borderColor: 'rgb(var(--color-app-border))',
            }}>
            <View className="flex-row items-center">
               <Image
                  source={require('@assets/images/nav_logo.png')}
                  style={{
                     width: 50,
                     height: 50,
                     tintColor: 'rgb(var(--color-app-icon))',
                     marginRight: 16,
                  }}
                  resizeMode="contain"
               />

               <View className="flex-1">
                  <Text className="text-appCardText font-appFont font-semibold text-lg">
                     Merhaba!
                  </Text>
                  <Text className="text-appCardText/70 font-appFont text-sm mt-1">
                     Uygulamaya hoş geldiniz
                  </Text>
               </View>
            </View>
         </View>

         {/* Action Buttons */}
         <View className="mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               Hızlı İşlemler
            </Text>

            <View className="space-y-3">
               <ButtonComponent
                  title="Birincil Aksiyon"
                  variant="primary"
                  size="medium"
                  fullWidth
                  onPress={() => console.log('Birincil aksiyon')}
               />

               <ButtonComponent
                  title="İkincil Aksiyon"
                  variant="secondary"
                  size="medium"
                  fullWidth
                  onPress={() => console.log('İkincil aksiyon')}
               />

               <ButtonComponent
                  title="Outline Aksiyon"
                  variant="outlined"
                  size="medium"
                  fullWidth
                  onPress={() => console.log('Outline aksiyon')}
               />
            </View>
         </View>

         {/* Sample Cards */}
         <View className="mb-6">
            <Text className="text-appText font-appFont font-semibold text-lg mb-4">
               Örnek Kartlar
            </Text>

            <View className="space-y-3">
               {[1, 2, 3].map((item, index) => (
                  <TouchableOpacity
                     key={index}
                     className="bg-appCardBackground rounded-xl p-4"
                     style={{
                        shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                        elevation: 1,
                        borderWidth: 1,
                        borderColor: 'rgb(var(--color-app-border))',
                     }}
                     activeOpacity={0.7}>
                     <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-full bg-appTransition items-center justify-center mr-3">
                           <Star size={20} color="rgb(var(--color-app-icon))" strokeWidth={2} />
                        </View>

                        <View className="flex-1">
                           <Text className="text-appCardText font-appFont font-semibold text-base">
                              Kart Başlığı {item}
                           </Text>
                           <Text className="text-appCardText/70 font-appFont text-sm mt-1">
                              Kart açıklaması burada yer alır
                           </Text>
                        </View>

                        <TouchableOpacity className="p-2">
                           <MessageCircle
                              size={20}
                              color="rgb(var(--color-app-icon))"
                              strokeWidth={2}
                           />
                        </TouchableOpacity>
                     </View>
                  </TouchableOpacity>
               ))}
            </View>
         </View>

         {/* Footer */}
         <View className="items-center py-4">
            <Text className="text-appPlaceholder font-appFont text-sm text-center">
               Template Home Screen
            </Text>
         </View>
      </View>
   );
};

export default HomeScreen;
