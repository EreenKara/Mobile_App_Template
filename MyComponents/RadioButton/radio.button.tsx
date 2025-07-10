import Colors, {ColorsSchema} from '@styles/common/colors';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useStyles} from '@hooks/Modular/use.styles';

interface RadioButtonComponentProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioButtonComponent: React.FC<RadioButtonComponentProps> = ({
  label,
  selected,
  onPress,
}) => {
  const styles = useStyles(createStyles);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.radioCircle, selected && styles.selectedRadio]}>
        {selected && <View style={styles.radioInnerCircle} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.button,
      marginRight: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedRadio: {
      borderColor: colors.button,
    },
    radioInnerCircle: {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: colors.button,
    },
    label: {
      fontSize: 16,
    },
  });

export default RadioButtonComponent;
