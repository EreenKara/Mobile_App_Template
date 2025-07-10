import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import Colors, {ColorsSchema} from '@styles/common/colors';
import {useStyles} from '@hooks/Modular/use.styles';

interface MenuItemComponentProps {
  iconComponent?: React.ReactNode;
  icon?: any;
  title: string;
  onPress?: () => void;
  tintColor?: string;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  description?: string;
  rightIcon?: any;
  rightIconComponent?: React.ReactNode;
  touchable?: boolean;
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({
  iconComponent,
  icon,
  title,
  tintColor,
  imageStyle,
  textStyle,
  description = '',
  rightIcon,
  rightIconComponent,
  touchable = true,
  onPress = () => {},
}) => {
  const styles = useStyles(createStyles);

  const item = (
    <>
      {iconComponent && iconComponent}
      {icon && (
        <Image
          source={icon}
          style={[
            styles.menuIcon,
            {tintColor: tintColor || Colors.getTheme().text},
            imageStyle,
          ]}
        />
      )}
      {description && (
        <View style={styles.menuTextContainer}>
          <Text
            style={[
              CommonStyles.textStyles.subtitle,
              styles.menuText,
              textStyle,
            ]}>
            {title}
          </Text>

          <Text
            style={[
              CommonStyles.textStyles.paragraph,
              styles.menuText,
              textStyle,
            ]}>
            {description}
          </Text>
        </View>
      )}
      {!description && (
        <Text
          style={[
            CommonStyles.textStyles.subtitle,
            styles.menuText,
            textStyle,
          ]}>
          {title}
        </Text>
      )}
      {rightIconComponent && rightIconComponent}
      {rightIcon && (
        <Image
          source={rightIcon}
          style={[
            styles.arrowIcon,
            {tintColor: tintColor || Colors.getTheme().text},
          ]}
        />
      )}
    </>
  );

  return touchable ? (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      {item}
    </TouchableOpacity>
  ) : (
    <View style={styles.menuItem}>{item}</View>
  );
};

export default MenuItemComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: styleNumbers.space * 1.5,
      padding: styleNumbers.space * 2,
    },

    menuTextContainer: {
      flex: 1,
    },
    menuIcon: {
      width: 32,
      height: 32,
      marginRight: styleNumbers.space * 2,
    },
    menuText: {
      flex: 1,
    },
    arrowIcon: {
      width: 15,
      height: 15,
    },
  });
