import React, { useEffect, useCallback, useState } from 'react';
import {
   View,
   ScrollView,
   Text,
   TouchableOpacity,
   Alert,
   KeyboardAvoidingView,
   Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Formik, FormikProps } from 'formik';
import { addressValidationSchema } from '@utility/validations';
import { Home, MapPin, Save, X, AlertCircle, CheckCircle } from 'lucide-react-native';

// Types & Navigation
import { ProfileStackParamList } from '@navigation/NavigationTypes';

// Components & Hooks
import TextInputComponent from '@mycomponents/TextInput/text.input';
import ButtonComponent from '@mycomponents/Button/Button';
import LoadingComponent from '@mycomponents/Loading/laoading';
import AddressPickerComponent from '@components/AddressPicker/address.picker';
import { useUserAddress, CreateAddressData, UserAddress } from '@hooks/profile/useUserAddress';

// ==================== TYPES ====================

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddressChange'>;

interface FormValues {
   type: 'home' | 'work' | 'other';
   title: string;
   cityId: string;
   districtId: string;
   fullAddress: string;
   buildingNo: string;
   apartmentNo: string;
   floor: string;
   postalCode: string;
   isDefault: boolean;
}

// ==================== MAIN COMPONENT ====================

const AddressChangeScreen: React.FC<Props> = ({ navigation, route }) => {
   // Route params
   const { mode = 'create', address } = route.params || {};
   const isEditMode = mode === 'edit' && address;

   // Local state
   const [selectedAddressType, setSelectedAddressType] = useState<'home' | 'work' | 'other'>(
      'home',
   );

   // Address hook
   const {
      createAddress,
      updateAddress,
      createLoading,
      updateLoading,
      createError,
      updateError,
      validateAddress,
      syncCityDistrict,
   } = useUserAddress();

   // ==================== INITIAL VALUES ====================

   const initialValues: FormValues = {
      type: address?.type || 'home',
      title: address?.title || '',
      cityId: address?.cityId || '',
      districtId: address?.districtId || '',
      fullAddress: address?.fullAddress || '',
      buildingNo: address?.buildingNo || '',
      apartmentNo: address?.apartmentNo || '',
      floor: address?.floor || '',
      postalCode: address?.postalCode || '',
      isDefault: address?.isDefault || false,
   };

   // ==================== EFFECTS ====================

   useEffect(() => {
      // Edit modunda şehir/ilçe bilgilerini sync et
      if (isEditMode && address) {
         syncCityDistrict(address.cityId, address.districtId);
         setSelectedAddressType(address.type);
      }
   }, [isEditMode, address, syncCityDistrict]);

   // ==================== HANDLERS ====================

   const handleSubmit = useCallback(
      async (values: FormValues) => {
         try {
            // Validation
            const validationResult = validateAddress(values);
            if (!validationResult.isValid) {
               Alert.alert('Doğrulama Hatası', validationResult.errors.join('\n'));
               return;
            }

            const addressData: CreateAddressData = {
               type: values.type,
               title: values.title,
               cityId: values.cityId,
               districtId: values.districtId,
               fullAddress: values.fullAddress,
               buildingNo: values.buildingNo,
               apartmentNo: values.apartmentNo,
               floor: values.floor,
               postalCode: values.postalCode,
               isDefault: values.isDefault,
            };

            if (isEditMode && address?.id) {
               // Update existing address
               await updateAddress({
                  id: address.id,
                  ...addressData,
               });
            } else {
               // Create new address
               await createAddress(addressData);
            }

            // Navigate back on success
            navigation.goBack();
         } catch (error) {
            console.error('Address save error:', error);
            Alert.alert('Hata', 'Adres kaydedilirken bir hata oluştu');
         }
      },
      [isEditMode, address, validateAddress, createAddress, updateAddress, navigation],
   );

   const handleCancel = useCallback(() => {
      navigation.goBack();
   }, [navigation]);

   // ==================== RENDER FUNCTIONS ====================

   const renderHeader = () => (
      <View className="flex-row items-center justify-between p-4 bg-appBackground border-b border-appBorder">
         <TouchableOpacity
            onPress={handleCancel}
            className="flex-row items-center py-2 px-3 rounded-lg bg-appSecondary/10"
            activeOpacity={0.7}>
            <X size={20} color="rgb(var(--color-app-text))" />
            <Text className="text-appText font-medium ml-2">İptal</Text>
         </TouchableOpacity>

         <View className="flex-row items-center">
            <Home size={24} color="rgb(var(--color-app-button))" />
            <Text className="text-appText font-bold text-lg ml-2">
               {isEditMode ? 'Adres Düzenle' : 'Yeni Adres'}
            </Text>
         </View>

         <View className="w-16" />
      </View>
   );

   const renderAddressTypeSelector = (
      setFieldValue: (field: string, value: any) => void,
      currentValue: string,
   ) => (
      <View className="mb-6">
         <Text className="text-appText font-medium text-base mb-3">Adres Tipi</Text>
         <View className="flex-row gap-3">
            {[
               { key: 'home', label: 'Ev', icon: Home },
               { key: 'work', label: 'İş', icon: MapPin },
               { key: 'other', label: 'Diğer', icon: MapPin },
            ].map(({ key, label, icon: Icon }) => (
               <TouchableOpacity
                  key={key}
                  onPress={() => {
                     setFieldValue('type', key);
                     setSelectedAddressType(key as 'home' | 'work' | 'other');
                  }}
                  className={`flex-1 flex-row items-center justify-center p-3 rounded-xl border-2 ${
                     currentValue === key
                        ? 'bg-appButton/10 border-appButton'
                        : 'bg-appSecondary/5 border-appBorder'
                  }`}
                  activeOpacity={0.7}>
                  <Icon
                     size={20}
                     color={
                        currentValue === key
                           ? 'rgb(var(--color-app-button))'
                           : 'rgb(var(--color-app-secondary))'
                     }
                  />
                  <Text
                     className={`font-medium ml-2 ${
                        currentValue === key ? 'text-appButton' : 'text-appSecondary'
                     }`}>
                     {label}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </View>
   );

   const renderFormFields = (
      values: FormValues,
      setFieldValue: (field: string, value: any) => void,
      errors: any,
      touched: any,
   ) => (
      <View className="gap-4">
         {/* Address Type Selector */}
         {renderAddressTypeSelector(setFieldValue, values.type)}

         {/* Title Input */}
         <TextInputComponent
            label="Adres Başlığı"
            value={values.title}
            onChangeText={text => setFieldValue('title', text)}
            placeholder="Örn: Ev Adresim, İş Yerim"
            error={touched.title && errors.title}
            leftIcon={<Home size={20} color="rgb(var(--color-app-secondary))" />}
            className="mb-2"
         />

         {/* City/District Picker */}
         <AddressPickerComponent
            values={{ city: values.cityId, district: values.districtId }}
            setFieldValue={setFieldValue}
            variant="card"
            size="medium"
            showLabels={true}
            showIcons={true}
            required={true}
         />

         {/* Full Address */}
         <TextInputComponent
            label="Detaylı Adres"
            value={values.fullAddress}
            onChangeText={text => setFieldValue('fullAddress', text)}
            placeholder="Mahalle, sokak, cadde bilgilerini giriniz"
            error={touched.fullAddress && errors.fullAddress}
            multiline={true}
            numberOfLines={3}
            leftIcon={<MapPin size={20} color="rgb(var(--color-app-secondary))" />}
            className="mb-2"
         />

         {/* Building Details */}
         <View className="flex-row gap-3">
            <TextInputComponent
               label="Bina No"
               value={values.buildingNo}
               onChangeText={text => setFieldValue('buildingNo', text)}
               placeholder="Bina No"
               error={touched.buildingNo && errors.buildingNo}
               className="flex-1"
            />
            <TextInputComponent
               label="Daire No"
               value={values.apartmentNo}
               onChangeText={text => setFieldValue('apartmentNo', text)}
               placeholder="Daire No"
               error={touched.apartmentNo && errors.apartmentNo}
               className="flex-1"
            />
         </View>

         <View className="flex-row gap-3">
            <TextInputComponent
               label="Kat"
               value={values.floor}
               onChangeText={text => setFieldValue('floor', text)}
               placeholder="Kat"
               error={touched.floor && errors.floor}
               className="flex-1"
            />
            <TextInputComponent
               label="Posta Kodu"
               value={values.postalCode}
               onChangeText={text => setFieldValue('postalCode', text)}
               placeholder="12345"
               error={touched.postalCode && errors.postalCode}
               keyboardType="numeric"
               maxLength={5}
               className="flex-1"
            />
         </View>

         {/* Default Address Toggle */}
         <TouchableOpacity
            onPress={() => setFieldValue('isDefault', !values.isDefault)}
            className={`flex-row items-center p-4 rounded-xl border-2 ${
               values.isDefault
                  ? 'bg-appButton/10 border-appButton'
                  : 'bg-appSecondary/5 border-appBorder'
            }`}
            activeOpacity={0.7}>
            <CheckCircle
               size={24}
               color={
                  values.isDefault
                     ? 'rgb(var(--color-app-button))'
                     : 'rgb(var(--color-app-secondary))'
               }
            />
            <View className="ml-3 flex-1">
               <Text
                  className={`font-medium ${values.isDefault ? 'text-appButton' : 'text-appText'}`}>
                  Varsayılan Adres
               </Text>
               <Text className="text-appSecondary text-sm mt-1">
                  Bu adresi varsayılan adres olarak ayarla
               </Text>
            </View>
         </TouchableOpacity>
      </View>
   );

   const renderActionButtons = (handleSubmit: () => void) => (
      <View className="flex-row gap-3 p-4 bg-appBackground border-t border-appBorder">
         <ButtonComponent
            title="İptal"
            onPress={handleCancel}
            variant="secondary"
            size="medium"
            className="flex-1"
         />
         <ButtonComponent
            title={isEditMode ? 'Güncelle' : 'Kaydet'}
            onPress={handleSubmit}
            variant="primary"
            size="medium"
            className="flex-1"
            leftIcon={<Save size={20} color="white" />}
            loading={createLoading || updateLoading}
         />
      </View>
   );

   // ==================== RENDER ====================

   return (
      <KeyboardAvoidingView
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         className="flex-1 bg-appBackground">
         {/* Header */}
         {renderHeader()}

         {/* Form */}
         <Formik
            initialValues={initialValues}
            validationSchema={addressValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}>
            {({
               values,
               setFieldValue,
               handleSubmit,
               errors,
               touched,
            }: FormikProps<FormValues>) => (
               <>
                  <ScrollView
                     className="flex-1"
                     showsVerticalScrollIndicator={false}
                     keyboardShouldPersistTaps="handled">
                     <View className="p-4">
                        {/* Error Display */}
                        {(createError || updateError) && (
                           <View className="flex-row items-center p-3 mb-4 bg-red-50 border border-red-200 rounded-lg">
                              <AlertCircle size={20} color="#dc2626" />
                              <Text className="text-red-600 font-medium ml-2 flex-1">
                                 {String(createError || updateError)}
                              </Text>
                           </View>
                        )}

                        {/* Form Fields */}
                        {renderFormFields(values, setFieldValue, errors, touched)}
                     </View>
                  </ScrollView>

                  {/* Action Buttons */}
                  {renderActionButtons(handleSubmit)}
               </>
            )}
         </Formik>

         {/* Loading Overlay */}
         {(createLoading || updateLoading) && (
            <View className="absolute inset-0 bg-black/20 items-center justify-center">
               <LoadingComponent
                  variant="spinner"
                  size="lg"
                  message={isEditMode ? 'Adres güncelleniyor...' : 'Adres kaydediliyor...'}
               />
            </View>
         )}
      </KeyboardAvoidingView>
   );
};

export default AddressChangeScreen;
