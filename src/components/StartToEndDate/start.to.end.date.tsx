import React, { useEffect, useState } from 'react';
import { View, Text, Platform, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonComponent from '@mycomponents/Button/Button';
import { handleDateTimeChange } from '@components/StartToEndDate/handleDateTimeChange';
import styleNumbers from '@styles/common/style.numbers';
import { ColorsSchema } from '@styles/common/colors';
import { useStyles } from '@hooks/Modular/use.styles';
import { ExtendedAsset } from '@hooks/common/useCamera';
import { useNotification } from '@contexts/notification.context';

interface StartToEndDateComponentProps {
   values: {
      title: string;
      description: string;
      image: ExtendedAsset | null;
      startDate: Date;
      endDate: Date;
   };
   setFieldValue: (field: string, value: any) => void;
   containerStyle?: StyleProp<ViewStyle>;
}

const StartToEndDateComponent: React.FC<StartToEndDateComponentProps> = ({
   values,
   setFieldValue,
   containerStyle,
}) => {
   const styles = useStyles(createStyles);
   const [showStartDate, setShowStartDate] = useState(false);
   const [showEndDate, setShowEndDate] = useState(false);
   const [showStartTime, setShowStartTime] = useState(false);
   const [showEndTime, setShowEndTime] = useState(false);
   const { showNotification } = useNotification();
   useEffect(() => {}, [values.startDate, values.endDate]);

   return (
      <View style={containerStyle}>
         <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Başlangıç:</Text>
            <View style={styles.dateTimeButtons}>
               <ButtonComponent
                  title={values.startDate.toLocaleDateString('tr-TR')}
                  onPress={() => setShowStartDate(true)}
                  style={styles.dateButton}
               />
               <ButtonComponent
                  title={values.startDate.toLocaleTimeString('tr-TR', {
                     hour: '2-digit',
                     minute: '2-digit',
                  })}
                  onPress={() => setShowStartTime(true)}
                  style={styles.timeButton}
               />
            </View>
         </View>

         <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Bitiş:</Text>
            <View style={styles.dateTimeButtons}>
               <ButtonComponent
                  title={values.endDate.toLocaleDateString('tr-TR')}
                  onPress={() => setShowEndDate(true)}
                  style={styles.dateButton}
               />
               <ButtonComponent
                  title={values.endDate.toLocaleTimeString('tr-TR', {
                     hour: '2-digit',
                     minute: '2-digit',
                  })}
                  onPress={() => setShowEndTime(true)}
                  style={styles.timeButton}
               />
            </View>
         </View>

         {showStartDate && (
            <DateTimePicker
               value={values.startDate}
               mode="date"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={(_, selectedDate) => {
                  setShowStartDate(false);
                  const message = handleDateTimeChange(
                     selectedDate,
                     values,
                     setFieldValue,
                     'startDate',
                     false,
                  );
                  message &&
                     showNotification({
                        message: message,
                        type: 'info',
                        modalType: 'snackbar',
                     });
               }}
               minimumDate={new Date()}
            />
         )}

         {showStartTime && (
            <DateTimePicker
               value={values.startDate}
               mode="time"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={(_, selectedDate) => {
                  setShowStartTime(false);
                  const message = handleDateTimeChange(
                     selectedDate,
                     values,
                     setFieldValue,
                     'startDate',
                     true,
                  );
                  message &&
                     showNotification({
                        message: message ?? '',
                        type: 'info',
                        modalType: 'snackbar',
                     });
               }}
            />
         )}

         {showEndDate && (
            <DateTimePicker
               value={values.endDate}
               mode="date"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={(_, selectedDate) => {
                  setShowEndDate(false);
                  handleDateTimeChange(selectedDate, values, setFieldValue, 'endDate', false);
               }}
               minimumDate={values.startDate}
            />
         )}

         {showEndTime && (
            <DateTimePicker
               value={values.endDate}
               mode="time"
               display={Platform.OS === 'ios' ? 'spinner' : 'default'}
               onChange={(_, selectedDate) => {
                  setShowEndTime(false);
                  handleDateTimeChange(selectedDate, values, setFieldValue, 'endDate', true);
               }}
            />
         )}
      </View>
   );
};

export default StartToEndDateComponent;

const createStyles = (colors: ColorsSchema) =>
   StyleSheet.create({
      dateContainer: {
         flexDirection: 'row',
         alignItems: 'center',
         marginBottom: styleNumbers.space,
      },
      dateLabel: {
         flex: 1,
         fontSize: styleNumbers.textSize,
      },
      dateTimeButtons: {
         flex: 2,
         flexDirection: 'row',
         gap: styleNumbers.spaceLittle,
      },
      dateButton: {
         flex: 2,
      },
      timeButton: {
         flex: 1,
      },
   });
