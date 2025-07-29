import React, { forwardRef } from 'react';
import { View, Dimensions, Alert, Text } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Trophy, Zap, Gamepad, MapPin, Users, RotateCcw } from 'lucide-react-native';

// Components
import ImageComponent from '@mycomponents/Image';
import IconComponent from '@mycomponents/LucidImage';
import ButtonComponent from '@mycomponents/Button/Button';

// Types
import { GameProfile } from '@apptypes/entities/gameProfile';

interface GameSwiperProps {
   profiles: GameProfile[];
   onSwipedLeft: (cardIndex: number) => void;
   onSwipedRight: (cardIndex: number) => void;
   onSwipedAll: () => void;
   onSwiping: (x: number, y: number) => void;
   onSwipedAborted: () => void;
   onResetStack: () => void;
   swiperHeight: number;
   cardIndex: number;
}

const GameSwiper = forwardRef<Swiper<GameProfile>, GameSwiperProps>(
   (
      {
         profiles,
         onSwipedLeft,
         onSwipedRight,
         onSwipedAll,
         onSwiping,
         onSwipedAborted,
         onResetStack,
         swiperHeight,
         cardIndex,
      },
      ref,
   ) => {
      const { width: screenWidth } = Dimensions.get('window');

      // Render single profile card
      const renderCard = (profile: GameProfile) => {
         if (!profile) return null;

         return (
            <View
               className="bg-appCardBackground rounded-3xl shadow-xl mx-4 border border-appBorderColor"
               style={{ height: swiperHeight - 40 }}>
               {/* Profile Image */}
               <View className="relative">
                  <ImageComponent
                     source={profile.avatar}
                     className="w-full h-80 rounded-t-3xl"
                     resizeMode="cover"
                  />

                  {/* Online Status */}
                  <View
                     className={`absolute top-4 left-4 flex-row items-center px-3 py-1 rounded-full ${
                        profile.isOnline ? 'bg-green-500' : 'bg-gray-500'
                     }`}>
                     <View
                        className={`w-2 h-2 rounded-full mr-2 ${
                           profile.isOnline ? 'bg-white' : 'bg-gray-300'
                        }`}
                     />
                     <Text className="text-white text-sm font-medium">
                        {profile.isOnline ? 'Online' : 'Offline'}
                     </Text>
                  </View>

                  {/* Skill Rating */}
                  <View className="absolute bottom-4 left-4 bg-appButton px-3 py-1 rounded-full">
                     <Text className="text-appButtonText font-bold text-sm">
                        {profile.skillRating}/100
                     </Text>
                  </View>
               </View>

               {/* Profile Info */}
               <View className="p-6">
                  {/* Name & Age */}
                  <View className="flex-row items-center justify-between mb-3">
                     <Text className="text-appCardText font-bold text-2xl">
                        {profile.name}, {profile.age}
                     </Text>
                     <View className="flex-row items-center">
                        <IconComponent Icon={MapPin} size={16} className="text-appIcon" />
                        <Text className="text-appIcon text-sm ml-1">{profile.location}</Text>
                     </View>
                  </View>

                  {/* Game Level & Rank */}
                  <View className="flex-row items-center justify-between mb-4">
                     <View className="bg-appTransition px-3 py-1 rounded-full">
                        <Text className="text-appText font-medium text-sm">
                           {profile.gameLevel}
                        </Text>
                     </View>
                     <View className="bg-appButton px-3 py-1 rounded-full">
                        <Text className="text-appButtonText font-bold text-sm">{profile.rank}</Text>
                     </View>
                  </View>

                  {/* Stats */}
                  <View className="flex-row justify-between mb-4">
                     <View className="items-center">
                        <IconComponent Icon={Trophy} size={20} className="text-yellow-500" />
                        <Text className="text-appCardText font-bold text-lg">
                           {profile.achievements}
                        </Text>
                        <Text className="text-appIcon text-xs">Başarım</Text>
                     </View>
                     <View className="items-center">
                        <IconComponent Icon={Zap} size={20} className="text-blue-500" />
                        <Text className="text-appCardText font-bold text-lg">
                           {profile.skillRating}
                        </Text>
                        <Text className="text-appIcon text-xs">Skill</Text>
                     </View>
                     <View className="items-center">
                        <IconComponent Icon={Gamepad} size={20} className="text-green-500" />
                        <Text className="text-appCardText font-bold text-lg">
                           {profile.playtime}
                        </Text>
                        <Text className="text-appIcon text-xs">Süre</Text>
                     </View>
                  </View>

                  {/* Bio */}
                  <Text className="text-appCardText text-base mb-4 line-height-6">
                     {profile.bio}
                  </Text>

                  {/* Favorite Games */}
                  <Text className="text-appIcon font-medium text-sm mb-2">Favori Oyunlar:</Text>
                  <View className="flex-row flex-wrap">
                     {profile.favoriteGames.map((game, index) => (
                        <View
                           key={index}
                           className="bg-appTransition px-3 py-1 rounded-full mr-2 mb-2">
                           <Text className="text-appText text-sm">{game}</Text>
                        </View>
                     ))}
                  </View>
               </View>
            </View>
         );
      };

      // Render no more cards
      const renderNoMoreCards = () => (
         <View className="flex-1 items-center justify-center p-8">
            <IconComponent Icon={Users} size={80} className="text-appIcon mb-4" />
            <Text className="text-appText font-bold text-2xl text-center mb-3">
               Tüm Profiller Tamamlandı!
            </Text>
            <Text className="text-appIcon text-center text-lg mb-6">
               Yeni oyuncular yakında eklenecek. Tekrar dene veya ayarlarını güncelle.
            </Text>
            <ButtonComponent
               title="Yeniden Başla"
               onPress={onResetStack}
               leftIcon={
                  <IconComponent Icon={RotateCcw} size={20} className="text-appButtonText" />
               }
            />
         </View>
      );

      return (
         <View style={{ height: swiperHeight }}>
            <Swiper
               ref={ref}
               cards={profiles}
               renderCard={renderCard}
               onSwipedLeft={onSwipedLeft}
               onSwipedRight={onSwipedRight}
               onSwipedAll={onSwipedAll}
               onSwiping={onSwiping}
               onSwipedAborted={onSwipedAborted}
               onTapCard={cardIndex => {
                  console.log('Card tapped:', profiles[cardIndex]?.name);
               }}
               cardIndex={cardIndex}
               backgroundColor="#056161"
               stackSize={3}
               stackSeparation={15}
               animateOverlayLabelsOpacity
               animateCardOpacity
               swipeBackCard
               cardVerticalMargin={20}
               cardHorizontalMargin={10}
               overlayLabels={{
                  left: {
                     title: 'PASS',
                     style: {
                        label: {
                           backgroundColor: '#ef4444',
                           color: 'white',
                           fontSize: 24,
                           fontWeight: 'bold',
                           borderRadius: 10,
                           padding: 10,
                        },
                        wrapper: {
                           flexDirection: 'column',
                           alignItems: 'flex-end',
                           justifyContent: 'flex-start',
                           marginTop: 20,
                           marginLeft: -20,
                        },
                     },
                  },
                  right: {
                     title: 'LIKE',
                     style: {
                        label: {
                           backgroundColor: '#22c55e',
                           color: 'white',
                           fontSize: 24,
                           fontWeight: 'bold',
                           borderRadius: 10,
                           padding: 10,
                        },
                        wrapper: {
                           flexDirection: 'column',
                           alignItems: 'flex-start',
                           justifyContent: 'flex-start',
                           marginTop: 20,
                           marginLeft: 20,
                        },
                     },
                  },
               }}
               infinite={false}
               verticalSwipe={false}
               horizontalThreshold={50}
               verticalThreshold={100}
            />
         </View>
      );
   },
);

GameSwiper.displayName = 'GameSwiper';

export default GameSwiper;
