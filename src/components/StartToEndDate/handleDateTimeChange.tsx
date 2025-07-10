import {useState} from 'react';
import {useNotification} from '@contexts/notification.context';
export const handleDateTimeChange = (
  selectedDate: Date | undefined,
  values: {startDate: Date; endDate: Date},
  setFieldValue: (field: string, value: any) => void,
  type: 'startDate' | 'endDate',
  isTimeChange: boolean,
) => {
  if (selectedDate) {
    const baseDate = type === 'startDate' ? values.startDate : values.endDate;
    const newDate = new Date(baseDate);

    if (isTimeChange) {
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
    } else {
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
    }

    setFieldValue(type, newDate);

    if (type === 'startDate') {
      if (values.endDate <= newDate) {
        const newEndDate = new Date(newDate);
        newEndDate.setDate(newDate.getDate() + 1);
        setFieldValue('endDate', newEndDate);
        return 'Başlangıç tarihi bitiş tarihinden sonra gelemez. Tarih güncellendi';
      }
    } else {
      if (values.startDate >= newDate) {
        const newStartDate = new Date(values.startDate);
        newStartDate.setDate(newDate.getDate() - 1);
        setFieldValue('startDate', newStartDate);
        return 'Bitiş tarihi başlangıç tarihinden önce gelemez. Tarih güncellendi.';
      }
    }
  }
};
