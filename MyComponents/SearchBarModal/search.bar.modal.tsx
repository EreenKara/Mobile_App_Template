import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import SearchBarComponent from '@components/SearchBar/search.bar';
import {useStyles} from '@hooks/Modular/use.styles';
import styleNumbers from '@styles/common/style.numbers';

interface SearchBarModalComponentProps {
  handleSearch: () => void;
  title?: string;
  modalTitle?: string;
  searchBarTitle?: string;
  style?: StyleProp<ViewStyle>;
  iconTitleStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  isOpened?: boolean;
  setIsOpened?: (opened: boolean) => void;
}

const SearchBarModalComponent: React.FC<SearchBarModalComponentProps> = ({
  style,
  title = '',
  iconTitleStyle,
  modalTitle = 'Search',
  searchBarTitle = '',
  handleSearch,
  children,
  isOpened,
  setIsOpened,
}) => {
  const styles = useStyles(createStyles);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const Open = useCallback(() => {
    if (isOpened !== undefined) {
      // Eğer dışarıdan bir setIsOpened fonksiyonu geldiyse:
      setIsOpened?.(true); // Optional chaining ile çağrılıyor
    } else {
      // Yoksa kendi internal state'ini kullan
      setIsOpen(true);
    }
  }, [isOpened, setIsOpened]);

  const Close = useCallback(() => {
    if (isOpened !== undefined) {
      setIsOpened?.(false);
    } else {
      setIsOpen(false);
    }
  }, [isOpened, setIsOpened]);
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.iconView} onPress={Open}>
        <Text
          style={[
            CommonStyles.textStyles.paragraph,
            styles.text,
            iconTitleStyle,
          ]}>
          {title}
        </Text>
        <Image
          source={require('@assets/images/search-icon.png')}
          style={styles.searchIcon}
        />
      </TouchableOpacity>

      {/* TAM EKRAN MODAL */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isOpened ?? isOpen}
        onRequestClose={Close}>
        <View style={styles.fullScreenModal}>
          {/* Üst Kısım: Geri Tuşu ve Başlık */}
          <View style={styles.header}>
            <TouchableOpacity onPress={Close} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Kapat</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <View style={styles.blank} />
          </View>

          {/* Arama Çubuğu */}
          {children ?? (
            <SearchBarComponent
              modalTitle={searchBarTitle}
              titleStyle={styles.modalTitle}
              handleSearch={handleSearch}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default SearchBarModalComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {},
    searchIcon: {
      width: 24,
      height: 24,
      tintColor: colors.icon,
    },
    iconView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      padding: styleNumbers.space,
      backgroundColor: colors.background,
      borderRadius: styleNumbers.borderRadius,
    },
    text: {
      ...CommonStyles.textStyles.paragraph,
      paddingRight: styleNumbers.space,
    },
    fullScreenModal: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: styleNumbers.space * 3,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: styleNumbers.space,
      paddingBottom: styleNumbers.space,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    closeButton: {
      padding: styleNumbers.space,
      borderRadius: styleNumbers.borderRadius,
    },
    closeButtonText: {
      ...CommonStyles.textStyles.subtitle,
    },
    modalTitle: {
      ...CommonStyles.textStyles.title,
      paddingHorizontal: styleNumbers.space * 3,
      textAlign: 'center',
      flex: 1,
    },
    contentContainer: {
      flex: 1,
      padding: styleNumbers.space,
    },
    blank: {
      backgroundColor: 'red',
      width: styleNumbers.space * 3,
    },
  });
