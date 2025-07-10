import {StyleSheet, Text, View, Image, Animated, Easing} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import Colors, {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import TextInputComponent from '@components/TextInput/text.input';
import ImagePickerComponent from '@icomponents/ImagePicker/image.picker';
import {ExtendedAsset} from '@hooks/useCamera';
import SearchBarModalComponent from '@components/SearchBarModal/search.bar.modal';
import ColorWheelPicker from '@components/ColorWheelPicker/color.wheel.picker';
import ColorPicker from '@components/ColorPicker/color.picker';
import {useStyles} from '@hooks/Modular/use.styles';
import CandidateCreateViewModel from '@viewmodels/candidate.create.viewmodel';
import LightUserViewModel from '@viewmodels/light.user.viewmodel';
import SelectUserComponent from '@icomponents/SelectUser/select.user';
interface CandidateInputItemComponentProps {
  candidate: CandidateCreateViewModel;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateCreateViewModel>>;
  user: LightUserViewModel | null;
  setUser: (user: LightUserViewModel | null) => void;
}
// TODO: IMAGE'i candidate'in icerisindeki image'e atamak gerek.
const CandidateInputItemComponent: React.FC<
  CandidateInputItemComponentProps
> = ({candidate, setCandidate, user, setUser}) => {
  const styles = useStyles(createStyles);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    console.log('candidate', candidate);
  }, []);
  const setUserWrapper = useCallback((user: LightUserViewModel | null) => {
    setUser(user);
    setIsOpen(false);
  }, []);
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{translateX: slideAnim}],
        },
      ]}>
      <Animated.View style={styles.imageContainer}>
        <ImagePickerComponent
          outStyle={styles.image}
          image={candidate.image}
          fieldName="image"
          setFieldValue={(string, value) => {
            setCandidate(prev => ({
              ...prev,
              image: value,
            }));
          }}
          responsive={false}
        />
      </Animated.View>
      <Animated.View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <TextInputComponent
            label="Adayın veya Seçeneğin İsmi"
            value={candidate.name}
            onChangeText={(text: string) => {
              setCandidate(prev => ({...prev, name: text}));
            }}
          />
        </View>
        <View style={styles.colorPicker}>
          <ColorWheelPicker
            size={300}
            onColorChange={(color: string) =>
              setCandidate(prev => ({...prev, color: color}))
            }
          />
        </View>
        <View style={styles.colorPickerInfo}>
          <Text style={[CommonStyles.textStyles.subtitle]}>
            Seçtiğiniz renk
          </Text>
          <View
            style={{width: 30, height: 30, backgroundColor: candidate.color}}
          />
        </View>
        <View style={styles.infoItem}>
          <View style={styles.searchInfoItem}>
            <SearchBarModalComponent
              style={styles.searchBar}
              handleSearch={() => {}}
              title={
                user
                  ? user.name + ' ' + user.surname
                  : 'Bir Kullanıcı ile eşleştirmek isterseniz arama yapınız'
              }
              isOpened={isOpen}
              setIsOpened={setIsOpen}
              modalTitle="Kullanıcı Ara">
              <SelectUserComponent user={user} setUser={setUserWrapper} />
            </SearchBarModalComponent>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default CandidateInputItemComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'column',
      flexWrap: 'wrap',
      borderRadius: styleNumbers.borderRadius,
      marginVertical: styleNumbers.space,
    },
    imageContainer: {
      width: '100%',
      borderRadius: styleNumbers.borderRadius,
      overflow: 'hidden',
    },
    image: {
      height: 300,
      justifyContent: 'center',
      alignItems: 'center',
    },
    infoContainer: {
      marginTop: styleNumbers.space * 2,
      padding: styleNumbers.space,
      width: '100%',
      gap: styleNumbers.space * 2,
      borderRadius: styleNumbers.borderRadius,
    },
    infoItem: {
      marginTop: styleNumbers.space * 2,
    },
    colorPicker: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      overflow: 'hidden',
      marginTop: styleNumbers.space * 2,
    },
    colorPickerInfo: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: styleNumbers.space,
    },
    searchBar: {
      width: '100%',
      borderWidth: 1,
      backgroundColor: colors.background,
      borderColor: colors.borderColor,
      borderRadius: styleNumbers.borderRadius,
      padding: styleNumbers.space,
    },
    searchInfoItem: {
      flex: 1,
    },
  });
