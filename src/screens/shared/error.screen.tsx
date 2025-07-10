import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useNavigation} from '@react-navigation/native';
import {useStyles} from '@hooks/Modular/use.styles';
import {ColorsSchema} from '@styles/common/colors';

interface ErrorScreenProps {
  fromScreen: string;
  toScreen?: string;
  error?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const ErrorScreenComponent: React.FC<ErrorScreenProps> = ({
  fromScreen,
  toScreen = 'Home',
  error = 'Bir hata oluştu',
  onRetry,
  fullScreen = true,
}) => {
  const navigation = useNavigation();
  const styles = useStyles(createStyles);
  return (
    <View
      style={[
        styles.container,
        fullScreen ? styles.fullScreen : styles.partialScreen,
      ]}>
      <View style={styles.content}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorMessage}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.navigate(toScreen as never)}>
          <Text style={styles.retryText}>Kurtar Beni</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      ...CommonStyles.viewStyles.centerContainer,
      padding: styleNumbers.space,
    },
    fullScreen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    partialScreen: {
      backgroundColor: colors.cardBackground,
      borderRadius: styleNumbers.borderRadius,
      margin: styleNumbers.space,
      ...CommonStyles.shadowStyle,
    },
    content: {
      alignItems: 'center',
      padding: styleNumbers.space,
    },
    errorIcon: {
      fontSize: styleNumbers.textSize * 3,
      marginBottom: styleNumbers.space,
    },
    errorMessage: {
      ...CommonStyles.textStyles.paragraph,
      color: colors.error,
      textAlign: 'center',
      marginBottom: styleNumbers.space * 2,
    },
    retryButton: {
      backgroundColor: colors.button,
      paddingHorizontal: styleNumbers.space * 2,
      paddingVertical: styleNumbers.space,
      borderRadius: styleNumbers.borderRadius,
      marginTop: styleNumbers.space,
    },
    retryText: {
      ...CommonStyles.textStyles.paragraph,
      color: colors.text,
    },
  });

export default ErrorScreenComponent;
