import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ViewStyle,
  StyleProp,
} from 'react-native';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import styleNumbers from '@styles/common/style.numbers';
import Colors, {ColorsSchema} from '@styles/common/colors';
import ButtonComponent from '@components/Button/Button';
import CommonStyles from '@styles/common/commonStyles';
import MenuItemComponent from '@icomponents/MenuItem/menu.item';
import {useStyles} from '@hooks/Modular/use.styles';

interface ExtendedPickerComponentProps {
  content: React.ReactNode;
  title: string;
  icon: string;
  style?: StyleProp<ViewStyle>;
}
export interface ChildRef {
  handleToggle: () => void;
}
const ExtendedPickerComponent = forwardRef<
  ChildRef,
  ExtendedPickerComponentProps
>(({content, title, icon, style}, ref) => {
  const styles = useStyles(createStyles);

  const [isOpen, setIsOpen] = useState(false);
  useImperativeHandle(ref, () => ({
    handleToggle: () => setIsOpen(prev => !prev),
  }));

  let shrinkContent = null;
  if (isOpen) {
    shrinkContent = (
      <View>
        {content}
        <TouchableOpacity
          onPress={() => setIsOpen(prev => !prev)}
          style={styles.button}>
          <Image
            source={require('@assets/images/up-arrow.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
    );
  } else {
    shrinkContent = (
      <MenuItemComponent
        icon={icon}
        title={title}
        tintColor={Colors.getTheme().button}
        onPress={() => setIsOpen(prev => !prev)}
        rightIcon={require('@assets/images/three_dots.png')}
      />
    );
  }
  return <View style={[styles.container, style]}>{shrinkContent}</View>;
});

export default ExtendedPickerComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      padding: styleNumbers.space * 2,
      borderColor: colors.cardBackground,
    },
    groupTitle: {
      ...CommonStyles.textStyles.subtitle,
      textAlign: 'center',
      position: 'relative',
      right: 30,
      marginBottom: styleNumbers.space,
    },
    button: {
      alignSelf: 'center',
      width: '60%',
      height: 20,
      zIndex: -100,
      overflow: 'hidden',
      position: 'relative',
      top: 10,
      backgroundColor: colors.button,
      borderRadius: styleNumbers.borderRadius,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonImage: {
      width: 20,
      height: 20,
      tintColor: colors.cardText,
    },
  });
