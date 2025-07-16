import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import SearchBarComponent from '@components/SearchBar/search.bar';
import FlatListComponent from '@components/List/flat.list';
import UserViewModel from '@viewmodels/user.viewmodel';
import ButtonComponent from '@components/Button/Button';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {useStyles} from '@hooks/Modular/use.styles';
import AvatarHeaderComponent from '@icomponents/AvatarHeader/avatar.header';
import {TextInput} from 'react-native-paper';
import TextInputComponent from '@components/TextInput/text.input';
import useUsers from '@hooks/use.users';
import useCreateGroup from '@hooks/use.create.group';
import LightUserViewModel from '@viewmodels/light.user.viewmodel';
import GroupViewModel from '@viewmodels/group.viewmodel';
import SelectUsersComponent from '@icomponents/SelectUsers/select.users';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@navigation/types';

interface AddressInformationScreenProps {
  navigation: NativeStackNavigationProp<
    ProfileStackParamList,
    'AddressInformation'
  >;
}

/* Item id 'si bu screen de zorunlu olarak verilmeli. */
const CreateGroupScreen: React.FC<AddressInformationScreenProps> = ({
  navigation,
}) => {
  const styles = useStyles(createStyles);
  const {createGroup, loading, success} = useCreateGroup();
  const [selectedUsers, setSelectedUsers] = useState<LightUserViewModel[]>([]);

  const [groupName, setGroupName] = useState<string>('');

  useEffect(() => {
    if (success === true) {
      navigation.replace('Groups');
    }
  }, [success]);
  return (
    <>
      <View style={styles.container}>
        <View>
          <TextInputComponent
            value={groupName}
            onChangeText={setGroupName}
            style={{marginBottom: styleNumbers.space}}
            placeholder="Grup Adı"></TextInputComponent>
        </View>
        <SelectUsersComponent
          selectedUsers={selectedUsers}
          setSelectedUsers={setSelectedUsers}
        />
        <View style={styles.createGroupButton}>
          <ButtonComponent
            title="Seçilen Kişilerden Grup Oluştur"
            onPress={() => {
              const group: GroupViewModel = {
                id: '',
                name: groupName,
                users: selectedUsers,
              };
              console.log('group olusturulurken kullancılar. ', group.users);
              createGroup(group);
            }}
            style={styles.createGroupButton}
          />
        </View>
      </View>
    </>
  );
};

export default CreateGroupScreen;

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
