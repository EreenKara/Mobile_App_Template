// components/ShoppingCart/ShoppingCart.tsx
import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import {
   ShoppingCart,
   Plus,
   Minus,
   Trash2,
   Package,
   CreditCard,
   TrendingUp,
   Tag,
} from 'lucide-react-native';

export interface CartItem {
   id: string | number;
   name: string;
   price: number;
   quantity: number;
   image?: string;
   discount?: number;
   category?: string;
}

interface ShoppingCartComponentProps {
   // Price & Items
   totalPrice: number;
   itemCount?: number;
   items?: CartItem[];
   currency?: string;
   showCurrency?: boolean;

   // Styling
   variant?: 'default' | 'compact' | 'card' | 'minimal' | 'badge';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   disabled?: boolean;

   // Display Options
   showIcon?: boolean;
   showItemCount?: boolean;
   showTotalText?: boolean;
   showDiscountInfo?: boolean;
   icon?: React.ReactNode;

   // Interactive Features
   interactive?: boolean;
   onPress?: () => void;
   onItemAdd?: (item: CartItem) => void;
   onItemRemove?: (item: CartItem) => void;
   onItemDelete?: (item: CartItem) => void;
   onClearCart?: () => void;

   // Animation
   animateOnChange?: boolean;

   // Price Display
   priceFormat?: 'decimal' | 'abbreviated' | 'currency';
   decimalPlaces?: number;
   showOriginalPrice?: boolean; // Show price before discount

   // Layout
   layout?: 'horizontal' | 'vertical' | 'icon-only';
   alignment?: 'left' | 'center' | 'right';

   // Discount & Promotions
   discount?: number; // percentage
   discountAmount?: number; // fixed amount
   promotionText?: string;

   // Status
   isEmpty?: boolean;
   loading?: boolean;
   error?: string;
}

