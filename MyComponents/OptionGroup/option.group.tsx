import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import RadioButtonComponent from '@components/RadioButton/radio.button';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import Colors, {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';

interface OptionGroupProps {
  title: string;
  options: string[];
  onOptionSelect?: (selectedOption: string) => void;
}

const OptionGroup: React.FC<OptionGroupProps> = ({
  title,
  options,
  onOptionSelect,
}) => {
  const styles = useStyles(createStyles);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handlePress = (option: string) => {
    setSelectedOption(option);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => (
          <RadioButtonComponent
            key={option}
            label={option}
            selected={selectedOption === option}
            onPress={() => handlePress(option)}
          />
        ))}
      </View>
    </View>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginVertical: styleNumbers.space,
    },
    groupTitle: {
      ...CommonStyles.textStyles.subtitle,
      textAlign: 'center',
      marginBottom: styleNumbers.space,
    },
    optionsContainer: {
      backgroundColor: colors.transition,
      flexWrap: 'wrap',
      padding: styleNumbers.space,
      borderWidth: 1,
      borderColor: colors.button,
      borderRadius: styleNumbers.borderRadius,
    },
  });

export default OptionGroup;
