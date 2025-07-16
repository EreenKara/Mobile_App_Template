import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import {
   Bell,
   ChevronDown,
   ChevronUp,
   Clock,
   User,
   MessageCircle,
   AlertCircle,
   CheckCircle,
   Info,
   Star,
   Heart,
   Settings,
   Mail,
} from 'lucide-react-native';
import { Notification } from '@apptypes/index';

interface NotificationItemComponentProps {
   notification: Notification;
   onPress?: (notification: Notification) => void;
   onExpand?: (notification: Notification) => void;
   className?: string;
   size?: 'small' | 'medium' | 'large';
   showBell?: boolean;
   showArrow?: boolean;
}

const NotificationItemComponent: React.FC<NotificationItemComponentProps> = ({
   notification,
   onPress,
   onExpand,
   className = '',
   size = 'medium',
   showBell = true,
   showArrow = true,
}) => {
   const [isExpanded, setIsExpanded] = useState(false);

   // Extract notification properties
   const { message, sender, time, description, type = 'info', isRead = false } = notification;

   // Check if expandable
   const expandable = !!description;

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'p-2 sm:p-3',
         avatar: { width: 40, height: 40 },
         spacing: 'ml-2 sm:ml-3',
         title: 'text-sm sm:text-base',
         meta: 'text-xs sm:text-sm',
         iconSize: 16,
         bellSize: 14,
         arrowSize: 16,
      },
      medium: {
         container: 'p-3 sm:p-4',
         avatar: { width: 50, height: 50 },
         spacing: 'ml-3 sm:ml-4',
         title: 'text-base sm:text-lg',
         meta: 'text-sm sm:text-base',
         iconSize: 18,
         bellSize: 16,
         arrowSize: 20,
      },
      large: {
         container: 'p-4 sm:p-5',
         avatar: { width: 60, height: 60 },
         spacing: 'ml-4 sm:ml-5',
         title: 'text-lg sm:text-xl',
         meta: 'text-base sm:text-lg',
         iconSize: 20,
         bellSize: 18,
         arrowSize: 24,
      },
   };

   // Notification type configurations
   const typeConfig = {
      info: { icon: Info, color: 'rgb(var(--color-app-indicator))' },
      success: { icon: CheckCircle, color: 'rgb(var(--color-app-button))' },
      warning: { icon: AlertCircle, color: 'rgb(var(--color-app-warning))' },
      error: { icon: AlertCircle, color: 'rgb(var(--color-app-error))' },
      message: { icon: MessageCircle, color: 'rgb(var(--color-app-card-button))' },
      system: { icon: Settings, color: 'rgb(var(--color-app-icon))' },
   };

   const currentSize = sizeConfig[size];
   const currentType = typeConfig[type];
   const TypeIcon = currentType.icon;

   // Format time - string'i Date'e çevir
   const formatTime = (timeStr: string) => {
      const date = new Date(timeStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) return `${days}g önce`;
      if (hours > 0) return `${hours}s önce`;
      if (minutes > 0) return `${minutes}d önce`;
      return 'Şimdi';
   };

   // Handle expand toggle
   const handleExpand = () => {
      setIsExpanded(!isExpanded);
      onExpand?.(notification);
   };

   // Container styles
   const containerStyles = `
    flex-row items-start rounded-xl mb-3
    ${currentSize.container}
    ${isRead ? 'bg-appCardBackground' : 'bg-appCardBackground border-l-4'}
    ${className}
  `;

   return (
      <TouchableOpacity
         className={containerStyles}
         style={{
            shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
            elevation: 2,
            borderWidth: 1,
            borderColor: 'rgb(var(--color-app-border))',
            borderLeftColor: isRead ? 'rgb(var(--color-app-border))' : currentType.color,
         }}
         onPress={() => onPress?.(notification)}
         activeOpacity={0.7}>
         {/* Content Section */}
         <View className="flex-1">
            {/* Main Message */}
            <Text
               className={`
          text-appCardText font-appFont font-semibold
          ${currentSize.title}
          ${!isRead ? 'font-bold' : ''}
        `}>
               {message}
            </Text>

            {/* Sender and Time Row */}
            <View className="flex-row items-center flex-wrap mt-1">
               <View className="flex-row items-center">
                  <User
                     size={currentSize.iconSize - 2}
                     color="rgb(var(--color-app-card-text) / 0.7)"
                     strokeWidth={2}
                  />
                  <Text
                     className={`
              text-appCardText/70 font-appFont ml-1
              ${currentSize.meta}
            `}>
                     {sender.name}
                  </Text>
               </View>

               <View className="w-1 h-1 rounded-full bg-appCardText/50 mx-2" />

               <View className="flex-row items-center">
                  <Clock
                     size={currentSize.iconSize - 2}
                     color="rgb(var(--color-app-card-text) / 0.7)"
                     strokeWidth={2}
                  />
                  <Text
                     className={`
              text-appCardText/70 font-appFont ml-1
              ${currentSize.meta}
            `}>
                     {formatTime(time)}
                  </Text>
               </View>
            </View>

            {/* Expandable Description */}
            {description && (expandable ? isExpanded : true) && (
               <Text
                  className={`
            text-appCardText/60 font-appFont mt-2 leading-5
            ${currentSize.meta}
          `}>
                  {description}
               </Text>
            )}

            {/* Actions Row */}
            <View className="flex-row items-center justify-between mt-2">
               <View className="flex-row items-center">
                  <View
                     className="w-6 h-6 rounded-full items-center justify-center"
                     style={{ backgroundColor: currentType.color }}>
                     <TypeIcon size={12} color="white" strokeWidth={2} />
                  </View>

                  {showBell && (
                     <Bell
                        size={currentSize.bellSize}
                        color="rgb(var(--color-app-card-text) / 0.7)"
                        strokeWidth={2}
                        className="ml-2"
                     />
                  )}

                  {!isRead && <View className="w-2 h-2 rounded-full bg-appButton ml-2" />}
               </View>

               {/* Expand/Collapse Button */}
               {expandable && description && (
                  <TouchableOpacity
                     onPress={handleExpand}
                     className="flex-row items-center p-1"
                     activeOpacity={0.7}>
                     <Text
                        className={`
                text-appButton font-appFont font-medium mr-1
                ${currentSize.meta}
              `}>
                        {isExpanded ? 'Daha Az' : 'Daha Fazla'}
                     </Text>
                     {isExpanded ? (
                        <ChevronUp
                           size={currentSize.arrowSize}
                           color="rgb(var(--color-app-button))"
                           strokeWidth={2}
                        />
                     ) : (
                        <ChevronDown
                           size={currentSize.arrowSize}
                           color="rgb(var(--color-app-button))"
                           strokeWidth={2}
                        />
                     )}
                  </TouchableOpacity>
               )}
            </View>
         </View>

         {/* Right Arrow */}
         {showArrow && !expandable && (
            <View className="ml-2">
               <ChevronDown
                  size={currentSize.arrowSize}
                  color="rgb(var(--color-app-card-text))"
                  strokeWidth={2}
               />
            </View>
         )}
      </TouchableOpacity>
   );
};

export default NotificationItemComponent;
