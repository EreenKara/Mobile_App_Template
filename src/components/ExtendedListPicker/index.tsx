import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useRef} from 'react';
import ExtendedPickerComponent, {ChildRef} from '@icomponents/ExtendedPicker';
import MenuItemComponent from '@icomponents/MenuItem/menu.item';
import Colors from '@styles/common/colors';
import {useThemeColors} from '@contexts/theme.provider';
interface ExtendedListPickerComponentProps {
  data: any[];
  selectedData: any;
  setSelectedData: (data: any) => void;
  title: string;
  onNonSelect: (item: any) => void;
  onSelect: (item: any) => void;
  style?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
  icon: string;
}

const ExtendedListPickerComponent = ({
  style,
  listStyle,
  data,
  selectedData,
  setSelectedData,
  onNonSelect,
  onSelect,
  title,
  icon,
}: ExtendedListPickerComponentProps) => {
  const {colors} = useThemeColors();
  const pickerRef = useRef<ChildRef>(null);

  const handlePress = (item: any) => {
    if (selectedData === item) {
      setSelectedData(null);
      onNonSelect(item);
    } else {
      if (selectedData) {
        onNonSelect(selectedData);
        setSelectedData(null);
      }
      pickerRef.current?.handleToggle();
      setSelectedData(item);
      onSelect(item);
    }
  };

  return (
    <ExtendedPickerComponent
      style={style}
      ref={pickerRef}
      content={
        <FlatList
          data={data}
          style={{maxHeight: 300}}
          nestedScrollEnabled={true}
          scrollEnabled={true}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({item}: {item: any}) => (
            <MenuItemComponent
              icon={require('@assets/images/group-people.png')}
              title={item.name}
              tintColor={selectedData === item ? colors.button : colors.icon}
              onPress={() => handlePress(item)}
              rightIcon={
                selectedData === item
                  ? require('@assets/images/check.png')
                  : require('@assets/images/plus.png')
              }
            />
          )}
        />
      }
      title={title}
      icon={icon}
    />
  );
};

export default ExtendedListPickerComponent;

const styles = StyleSheet.create({});
