import React from 'react';
import {
   View,
   Pressable,
   ImageBackground,
   Text,
   StyleSheet,
   StyleProp,
   ViewStyle,
} from 'react-native';
import CommonStyles from '@styles/common/commonStyles';
import Colors, { ColorsSchema } from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import { ExtendedAsset, useCamera } from '@hooks/common/useCamera';
import { useStyles } from '@hooks/Modular/use.styles';

export interface ImagePickerComponentProps {
   image: ExtendedAsset | null;
   fieldName: string;
   setFieldValue: (field: string, value: ExtendedAsset) => void;
   responsive?: boolean;
   outStyle?: StyleProp<ViewStyle>;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
   image,
   fieldName,
   setFieldValue,
   responsive = true,
   outStyle,
}) => {
   const styles = useStyles(createStyles);

   const { handleCamera } = useCamera();

   return (
      <View style={styles.imageContainer}>
         <Pressable
            onPress={() => handleCamera(fieldName, setFieldValue)}
            style={[
               styles.imagePickerContainer,
               image?.containerHeight && responsive
                  ? {
                       width: image.containerWidth,
                       height: image.containerHeight,
                    }
                  : null,

               outStyle,
            ]}>
            <ImageBackground
               source={
                  image === null || !image.uri
                     ? require('@assets/images/camera-place-holder.jpg')
                     : responsive
                       ? {
                            uri: image.uri,
                            width: image.containerWidth,
                            height: image.containerHeight,
                            cache: 'force-cache',
                         }
                       : {
                            uri: image.uri,
                            cache: 'force-cache',
                         }
               }
               style={[styles.image]}
               imageStyle={[styles.imageStyle, image !== null && { opacity: 1 }]}>
               <View style={styles.imageOverlay}>
                  <Text style={[CommonStyles.textStyles.paragraph, styles.imageText]}>
                     {image === null ? 'Seçim Resmi Ekle' : 'Resmi Değiştir'}
                  </Text>
               </View>
            </ImageBackground>
         </Pressable>
      </View>
   );
};

export default ImagePickerComponent;

const createStyles = (colors: ColorsSchema) =>
   StyleSheet.create({
      imageContainer: {
         width: '100%',
         alignItems: 'center',
         justifyContent: 'center',
      },
      imagePickerContainer: {
         width: '100%',
         height: 200,
         borderRadius: styleNumbers.borderRadius,
         overflow: 'hidden',
         borderWidth: 2,
         borderColor: colors.borderColor,
         borderStyle: 'dashed',
      },
      image: {
         width: '100%',
         height: '100%',
         justifyContent: 'center',
         alignItems: 'center',
      },
      imageStyle: {
         opacity: 0.7,
         resizeMode: 'contain',
         width: '100%',
         height: '100%',
      },
      imageOverlay: {
         backgroundColor: colors.transparentColor,
         padding: styleNumbers.space,
         borderRadius: styleNumbers.borderRadius,
         alignItems: 'center',
      },
      imageText: {
         color: colors.text,
         textAlign: 'center',
      },
   });
