import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Colors, { ColorsSchema } from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import MenuItemComponent from '@icomponents/MenuItem/menu.item';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@navigation/types';
import ButtonComponent from '@components/Button/Button';
import ErrorComponent from '@screens/shared/error.screen';
import LoadingComponent from '@mycomponents/Loading/laoading';
import FlatListComponent from '@components/List/flat.list';
import GroupViewModel from '@viewmodels/group.viewmodel';
import LightGroupViewModel from '@viewmodels/light.group.viewmodel';
import { useUserProfileContext } from '@contexts/user.profile.context';
import CommonStyles from '@styles/common/commonStyles';
import { useStyles } from '@hooks/Modular/use.styles';
type GroupsProps = NativeStackScreenProps<ProfileStackParamList, 'Groups'>;

const GroupsScreen: React.FC<GroupsProps> = ({ navigation }) => {
   const styles = useStyles(createStyles);
   const {
      user,
      groups, // burada backend scces ve data döndürüyor yapcak bir şey yok
      groupsLoading: loading,
      groupsError: error,
      fetchGroups,
   } = useUserProfileContext();
   useEffect(() => {
      fetchGroups();
   }, []);
   useEffect(() => {
      fetchGroups();
   }, [user]);

   if (loading) {
      return <LoadingComponent />;
   }

   if (error) {
      return <ErrorComponent fromScreen="Groups" toScreen="ProfileMain" error={error} />;
   }

   const renderItem = ({ item }: { item: LightGroupViewModel }) => {
      return (
         <MenuItemComponent
            icon={require('@assets/images/group-people.png')}
            title={item.name}
            tintColor={Colors.getTheme().icon}
            onPress={() =>
               navigation.navigate('Group', {
                  group: item,
               })
            }
         />
      );
   };
   return (
      <View style={styles.container}>
         <View style={styles.listContainer}>
            <FlatListComponent
               data={groups ?? []}
               renderItem={renderItem}
               ListEmptyComponent={
                  <>
                     <Text style={styles.emptyText}>Grup bulunamadı</Text>
                  </>
               }
            />
         </View>
         <View style={styles.createGroupButton}>
            <ButtonComponent
               title="Yeni Grup Oluştur"
               onPress={() => {
                  navigation.navigate('CreateGroup');
               }}
               style={styles.createGroupButton}
            />
         </View>
      </View>
   );
};

export default GroupsScreen;

const createStyles = (colors: ColorsSchema) =>
   StyleSheet.create({
      container: {
         flex: 1,
         backgroundColor: colors.background,
         paddingHorizontal: styleNumbers.space * 2,
         paddingVertical: styleNumbers.space * 3,
      },
      listContainer: {
         flex: 1,
         width: '100%',
         paddingVertical: styleNumbers.space,
      },
      createGroupButton: {
         marginTop: styleNumbers.space,
      },
      emptyText: {
         ...CommonStyles.textStyles.paragraph,
         color: colors.text,
         textAlign: 'center',
      },
   });
