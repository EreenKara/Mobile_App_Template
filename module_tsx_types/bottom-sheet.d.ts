declare module '@gorhom/bottom-sheet' {
  import {
    ComponentType,
    RefObject,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
  } from 'react';
  import {ViewStyle, StyleProp} from 'react-native';

  export interface BottomSheetProps {
    index: number;
    snapPoints: (string | number)[];
    onChange?: (index: number) => void;
    onClose?: () => void;
    style?: StyleProp<ViewStyle>;
    handleStyle?: StyleProp<ViewStyle>;
    handleIndicatorStyle?: StyleProp<ViewStyle>;
    enablePanDownToClose?: boolean;
    children?: React.ReactNode;
  }

  export interface BottomSheetViewProps {
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
  }

  export const BottomSheetView: ComponentType<BottomSheetViewProps>;

  const BottomSheet: ForwardRefExoticComponent<
    PropsWithoutRef<BottomSheetProps> & RefAttributes<BottomSheet>
  >;

  export default BottomSheet;
}
