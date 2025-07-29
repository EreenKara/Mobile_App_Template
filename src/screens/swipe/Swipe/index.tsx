import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, Alert, StatusBar, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import Swiper from 'react-native-deck-swiper';

// Components
import GameSwiper from '@screens/swipe/Swipe/GameSwiper';
import SwipeButtons from '@screens/swipe/Swipe/SwipeButtons';
import { useTailwindColors } from '@styles/tailwind.colors';
import { GameProfile } from '@apptypes/entities/gameProfile';

// Screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Props {}

const GameMatcherScreen: React.FC<Props> = () => {
   const dispatch = useDispatch();
   const swiperRef = useRef<Swiper<GameProfile>>(null);
   const [cardIndex, setCardIndex] = useState(0);
   const [matches, setMatches] = useState<GameProfile[]>([]);
   const tailwindColors = useTailwindColors();

   // Status bar height
   const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;

   // Swiper height calculation
   const headerHeight = 80; // Header yaklaşık yüksekliği
   const actionButtonsHeight = 120; // Action buttons yaklaşık yüksekliği
   const swiperHeight = screenHeight - statusBarHeight - headerHeight - actionButtonsHeight;

   // Button colors state
   const [color, setColor] = useState<{ like: string; pass: string; superLike: string }>({
      like: tailwindColors.appTransition,
      pass: tailwindColors.appTransition,
      superLike: tailwindColors.appTransition,
   });

   // Mock gaming profiles data
   const [profiles] = useState<GameProfile[]>([
      {
         id: 1,
         name: 'Alex',
         age: 24,
         avatar: require('@assets/images/on-time.png'),
         location: 'İstanbul',
         favoriteGames: ['Valorant', 'CS2', 'League of Legends'],
         rank: 'Diamond',
         gameLevel: 'Pro',
         bio: 'Competitive FPS oyuncusu. Takım arıyorum!',
         isOnline: true,
         skillRating: 85,
         achievements: 42,
         playtime: '2.5k saat',
      },
      {
         id: 2,
         name: 'Maya',
         age: 22,
         avatar: require('@assets/images/on-time.png'),
         location: 'Ankara',
         favoriteGames: ['Apex Legends', 'Overwatch 2', 'Rocket League'],
         rank: 'Master',
         gameLevel: 'Hardcore',
         bio: 'Battle Royale sevdalısı. Eğlenceli oyunlar için yazın!',
         isOnline: false,
         skillRating: 92,
         achievements: 67,
         playtime: '3.1k saat',
      },
      {
         id: 3,
         name: 'Eren',
         age: 26,
         avatar: require('@assets/images/on-time.png'),
         location: 'İzmir',
         favoriteGames: ['Dota 2', 'World of Warcraft', 'Cyberpunk 2077'],
         rank: 'Immortal',
         gameLevel: 'Elite',
         bio: 'MOBA oyunlarında ustayım. Stratejik oyunlar benim işim!',
         isOnline: true,
         skillRating: 96,
         achievements: 89,
         playtime: '4.2k saat',
      },
      {
         id: 4,
         name: 'Zeynep',
         age: 21,
         avatar: require('@assets/images/on-time.png'),
         location: 'Bursa',
         favoriteGames: ['Among Us', 'Fall Guys', 'Minecraft'],
         rank: 'Gold',
         gameLevel: 'Casual',
         bio: 'Eğlenceli ve sosyal oyunları seviyorum. Beraber vakit geçirelim!',
         isOnline: true,
         skillRating: 72,
         achievements: 28,
         playtime: '1.8k saat',
      },
      {
         id: 5,
         name: 'Mehmet',
         age: 28,
         avatar: require('@assets/images/on-time.png'),
         location: 'Antalya',
         favoriteGames: ['FIFA 24', 'NBA 2K24', 'Forza Horizon'],
         rank: 'Champion',
         gameLevel: 'Competitive',
         bio: 'Spor oyunları tutkunu. Turnuva arkadaşı arıyorum!',
         isOnline: false,
         skillRating: 88,
         achievements: 54,
         playtime: '2.9k saat',
      },
   ]);

   // Swipe handlers
   const onSwipedLeft = (cardIndex: number) => {
      console.log('Passed:', profiles[cardIndex].name);
   };

   const onSwipedRight = (cardIndex: number) => {
      const profile = profiles[cardIndex];
      console.log('Liked:', profile.name);

      // Simulate match (50% chance)
      if (Math.random() > 0.5) {
         setMatches(prev => [...prev, profile]);
         Alert.alert(
            '🎮 Match!',
            `${profile.name} ile eşleştiniz! Artık sohbet edip oyun planlayabilirsiniz.`,
            [{ text: 'Harika!', style: 'default' }],
         );
      }
   };

   const onSwipedAll = () => {
      Alert.alert('✨ Tüm Profiller Tamamlandı', 'Yeni oyuncu profillerini yakında ekleyeceğiz!', [
         { text: 'Tamam', style: 'default' },
      ]);
   };

   // Swipe progress handlers
   const onSwipingLeft = (percent: number) => {
      // Sola kaydırma ilerledikçe pass buton rengini değiştir
      const intensity = Math.abs(percent) / 100;
      if (intensity > 0.2) {
         // %20'dan fazla kaydırıldığında renk değişsin
         setColor(prev => ({
            ...prev,
            pass: tailwindColors.appError,
         }));
      } else {
         setColor(prev => ({
            ...prev,
            pass: tailwindColors.appTransition,
         }));
      }
   };

   const onSwipingRight = (percent: number) => {
      // Sağa kaydırma ilerledikçe like buton rengini değiştir
      const intensity = Math.abs(percent) / 100;
      if (intensity > 0.2) {
         // %20'dan fazla kaydırıldığında renk değişsin
         setColor(prev => ({
            ...prev,
            like: tailwindColors.appButton,
         }));
      } else {
         setColor(prev => ({
            ...prev,
            like: tailwindColors.appTransition,
         }));
      }
   };

   const handleSwiping = (x: number, y: number) => {
      // x > 0 sağa, x < 0 sola kaydırma
      const percent = (x / (screenWidth * 0.4)) * 100; // Normalized percentage

      if (x > 50) {
         // Sağa kaydırma
         onSwipingRight(Math.abs(percent));
      } else if (x < -50) {
         // Sola kaydırma
         onSwipingLeft(Math.abs(percent));
      } else {
         // Neutral position - renkleri normale döndür
         setColor({
            like: tailwindColors.appTransition,
            pass: tailwindColors.appTransition,
            superLike: tailwindColors.appTransition,
         });
      }
   };

   const handleSwipedAborted = () => {
      // Swipe iptal edildiğinde renkleri normale döndür
      setColor({
         like: tailwindColors.appTransition,
         pass: tailwindColors.appTransition,
         superLike: tailwindColors.appTransition,
      });
   };

   // Manual swipe functions
   const swipeLeft = () => {
      swiperRef.current?.swipeLeft();
   };

   const swipeRight = () => {
      swiperRef.current?.swipeRight();
   };

   const resetStack = () => {
      swiperRef.current?.jumpToCardIndex(0);
      setCardIndex(0);
   };

   // Button press handlers
   const handlePassPressIn = () => {
      setColor(prev => ({
         ...prev,
         pass: tailwindColors.appError,
      }));
   };

   const handlePassPressOut = () => {
      setColor(prev => ({
         ...prev,
         pass: tailwindColors.appTransition,
      }));
   };

   const handleLikePressIn = () => {
      setColor(prev => ({
         ...prev,
         like: tailwindColors.appButton,
      }));
   };

   const handleLikePressOut = () => {
      setColor(prev => ({
         ...prev,
         like: tailwindColors.appTransition,
      }));
   };

   const handleSuperLikePressIn = () => {
      setColor(prev => ({
         ...prev,
         superLike: tailwindColors.appWarning,
      }));
   };

   const handleSuperLikePressOut = () => {
      setColor(prev => ({
         ...prev,
         superLike: tailwindColors.appTransition,
      }));
   };

   return (
      <View className="flex-1 bg-appBackground" style={{ paddingTop: statusBarHeight }}>
         <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

         {/* Header */}
         <View className="px-6 py-4 border-b border-appBorderColor/20">
            <Text className="text-appText font-bold text-2xl text-center">🎮 Game Matcher</Text>
            <Text className="text-appIcon text-center mt-1">
               Oyuncu arkadaşını bul! ({matches.length} eşleşme)
            </Text>
         </View>

         {/* Swiper Container */}
         <GameSwiper
            ref={swiperRef}
            profiles={profiles}
            onSwipedLeft={onSwipedLeft}
            onSwipedRight={onSwipedRight}
            onSwipedAll={onSwipedAll}
            onSwiping={handleSwiping}
            onSwipedAborted={handleSwipedAborted}
            onResetStack={resetStack}
            swiperHeight={swiperHeight}
            cardIndex={cardIndex}
         />

         {/* Action Buttons */}
         <SwipeButtons
            onSwipeLeft={swipeLeft}
            onSwipeRight={swipeRight}
            colors={color}
            onPassPressIn={handlePassPressIn}
            onPassPressOut={handlePassPressOut}
            onLikePressIn={handleLikePressIn}
            onLikePressOut={handleLikePressOut}
            onSuperLikePressIn={handleSuperLikePressIn}
            onSuperLikePressOut={handleSuperLikePressOut}
         />
      </View>
   );
};

export default GameMatcherScreen;
