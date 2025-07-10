import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import MenuItemComponent from '@icomponents/MenuItem/menu.item';
import {useStyles} from '@hooks/Modular/use.styles';
import ButtonComponent from '@components/Button/Button';
import CommonStyles from '@styles/common/commonStyles';
import {useUserAddress} from '@hooks/use.user.address';
import {ProfileStackParamList} from '@navigation/types';
import TextInputComponent from '@components/TextInput/text.input';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AddressPickerComponent from '@icomponents/AddressPicker/address.picker';
import {Formik} from 'formik';
import {useAddressChange} from '@hooks/use.address.change';
import {AddressChangeViewModel} from '@viewmodels/address.change.viewmodel';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddressChange'>;

interface FormValues {
  city: string;
  district: string;
}
const AddressChangeScreen: React.FC<Props> = ({navigation, route}) => {
  const {address} = route.params;
  const styles = useStyles(createStyles);
  const {loading, success, error, changeAddress} = useAddressChange();
  useEffect(() => {
    if (success === true) {
      navigation.navigate('ProfileMain');
    }
  }, [success]);
  const initialValues: FormValues = {
    city: '',
    district: '',
  };
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('@assets/images/home.png')} />
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: FormValues) => {
          const data: AddressChangeViewModel = {
            cityId: values.city,
            districtId: values.district,
            hoodId: '',
            buildingNo: '',
          };
          changeAddress(data);
        }}>
        {({values, handleSubmit, handleChange, setFieldValue}) => {
          return (
            <View style={styles.content}>
              <AddressPickerComponent
                values={values}
                setFieldValue={setFieldValue}
              />
              <ButtonComponent
                style={styles.button}
                title="Adres Bilgilerini Değiştir"
                onPress={handleSubmit}
              />
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

export default AddressChangeScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: styleNumbers.space * 2,
      paddingVertical: styleNumbers.space * 3,
    },
    content: {
      flex: 1,
      width: '100%',
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
    textInput: {
      width: '100%',
    },
  });
