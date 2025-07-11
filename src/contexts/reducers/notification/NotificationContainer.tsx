// src/components/NotificationContainer.tsx - Alternatif Yaklaşım
import React, { useEffect } from 'react';
import { Snackbar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@contexts/store';
import { dismissNotification, nextNotification } from '../notification/notificationSlice';
import customColors from '@styles/tailwind.colors';

export const NotificationContainer = () => {
   const dispatch = useDispatch<AppDispatch>();
   const { current, visible, queue } = useSelector((state: RootState) => state.notification);

   const handleDismiss = () => {
      dispatch(dismissNotification());
   };
   useEffect(() => {
      if (!current && queue.length > 0) {
         dispatch(nextNotification());
      }
   }, [current, dispatch]);

   if (!current || (current.modalType && current.modalType !== 'snackbar') || !current.message)
      return <></>;

   return (
      <Snackbar
         visible={visible}
         onDismiss={handleDismiss}
         duration={current.duration ?? 3000}
         action={
            current.actionLabel
               ? {
                    label: current.actionLabel,
                    onPress: () => {
                       current.onActionPress?.();
                       handleDismiss();
                    },
                 }
               : undefined
         }
         style={{ backgroundColor: customColors?.appButton }}>
         {current.message}
      </Snackbar>
   );
};
