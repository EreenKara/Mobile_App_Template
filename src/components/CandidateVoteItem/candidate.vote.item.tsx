import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  Easing,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import {ColorsSchema} from '@styles/common/colors';
import CommonStyles from '@styles/common/commonStyles';
import styleNumbers from '@styles/common/style.numbers';
import {useStyles} from '@hooks/Modular/use.styles';
import {hexToRgba} from '@utility/hexToRGBA';
import {rotate} from '@shopify/react-native-skia';
interface CandidateVoteItemComponentProps {
  candidate: CandidateViewModel;
  onSelect: (id: string) => void;
  selected: boolean;
}
const {width} = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.3;
const INNER_CIRCLE_PADDING = 10;
const INNER_CIRCLE_SIZE = CIRCLE_SIZE - INNER_CIRCLE_PADDING * 2;
const BORDER_WIDTH = 2;
// TODO: IMAGE'i candidate'in icerisindeki image'e atamak gerek.
const CandidateVoteItemComponent: React.FC<CandidateVoteItemComponentProps> = ({
  candidate,
  onSelect,
  selected,
}) => {
  const styles = useStyles(createStyles);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  return (
    <View
      style={[
        styles.candidateView,
        {
          backgroundColor: hexToRgba(candidate.color, 0.4),
          borderColor: hexToRgba(candidate.color, 1),
          borderWidth: 3,
        },
      ]}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={
            candidate?.image
              ? {uri: candidate.image}
              : require('@assets/images/candidate.png')
          }
        />
      </View>
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.text}>
            {candidate.userId ? 'İsim: ' : 'İsim: '}
          </Text>
        </View>
        <View style={styles.cell}>
          <Text style={styles.text}>{candidate.name}</Text>
        </View>
      </View>
      <Pressable style={styles.vote} onPress={() => onSelect(candidate.id)}>
        <View
          style={[styles.circle, {borderColor: hexToRgba(candidate.color, 1)}]}>
          {selected ? (
            <View
              style={[
                styles.voteCircle,
                {backgroundColor: hexToRgba(candidate.color, 1)},
              ]}></View>
          ) : (
            <Text
              style={[
                styles.title,
                {fontSize: styleNumbers.textSize * 2},
                styles.rotated,
              ]}>
              Oy Ver
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default CandidateVoteItemComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    cell: {
      justifyContent: 'center',
      width: '45%',
    },
    row: {
      marginVertical: styleNumbers.space * 2,

      marginLeft: '10%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderBottomWidth: 0,
    },
    title: {
      ...CommonStyles.textStyles.title,
    },
    text: {
      ...CommonStyles.textStyles.subtitle,
      margin: styleNumbers.space,
    },
    imageContainer: {
      margin: styleNumbers.space,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      borderRadius: styleNumbers.borderRadius,
    },
    image: {
      width: '60%',
      resizeMode: 'contain',
      aspectRatio: 1,
    },
    candidateView: {
      flex: 1,
      flexBasis: '50%', // her satırda 2 item olmasını sağlar
      margin: styleNumbers.space,
      backgroundColor: colors.transition,
    },
    vote: {
      alignItems: 'center',
      marginBottom: styleNumbers.space * 2,
    },
    candidateContent: {
      flexDirection: 'column',
    },
    circle: {
      width: CIRCLE_SIZE,
      height: CIRCLE_SIZE,
      borderRadius: CIRCLE_SIZE / 2,
      borderWidth: BORDER_WIDTH,
    },
    voteCircle: {
      width: INNER_CIRCLE_SIZE,
      height: INNER_CIRCLE_SIZE,
      borderRadius: INNER_CIRCLE_SIZE / 2,
      position: 'absolute',
      top: INNER_CIRCLE_PADDING - BORDER_WIDTH,
      left: INNER_CIRCLE_PADDING - BORDER_WIDTH,
    },
    rotated: {
      fontSize: styleNumbers.textSize * 1.5,
      position: 'absolute',
      top: CIRCLE_SIZE / 2 - INNER_CIRCLE_PADDING - BORDER_WIDTH,
      left: CIRCLE_SIZE / 4,
      transform: [{rotate: '-45deg'}],
    },
  });
