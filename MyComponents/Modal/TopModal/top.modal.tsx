import React, {useEffect} from 'react';
import {View, Text, ViewStyle} from 'react-native';
import Toast from 'react-native-toast-message';
import createStyles from './top.modal.style';
import {useStyles} from '@hooks/Modular/use.styles';

interface TopModalComponentProps {
  isOpen: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  onClose: () => void;
  message?: string;
  description?: string;
}

const TopModalComponent: React.FC<TopModalComponentProps> = ({
  isOpen,
  children,
  style,
  onClose,
  message = 'Bilgilendirme',
  description = '',
}) => {
  const styles = useStyles(createStyles);
  useEffect(() => {
    if (isOpen) {
      Toast.show({
        type: 'info',
        text1: message,
        text2: description,
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
        onHide: onClose,
      });
    }
  }, [isOpen]);

  return (
    <View style={[styles.container, style]}>
      <Toast
        config={{
          info: ({text1, text2}) => (
            <View style={styles.toastContainer}>
              <View style={{flex: 1}}>
                <Text style={styles.toastText} numberOfLines={2}>
                  {text1}
                </Text>
                {text2 && (
                  <Text
                    style={[styles.toastText, {fontSize: 12}]}
                    numberOfLines={1}>
                    {text2}
                  </Text>
                )}
                {children && <View style={{marginTop: 10}}>{children}</View>}
              </View>
              <View style={styles.iconContainer}>
                <Text>📈</Text>
              </View>
            </View>
          ),
        }}
      />
    </View>
  );
};

export default TopModalComponent;
