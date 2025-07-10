import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import TextInputComponent from '@components/TextInput/text.input';
import {useStyles} from '@hooks/Modular/use.styles';
import {useDebounce} from '@hooks/Modular/use.debounce';
interface SearchBarComponentProps {
  modalTitle?: string;
  placeholder?: string;
  handleSearch?: (value: string) => void;
  inputStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  debounceTime?: number;
  debounce?: boolean;
}
const SearchIcon = () => {
  const styles = useStyles(createStyles);
  return (
    <Image
      source={require('@assets/images/search-icon.png')}
      style={styles.searchIcon}
    />
  );
};

const SearchBarComponent: React.FC<SearchBarComponentProps> = ({
  placeholder = '',
  modalTitle = '',
  handleSearch,
  inputStyle,
  titleStyle,
  debounceTime = 500,
  debounce = false,
}) => {
  const styles = useStyles(createStyles);
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, debounceTime);
  useEffect(() => {
    if (debounce) {
      handleSearch?.(debouncedValue);
    }
  }, [debouncedValue]);
  return (
    <View style={styles.searchContainer}>
      <Text style={[CommonStyles.textStyles.title, styles.text, titleStyle]}>
        {modalTitle}
      </Text>
      <TextInputComponent
        placeholder={placeholder}
        viewStyle={[inputStyle]}
        leftIcon={<SearchIcon />}
        value={value}
        onChangeText={setValue}
      />
    </View>
  );
};

export default SearchBarComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    searchContainer: {
      flexDirection: 'column',
      width: '100%',
      alignItems: 'center',
      borderRadius: styleNumbers.borderRadius,
      paddingHorizontal: styleNumbers.space * 2,
    },
    text: {
      paddingRight: styleNumbers.space / 2,
    },
    searchIcon: {
      width: 20,
      height: 20,
    },
  });
