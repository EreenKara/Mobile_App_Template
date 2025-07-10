import {ColorsSchema} from '@styles/common/colors';
import React from 'react';
import {Image, StyleSheet, ImageStyle} from 'react-native';
import {useStyles} from '@hooks/Modular/use.styles';

const NavBarTitle: React.FC = () => {
  const styles = useStyles(createStyles);
  const navlogo = require('@assets/images/nav_logo.png');

  return <Image style={styles.imagestyle} source={navlogo} />;
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    imagestyle: {
      tintColor: colors.icon,
      height: 50,
      width: 60,
      marginBottom: 5,
      resizeMode: 'contain',
    } as ImageStyle,
  });

export default NavBarTitle;
