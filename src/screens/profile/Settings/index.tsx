import {StyleSheet, Text, View, Switch} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '@navigation/types';
import {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';
import {useThemeColors} from '@contexts/theme.provider';

type ScreenProps = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

const SettingsScreen: React.FC<ScreenProps> = () => {
  const {colorScheme, toggleTheme} = useThemeColors();
  const styles = useStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tema Seçimi</Text>
      <Switch value={colorScheme === 'dark'} onValueChange={toggleTheme} />
    </View>
  );
};

export default SettingsScreen;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    text: {
      color: colors.text,
      fontSize: 18,
      marginBottom: 10,
    },
  });
