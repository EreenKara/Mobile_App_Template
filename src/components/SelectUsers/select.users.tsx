import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import Colors, {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';
import useUsers from '@hooks/use.users';
import {useCallback, useEffect, useState} from 'react';
import LightUserViewModel from '@viewmodels/light.user.viewmodel';
import FlatListComponent from '@components/List/flat.list';
import SearchBarComponent from '@components/SearchBar/search.bar';
import TextInputComponent from '@components/TextInput/text.input';

interface SelectUsersComponentProps {
  selectedUsers: LightUserViewModel[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<LightUserViewModel[]>>;
}

export const SelectUsersComponent: React.FC<SelectUsersComponentProps> = ({
  selectedUsers,
  setSelectedUsers,
}) => {
  const styles = useStyles(createStyles);
  const {fetchUsers, users} = useUsers();
  const [searchQuery, setSearchQuery] = useState<string>('');
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleSearch = useCallback((text: string) => {
    console.log('text', text);
    setSearchQuery(text);
    /*const filteredUsers = initialUsers.filter(user =>
    user.name?.toLowerCase().includes(text.toLowerCase()),
    );
    setUsers(filteredUsers);*/
  }, []);
  const handleUserSelect = useCallback(
    (userId: string) => {
      setSelectedUsers(prev => {
        const isSelected = prev.some(user => user.id === userId);
        return isSelected
          ? prev.filter(user => user.id !== userId) // Kullanıcı seçiliyse, çıkar
          : [...prev, users?.find(user => user.id === userId)!]; // Kullanıcı seçili değilse, ekle
      });
    },
    [users], // 🔥 `users` bağımlılık olarak eklendi
  );
  const renderUserItem = ({item}: {item: LightUserViewModel}) => {
    const isSelected = selectedUsers.some(user => user.id === item.id);

    return (
      <View style={styles.userItem}>
        <Image
          source={
            item.image
              ? {uri: item.image}
              : require('@assets/images/no-avatar.png')
          }
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {item?.name} {item?.surname}
          </Text>
          <Text style={styles.userTitle}>{item?.username}</Text>
        </View>
        <TouchableOpacity
          style={[styles.groupButton, isSelected && styles.selectedGroupButton]}
          onPress={() => handleUserSelect(item.id || '')}>
          <Text
            style={[styles.plusIcon, isSelected && styles.selectedPlusIcon]}>
            {isSelected ? '✓' : '+'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <SearchBarComponent
          debounceTime={300}
          modalTitle="Kişi Arayın"
          handleSearch={handleSearch}
          debounce={true}
        />
        <View style={styles.listContainer}>
          <FlatListComponent
            data={searchQuery ? users ?? [] : selectedUsers}
            ListEmptyComponent={
              <Text
                style={[
                  {...CommonStyles.textStyles.subtitle},
                  {textAlign: 'center'},
                ]}>
                {searchQuery ? 'Kişi bulunamadı' : 'Seçilen kişiler yok'}
              </Text>
            }
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
};

export default SelectUsersComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: styleNumbers.space * 2,
    },
    listContainer: {
      flex: 1,
      width: '100%',
      paddingVertical: styleNumbers.space,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: styleNumbers.space * 1.5,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: styleNumbers.space * 2,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      ...CommonStyles.textStyles.subtitle,
      marginBottom: styleNumbers.spaceLittle,
    },
    userTitle: {
      ...CommonStyles.textStyles.paragraph,
      color: colors.placeholder,
    },
    groupButton: {
      width: styleNumbers.iconSize * 2,
      height: styleNumbers.iconSize * 2,
      borderRadius: styleNumbers.borderRadius * 2,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
    },
    selectedGroupButton: {
      backgroundColor: colors.button,
      borderColor: colors.button,
    },
    plusIcon: {
      ...CommonStyles.textStyles.paragraph,
      fontSize: styleNumbers.textSize * 2,
    },
    selectedPlusIcon: {
      color: colors.background,
    },
    createGroupButton: {
      marginTop: styleNumbers.space,
    },
  });
