import React, {useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {useAuthContext, useThemeColors} from '@contexts/index';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList, RootStackParamList} from '@navigation/types';
import {useNavigation} from '@react-navigation/native';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ActivityIndicatorComponent from '@screens/shared/activity.indicator';
import MenuItemComponent from '@icomponents/MenuItem/menu.item';
import {useUserProfileContext} from '@contexts/user.profile.context';
import AvatarHeaderComponent from '@icomponents/AvatarHeader/avatar.header';
import {ElectionType} from '@enums/election.type';
import ErrorScreenComponent from '@screens/shared/error.screen';
import {useStyles} from '@hooks/Modular/use.styles';
type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'ProfileMain'>;
type RootProps = NativeStackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC<ScreenProps> = ({navigation}) => {
  const {colors} = useThemeColors();
  const styles = useStyles(createStyles);
  const rootNavigation = useNavigation<RootProps>();
  const {logout} = useAuthContext();
  const {user, fetchUser, loading, error} = useUserProfileContext();

  useEffect(() => {
    const getUser = async () => {
      await fetchUser();
      console.log('user', user);
    };
    getUser();
  }, []);
  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        await fetchUser();
      };
      getUser();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    rootNavigation.reset({
      index: 0,
      routes: [{name: 'Auth'}],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicatorComponent />
      </View>
    );
  }
  //if (error) {
  //  return <ErrorScreenComponent fromScreen="Profile" error={error} />;
  //}
  return (
    <ScrollView style={styles.container}>
      {/* Profil Başlığı */}
      <AvatarHeaderComponent
        user={user ? user : undefined}
        notifications={[
          {
            reasonTitle: 'Group Invitation',
            sender: 'Eren Kara',
            notificationCount: 1,
            time: new Date(),
            image: '',
          },
          {
            reasonTitle: 'Group Invitation',
            sender: 'Ali Eren',
            notificationCount: 2,
            time: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
            image: '',
          },
        ]}
      />
      {/* Menü Grupları */}
      <View style={styles.menuGroup}>
        <MenuItemComponent
          icon={require('@assets/images/person.png')}
          title="Kişisel Bilgiler"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('PersonalInformation');
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
        <MenuItemComponent
          icon={require('@assets/images/address.png')}
          title="Adres"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('AddressInformation');
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
        <MenuItemComponent
          icon={require('@assets/images/group-people.png')}
          title="Grup Oluştur"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('Groups');
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
      </View>

      <View style={styles.menuGroup}>
        <MenuItemComponent
          icon={require('@assets/images/elections.png')}
          title="Oluşturduğun Seçimler"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('Shared', {
              screen: 'ListElections',
              params: {type: ElectionType.Created},
            });
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
        <MenuItemComponent
          icon={require('@assets/images/b-box.png')}
          title="Oy Kullandığın Seçimler"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('Shared', {
              screen: 'ListElections',
              params: {type: ElectionType.Casted},
            });
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
        <MenuItemComponent
          icon={require('@assets/images/candidate.png')}
          title="Aday Olduğun Seçimler"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('Shared', {
              screen: 'ListElections',
              params: {type: ElectionType.BeingCandidate},
            });
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
      </View>
      <View style={styles.menuGroup}>
        <MenuItemComponent
          icon={require('@assets/images/payment.png')}
          title="Ödeme"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('Payment');
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
      </View>
      <View style={styles.menuGroup}>
        <MenuItemComponent
          icon={require('@assets/images/settings.png')}
          title="Ayarlar"
          tintColor={colors.icon}
          onPress={() => {
            navigation.navigate('Settings');
          }}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
      </View>

      <View style={styles.menuGroup}>
        <MenuItemComponent
          icon={require('@assets/images/logout.png')}
          imageStyle={{tintColor: colors.error}}
          textStyle={{color: colors.error}}
          title="Çıkış Yap"
          onPress={handleLogout}
          tintColor={colors.error}
          rightIcon={require('@assets/images/right-arrow.png')}
        />
      </View>
    </ScrollView>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: styleNumbers.space * 2,
    },
    centerContent: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuGroup: {
      marginTop: styleNumbers.space,
      paddingHorizontal: styleNumbers.space,
      backgroundColor: colors.transition,
      padding: styleNumbers.space * 2,
      borderRadius: styleNumbers.borderRadius * 2,
      borderWidth: 1,
      borderColor: colors.transparentColor,
    },
  });

export default ProfileScreen;
