import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import SearchBarComponent from '@components/SearchBarModal/search.bar.modal';
import ShoppingCartComponent from '@icomponents/ShoppingCart';
import SearchBarModalComponent from '@components/SearchBarModal/search.bar.modal';
import ButtonComponent from '@components/Button/Button';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  AuthStackParamList,
  HomeStackParamList,
  RootStackParamList,
} from '@navigation/types';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';
import {useThemeColors} from '@contexts/index';
import ExtendedListPickerComponent from '@icomponents/ExtendedListPicker';
type Props = NativeStackScreenProps<AuthStackParamList, 'Deneme'>;

const datas = [
  {
    id: '1',
    name: 'test',
    users: [],
  },
  {
    id: '2',
    name: 'test2',
    users: [],
  },
  {
    id: '3',
    name: 'test3',
    users: [],
  },
  {
    id: '1',
    name: 'test',
    users: [],
  },
  {
    id: '2',
    name: 'test2',
    users: [],
  },
  {
    id: '3',
    name: 'test3',
    users: [],
  },
  {
    id: '1',
    name: 'test',
    users: [],
  },
  {
    id: '2',
    name: 'test2',
    users: [],
  },
  {
    id: '3',
    name: 'test3',
    users: [],
  },
];

const DenemeScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const [selectedData, setSelectedData] = useState<any>(null);
  const homeNavigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  return (
    <View style={styles.container}>
      <SearchBarModalComponent handleSearch={() => {}} />
    </View>
  );
};

export default DenemeScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    picker: {
      height: 300,
    },
  });
