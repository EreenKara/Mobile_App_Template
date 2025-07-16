// components/ExtendedListPicker/ExtendedListPicker.tsx
import React, { useRef, useCallback, useMemo, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, TextInput, ListRenderItem } from 'react-native';
import { Search, Check, Plus, Users, X, ChevronRight, Filter } from 'lucide-react-native';
import ExtendedPickerComponent, { ExtendedPickerRef } from '@components/ExtendedPicker/index';

// Generic type for list items
interface ListItem {
   id: string | number;
   name: string;
   [key: string]: any;
}

interface ExtendedListPickerComponentProps<T extends ListItem> {
   data: T[];
   selectedData: T | T[] | null;
   onSelect: (item: T) => void;
   onDeselect?: (item: T) => void;
   title: string;

   // Picker Props
   icon?: React.ReactNode;
   variant?: 'default' | 'compact' | 'card' | 'minimal';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   disabled?: boolean;
   animationType?: 'layout' | 'scale' | 'fade';

   // List Props
   selectionMode?: 'single' | 'multiple' | 'none';
   searchable?: boolean;
   searchPlaceholder?: string;
   emptyText?: string;
   maxHeight?: number;
   showItemIcons?: boolean;

   // Item Rendering
   renderItem?: ListRenderItem<T>;
   itemIcon?: React.ReactNode;
   getItemIcon?: (item: T, isSelected: boolean) => React.ReactNode;
   getItemSubtitle?: (item: T) => string;
   getItemRightContent?: (item: T, isSelected: boolean) => React.ReactNode;

   // Filtering & Sorting
   searchFields?: (keyof T)[];
   sortBy?: keyof T;
   sortOrder?: 'asc' | 'desc';
   filterFunction?: (item: T, searchText: string) => boolean;

   // Callbacks
   onToggle?: (isOpen: boolean) => void;
   onSearch?: (searchText: string) => void;
   onFilteredDataChange?: (filteredData: T[]) => void;

   // Styling
   listClassName?: string;
   itemClassName?: string;
   searchInputClassName?: string;
}

