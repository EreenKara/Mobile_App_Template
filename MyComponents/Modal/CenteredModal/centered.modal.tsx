import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Modal,
  ViewStyle,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useStyles} from '@hooks/Modular/use.styles';

interface CenteredModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  withInput?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const CenteredModalComponent: React.FC<CenteredModalComponentProps> = ({
  isOpen,
  withInput,
  children,
  style,
  onClose,
  ...rest
}) => {
  const styles = useStyles(createStyles);
  const content = withInput ? (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.modalContent, style]}>
            {children}
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalContainer}>
        <TouchableWithoutFeedback>
          <View style={[styles.modalContent, style]}>{children}</View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      {...rest}
      onRequestClose={onClose}>
      {content}
    </Modal>
  );
};

export default CenteredModalComponent;
const {width, height} = Dimensions.get('window');

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: colors.transparentColor,
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: colors.cardBackground,
      padding: styleNumbers.space * 2,
      marginHorizontal: styleNumbers.space * 2,
      width: width * 0.9,
      height: height * 0.35,
      alignItems: 'center',
      borderRadius: styleNumbers.borderRadius,
      ...CommonStyles.shadowStyle,
    },
  });
