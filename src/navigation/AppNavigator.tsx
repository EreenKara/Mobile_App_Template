import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@navigation/types';
import HomeNavigator from '@navigation/HomeNavigator';
import ProfileNavigator from '@navigation/ProfileNavigator';
import SocialMediaScreen from '@screens/social/SocialMedia';
import {Image, StyleSheet} from 'react-native';
import Colors from '@styles/common/colors';
import {useThemeColors} from '@contexts/theme.provider';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const {colors} = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bar,
        },
        tabBarIcon: ({color, size}) => {
          let iconSource;
          if (route.name === 'Home') {
            iconSource = require('@assets/images/home.png');
          } else if (route.name === 'Profile') {
            iconSource = require('@assets/images/profile.png');
          } else if (route.name === 'SocialMedia') {
            iconSource = require('@assets/images/social_media_icon.png');
          }
          return (
            <Image
              source={iconSource}
              style={[
                styles.tabIcon,
                {
                  width: size,
                  height: size,
                  tintColor: color,
                },
              ]}
            />
          );
        },
      })}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    resizeMode: 'contain',
  },
});

export default MainNavigator;
