import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Colors, { ColorsSchema } from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import MenuItemComponent from '@icomponents/MenuItem/menu.item';
import { useStyles } from '@hooks/Modular/use.styles';
import ButtonComponent from '@components/Button/Button';
import CommonStyles from '@styles/common/commonStyles';
import { useUserAddress } from '@hooks/use.user.address';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '@navigation/types';
import LoadingComponent from '@mycomponents/Loading/laoading';
interface AddressInformationScreenProps {
   navigation: NativeStackNavigationProp<ProfileStackParamList, 'AddressInformation'>;
}

const AddressInformationScreen: React.FC<AddressInformationScreenProps> = ({ navigation }) => {
   const styles = useStyles(createStyles);
   const { address, loading, error, fetchAddress } = useUserAddress();

   useEffect(() => {
      fetchAddress();
   }, []);

   return (
      <View style={styles.container}>
         <View style={styles.content}>
            <Image style={styles.image} source={require('@assets/images/home.png')} />
            <View style={styles.textDiv}>
               <Text style={styles.text}>Şehir:</Text>
               {loading ? (
                  <LoadingComponent size="large" />
               ) : (
                  <Text style={styles.text}>{address?.city ?? 'Bilgi yok.'}</Text>
               )}
            </View>
            <View style={styles.textDiv}>
               <Text style={styles.text}>İlçe:</Text>
               {loading ? (
                  <LoadingComponent size="large" />
               ) : (
                  <Text style={styles.text}>{address?.district ?? 'Bilgi yok.'}</Text>
               )}
            </View>

            <View style={styles.textDiv}>
               <Text style={styles.text}>Bina numarası:</Text>
               {loading ? (
                  <LoadingComponent size="small" />
               ) : (
                  <Text style={styles.text}>{address?.buildingNo ?? 'Bilgi yok.'}</Text>
               )}
            </View>
         </View>

         <ButtonComponent
            style={styles.button}
            title="Adres Bilgilerini Değiştir"
            onPress={() => {
               navigation.navigate('AddressChange', {
                  address: address,
               });
            }}
         />
      </View>
   );
};

export default AddressInformationScreen;

const createStyles = (colors: ColorsSchema) =>
   StyleSheet.create({
      container: {
         flex: 1,
         backgroundColor: colors.background,
         paddingHorizontal: styleNumbers.space * 2,
         paddingVertical: styleNumbers.space * 3,
      },
      content: {
         flex: 1,
      },
      image: {
         alignSelf: 'center',
         tintColor: colors.icon,
         width: 100,
         height: 100,
         borderRadius: 50,
         marginBottom: styleNumbers.space * 2,
      },
      button: {
         alignItems: 'flex-end',
      },
      text: {
         ...CommonStyles.textStyles.title,
      },
      textDiv: {
         flexDirection: 'row',
         justifyContent: 'space-evenly',
         width: '100%',
         marginBottom: styleNumbers.space * 2,
      },
   });
