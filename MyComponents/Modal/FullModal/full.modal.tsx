import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Modal,
  ViewStyle,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import React from 'react';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Text} from 'react-native-paper';
import {useStyles} from '@hooks/Modular/use.styles';

interface FullModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  withInput?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
}

const FullModalComponent: React.FC<FullModalComponentProps> = ({
  isOpen,
  title,
  children,
  style,
  onClose,
  ...rest
}) => {
  const styles = useStyles(createStyles);
  const content = (
    <SafeAreaView style={[styles.modal, style]}>
      <View style={styles.navbar}>
        <TouchableOpacity
          style={[styles.closeButton, {marginRight: styleNumbers.space * 2}]}
          onPress={onClose}>
          <Image
            source={require('@assets/images/X.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[CommonStyles.textStyles.title, styles.title]}>
            {title}
          </Text>
        </View>
        <View style={styles.closeButton}></View>
      </View>
      <KeyboardAwareScrollView
        style={styles.modalContent}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{flex: 1}}>
        {children}
      </KeyboardAwareScrollView>
    </SafeAreaView>
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

export default FullModalComponent;
const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    modal: {
      flex: 1,
      backgroundColor: colors.cardBackground,
      marginTop: StatusBar.currentHeight,
    },
    modalContent: {
      padding: styleNumbers.space * 2,
    },
    closeButton: {
      position: 'relative',
      width: 50,
      height: 50,
      marginHorizontal: styleNumbers.space,
    },
    closeIcon: {
      width: 50,
      height: 50,
      tintColor: colors.errorButton,
    },
    navbar: {
      width: '100%',
      backgroundColor: colors.cardText,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: styleNumbers.space * 2,
    },
    title: {
      textAlign: 'center',
      color: colors.cardBackground,
      fontSize: styleNumbers.textSize * 2,
    },
    titleContainer: {
      flex: 1,
    },
  });
