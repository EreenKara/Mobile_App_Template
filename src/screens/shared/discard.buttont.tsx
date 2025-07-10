import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ButtonComponent from '@components/Button/Button';
import Colors, {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';

interface DiscardButtonComponentProps {
  onPress: () => void;
}

const DiscardButtonComponent: React.FC<DiscardButtonComponentProps> = ({
  onPress,
}) => {
  const styles = useStyles(createStyles);
  return (
    <ButtonComponent style={styles.button} title="İptal Et" onPress={onPress} />
  );
};

export default DiscardButtonComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.errorButton,
    },
  });
