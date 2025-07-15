import { Dimensions } from 'react-native';
import {
   launchImageLibrary,
   ImageLibraryOptions,
   ImagePickerResponse,
   Asset,
} from 'react-native-image-picker';
import styleNumbers from '@styles/common/style.numbers';
export interface ExtendedAsset extends Asset {
   containerWidth?: number;
   containerHeight?: number;
}

export const useCamera = () => {
   const handleCamera = async (
      fieldName: string,
      setFieldValue: (field: string, value: ExtendedAsset) => void,
   ) => {
      const imageOptions: ImageLibraryOptions = {
         mediaType: 'photo',
         includeBase64: true,
         selectionLimit: 1,
      };

      await launchImageLibrary(imageOptions, response => {
         if (response.assets && response.assets[0]) {
            const asset = response.assets[0];
            if (asset.width && asset.height) {
               const ratio = asset.width / asset.height;
               const containerWidth =
                  (Dimensions.get('window').width - styleNumbers.space * 4) * 0.75;
               const containerHeight = containerWidth / ratio;
               setFieldValue(fieldName, {
                  ...asset,
                  containerWidth,
                  containerHeight: Math.min(containerHeight, 300),
               });
            }
         }
      });
   };

   return { handleCamera };
};
