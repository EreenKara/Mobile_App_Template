import React from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { Heart, X, Star } from 'lucide-react-native';

// Components
import IconComponent from '@mycomponents/LucidImage';

interface SwipeButtonsProps {
   onSwipeLeft: () => void;
   onSwipeRight: () => void;
   colors: {
      like: string;
      pass: string;
      superLike: string;
   };
   onPassPressIn: () => void;
   onPassPressOut: () => void;
   onLikePressIn: () => void;
   onLikePressOut: () => void;
   onSuperLikePressIn: () => void;
   onSuperLikePressOut: () => void;
}

const SwipeButtons: React.FC<SwipeButtonsProps> = ({
   onSwipeLeft,
   onSwipeRight,
   colors,
   onPassPressIn,
   onPassPressOut,
   onLikePressIn,
   onLikePressOut,
   onSuperLikePressIn,
   onSuperLikePressOut,
}) => {
   const handleSuperLike = () => {
      Alert.alert('Super Like!', 'Premium özellik - yakında geliyor!');
   };

   return (
      <View className="z-[1] w-full flex-row justify-center items-center p-6 space-x-8">
         {/* Pass Button */}
         <TouchableOpacity
            onPress={onSwipeLeft}
            className="relative bottom-[20px] w-24 h-24 rounded-full items-center justify-center"
            activeOpacity={0.8}
            style={{ backgroundColor: colors.pass }}
            onPressIn={onPassPressIn}
            onPressOut={onPassPressOut}>
            <IconComponent Icon={X} size={48} className="text-red-400" />
         </TouchableOpacity>

         {/* Super Like Button */}
         <TouchableOpacity
            onPress={handleSuperLike}
            onPressIn={onSuperLikePressIn}
            onPressOut={onSuperLikePressOut}
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.superLike }}
            activeOpacity={0.8}>
            <IconComponent Icon={Star} size={28} className="text-blue-500" />
         </TouchableOpacity>

         {/* Like Button */}
         <TouchableOpacity
            onPress={onSwipeRight}
            className="relative bottom-[20px] w-24 h-24 rounded-full items-center justify-center"
            activeOpacity={0.8}
            style={{ backgroundColor: colors.like }}
            onPressIn={onLikePressIn}
            onPressOut={onLikePressOut}>
            <IconComponent Icon={Heart} size={48} className="text-green-500" />
         </TouchableOpacity>
      </View>
   );
};

export default SwipeButtons;
