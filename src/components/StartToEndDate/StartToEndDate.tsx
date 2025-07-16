// components/StartToEndDate/StartToEndDate.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch } from 'react-redux';
import {
   Calendar,
   Clock,
   CalendarDays,
   Timer,
   AlertCircle,
   CheckCircle,
   Info,
} from 'lucide-react-native';
import { showNotification } from '@contexts/slices/notification/notificationSlice';

export interface DateRangeValues {
   startDate: Date;
   endDate: Date;
}

export interface DateValidationError {
   type:
      | 'start_after_end'
      | 'end_before_start'
      | 'invalid_date'
      | 'min_date_violation'
      | 'max_date_violation'
      | 'duration_violation';
   message: string;
   correctedDates?: DateRangeValues;
}

interface StartToEndDateComponentProps {
   values: DateRangeValues;
   onDateChange: (dates: DateRangeValues) => void;

   // Styling Props
   variant?: 'default' | 'compact' | 'card' | 'minimal';
   size?: 'small' | 'medium' | 'large';
   className?: string;
   disabled?: boolean;

   // Configuration Props
   minimumDate?: Date;
   maximumDate?: Date;
   minimumDuration?: number; // days
   maximumDuration?: number; // days
   autoCorrection?: boolean;
   showDuration?: boolean;
   showLabels?: boolean;
   showIcons?: boolean;

   // Display Props
   startLabel?: string;
   endLabel?: string;
   dateFormat?: 'tr-TR' | 'en-US' | string;
   timeFormat?: '12h' | '24h';

   // Validation Props
   required?: boolean;
   showValidationIcon?: boolean;

   // Layout Props
   layout?: 'vertical' | 'horizontal' | 'grid';
   buttonStyle?: 'outlined' | 'filled' | 'minimal';

   // Callbacks
   onValidationError?: (error: DateValidationError) => void;
   onValidationSuccess?: () => void;
}

