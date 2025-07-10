import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useStyles} from '@hooks/Modular/use.styles';
import {ColorsSchema} from '@styles/common/colors';
import {ProfileStackParamList} from '@navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useUserProfileContext} from '@contexts/user.profile.context';
import {text} from 'stream/consumers';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
type ScreenProps = NativeStackScreenProps<
  ProfileStackParamList,
  'PersonalInformation'
>;

const PersonalInformationScreen: React.FC<ScreenProps> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const {user, fetchUser, loading, error} = useUserProfileContext();

  useEffect(() => {
    const getUser = async () => {
      await fetchUser();
    };
    if (user === null) {
      getUser();
    }
  }, []);
  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        await fetchUser();
      };
      if (user === null) {
        getUser();
      }
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={
          user?.image
            ? {uri: user?.image}
            : require('@assets/images/person.png')
        }
      />
      <View style={styles.contentDiv}>
        <Text style={styles.title}>Email: </Text>
        <Text style={styles.subtitle}>{user?.email}</Text>
      </View>
      <View style={styles.contentDiv}>
        <Text style={styles.title}>İsim Soyisim: </Text>
        <Text style={styles.subtitle}>
          {user?.name} {user?.surname}
        </Text>
      </View>
      <View style={styles.contentDiv}>
        <Text style={styles.title}>Telefon Numarası: </Text>
        <Text style={styles.subtitle}>{user?.phoneNumber}</Text>
      </View>
      <View style={styles.contentDiv}>
        <Text style={styles.title}>TC No: </Text>
        <Text style={styles.subtitle}>{user?.identityNumber}</Text>
      </View>
    </View>
  );
};

export default PersonalInformationScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: styleNumbers.space * 2,
    },
    contentDiv: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: styleNumbers.space,
      paddingHorizontal: styleNumbers.space,
      margin: styleNumbers.space,
    },
    image: {
      width: '100%',
      height: 200,
      resizeMode: 'contain',
      marginTop: styleNumbers.space * 2,
      marginBottom: styleNumbers.space * 4,
    },
    title: {
      ...CommonStyles.textStyles.title,
    },
    subtitle: {
      ...CommonStyles.textStyles.subtitle,
    },
  });
