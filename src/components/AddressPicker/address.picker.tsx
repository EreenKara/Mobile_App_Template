import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Picker} from '@react-native-picker/picker';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import {useStyles} from '@hooks/Modular/use.styles';
import {useAddresses} from '@hooks/use.addresses';

interface AddressPickerComponentProps {
  values: {city: string; district: string};
  setFieldValue: (field: string, value: any) => void;
}

// Türkiye'nin illeri (örnek veri)
// const cities = [
//   'İstanbul',
//   'Ankara',
//   'İzmir',
//   // Diğer iller eklenebilir
// ];

// İlçeler için örnek veri (gerçek uygulamada API'den alınabilir)
// const districts: {[key: string]: string[]} = {
//   İstanbul: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Bakırköy'],
//   Ankara: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut'],
//   İzmir: ['Konak', 'Karşıyaka', 'Bornova', 'Buca', 'Çiğli'],
//   // Diğer şehirlerin ilçeleri eklenebilir
// };

const AddressPickerComponent = ({
  values,
  setFieldValue,
}: AddressPickerComponentProps) => {
  const styles = useStyles(createStyles);

  const {
    fetchCities,
    fetchDistricts,
    fetchNeighborhoods,
    cities,
    districts,
    neighborhoods,
  } = useAddresses();

  useEffect(() => {
    const getCities = async () => {
      await fetchCities();
    };
    getCities();
  }, []);

  useEffect(() => {
    if (values.city) {
      const getDistricts = async () => {
        await fetchDistricts(values.city);
      };
      getDistricts();
      setFieldValue('district', '');
      // Eğer seçili ilçe, yeni şehrin ilçeleri arasında yoksa ilçe seçimini sıfırla
    } else {
      setFieldValue('district', '');
    }
  }, [values.city]);

  return (
    <View style={styles.addressContainer}>
      <View style={styles.pickerContainer}>
        <Text
          style={[CommonStyles.textStyles.paragraph, styles.label, {left: 10}]}>
          Şehir
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={values.city}
            onValueChange={value => setFieldValue('city', value)}
            style={styles.picker}
            dropdownIconColor={Colors.getTheme().text}>
            <Picker.Item
              label="Şehir Seçiniz"
              value=""
              color={Colors.getTheme().placeholder}
            />
            {cities?.map(city => (
              <Picker.Item
                key={city.id}
                label={city.name}
                value={city.id}
                color={Colors.getTheme().text}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Text
          style={[CommonStyles.textStyles.paragraph, styles.label, {left: 10}]}>
          İlçe
        </Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={values.district}
            onValueChange={value => setFieldValue('district', value)}
            enabled={!!values.city}
            style={styles.picker}
            dropdownIconColor={Colors.getTheme().text}>
            <Picker.Item
              label="İlçe Seçiniz"
              value=""
              color={Colors.getTheme().placeholder}
            />
            {districts?.map(district => (
              <Picker.Item
                key={district.id}
                label={district.name}
                value={district.id}
                color={Colors.getTheme().text}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default AddressPickerComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    addressContainer: {
      flexDirection: 'column',
      gap: styleNumbers.space,
      marginBottom: styleNumbers.space * 3,
    },
    pickerContainer: {
      marginTop: styleNumbers.space * 2,
    },
    label: {
      marginBottom: styleNumbers.spaceLittle,
      color: colors.text,
      fontSize: styleNumbers.textSize * 0.9,
    },
    pickerWrapper: {
      borderWidth: styleNumbers.borderWidth,
      borderColor: colors.borderColor,
      borderRadius: styleNumbers.borderRadius,
      backgroundColor: colors.background,
      ...CommonStyles.shadowStyle,
    },
    picker: {
      color: colors.text,
    },
  });
