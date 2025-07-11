import React from 'react';
import { View, ActivityIndicator as RNActivityIndicator } from 'react-native';
import customColors from '@styles/tailwind.colors';

interface LoadingComponentProps {
   size?: 'small' | 'large';
   color?: string;
   fullScreen?: boolean;
}

const LoadingComponent: React.FC<LoadingComponentProps> = ({
   size = 'large',
   color = customColors?.button || '#000', // fallback
   fullScreen = false,
}) => {
   return (
      <View
         className={`
        items-center justify-center p-4 
        ${fullScreen ? 'absolute inset-0 bg-background z-[999]' : ''}
      `}>
         <RNActivityIndicator size={size} color={color} />
      </View>
   );
};

export default LoadingComponent;