const StartToEndDateComponent: React.FC<StartToEndDateComponentProps> = ({
   values,
   onDateChange,

   // Styling
   variant = 'default',
   size = 'medium',
   className = '',
   disabled = false,

   // Configuration
   minimumDate,
   maximumDate,
   minimumDuration = 0,
   maximumDuration,
   autoCorrection = true,
   showDuration = true,
   showLabels = true,
   showIcons = true,

   // Display
   startLabel = 'Başlangıç',
   endLabel = 'Bitiş',
   dateFormat = 'tr-TR',
   timeFormat = '24h',

   // Validation
   required = false,
   showValidationIcon = true,

   // Layout
   layout = 'vertical',
   buttonStyle = 'outlined',

   // Callbacks
   onValidationError,
   onValidationSuccess,
}) => {
   const dispatch = useDispatch();

   // Local state for picker visibility
   const [pickerState, setPickerState] = useState({
      showStartDate: false,
      showEndDate: false,
      showStartTime: false,
      showEndTime: false,
   });

   // Local state for validation
   const [validationError, setValidationError] = useState<DateValidationError | null>(null);
   const [isValid, setIsValid] = useState(true);

   // Date formatting helpers
   const formatDate = useCallback(
      (date: Date): string => {
         return date.toLocaleDateString(dateFormat);
      },
      [dateFormat],
   );

   const formatTime = useCallback(
      (date: Date): string => {
         const options =
            timeFormat === '12h'
               ? { hour: '2-digit' as const, minute: '2-digit' as const, hour12: true }
               : { hour: '2-digit' as const, minute: '2-digit' as const, hour12: false };

         return date.toLocaleTimeString(dateFormat, options);
      },
      [dateFormat, timeFormat],
   );

   // Validation function
   const validateDateRange = useCallback(
      (startDate: Date, endDate: Date): DateValidationError | null => {
         // Check if dates are valid
         if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return {
               type: 'invalid_date',
               message: 'Geçersiz tarih seçildi',
            };
         }

         // Check minimum date constraint
         if (minimumDate && startDate < minimumDate) {
            return {
               type: 'min_date_violation',
               message: `Başlangıç tarihi ${formatDate(minimumDate)} tarihinden önce olamaz`,
            };
         }

         // Check maximum date constraint
         if (maximumDate && endDate > maximumDate) {
            return {
               type: 'max_date_violation',
               message: `Bitiş tarihi ${formatDate(maximumDate)} tarihinden sonra olamaz`,
            };
         }

         // Check if start date is after or equal to end date
         if (startDate >= endDate) {
            const correctedEndDate = new Date(startDate);
            correctedEndDate.setDate(startDate.getDate() + 1);

            return {
               type: 'start_after_end',
               message: 'Başlangıç tarihi bitiş tarihinden sonra veya eşit olamaz',
               correctedDates: {
                  startDate,
                  endDate: correctedEndDate,
               },
            };
         }

         // Check minimum duration
         const durationMs = endDate.getTime() - startDate.getTime();
         const durationDays = durationMs / (24 * 60 * 60 * 1000);

         if (minimumDuration && durationDays < minimumDuration) {
            const correctedEndDate = new Date(startDate);
            correctedEndDate.setDate(startDate.getDate() + minimumDuration);

            return {
               type: 'duration_violation',
               message: `Minimum ${minimumDuration} gün seçilmelidir`,
               correctedDates: {
                  startDate,
                  endDate: correctedEndDate,
               },
            };
         }

         // Check maximum duration
         if (maximumDuration && durationDays > maximumDuration) {
            return {
               type: 'duration_violation',
               message: `Maksimum ${maximumDuration} gün seçilebilir`,
            };
         }

         return null;
      },
      [minimumDate, maximumDate, minimumDuration, maximumDuration, formatDate],
   );

   // Handle date/time change
   const handleDateTimeChange = useCallback(
      (
         selectedDate: Date | undefined,
         type: 'startDate' | 'endDate',
         isTimeChange: boolean = false,
      ) => {
         if (!selectedDate) return;

         const currentDates = { ...values };
         const baseDate = type === 'startDate' ? currentDates.startDate : currentDates.endDate;
         const newDate = new Date(baseDate);

         if (isTimeChange) {
            // Only update time
            newDate.setHours(selectedDate.getHours());
            newDate.setMinutes(selectedDate.getMinutes());
            newDate.setSeconds(0);
            newDate.setMilliseconds(0);
         } else {
            // Only update date, preserve time
            newDate.setFullYear(selectedDate.getFullYear());
            newDate.setMonth(selectedDate.getMonth());
            newDate.setDate(selectedDate.getDate());
         }

         // Update the appropriate date
         const updatedDates = {
            ...currentDates,
            [type]: newDate,
         };

         // Validate the new date range
         const validationResult = validateDateRange(updatedDates.startDate, updatedDates.endDate);

         if (validationResult && autoCorrection && validationResult.correctedDates) {
            // Apply auto-correction
            const correctedDates = validationResult.correctedDates;

            setValidationError(validationResult);
            setIsValid(false);

            // Dispatch notification for correction
            dispatch(
               showNotification({
                  message: validationResult.message + ' Tarihler otomatik düzeltildi.',
                  type: 'info',
                  modalType: 'snackbar',
                  duration: 4000,
               }),
            );

            onDateChange(correctedDates);
            onValidationError?.(validationResult);

            // Clear error after showing correction
            setTimeout(() => {
               setValidationError(null);
               setIsValid(true);
               onValidationSuccess?.();
            }, 1000);
         } else if (validationResult) {
            // Don't update dates, just show error
            setValidationError(validationResult);
            setIsValid(false);

            dispatch(
               showNotification({
                  message: validationResult.message,
                  type: 'error',
                  modalType: 'snackbar',
                  duration: 3000,
               }),
            );

            onValidationError?.(validationResult);
         } else {
            // Valid date range
            setValidationError(null);
            setIsValid(true);

            onDateChange(updatedDates);
            onValidationSuccess?.();
         }
      },
      [
         values,
         validateDateRange,
         autoCorrection,
         onDateChange,
         onValidationError,
         onValidationSuccess,
         dispatch,
      ],
   );

   // Show/hide picker handlers
   const showDatePicker = useCallback((type: 'startDate' | 'endDate') => {
      setPickerState({
         showStartDate: type === 'startDate',
         showEndDate: type === 'endDate',
         showStartTime: false,
         showEndTime: false,
      });
   }, []);

   const showTimePicker = useCallback((type: 'startDate' | 'endDate') => {
      setPickerState({
         showStartDate: false,
         showEndDate: false,
         showStartTime: type === 'startDate',
         showEndTime: type === 'endDate',
      });
   }, []);

   const hidePickers = useCallback(() => {
      setPickerState({
         showStartDate: false,
         showEndDate: false,
         showStartTime: false,
         showEndTime: false,
      });
   }, []);

   // Date picker event handlers
   const onStartDateChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         handleDateTimeChange(selectedDate, 'startDate', false);
      },
      [handleDateTimeChange, hidePickers],
   );

   const onEndDateChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         handleDateTimeChange(selectedDate, 'endDate', false);
      },
      [handleDateTimeChange, hidePickers],
   );

   const onStartTimeChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         handleDateTimeChange(selectedDate, 'startDate', true);
      },
      [handleDateTimeChange, hidePickers],
   );

   const onEndTimeChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         handleDateTimeChange(selectedDate, 'endDate', true);
      },
      [handleDateTimeChange, hidePickers],
   );

   // Computed values
   const duration = useMemo(() => {
      const durationMs = values.endDate.getTime() - values.startDate.getTime();
      const days = Math.floor(durationMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((durationMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));

      return { days, hours, minutes, totalMs: durationMs };
   }, [values]);

   const formattedDates = useMemo(
      () => ({
         startDate: formatDate(values.startDate),
         endDate: formatDate(values.endDate),
         startTime: formatTime(values.startDate),
         endTime: formatTime(values.endDate),
      }),
      [values, formatDate, formatTime],
   );

   // Size configurations
   const sizeConfig = {
      small: {
         container: 'gap-2',
         row: 'gap-2',
         button: 'p-2 rounded-lg',
         label: 'text-sm',
         buttonText: 'text-sm',
         iconSize: 16,
         durationText: 'text-xs',
      },
      medium: {
         container: 'gap-3',
         row: 'gap-3',
         button: 'p-3 rounded-xl',
         label: 'text-base',
         buttonText: 'text-base',
         iconSize: 20,
         durationText: 'text-sm',
      },
      large: {
         container: 'gap-4',
         row: 'gap-4',
         button: 'p-4 rounded-2xl',
         label: 'text-lg',
         buttonText: 'text-lg',
         iconSize: 24,
         durationText: 'text-base',
      },
   };

   // Variant configurations
   const variantConfig = {
      default: {
         container: 'bg-appBackground',
         label: 'text-appText',
         button: {
            outlined: 'bg-appTransition border-2 border-appBorderColor',
            filled: 'bg-appButton',
            minimal: 'bg-appTransition border border-appBorderColor',
         },
         buttonText: {
            outlined: 'text-appText',
            filled: 'text-appButtonText',
            minimal: 'text-appText',
         },
         validationIcon: 'text-appError',
         durationContainer: 'bg-appTransition border border-appBorderColor',
         durationText: 'text-appText',
      },
      compact: {
         container: 'bg-appCardBackground',
         label: 'text-appCardText',
         button: {
            outlined: 'bg-appCardBackground border-2 border-appBorderColor',
            filled: 'bg-appCardButton',
            minimal: 'bg-appTransition border border-appBorderColor',
         },
         buttonText: {
            outlined: 'text-appCardText',
            filled: 'text-appButtonText',
            minimal: 'text-appCardText',
         },
         validationIcon: 'text-appError',
         durationContainer: 'bg-appTransition border border-appBorderColor',
         durationText: 'text-appCardText',
      },
      card: {
         container: 'bg-appCardBackground border border-appBorderColor rounded-xl p-4',
         label: 'text-appCardText',
         button: {
            outlined: 'bg-appBackground border-2 border-appBorderColor',
            filled: 'bg-appButton',
            minimal: 'bg-appTransition border border-appBorderColor',
         },
         buttonText: {
            outlined: 'text-appText',
            filled: 'text-appButtonText',
            minimal: 'text-appText',
         },
         validationIcon: 'text-appError',
         durationContainer: 'bg-appBackground border border-appBorderColor',
         durationText: 'text-appText',
      },
      minimal: {
         container: 'bg-transparent',
         label: 'text-appText',
         button: {
            outlined: 'bg-transparent border border-appBorderColor',
            filled: 'bg-appButton',
            minimal: 'bg-appTransition',
         },
         buttonText: {
            outlined: 'text-appText',
            filled: 'text-appButtonText',
            minimal: 'text-appText',
         },
         validationIcon: 'text-appError',
         durationContainer: 'bg-appTransition border border-appBorderColor',
         durationText: 'text-appText',
      },
   };

   const currentSize = sizeConfig[size];
   const currentVariant = variantConfig[variant];

   // Layout configurations
   const layoutConfig = {
      vertical: 'flex-col',
      horizontal: 'flex-row items-center justify-between',
      grid: 'flex-row flex-wrap',
   };

   // Format duration for display
   const formatDuration = useCallback(() => {
      if (duration.days > 0) {
         return `${duration.days} gün ${duration.hours} saat`;
      } else if (duration.hours > 0) {
         return `${duration.hours} saat ${duration.minutes} dakika`;
      } else {
         return `${duration.minutes} dakika`;
      }
   }, [duration]);

   // Render validation icon
   const renderValidationIcon = () => {
      if (!showValidationIcon) return null;

      if (validationError) {
         return (
            <AlertCircle
               size={currentSize.iconSize}
               color="rgb(var(--color-app-error))"
               strokeWidth={2}
            />
         );
      } else if (isValid && values.startDate && values.endDate) {
         return (
            <CheckCircle
               size={currentSize.iconSize}
               color="rgb(var(--color-app-button))"
               strokeWidth={2}
            />
         );
      }

      return null;
   };

   // Render date/time button
   const renderDateTimeButton = (
      type: 'date' | 'time',
      dateType: 'start' | 'end',
      value: string,
      onPress: () => void,
   ) => {
      const IconComponent =
         type === 'date'
            ? dateType === 'start'
               ? Calendar
               : CalendarDays
            : dateType === 'start'
              ? Clock
              : Timer;

      return (
         <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`
          flex-row items-center justify-center
          ${currentVariant.button[buttonStyle]}
          ${currentSize.button}
          ${type === 'date' ? 'flex-2' : 'flex-1'}
          ${disabled ? 'opacity-50' : 'active:opacity-70'}
        `}
            activeOpacity={0.7}>
            {showIcons && (
               <IconComponent
                  size={currentSize.iconSize}
                  color={
                     buttonStyle === 'filled'
                        ? 'rgb(var(--color-app-button-text))'
                        : 'rgb(var(--color-app-icon))'
                  }
                  strokeWidth={2}
                  className="mr-2"
               />
            )}
            <Text
               className={`
            ${currentVariant.buttonText[buttonStyle]} 
            font-appFont font-medium 
            ${currentSize.buttonText}
          `}
               numberOfLines={1}>
               {value}
            </Text>
         </TouchableOpacity>
      );
   };

   // Render date row
   const renderDateRow = (
      dateType: 'start' | 'end',
      label: string,
      dateValue: string,
      timeValue: string,
      onDatePress: () => void,
      onTimePress: () => void,
   ) => (
      <View className={layout === 'vertical' ? 'flex-col' : 'flex-row items-center'}>
         {showLabels && (
            <View className="flex-row items-center mb-2">
               <Text
                  className={`
              ${currentVariant.label} 
              font-appFont font-medium 
              ${currentSize.label}
              ${layout === 'horizontal' ? 'mr-4 min-w-[80px]' : ''}
            `}>
                  {label} {required && <Text className="text-appError">*</Text>}
               </Text>
               {renderValidationIcon()}
            </View>
         )}

         <View className={`flex-row ${currentSize.row}`}>
            {renderDateTimeButton('date', dateType, dateValue, onDatePress)}
            {renderDateTimeButton('time', dateType, timeValue, onTimePress)}
         </View>
      </View>
   );

   return (
      <View
         className={`
        ${currentVariant.container}
        ${currentSize.container}
        ${layoutConfig[layout]}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
         style={
            variant === 'card'
               ? {
                    shadowColor: 'rgb(var(--color-app-transparent) / 0.3)',
                    elevation: 2,
                 }
               : undefined
         }>
         {/* Start Date Row */}
         {renderDateRow(
            'start',
            startLabel,
            formattedDates.startDate,
            formattedDates.startTime,
            () => showDatePicker('startDate'),
            () => showTimePicker('startDate'),
         )}

         {/* End Date Row */}
         {renderDateRow(
            'end',
            endLabel,
            formattedDates.endDate,
            formattedDates.endTime,
            () => showDatePicker('endDate'),
            () => showTimePicker('endDate'),
         )}

         {/* Duration Display */}
         {showDuration && isValid && values.startDate && values.endDate && (
            <View
               className={`
            ${currentVariant.durationContainer}
            ${currentSize.button}
            flex-row items-center justify-center
            mt-2
          `}>
               <Info
                  size={currentSize.iconSize}
                  color="rgb(var(--color-app-icon))"
                  strokeWidth={2}
                  className="mr-2"
               />
               <Text
                  className={`
              ${currentVariant.durationText} 
              font-appFont 
              ${currentSize.durationText}
            `}>
                  Süre: {formatDuration()}
               </Text>
            </View>
         )}

         {/* Date Pickers */}
         {pickerState.showStartDate && (
            <DateTimePicker
               value={values.startDate}
               mode="date"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={onStartDateChange}
               minimumDate={minimumDate || new Date()}
               maximumDate={maximumDate}
            />
         )}

         {pickerState.showStartTime && (
            <DateTimePicker
               value={values.startDate}
               mode="time"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={onStartTimeChange}
            />
         )}

         {pickerState.showEndDate && (
            <DateTimePicker
               value={values.endDate}
               mode="date"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={onEndDateChange}
               minimumDate={values.startDate}
               maximumDate={maximumDate}
            />
         )}

         {pickerState.showEndTime && (
            <DateTimePicker
               value={values.endDate}
               mode="time"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={onEndTimeChange}
            />
         )}
      </View>
   );
};

export default StartToEndDateComponent;
