import React, { useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import ImageComponent from '@mycomponents/Image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@navigation/NavigationTypes';
import ButtonComponent from '@mycomponents/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@contexts/store';
import { Star, MessageCircle } from 'lucide-react-native';
import { toggleDarkMode } from '@contexts/slices/settings/settingsSlice';
import IconComponent from '@mycomponents/LucidImage';
import { colorScheme } from 'nativewind';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
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
         <View className="bg-appCardBackground rounded-xl p-6 mb-6 border border-appBorderColor shadow-md">
            <View className="flex-row items-center">
               <ImageComponent
                  source={require('@assets/images/nav_logo.png')}
                  className="w-12 h-12 mr-4 text-appIcon"
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
