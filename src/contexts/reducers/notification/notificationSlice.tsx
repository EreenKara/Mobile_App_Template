// src/features/notification/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'info' | 'success' | 'error';
export type NotificationModalType = 'snackbar' | 'modal' | 'toast';

export interface NotificationOptions {
   message: string;
   type?: NotificationType;
   modalType?: NotificationModalType;
   duration?: number;
   actionLabel?: string;
   onActionPress?: () => void;
}

interface NotificationState {
   current: NotificationOptions | null;
   queue: NotificationOptions[];
   visible: boolean;
}

const initialState: NotificationState = {
   current: null,
   queue: [],
   visible: false,
};

const notificationSlice = createSlice({
   name: 'notification',
   initialState,
   reducers: {
      showNotification(state, action: PayloadAction<NotificationOptions>) {
         state.queue.push(action.payload);

         if (!state.visible && !state.current) {
            state.current = state.queue.shift() || null;
            state.visible = !!state.current;
         }
      },
      dismissNotification(state) {
         state.visible = false;
      },
      nextNotification(state) {
         if (state.queue.length > 0) {
            state.current = state.queue.shift()!;
            state.visible = true;
         } else {
            state.current = null;
            state.visible = false;
         }
      },
   },
});

export const { showNotification, dismissNotification, nextNotification } =
   notificationSlice.actions;

export default notificationSlice.reducer;
