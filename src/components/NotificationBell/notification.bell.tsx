import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Bell, BellRing, X, Filter, MoreVertical } from 'lucide-react-native';
import { Notification } from '@apptypes/index';
import CenteredModalComponent from '@mycomponents/Modal/CenteredModal/centered.modal';
import NotificationItemComponent from '@components/NotificationItem/notification.item';

interface NotificationBellComponentProps {
   notifications: Notification[];
   size?: 'small' | 'medium' | 'large';
   variant?: 'default' | 'header' | 'floating';
   maxBadgeCount?: number;
   onNotificationPress?: (notification: Notification, index: number) => void;
   onMarkAllRead?: () => void;
   onClearAll?: () => void;
   className?: string;
   showAnimation?: boolean;
}

const NotificationBellComponent: React.FC<NotificationBellComponentProps> = ({
   notifications,
   size = 'medium',
   variant = 'default',
   maxBadgeCount = 99,
   onNotificationPress,
   onMarkAllRead,
   onClearAll,
   className = '',
   showAnimation = true,
}) => {
   const [isOpen, setIsOpen] = useState(false);
   const [filter, setFilter] = useState<'all' | 'unread'>('all');

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'p-2',
         bell: 20,
         badge: 'w-4 h-4 text-xs',
         badgeOffset: '-top-1 -right-1',
      },
      medium: {
         container: 'p-3',
         bell: 24,
         badge: 'w-5 h-5 text-xs',
         badgeOffset: '-top-2 -right-2',
      },
      large: {
         container: 'p-4',
         bell: 28,
         badge: 'w-6 h-6 text-sm',
         badgeOffset: '-top-2 -right-2',
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         container: 'bg-appTransition rounded-lg',
         bell: 'rgb(var(--color-app-icon))',
      },
      header: {
         container: 'bg-transparent',
         bell: 'rgb(var(--color-app-icon))',
      },
      floating: {
         container: 'bg-appButton rounded-full shadow-lg',
         bell: 'rgb(var(--color-app-button-text))',
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   // Calculate notification counts
   const totalCount = notifications.length;
   const unreadCount = notifications.filter(n => !n.isRead).length;
   const displayCount = Math.min(totalCount, maxBadgeCount);

   // Filter notifications
   const filteredNotifications =
      filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

   // Badge display logic
   const badgeText = displayCount > maxBadgeCount ? `${maxBadgeCount}+` : displayCount.toString();
   const showBadge = totalCount > 0;

   // Handle notification press
   const handleNotificationPress = (notification: Notification, index: number) => {
      onNotificationPress?.(notification, index);
      setIsOpen(false);
   };

   // Modal header component
   const ModalHeader = () => (
      <View className="flex-row items-center justify-between p-4 border-b border-appBorderColor/20">
         <View className="flex-row items-center">
            <Bell size={20} color="rgb(var(--color-app-text))" strokeWidth={2} />
            <Text className="text-appText font-appFont font-semibold text-lg ml-2">
               Bildirimler
            </Text>
            {unreadCount > 0 && <View className="w-2 h-2 rounded-full bg-appButton ml-2" />}
         </View>

         <TouchableOpacity onPress={() => setIsOpen(false)} className="p-2">
            <X size={20} color="rgb(var(--color-app-icon))" strokeWidth={2} />
         </TouchableOpacity>
      </View>
   );

   // Modal filters component
   const ModalFilters = () => (
      <View className="flex-row items-center justify-between px-4 py-3 bg-appTransition">
         <View className="flex-row items-center">
            <TouchableOpacity
               className={`px-3 py-1 rounded-full mr-2 ${
                  filter === 'all' ? 'bg-appButton' : 'bg-appCardBackground'
               }`}
               onPress={() => setFilter('all')}>
               <Text
                  className={`font-appFont text-sm ${
                     filter === 'all' ? 'text-appButtonText' : 'text-appCardText'
                  }`}>
                  Tümü ({totalCount})
               </Text>
            </TouchableOpacity>

            <TouchableOpacity
               className={`px-3 py-1 rounded-full ${
                  filter === 'unread' ? 'bg-appButton' : 'bg-appCardBackground'
               }`}
               onPress={() => setFilter('unread')}>
               <Text
                  className={`font-appFont text-sm ${
                     filter === 'unread' ? 'text-appButtonText' : 'text-appCardText'
                  }`}>
                  Okunmamış ({unreadCount})
               </Text>
            </TouchableOpacity>
         </View>

         <View className="flex-row items-center">
            {unreadCount > 0 && onMarkAllRead && (
               <TouchableOpacity onPress={onMarkAllRead} className="px-3 py-1 mr-2">
                  <Text className="text-appButton font-appFont text-sm font-medium">
                     Tümünü Okundu İşaretle
                  </Text>
               </TouchableOpacity>
            )}

            <TouchableOpacity className="p-2">
               <MoreVertical size={16} color="rgb(var(--color-app-icon))" strokeWidth={2} />
            </TouchableOpacity>
         </View>
      </View>
   );

   // Empty state component
   const EmptyState = () => (
      <View className="items-center justify-center py-12">
         <Bell size={48} color="rgb(var(--color-app-placeholder))" strokeWidth={1} />
         <Text className="text-appPlaceholder font-appFont text-lg mt-4">
            {filter === 'unread' ? 'Okunmamış bildirim yok' : 'Henüz bildirim yok'}
         </Text>
         <Text className="text-appPlaceholder font-appFont text-sm mt-2 text-center">
            {filter === 'unread'
               ? 'Tüm bildirimleriniz okunmuş'
               : 'Yeni bildirimler burada görünecek'}
         </Text>
      </View>
   );

   return (
      <>
         {/* Bell Button */}
         <TouchableOpacity
            onPress={() => setIsOpen(true)}
            className={`
               relative items-center justify-center
               ${currentSize.container}
               ${currentVariant.container}
               ${className}
            `}
            style={
               variant === 'floating'
                  ? {
                       shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                       elevation: 4,
                    }
                  : undefined
            }
            activeOpacity={0.7}>
            {/* Bell Icon */}
            {showAnimation && unreadCount > 0 ? (
               <BellRing size={currentSize.bell} color={currentVariant.bell} strokeWidth={2} />
            ) : (
               <Bell size={currentSize.bell} color={currentVariant.bell} strokeWidth={2} />
            )}

            {/* Badge */}
            {showBadge && (
               <View
                  className={`
                  absolute ${currentSize.badgeOffset} ${currentSize.badge}
                  bg-appError rounded-full items-center justify-center
                  border-2 border-appBackground
               `}>
                  <Text className="text-appButtonText font-appFont font-semibold">{badgeText}</Text>
               </View>
            )}
         </TouchableOpacity>

         {/* Modal */}
         <CenteredModalComponent isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <View className="bg-appBackground rounded-xl max-h-[80%] w-full">
               {/* Header */}
               <ModalHeader />

               {/* Filters */}
               <ModalFilters />

               {/* Content */}
               <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                  {filteredNotifications.length === 0 ? (
                     <EmptyState />
                  ) : (
                     <View className="py-4">
                        {filteredNotifications.map((notification, index) => (
                           <NotificationItemComponent
                              key={index}
                              notification={notification}
                              onPress={() => handleNotificationPress(notification, index)}
                           />
                        ))}
                     </View>
                  )}
               </ScrollView>

               {/* Footer Actions */}
               {filteredNotifications.length > 0 && (
                  <View className="flex-row items-center justify-between p-4 border-t border-appBorderColor/20">
                     <Text className="text-appIcon font-appFont text-sm">
                        {filteredNotifications.length} bildirim
                     </Text>

                     {onClearAll && (
                        <TouchableOpacity
                           onPress={onClearAll}
                           className="px-4 py-2 bg-appError/10 rounded-lg">
                           <Text className="text-appError font-appFont font-medium text-sm">
                              Tümünü Temizle
                           </Text>
                        </TouchableOpacity>
                     )}
                  </View>
               )}
            </View>
         </CenteredModalComponent>
      </>
   );
};

export default NotificationBellComponent;
