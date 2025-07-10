import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@navigation/types';

interface CreatedElectionsScreenProps {
  navigation: NativeStackNavigationProp<
    ProfileStackParamList,
    'CreatedElections'
  >;
}

const CreatedElectionsScreen: React.FC<CreatedElectionsScreenProps> = ({
  navigation,
}) => {
  return (
    <View>
      <Text>CreatedElectionsScreen</Text>
    </View>
  );
};

export default CreatedElectionsScreen;