const ExtendedListPickerComponent = <T extends ListItem>({
   data,
   selectedData,
   onSelect,
   onDeselect,
   title,

   // Picker Props
   icon,
   variant = 'default',
   size = 'medium',
   className = '',
   disabled = false,
   animationType = 'layout',

   // List Props
   selectionMode = 'single',
   searchable = false,
   searchPlaceholder = 'Ara...',
   emptyText = 'Veri bulunamadı',
   maxHeight = 300,
   showItemIcons = true,

   // Item Rendering
   renderItem,
   itemIcon,
   getItemIcon,
   getItemSubtitle,
   getItemRightContent,

   // Filtering & Sorting
   searchFields = ['name' as keyof T],
   sortBy,
   sortOrder = 'asc',
   filterFunction,

   // Callbacks
   onToggle,
   onSearch,
   onFilteredDataChange,

   // Styling
   listClassName = '',
   itemClassName = '',
   searchInputClassName = '',
}: ExtendedListPickerComponentProps<T>) => {
   const pickerRef = useRef<ExtendedPickerRef>(null);
   const [searchText, setSearchText] = useState('');

   // Size configurations for internal components
   const sizeConfig = {
      small: {
         searchInput: 'p-2 rounded-lg text-sm',
         listItem: 'p-2 rounded-lg',
         itemText: 'text-sm',
         itemSubtext: 'text-xs',
         iconSize: 16,
         maxHeight: 200,
      },
      medium: {
         searchInput: 'p-3 rounded-xl text-base',
         listItem: 'p-3 rounded-xl',
         itemText: 'text-base',
         itemSubtext: 'text-sm',
         iconSize: 20,
         maxHeight: 300,
      },
      large: {
         searchInput: 'p-4 rounded-2xl text-lg',
         listItem: 'p-4 rounded-2xl',
         itemText: 'text-lg',
         itemSubtext: 'text-base',
         iconSize: 24,
         maxHeight: 400,
      },
   };

   const currentSize = sizeConfig[size];
   const currentMaxHeight = maxHeight || currentSize.maxHeight;

   // Helper functions
   const isItemSelected = useCallback(
      (item: T): boolean => {
         if (!selectedData) return false;

         if (Array.isArray(selectedData)) {
            return selectedData.some(selected => selected.id === item.id);
         }

         return selectedData.id === item.id;
      },
      [selectedData],
   );

   const getSelectedItems = useCallback((): T[] => {
      if (!selectedData) return [];
      return Array.isArray(selectedData) ? selectedData : [selectedData];
   }, [selectedData]);

   // Filter and sort data
   const filteredAndSortedData = useMemo(() => {
      let filtered = data;

      // Apply search filter
      if (searchText.trim()) {
         filtered = data.filter(item => {
            if (filterFunction) {
               return filterFunction(item, searchText);
            }

            return searchFields.some(field => {
               const value = item[field];
               if (typeof value === 'string') {
                  return value.toLowerCase().includes(searchText.toLowerCase());
               }
               return false;
            });
         });
      }

      // Apply sorting
      if (sortBy) {
         filtered = [...filtered].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
               const comparison = aValue.localeCompare(bValue, 'tr');
               return sortOrder === 'asc' ? comparison : -comparison;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
         });
      }

      return filtered;
   }, [data, searchText, searchFields, sortBy, sortOrder, filterFunction]);

   // Update filtered data callback
   React.useEffect(() => {
      onFilteredDataChange?.(filteredAndSortedData);
   }, [filteredAndSortedData, onFilteredDataChange]);

   // Handle item press
   const handleItemPress = useCallback(
      (item: T) => {
         const isSelected = isItemSelected(item);

         if (selectionMode === 'none') return;

         if (selectionMode === 'single') {
            if (isSelected) {
               onDeselect?.(item);
            } else {
               onSelect(item);
               // Auto close picker after selection in single mode
               setTimeout(() => {
                  pickerRef.current?.close();
               }, 150);
            }
         } else if (selectionMode === 'multiple') {
            if (isSelected) {
               onDeselect?.(item);
            } else {
               onSelect(item);
            }
         }
      },
      [selectionMode, isItemSelected, onSelect, onDeselect],
   );

   // Handle search
   const handleSearch = useCallback(
      (text: string) => {
         setSearchText(text);
         onSearch?.(text);
      },
      [onSearch],
   );

   // Clear search
   const clearSearch = useCallback(() => {
      setSearchText('');
      onSearch?.('');
   }, [onSearch]);

   // Render default icon
   const renderDefaultIcon = useCallback(() => {
      if (icon) return icon;
      return (
         <Users size={currentSize.iconSize} color="rgb(var(--color-app-icon))" strokeWidth={2} />
      );
   }, [icon, currentSize.iconSize]);

   // Render item icon
   const renderItemIcon = useCallback(
      (item: T, isSelected: boolean) => {
         if (!showItemIcons) return null;

         if (getItemIcon) {
            return getItemIcon(item, isSelected);
         }

         if (itemIcon) return itemIcon;

         return (
            <Users
               size={currentSize.iconSize}
               color={isSelected ? 'rgb(var(--color-app-button))' : 'rgb(var(--color-app-icon))'}
               strokeWidth={2}
            />
         );
      },
      [showItemIcons, getItemIcon, itemIcon, currentSize.iconSize],
   );

   // Render right content
   const renderRightContent = useCallback(
      (item: T, isSelected: boolean) => {
         if (getItemRightContent) {
            return getItemRightContent(item, isSelected);
         }

         if (selectionMode === 'none') {
            return (
               <ChevronRight
                  size={currentSize.iconSize}
                  color="rgb(var(--color-app-icon))"
                  strokeWidth={2}
               />
            );
         }

         const IconComponent = isSelected ? Check : Plus;
         return (
            <IconComponent
               size={currentSize.iconSize}
               color={isSelected ? 'rgb(var(--color-app-button))' : 'rgb(var(--color-app-icon))'}
               strokeWidth={2}
            />
         );
      },
      [getItemRightContent, selectionMode, currentSize.iconSize],
   );

   // Render search input
   const renderSearchInput = () => {
      if (!searchable) return null;

      return (
         <View className="relative mb-3">
            <TextInput
               value={searchText}
               onChangeText={handleSearch}
               placeholder={searchPlaceholder}
               placeholderTextColor="rgb(var(--color-app-placeholder))"
               className={`
            bg-appTransition border border-appBorderColor
            ${currentSize.searchInput}
            text-appText font-appFont
            pr-10
            ${searchInputClassName}
          `}
            />
            <View className="absolute right-3 top-1/2 -translate-y-1/2 flex-row items-center">
               {searchText ? (
                  <TouchableOpacity onPress={clearSearch} className="p-1">
                     <X
                        size={currentSize.iconSize}
                        color="rgb(var(--color-app-icon))"
                        strokeWidth={2}
                     />
                  </TouchableOpacity>
               ) : (
                  <Search
                     size={currentSize.iconSize}
                     color="rgb(var(--color-app-icon))"
                     strokeWidth={2}
                  />
               )}
            </View>
         </View>
      );
   };

   // Render list item
   const renderListItem: ListRenderItem<T> = useCallback(
      ({ item, index, separators }) => {
         if (renderItem) {
            return renderItem({ item, index, separators });
         }

         const isSelected = isItemSelected(item);
         const subtitle = getItemSubtitle?.(item);

         return (
            <TouchableOpacity
               onPress={() => handleItemPress(item)}
               className={`
          flex-row items-center justify-between
          ${currentSize.listItem}
          ${isSelected ? 'bg-appButton/10' : 'bg-appTransition'}
          border border-appBorderColor
          mb-2 last:mb-0
          active:opacity-70
          ${itemClassName}
        `}
               activeOpacity={0.7}>
               <View className="flex-row items-center flex-1">
                  {renderItemIcon(item, isSelected)}

                  <View className="ml-3 flex-1">
                     <Text
                        className={`
                ${isSelected ? 'text-appButton' : 'text-appText'}
                font-appFont font-medium
                ${currentSize.itemText}
              `}
                        numberOfLines={1}>
                        {item.name}
                     </Text>

                     {subtitle && (
                        <Text
                           className={`
                  text-appPlaceholder font-appFont
                  ${currentSize.itemSubtext}
                  mt-1
                `}
                           numberOfLines={1}>
                           {subtitle}
                        </Text>
                     )}
                  </View>
               </View>

               <View className="ml-3">{renderRightContent(item, isSelected)}</View>
            </TouchableOpacity>
         );
      },
      [
         renderItem,
         isItemSelected,
         getItemSubtitle,
         handleItemPress,
         renderItemIcon,
         renderRightContent,
         currentSize,
         itemClassName,
      ],
   );

   // Render empty state
   const renderEmptyState = () => (
      <View className="items-center justify-center py-8">
         <Filter
            size={48}
            color="rgb(var(--color-app-placeholder))"
            strokeWidth={1}
            className="mb-3"
         />
         <Text className="text-appPlaceholder font-appFont text-base text-center">
            {searchText ? `"${searchText}" için sonuç bulunamadı` : emptyText}
         </Text>
         {searchText && (
            <TouchableOpacity onPress={clearSearch} className="mt-3">
               <Text className="text-appButton font-appFont text-sm">Aramayı Temizle</Text>
            </TouchableOpacity>
         )}
      </View>
   );

   // List content
   const listContent = (
      <View className={listClassName}>
         {renderSearchInput()}

         <FlatList
            data={filteredAndSortedData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderListItem}
            ListEmptyComponent={renderEmptyState}
            nestedScrollEnabled={true}
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            style={{
               maxHeight: currentMaxHeight,
            }}
            contentContainerStyle={{
               paddingBottom: 8,
            }}
         />

         {/* Selection Summary */}
         {selectionMode === 'multiple' && getSelectedItems().length > 0 && (
            <View className="mt-3 p-3 bg-appButton/10 rounded-xl border border-appButton/20">
               <Text className="text-appButton font-appFont text-sm text-center">
                  {getSelectedItems().length} öğe seçildi
               </Text>
            </View>
         )}
      </View>
   );

   return (
      <ExtendedPickerComponent
         ref={pickerRef}
         title={title}
         icon={renderDefaultIcon()}
         content={listContent}
         variant={variant}
         size={size}
         className={className}
         disabled={disabled}
         animationType={animationType}
         onToggle={onToggle}
         contentProps={{
            showCloseButton: false, // List'te close button gerekmez
         }}
      />
   );
};

export default ExtendedListPickerComponent;
