// src/components/NotificationContainer.tsx
import React, { useEffect } from 'react';
import { Snackbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@contexts/store';
import { dismissNotification, nextNotification } from '../notification/notificationSlice';
import { useThemeColors } from '@contexts/index';

export const NotificationContainer = () => {
   const dispatch = useDispatch<AppDispatch>();
   const { current, visible } = useSelector((state: RootState) => state.notification);
   const { colors } = useThemeColors();

   useEffect(() => {
      if (!visible) {
         dispatch(nextNotification());
      }
   }, [visible]);

   const getBackgroundColor = () => {
      switch (current?.type) {
         case 'success':
            return colors.button;
         case 'info':
            return colors.button;
         case 'error':
            return colors.error;
         default:
            return colors.transition;
      }
   };

   if (!current || (current.modalType && current.modalType !== 'snackbar') || !current.message)
      return null;

   return (
      <Snackbar
         visible={visible}
         onDismiss={() => dispatch(dismissNotification())}
         duration={current.duration ?? 3000}
         action={
            current.actionLabel
               ? {
                    label: current.actionLabel,
                    onPress: () => {
                       current.onActionPress?.();
                       dispatch(dismissNotification());
                    },
                 }
               : undefined
         }
         style={{ backgroundColor: getBackgroundColor() }}>
         {current.message}
      </Snackbar>
   );
};
