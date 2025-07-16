// hooks/useDateRange.ts
import { useState, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';

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
      | 'max_date_violation';
   message: string;
   correctedDates?: DateRangeValues;
}

export interface UseDateRangeOptions {
   initialStartDate?: Date;
   initialEndDate?: Date;
   minimumDate?: Date;
   maximumDate?: Date;
   minimumDuration?: number; // days
   maximumDuration?: number; // days
   autoCorrection?: boolean;
   onDateChange?: (dates: DateRangeValues) => void;
   onValidationError?: (error: DateValidationError) => void;
   onValidationSuccess?: () => void;
   dateFormat?: 'tr-TR' | 'en-US' | string;
   timeFormat?: '12h' | '24h';
}

export interface DateRangeState {
   showStartDate: boolean;
   showEndDate: boolean;
   showStartTime: boolean;
   showEndTime: boolean;
   isValidRange: boolean;
   validationError: DateValidationError | null;
}

export const useDateRange = (options: UseDateRangeOptions = {}) => {
   const {
      initialStartDate = new Date(),
      initialEndDate = new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
      minimumDate,
      maximumDate,
      minimumDuration = 0,
      maximumDuration,
      autoCorrection = true,
      onDateChange,
      onValidationError,
      onValidationSuccess,
      dateFormat = 'tr-TR',
      timeFormat = '24h',
   } = options;

   // State management
   const [dates, setDates] = useState<DateRangeValues>({
      startDate: initialStartDate,
      endDate: initialEndDate,
   });

   const [state, setState] = useState<DateRangeState>({
      showStartDate: false,
      showEndDate: false,
      showStartTime: false,
      showEndTime: false,
      isValidRange: true,
      validationError: null,
   });

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

   // Validation functions
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

         // Check if start date is after end date
         if (startDate >= endDate) {
            const correctedEndDate = new Date(startDate);
            correctedEndDate.setDate(startDate.getDate() + 1);

            return {
               type: 'start_after_end',
               message: 'Başlangıç tarihi bitiş tarihinden sonra olamaz',
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
            return {
               type: 'start_after_end',
               message: `Minimum ${minimumDuration} gün seçilmelidir`,
            };
         }

         // Check maximum duration
         if (maximumDuration && durationDays > maximumDuration) {
            return {
               type: 'start_after_end',
               message: `Maksimum ${maximumDuration} gün seçilebilir`,
            };
         }

         return null;
      },
      [minimumDate, maximumDate, minimumDuration, maximumDuration, formatDate],
   );

   // Date change handler
   const handleDateTimeChange = useCallback(
      (
         selectedDate: Date | undefined,
         type: 'startDate' | 'endDate',
         isTimeChange: boolean = false,
      ): DateValidationError | null => {
         if (!selectedDate) return null;

         const currentDates = { ...dates };
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
         const validationError = validateDateRange(updatedDates.startDate, updatedDates.endDate);

         if (validationError && autoCorrection && validationError.correctedDates) {
            // Apply auto-correction
            const correctedDates = validationError.correctedDates;
            setDates(correctedDates);
            setState(prev => ({
               ...prev,
               isValidRange: false,
               validationError,
            }));

            onDateChange?.(correctedDates);
            onValidationError?.(validationError);

            return validationError;
         } else if (validationError) {
            // Don't update dates, just show error
            setState(prev => ({
               ...prev,
               isValidRange: false,
               validationError,
            }));

            onValidationError?.(validationError);
            return validationError;
         } else {
            // Valid date range
            setDates(updatedDates);
            setState(prev => ({
               ...prev,
               isValidRange: true,
               validationError: null,
            }));

            onDateChange?.(updatedDates);
            onValidationSuccess?.();
            return null;
         }
      },
      [
         dates,
         validateDateRange,
         autoCorrection,
         onDateChange,
         onValidationError,
         onValidationSuccess,
      ],
   );

   // Show/hide picker handlers
   const showDatePicker = useCallback((type: 'startDate' | 'endDate') => {
      setState(prev => ({
         ...prev,
         showStartDate: type === 'startDate',
         showEndDate: type === 'endDate',
         showStartTime: false,
         showEndTime: false,
      }));
   }, []);

   const showTimePicker = useCallback((type: 'startDate' | 'endDate') => {
      setState(prev => ({
         ...prev,
         showStartDate: false,
         showEndDate: false,
         showStartTime: type === 'startDate',
         showEndTime: type === 'endDate',
      }));
   }, []);

   const hidePickers = useCallback(() => {
      setState(prev => ({
         ...prev,
         showStartDate: false,
         showEndDate: false,
         showStartTime: false,
         showEndTime: false,
      }));
   }, []);

   // Date picker event handlers
   const onStartDateChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         return handleDateTimeChange(selectedDate, 'startDate', false);
      },
      [handleDateTimeChange, hidePickers],
   );

   const onEndDateChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         return handleDateTimeChange(selectedDate, 'endDate', false);
      },
      [handleDateTimeChange, hidePickers],
   );

   const onStartTimeChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         return handleDateTimeChange(selectedDate, 'startDate', true);
      },
      [handleDateTimeChange, hidePickers],
   );

   const onEndTimeChange = useCallback(
      (event: any, selectedDate?: Date) => {
         if (Platform.OS === 'android') {
            hidePickers();
         }
         return handleDateTimeChange(selectedDate, 'endDate', true);
      },
      [handleDateTimeChange, hidePickers],
   );

   // Computed values
   const duration = useMemo(() => {
      const durationMs = dates.endDate.getTime() - dates.startDate.getTime();
      const days = Math.floor(durationMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((durationMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000));

      return { days, hours, minutes, totalMs: durationMs };
   }, [dates]);

   const formattedDates = useMemo(
      () => ({
         startDate: formatDate(dates.startDate),
         endDate: formatDate(dates.endDate),
         startTime: formatTime(dates.startDate),
         endTime: formatTime(dates.endDate),
      }),
      [dates, formatDate, formatTime],
   );

   // Manual date setters
   const setStartDate = useCallback(
      (date: Date) => {
         handleDateTimeChange(date, 'startDate', false);
      },
      [handleDateTimeChange],
   );

   const setEndDate = useCallback(
      (date: Date) => {
         handleDateTimeChange(date, 'endDate', false);
      },
      [handleDateTimeChange],
   );

   const setDateRange = useCallback(
      (startDate: Date, endDate: Date) => {
         const validationError = validateDateRange(startDate, endDate);

         if (!validationError) {
            setDates({ startDate, endDate });
            setState(prev => ({
               ...prev,
               isValidRange: true,
               validationError: null,
            }));
            onDateChange?.({ startDate, endDate });
            onValidationSuccess?.();
         } else {
            setState(prev => ({
               ...prev,
               isValidRange: false,
               validationError,
            }));
            onValidationError?.(validationError);
         }
      },
      [validateDateRange, onDateChange, onValidationSuccess, onValidationError],
   );

   // Clear validation error
   const clearValidationError = useCallback(() => {
      setState(prev => ({
         ...prev,
         validationError: null,
         isValidRange: true,
      }));
   }, []);

   return {
      // Core date values
      dates,
      formattedDates,
      duration,

      // State
      state,

      // Validation
      isValid: state.isValidRange,
      validationError: state.validationError,

      // Picker visibility handlers
      showDatePicker,
      showTimePicker,
      hidePickers,

      // Date change handlers
      onStartDateChange,
      onEndDateChange,
      onStartTimeChange,
      onEndTimeChange,

      // Manual setters
      setStartDate,
      setEndDate,
      setDateRange,

      // Utility
      clearValidationError,
      validateDateRange,
      formatDate,
      formatTime,
   };
};
