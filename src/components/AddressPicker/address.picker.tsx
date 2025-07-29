import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MapPin, RefreshCw, AlertCircle } from 'lucide-react-native';
import { useCityDistrict } from '@hooks/profile/useCityDistrict';
import City from '@apptypes/entities/city';
import District from '@apptypes/entities/district';
import IconComponent from '@mycomponents/LucidImage';
import { useTailwindColors } from '@styles/tailwind.colors';

interface AddressPickerComponentProps {
   values: { city: string; district: string };
   setFieldValue: (field: string, value: any) => void;
   onCityChange?: (city: City | null) => void;
   onDistrictChange?: (district: District | null) => void;
   variant?: 'default' | 'compact' | 'card';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   showLabels?: boolean;
   showIcons?: boolean;
   disabled?: boolean;
   required?: boolean;
   placeholder?: {
      city?: string;
      district?: string;
   };
}

const AddressPickerComponent: React.FC<AddressPickerComponentProps> = ({
   values,
   setFieldValue,
   onCityChange,
   onDistrictChange,
   variant = 'default',
   size = 'medium',
   className = '',
   showLabels = true,
   showIcons = true,
   disabled = false,
   required = false,
   placeholder = {
      city: 'Şehir Seçiniz',
      district: 'İlçe Seçiniz',
   },
}) => {
   const colors = useTailwindColors();
   // useCityDistrict hook'unu kullan
   const {
      cities,
      districts,
      selectedCity,
      selectedDistrict,
      loading,
      citiesLoading,
      districtsLoading,
      error,
      citiesError,
      districtsError,
      getCities,
      getDistricts,
      selectCity,
      selectDistrict,
      retryCities,
      retryDistricts,
      findCityById,
      findDistrictById,
      hasCities,
      hasDistricts,
   } = useCityDistrict({
      autoFetchCities: true,
      autoFetchDistrictsOnCityChange: true,
      enableCache: true,
      onCityChange,
      onDistrictChange,
   });

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'gap-2 mb-4',
         picker: 'p-2 rounded-lg',
         label: 'text-sm',
         iconSize: 16,
      },
      medium: {
         container: 'gap-3 mb-6',
         picker: 'p-3 rounded-xl',
         label: 'text-base',
         iconSize: 20,
      },
      large: {
         container: 'gap-4 mb-8',
         picker: 'p-4 rounded-2xl',
         label: 'text-lg',
         iconSize: 24,
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         container: 'bg-transparent',
         picker: 'bg-appBackground border-2 border-appBorderColor',
         label: 'text-appText',
         focusedBorder: 'border-appButton',
      },
      compact: {
         container: 'bg-appTransition rounded-xl p-4',
         picker: 'bg-appBackground border border-appBorderColor',
         label: 'text-appText',
         focusedBorder: 'border-appButton',
      },
      card: {
         container: 'bg-appCardBackground rounded-xl p-4',
         picker: 'bg-appTransition border border-appBorderColor',
         label: 'text-appCardText',
         focusedBorder: 'border-appButton',
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   // Şehir değişikliğini handle et
   const handleCityChange = useCallback(
      (cityId: string) => {
         setFieldValue('city', cityId);
         setFieldValue('district', ''); // İlçe seçimini sıfırla

         const city = findCityById(cityId);
         selectCity(city || null);
      },
      [setFieldValue, findCityById, selectCity],
   );

   // İlçe değişikliğini handle et
   const handleDistrictChange = useCallback(
      (districtId: string) => {
         setFieldValue('district', districtId);

         const district = findDistrictById(districtId);
         selectDistrict(district || null);
      },
      [setFieldValue, findDistrictById, selectDistrict],
   );

   // Component mount olduğunda veya values.city değiştiğinde seçili şehri set et
   useEffect(() => {
      if (values.city && values.city !== selectedCity?.id) {
         const city = findCityById(values.city);
         if (city) {
            selectCity(city);
         }
      }
   }, [values.city, selectedCity, findCityById, selectCity]);

   // values.district değiştiğinde seçili ilçeyi set et
   useEffect(() => {
      if (values.district && values.district !== selectedDistrict?.id) {
         const district = findDistrictById(values.district);
         if (district) {
            selectDistrict(district);
         }
      }
   }, [values.district, selectedDistrict, findDistrictById, selectDistrict]);

   // Retry handler
   const handleRetry = useCallback(() => {
      if (citiesError) {
         retryCities();
      }
      if (districtsError) {
         retryDistricts();
      }
   }, [citiesError, districtsError, retryCities, retryDistricts]);

   // Error component
   const ErrorComponent = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
      <View className="flex-row items-center justify-between p-3 bg-appError/10 rounded-lg">
         <View className="flex-row items-center flex-1">
            <IconComponent Icon={AlertCircle} className="text-appError" size={16} />
            <Text className="text-appError font-appFont text-sm ml-2 flex-1">
               Veriler yüklenirken hata oluştu
            </Text>
         </View>
         <TouchableOpacity
            onPress={onRetry}
            className="bg-appError/20 px-3 py-1 rounded-full"
            activeOpacity={0.7}>
            <Text className="text-appError font-appFont text-sm font-medium">Tekrar Dene</Text>
         </TouchableOpacity>
      </View>
   );

   // Loading indicator
   const LoadingIndicator = () => (
      <View className="flex-row items-center justify-center p-3">
         <IconComponent Icon={RefreshCw} className="text-appIcon" size={16} />
         <Text className="text-appIcon font-appFont text-sm ml-2">Yükleniyor...</Text>
      </View>
   );

   return (
      <View
         className={`
      flex-col
      ${currentSize.container}
      ${currentVariant.container}
      ${disabled ? 'opacity-50' : ''}
      ${className}
      ${variant === 'compact' || variant === 'card' ? 'border border-appBorderColor shadow-md' : ''}
    `}>
         {/* City Picker */}
         <View className="flex-col">
            {showLabels && (
               <View className="flex-row items-center mb-2">
                  {showIcons && (
                     <IconComponent
                        Icon={MapPin}
                        className="text-appIcon mr-2"
                        size={currentSize.iconSize}
                     />
                  )}
                  <Text
                     className={`
              ${currentVariant.label} font-appFont font-medium
              ${currentSize.label}
            `}>
                     Şehir {required && <Text className="text-appError">*</Text>}
                  </Text>
               </View>
            )}

            {citiesError ? (
               <ErrorComponent error={citiesError} onRetry={retryCities} />
            ) : citiesLoading ? (
               <LoadingIndicator />
            ) : (
               <View
                  className={`
            ${currentVariant.picker}
            ${currentSize.picker}
            shadow-md
          `}>
                  <Picker
                     selectedValue={values.city}
                     onValueChange={handleCityChange}
                     enabled={!disabled && hasCities}
                     className="text-appText"
                     dropdownIconColor={colors.appIcon}>
                     <Picker.Item
                        label={placeholder.city || 'Şehir Seçiniz'}
                        value=""
                        color={colors.appPlaceholder}
                     />

                     {cities.map(city => (
                        <Picker.Item
                           key={city.id}
                           label={city.name}
                           value={city.id}
                           color={colors.appText}
                        />
                     ))}
                  </Picker>
               </View>
            )}
         </View>

         {/* District Picker */}
         <View className="flex-col">
            {showLabels && (
               <View className="flex-row items-center mb-2">
                  {showIcons && (
                     <IconComponent
                        Icon={MapPin}
                        className="text-appIcon mr-2"
                        size={currentSize.iconSize}
                     />
                  )}
                  <Text
                     className={`
              ${currentVariant.label} font-appFont font-medium
              ${currentSize.label}
            `}>
                     İlçe {required && <Text className="text-appError">*</Text>}
                  </Text>
               </View>
            )}

            {districtsError ? (
               <ErrorComponent error={districtsError} onRetry={retryDistricts} />
            ) : districtsLoading ? (
               <LoadingIndicator />
            ) : (
               <View
                  className={`
            ${currentVariant.picker}
            ${currentSize.picker}
            ${!values.city || !hasDistricts ? 'opacity-50' : ''}
          `}>
                  <Picker
                     selectedValue={values.district}
                     onValueChange={handleDistrictChange}
                     enabled={!disabled && !!values.city && hasDistricts}
                     className="text-appText"
                     dropdownIconColor={colors.appIcon}>
                     <Picker.Item
                        label={placeholder.district || 'İlçe Seçiniz'}
                        value=""
                        color={colors.appPlaceholder}
                     />

                     {districts.map(district => (
                        <Picker.Item
                           key={district.id}
                           label={district.name}
                           value={district.id}
                           color={colors.appText}
                        />
                     ))}
                  </Picker>
               </View>
            )}
         </View>

         {/* Info Text */}
         {!values.city && (
            <Text className="text-appPlaceholder font-appFont text-sm text-center mt-2">
               Önce bir şehir seçiniz
            </Text>
         )}
      </View>
   );
};

export default AddressPickerComponent;
