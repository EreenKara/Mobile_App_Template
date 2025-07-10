import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Avatar} from 'react-native-paper';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import NotificationViewModel from '@viewmodels/notification.viewmodel';
import NotificationBellComponent from '@icomponents/NotificationBell/notification.bell';
import LightUserViewModel from '@viewmodels/light.user.viewmodel';
import {useStyles} from '@hooks/Modular/use.styles';
import UserViewModel from '@viewmodels/user.viewmodel';
interface AvatarHeaderComponentProps {
  user?: UserViewModel;
  notifications: NotificationViewModel[];
}

const AvatarHeaderComponent = ({
  user,
  notifications,
}: AvatarHeaderComponentProps) => {
  const styles = useStyles(createStyles);
  return (
    <View style={styles.header}>
      <Avatar.Image
        style={styles.avatar}
        size={80}
        source={
          user?.image
            ? {uri: user.image}
            : require('@assets/images/no-avatar.png')
        }
      />
      <View style={styles.headerText}>
        <Text style={[CommonStyles.textStyles.title]}>
          {user?.name} {user?.surname}
        </Text>
        <Text style={[CommonStyles.textStyles.paragraph]}>{user?.email}</Text>
      </View>
      <NotificationBellComponent notifications={notifications} />
    </View>
  );
};

export default AvatarHeaderComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    header: {
      padding: styleNumbers.space * 2,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    headerText: {
      marginLeft: styleNumbers.space * 2,
    },

    avatar: {
      zIndex: 1,
      backgroundColor: colors.icon,
    },
  });
