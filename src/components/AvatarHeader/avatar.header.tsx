import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { User, Settings, MoreHorizontal, Edit3, Camera } from 'lucide-react-native';
import NotificationBellComponent from '@components/NotificationBell/notification.bell';
import { UserProfile as UserType, Notification } from '@apptypes/index';
import ImageComponent from '@mycomponents/Image';
import IconComponent from '@mycomponents/LucidImage';

interface AvatarHeaderComponentProps {
   user?: UserType;
   notifications: Notification[];
   onAvatarPress?: () => void;
   onEditPress?: () => void;
   onSettingsPress?: () => void;
   onNotificationPress?: (notification: Notification, index: number) => void;
   onMarkAllRead?: () => void;
   onClearAll?: () => void;
   variant?: 'default' | 'compact' | 'detailed';
   size?: 'small' | 'medium' | 'large';
   showNotifications?: boolean;
   showEditButton?: boolean;
   showSettingsButton?: boolean;
   className?: string;
}

const AvatarHeaderComponent: React.FC<AvatarHeaderComponentProps> = ({
   user,
   notifications,
   onAvatarPress,
   onEditPress,
   onSettingsPress,
   onNotificationPress,
   onMarkAllRead,
   onClearAll,
   variant = 'default',
   size = 'medium',
   showNotifications = true,
   showEditButton = false,
   showSettingsButton = false,
   className = '',
}) => {
   const [showActions, setShowActions] = useState(false);

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'p-3 sm:p-4',
         avatar: 60,
         spacing: 'ml-3 sm:ml-4',
         name: 'text-lg sm:text-xl',
         email: 'text-sm sm:text-base',
         iconSize: 18,
         buttonSize: 'w-8 h-8',
      },
      medium: {
         container: 'p-4 sm:p-5',
         avatar: 80,
         spacing: 'ml-4 sm:ml-5',
         name: 'text-xl sm:text-2xl',
         email: 'text-base sm:text-lg',
         iconSize: 20,
         buttonSize: 'w-10 h-10',
      },
      large: {
         container: 'p-5 sm:p-6',
         avatar: 100,
         spacing: 'ml-5 sm:ml-6',
         name: 'text-2xl sm:text-3xl',
         email: 'text-lg sm:text-xl',
         iconSize: 24,
         buttonSize: 'w-12 h-12',
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         container: 'bg-appBackground border-b border-appBorderColor/20',
         textColor: 'text-appText',
         subtitleColor: 'text-appText',
      },
      compact: {
         container: 'bg-appCardBackground rounded-xl',
         textColor: 'text-appCardText',
         subtitleColor: 'text-appText/70',
      },
      detailed: {
         container: 'bg-appTransition rounded-xl',
         textColor: 'text-appText',
         subtitleColor: 'text-appText',
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   // Get user initials for fallback
   const getUserInitials = (user?: UserType) => {
      if (!user) return 'U';
      const firstName = user.name || '';
      const lastName = user.surname || '';
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
   };

   // Handle avatar press
   const handleAvatarPress = () => {
      if (onAvatarPress) {
         onAvatarPress();
      } else {
         setShowActions(!showActions);
      }
   };

   return (
      <View
         className={`
      flex-row items-center justify-between
      ${currentSize.container}
      ${currentVariant.container}
      ${className}
      ${variant === 'compact' || variant === 'detailed' ? 'border border-appBorderColor shadow-md' : ''}
    `}>
         {/* Left Section - Avatar & Info */}
         <View className="flex-row items-center flex-1">
            {/* Avatar */}
            <TouchableOpacity
               onPress={handleAvatarPress}
               className="relative border border-appBorderColor rounded-full"
               activeOpacity={0.7}>
               {user?.image ? (
                  <ImageComponent
                     source={{ uri: user.image }}
                     className="bg-appTransition rounded-full w-10 h-10"
                  />
               ) : (
                  <View
                     style={{
                        width: currentSize.avatar,
                        height: currentSize.avatar,
                        borderRadius: currentSize.avatar / 2,
                     }}
                     className="bg-appTransition items-center justify-center">
                     <Text
                        className={`
                text-appText font-appFont font-bold
                ${size === 'small' ? 'text-xl' : size === 'medium' ? 'text-2xl' : 'text-3xl'}
              `}>
                        {getUserInitials(user)}
                     </Text>
                  </View>
               )}

               {/* Camera overlay on avatar */}
               {showActions && (
                  <View
                     className="absolute inset-0 rounded-full bg-appTransparentColor/50 items-center justify-center"
                     style={{ borderRadius: currentSize.avatar / 2 }}>
                     <Camera size={currentSize.iconSize} color="white" strokeWidth={2} />
                  </View>
               )}
            </TouchableOpacity>

            {/* User Info */}
            <View className={`flex-1 ${currentSize.spacing}`}>
               <Text
                  className={`
            font-appFont font-bold
            ${currentSize.name}
            ${currentVariant.textColor}
          `}>
                  {user?.name || 'Kullanıcı'} {user?.surname || ''}
               </Text>

               <Text
                  className={`
            font-appFont mt-1
            ${currentSize.email}
            ${currentVariant.subtitleColor}
          `}>
                  {user?.email || 'Email bulunamadı'}
               </Text>

               {/* Additional Info for detailed variant */}
               {variant === 'detailed' && (
                  <View className="flex-row items-center mt-2">
                     <View className="flex-row items-center mr-4">
                        <IconComponent Icon={User} className="text-appText" size={14} />
                        <Text className="text-appText font-appFont text-sm ml-1">Kullanıcı</Text>
                     </View>

                     <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-appButton mr-2" />
                        <Text className="text-appButton font-appFont text-sm">Aktif</Text>
                     </View>
                  </View>
               )}
            </View>
         </View>

         {/* Right Section - Actions */}
         <View className="flex-row items-center space-x-2">
            {/* Edit Button */}
            {showEditButton && (
               <TouchableOpacity
                  onPress={onEditPress}
                  className={`
              ${currentSize.buttonSize} rounded-lg bg-appTransition items-center justify-center
            `}
                  activeOpacity={0.7}>
                  <IconComponent
                     Icon={Edit3}
                     className="text-appText"
                     size={currentSize.iconSize}
                  />
               </TouchableOpacity>
            )}

            {/* Settings Button */}
            {showSettingsButton && (
               <TouchableOpacity
                  onPress={onSettingsPress}
                  className={`
              ${currentSize.buttonSize} rounded-lg bg-appTransition items-center justify-center
            `}
                  activeOpacity={0.7}>
                  <IconComponent
                     Icon={Settings}
                     className="text-appText"
                     size={currentSize.iconSize}
                  />
               </TouchableOpacity>
            )}

            {/* Notification Bell */}
            {showNotifications && (
               <NotificationBellComponent
                  notifications={notifications}
                  size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
                  variant="header"
                  onNotificationPress={onNotificationPress}
                  onMarkAllRead={onMarkAllRead}
                  onClearAll={onClearAll}
               />
            )}

            {/* More Actions */}
            {variant === 'detailed' && (
               <TouchableOpacity
                  onPress={() => setShowActions(!showActions)}
                  className={`
              ${currentSize.buttonSize} rounded-lg bg-appTransition items-center justify-center
            `}
                  activeOpacity={0.7}>
                  <IconComponent
                     Icon={MoreHorizontal}
                     className="text-appIcon"
                     size={currentSize.iconSize}
                  />
               </TouchableOpacity>
            )}
         </View>

         {/* Action Menu */}
         {showActions && (
            <View className="absolute top-full right-0 mt-2 bg-appCardBackground rounded-xl p-2 z-10 shadow-md">
               <TouchableOpacity
                  onPress={() => {
                     onEditPress?.();
                     setShowActions(false);
                  }}
                  className="flex-row items-center p-3 rounded-lg"
                  activeOpacity={0.7}>
                  <IconComponent Icon={Edit3} className="text-appCardText" size={16} />
                  <Text className="text-appCardText font-appFont ml-2">Profili Düzenle</Text>
               </TouchableOpacity>

               <TouchableOpacity
                  onPress={() => {
                     onSettingsPress?.();
                     setShowActions(false);
                  }}
                  className="flex-row items-center p-3 rounded-lg"
                  activeOpacity={0.7}>
                  <IconComponent Icon={Settings} className="text-appCardText" size={16} />
                  <Text className="text-appCardText font-appFont ml-2">Ayarlar</Text>
               </TouchableOpacity>
            </View>
         )}
      </View>
   );
};

export default AvatarHeaderComponent;
