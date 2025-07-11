import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { cssInterop } from 'nativewind';

const StyledBottomSheet = cssInterop(BottomSheet, {
   className: {
      target: 'handleStyle',
   },
   classNameIndicator: {
      target: 'handleIndicatorStyle',
   },
});

interface BottomSheetComponentProps {
   index: number;
   setIndex: (index: number) => void;
   children: React.ReactNode;
   style?: string;
   snapPoints?: string[];
}

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
   index,
   setIndex,
   snapPoints,
   children,
   style = '',
}) => {
   const bottomSheetRef = useRef<React.ElementRef<typeof BottomSheet>>(null);

   const snapPointsLocal = useMemo(() => (snapPoints ? snapPoints : ['30%', '58%']), [snapPoints]);

   const handleSheetChanges = useCallback(
      (index: number) => {
         setIndex(index);
      },
      [setIndex],
   );

   return (
      <GestureHandlerRootView className="flex-1">
         <StyledBottomSheet
            ref={bottomSheetRef}
            index={index}
            snapPoints={snapPointsLocal}
            onChange={handleSheetChanges}
            enablePanDownToClose
            onClose={() => setIndex(-1)}
            className="bg-appBackground rounded-t-lg"
            classNameIndicator="bg-appIndicator rounded-full w-10 h-1.5">
            <BottomSheetView className="flex-1 items-center bg-appTransition px-4 pt-4">
               {children}
            </BottomSheetView>
         </StyledBottomSheet>
      </GestureHandlerRootView>
   );
};

export default BottomSheetComponent;
