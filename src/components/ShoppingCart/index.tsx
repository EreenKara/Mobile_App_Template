import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import styleNumbers from '@styles/common/style.numbers';
import {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';
interface ShoppingCartComponentProps {
  totalPrice: number;
  style?: StyleProp<ViewStyle>;
}

const ShoppingCartComponent = ({
  totalPrice = 0,
  style,
}: ShoppingCartComponentProps) => {
  const styles = useStyles(createStyles);
  return (
    <View style={[styles.cartContainer, style]}>
      <Image
        source={require('@assets/images/shopping-cart.png')}
        style={styles.cartIcon}
      />
      <Text style={styles.cartText}>{totalPrice}₺</Text>
    </View>
  );
};

export default ShoppingCartComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    cartContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: styleNumbers.space * 1.5,
      paddingVertical: styleNumbers.space,
      borderRadius: styleNumbers.borderRadius / 2,
    },
    cartIcon: {
      width: 20,
      height: 20,
      marginRight: styleNumbers.space,
      tintColor: colors.text,
    },
    cartText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
    },
  });
