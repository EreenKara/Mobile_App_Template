import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '@navigation/types';
import Colors from '@styles/common/colors';
import ButtonComponent from '@components/Button/Button';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useAuthContext} from '@contexts/auth.context';

type Props = NativeStackScreenProps<RootStackParamList, 'Error'>;

const ErrorScreen: React.FC<Props> = ({navigation, route}) => {
  let {error, toScreen} = route.params;
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
          source={require('@assets/images/X.png')}
        />
      </View>
      <Text style={[styles.title]}>Hata</Text>
      <Text style={[styles.description]}>
        {error?.toString() || 'Bilinmeyen bir hata oluştu.'}
      </Text>
      <ButtonComponent
        style={[styles.button]}
        title={`Geri uygulamaya dön`}
        onPress={() => navigation.reset({index: 0, routes: [{name: toScreen}]})}
      />
    </View>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.getTheme().background,
    paddingHorizontal: styleNumbers.space * 2,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.getTheme().warning,
  },
  image: {
    width: 200,
    height: 200,
    tintColor: Colors.getTheme().error,
  },
  title: {
    ...CommonStyles.textStyles.title,
    marginTop: styleNumbers.space * 2,
    color: Colors.getTheme().error,
  },
  description: {
    ...CommonStyles.textStyles.paragraph,
    textAlign: 'center',
    marginTop: styleNumbers.space,
    color: Colors.getTheme().error,
  },
  button: {
    marginTop: styleNumbers.space * 2,
    width: '80%',
    backgroundColor: Colors.getTheme().errorButton,
  },
});
