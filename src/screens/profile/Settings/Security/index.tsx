import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList, RootStackParamList } from '@navigation/NavigationTypes';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Security'>;

const SecurityScreen: React.FC<ScreenProps> = ({ navigation }) => {
   return <></>;
};

export default SecurityScreen;
