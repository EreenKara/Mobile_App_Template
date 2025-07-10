import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import ChoiceCardComponent from '@icomponents/ChoiceCard/choice.card';
import {ElectionInfoScreen} from '@screens/home';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {HomeStackParamList, SharedStackParamList} from '@navigation/types';
import Colors, {ColorsSchema} from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import {useStyles} from '@hooks/Modular/use.styles';
import useElectionChoicesDefault from '@hooks/use.election.choices.default';
import {useNavigation} from '@react-navigation/native';
type Props = NativeStackScreenProps<HomeStackParamList, 'PastCurrentUpcoming'>;
const windowWidth = Dimensions.get('window').width;

const PastCurrentUpcomingScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const heightNumber: number = 0.4;
  useEffect(() => {}, []);
  return (
    <View style={styles.container}>
      <View style={styles.transparentContainer}>
        <ChoiceCardComponent
          title="Geçmiş"
          description="Geçmişteki Seçimler"
          image={require('@assets/images/time-past.png')}
          onPress={() => {
            navigation.navigate('PrivateElections', {timeframe: 'past'});
          }}
          height={windowWidth * heightNumber}
          tintColor={Colors.getTheme().icon}
        />
        <ChoiceCardComponent
          title="Aktif"
          description="Şuanki Seçimler"
          image={require('@assets/images/on-time.png')}
          onPress={() => {
            navigation.navigate('PrivateElections', {timeframe: 'current'});
          }}
          height={windowWidth * heightNumber}
          tintColor={Colors.getTheme().icon}
        />
        <ChoiceCardComponent
          title="Gelecekteki"
          description="Gelecekteki Seçimler"
          image={require('@assets/images/time-left.png')}
          onPress={() => {
            navigation.navigate('PrivateElections', {timeframe: 'upcoming'});
          }}
          height={windowWidth * heightNumber}
          tintColor={Colors.getTheme().icon}
        />
      </View>
    </View>
  );
};

export default PastCurrentUpcomingScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    transparentContainer: {
      flex: 1,
      backgroundColor: colors.transparentColor,
      padding: styleNumbers.space,
    },
  });
