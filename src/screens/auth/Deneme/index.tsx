import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@navigation/NavigationTypes';

type Props = NativeStackScreenProps<AuthStackParamList, 'Deneme'>;

const DenemeScreen: React.FC<Props> = ({ navigation }) => {
   return <View></View>;
};

export default DenemeScreen;