const ShoppingCartComponent: React.FC<ShoppingCartComponentProps> = ({
   // Price & Items
   totalPrice = 0,
   itemCount = 0,
   items = [],
   currency = '₺',
   showCurrency = true,

   // Styling
   variant = 'default',
   size = 'medium',
   className = '',
   disabled = false,

   // Display Options
   showIcon = true,
   showItemCount = false,
   showTotalText = true,
   showDiscountInfo = false,
   icon,

   // Interactive Features
   interactive = false,
   onPress,
   onItemAdd,
   onItemRemove,
   onItemDelete,
   onClearCart,

   // Animation
   animateOnChange = true,

   // Price Display
   priceFormat = 'decimal',
   decimalPlaces = 2,
   showOriginalPrice = false,

   // Layout
   layout = 'horizontal',
   alignment = 'left',

   // Discount & Promotions
   discount = 0,
   discountAmount = 0,
   promotionText,

   // Status
   isEmpty = false,
   loading = false,
   error,
}) => {
   // Size configurations
   const sizeConfig = {
      small: {
         container: 'px-2 py-1 rounded-lg',
         icon: 16,
         text: 'text-sm',
         badge: 'w-4 h-4 text-xs',
         gap: 'gap-1',
      },
      medium: {
         container: 'px-3 py-2 rounded-xl',
         icon: 20,
         text: 'text-base',
         badge: 'w-5 h-5 text-xs',
         gap: 'gap-2',
      },
      large: {
         container: 'px-4 py-3 rounded-2xl',
         icon: 24,
         text: 'text-lg',
         badge: 'w-6 h-6 text-sm',
         gap: 'gap-3',
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         container: 'bg-appBackground border border-appBorderColor',
         text: 'text-appText',
         icon: 'rgb(var(--color-app-icon))',
         badge: 'bg-appButton text-appButtonText',
         shadow: false,
      },
      compact: {
         container: 'bg-appTransition',
         text: 'text-appText',
         icon: 'rgb(var(--color-app-icon))',
         badge: 'bg-appButton text-appButtonText',
         shadow: false,
      },
      card: {
         container: 'bg-appCardBackground border border-appBorderColor',
         text: 'text-appCardText',
         icon: 'rgb(var(--color-app-icon))',
         badge: 'bg-appButton text-appButtonText',
         shadow: true,
      },
      minimal: {
         container: 'bg-transparent',
         text: 'text-appText',
         icon: 'rgb(var(--color-app-icon))',
         badge: 'bg-appButton text-appButtonText',
         shadow: false,
      },
      badge: {
         container: 'bg-appButton',
         text: 'text-appButtonText',
         icon: 'rgb(var(--color-app-button-text))',
         badge: 'bg-appBackground text-appText',
         shadow: true,
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   // Layout configurations
   const layoutConfig = {
      horizontal: 'flex-row items-center',
      vertical: 'flex-col items-center',
      'icon-only': 'flex-row items-center justify-center',
   };

   // Alignment configurations
   const alignmentConfig = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
   };

   // Calculate derived values
   const calculatedValues = useMemo(() => {
      const originalPrice = totalPrice + (discountAmount || 0);
      const finalDiscount = discountAmount || totalPrice * (discount / 100);
      const hasDiscount = discount > 0 || discountAmount > 0;
      const actualItemCount = itemCount || items.length;
      const hasItems = actualItemCount > 0;

      return {
         originalPrice,
         finalDiscount,
         hasDiscount,
         actualItemCount,
         hasItems,
      };
   }, [totalPrice, discount, discountAmount, itemCount, items.length]);

   // Format price based on format type
   const formatPrice = useCallback(
      (price: number): string => {
         const absPrice = Math.abs(price);

         switch (priceFormat) {
            case 'abbreviated':
               if (absPrice >= 1000000) {
                  return `${(price / 1000000).toFixed(1)}M`;
               } else if (absPrice >= 1000) {
                  return `${(price / 1000).toFixed(1)}K`;
               }
               return price.toFixed(decimalPlaces);

            case 'currency':
               return new Intl.NumberFormat('tr-TR', {
                  style: 'currency',
                  currency: 'TRY',
                  minimumFractionDigits: decimalPlaces,
                  maximumFractionDigits: decimalPlaces,
               }).format(price);

            case 'decimal':
            default:
               return price.toFixed(decimalPlaces);
         }
      },
      [priceFormat, decimalPlaces],
   );

   // Render icon
   const renderIcon = () => {
      if (!showIcon) return null;

      if (icon) return icon;

      if (isEmpty) {
         return <Package size={currentSize.icon} color={currentVariant.icon} strokeWidth={2} />;
      }

      return <ShoppingCart size={currentSize.icon} color={currentVariant.icon} strokeWidth={2} />;
   };

   // Render item count badge
   const renderItemCountBadge = () => {
      if (!showItemCount || calculatedValues.actualItemCount === 0) return null;

      return (
         <View
            className={`
          absolute -top-1 -right-1
          ${currentVariant.badge}
          ${currentSize.badge}
          rounded-full
          items-center justify-center
          min-w-[16px] min-h-[16px]
        `}
            style={
               currentVariant.shadow
                  ? {
                       shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                       elevation: 2,
                    }
                  : undefined
            }>
            <Text
               className={`font-appFont font-bold ${currentSize.badge.includes('text-xs') ? 'text-xs' : 'text-sm'}`}
               style={{
                  color: currentVariant.badge.includes('text-appButtonText')
                     ? 'rgb(var(--color-app-button-text))'
                     : 'rgb(var(--color-app-text))',
               }}>
               {calculatedValues.actualItemCount > 99 ? '99+' : calculatedValues.actualItemCount}
            </Text>
         </View>
      );
   };

   // Render price display
   const renderPriceDisplay = () => {
      if (!showTotalText && layout === 'icon-only') return null;

      return (
         <View className={layout === 'vertical' ? 'items-center' : ''}>
            {/* Main Price */}
            <View className="flex-row items-center">
               {showOriginalPrice && calculatedValues.hasDiscount && (
                  <Text
                     className={`
                ${currentVariant.text} font-appFont line-through opacity-60 mr-2
                ${currentSize.text}
              `}>
                     {formatPrice(calculatedValues.originalPrice)}
                     {showCurrency && currency}
                  </Text>
               )}

               <Text
                  className={`
              ${currentVariant.text} font-appFont font-bold
              ${currentSize.text}
              ${calculatedValues.hasDiscount ? 'text-appButton' : ''}
            `}>
                  {formatPrice(totalPrice)}
                  {showCurrency && currency}
               </Text>
            </View>

            {/* Discount Info */}
            {showDiscountInfo && calculatedValues.hasDiscount && (
               <View className="flex-row items-center mt-1">
                  <Tag
                     size={12}
                     color="rgb(var(--color-app-button))"
                     strokeWidth={2}
                     className="mr-1"
                  />
                  <Text className="text-appButton font-appFont text-xs">
                     {formatPrice(calculatedValues.finalDiscount)}
                     {currency} tasarruf
                  </Text>
               </View>
            )}

            {/* Promotion Text */}
            {promotionText && (
               <Text className="text-appButton font-appFont text-xs mt-1 text-center">
                  {promotionText}
               </Text>
            )}
         </View>
      );
   };

   // Render loading state
   const renderLoadingState = () => (
      <View
         className={`
      ${currentVariant.container}
      ${currentSize.container}
      ${layoutConfig[layout]}
      ${alignmentConfig[alignment]}
      ${currentSize.gap}
      opacity-60
    `}>
         <View className="animate-pulse">{renderIcon()}</View>
         {layout !== 'icon-only' && (
            <View className="bg-appPlaceholder rounded h-4 w-16 animate-pulse" />
         )}
      </View>
   );

   // Render error state
   const renderErrorState = () => (
      <View
         className={`
      ${currentVariant.container}
      ${currentSize.container}
      ${layoutConfig[layout]}
      ${alignmentConfig[alignment]}
      ${currentSize.gap}
      border-appError
    `}>
         <Text className="text-appError font-appFont text-sm">{error}</Text>
      </View>
   );

   // Render empty state
   const renderEmptyState = () => (
      <View
         className={`
      ${currentVariant.container}
      ${currentSize.container}
      ${layoutConfig[layout]}
      ${alignmentConfig[alignment]}
      ${currentSize.gap}
      opacity-60
    `}>
         {showIcon && (
            <Package size={currentSize.icon} color={currentVariant.icon} strokeWidth={2} />
         )}
         {layout !== 'icon-only' && (
            <Text className={`${currentVariant.text} font-appFont ${currentSize.text}`}>
               Sepet Boş
            </Text>
         )}
      </View>
   );

   // Handle loading state
   if (loading) {
      return renderLoadingState();
   }

   // Handle error state
   if (error) {
      return renderErrorState();
   }

   // Handle empty state
   if (isEmpty || (totalPrice === 0 && calculatedValues.actualItemCount === 0)) {
      return renderEmptyState();
   }

   // Main content
   const content = (
      <View
         className={`
        ${currentVariant.container}
        ${currentSize.container}
        ${layoutConfig[layout]}
        ${alignmentConfig[alignment]}
        ${currentSize.gap}
        ${disabled ? 'opacity-50' : ''}
        ${interactive && !disabled ? 'active:opacity-70' : ''}
        ${className}
      `}
         style={
            currentVariant.shadow
               ? {
                    shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                    elevation: 2,
                 }
               : undefined
         }>
         {/* Icon with badge */}
         <View className="relative">
            {renderIcon()}
            {renderItemCountBadge()}
         </View>

         {/* Price Display */}
         {renderPriceDisplay()}
      </View>
   );

   // Return interactive or static version
   if (interactive && onPress && !disabled) {
      return (
         <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={disabled}>
            {content}
         </TouchableOpacity>
      );
   }

   return content;
};

export default ShoppingCartComponent;
