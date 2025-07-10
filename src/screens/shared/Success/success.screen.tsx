import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/types';
import Colors, {ColorsSchema} from '@styles/common/colors';
import ButtonComponent from '@components/Button/Button';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useAuthContext} from '@contexts/auth.context';
import {useStyles} from '@hooks/Modular/use.styles';
type Props = NativeStackScreenProps<RootStackParamList, 'Success'>;

const SuccessScreen: React.FC<Props> = ({navigation, route}) => {
  const styles = useStyles(createStyles);
  let {success, toScreen} = route.params;
  const {token} = useAuthContext();
  if (!token) {
    if (toScreen === 'Main') {
      toScreen = 'Auth';
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer]}>
        <Image
          style={[styles.image]}
          source={require('@assets/images/check-circle.png')}
        />
      </View>
      <Text style={[styles.title]}>Başarılı</Text>
      <Text style={[styles.description]}>{success?.toString()}</Text>
      <ButtonComponent
        style={[styles.button]}
        title={`Geri uygulamaya dön`}
        onPress={() => navigation.reset({index: 0, routes: [{name: toScreen}]})}
      />
    </View>
  );
};

export default SuccessScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: styleNumbers.space * 2,
    },
    imageContainer: {
      width: 300,
      height: 300,
      borderRadius: 1000,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.cardBackground,
    },
    image: {
      width: 200,
      height: 200,
    },
    title: {
      ...CommonStyles.textStyles.title,
      marginTop: styleNumbers.space * 2,
      color: colors.button,
    },
    description: {
      ...CommonStyles.textStyles.paragraph,
      textAlign: 'center',
      marginTop: styleNumbers.space,
      color: colors.button,
    },
    button: {
      marginTop: styleNumbers.space * 2,
      width: '80%',
      backgroundColor: colors.button,
    },
  });
