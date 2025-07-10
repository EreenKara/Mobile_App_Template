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

interface SelectUserComponentProps {
  user: LightUserViewModel | null;
  setUser: (user: LightUserViewModel | null) => void;
}

export const SelectUserComponent: React.FC<SelectUserComponentProps> = ({
  user,
  setUser,
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
      setUser(users?.find(user => user.id === userId) ?? null); // Kullanıcı seçili değilse, ekle);
    },
    [users], // 🔥 `users` bağımlılık olarak eklendi
  );
  const renderUserItem = ({item}: {item: LightUserViewModel}) => {
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
          style={[styles.groupButton]}
          onPress={() => handleUserSelect(item.id || '')}>
          <Text style={[styles.plusIcon]}>{'[]'}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <SearchBarComponent
          debounceTime={300}
          handleSearch={handleSearch}
          debounce={true}
        />
        <View style={styles.listContainer}>
          <FlatListComponent
            data={searchQuery ? users ?? [] : []}
            ListEmptyComponent={
              searchQuery ? (
                <Text
                  style={[
                    {...CommonStyles.textStyles.subtitle},
                    {textAlign: 'center'},
                  ]}>
                  Kişi Bulunamadı
                </Text>
              ) : user ? (
                <>
                  <Text
                    style={[
                      {...CommonStyles.textStyles.title},
                      {
                        textAlign: 'center',
                        marginBottom: styleNumbers.space * 3,
                      },
                    ]}>
                    Seçilen Kişi
                  </Text>
                  {renderUserItem({item: user})}
                </>
              ) : (
                <Text
                  style={[
                    {...CommonStyles.textStyles.subtitle},
                    {textAlign: 'center'},
                  ]}>
                  Kişi Bulunamadı
                </Text>
              )
            }
            renderItem={renderUserItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </>
  );
};

export default SelectUserComponent;

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
