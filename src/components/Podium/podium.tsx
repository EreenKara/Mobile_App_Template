import {useThemeColors} from '@contexts/theme.provider';
import {InteractionManager, Text, View} from 'react-native';
import {useStyles} from '@hooks/Modular/use.styles';
import createStyles from './podium.style';
import PodiumItemComponent from '../PodiumItem/podium.item';
import CandidateViewModel from '@viewmodels/candidate.viewmodel';
import {useMemo} from 'react';
import CommonStyles from '@styles/common/commonStyles';

interface PodiumProps {
  candidates: CandidateViewModel[];
}

const PodiumComponent: React.FC<PodiumProps> = ({candidates}) => {
  const styles = useStyles(createStyles);

  const sortedCandidates = useMemo(() => {
    return [...candidates].sort((a, b) => b.votes - a.votes).slice(0, 3);
  }, [candidates]);

  // Toplam oyu hesaplayalım
  const totalVotes = useMemo(() => {
    const sum = candidates.reduce((acc, c) => acc + c.votes, 0);
    return sum > 0 ? sum : 1; // Bölme hatasını önlemek için
  }, [candidates]);

  const getPodiumHeight = (
    candidateVotes: number,
    maxHeight = 400,
    minHeight = 70,
  ): number => {
    const ratio = candidateVotes / totalVotes;
    return Math.max(minHeight, ratio * maxHeight);
  };
  // Her basamağın maksimum yüksekliğini belirleyip, oy oranına göre çarpalım
  const firstPlaceHeight = getPodiumHeight(sortedCandidates[0]?.votes ?? 0);
  const secondPlaceHeight = getPodiumHeight(sortedCandidates[1]?.votes ?? 0);
  const thirdPlaceHeight = getPodiumHeight(sortedCandidates[2]?.votes ?? 0);
  return (
    <View style={styles.container}>
      <View style={styles.podiumContainer}>
        {/* 2. Sıra */}
        <PodiumItemComponent
          rank={2}
          candidate={sortedCandidates[1]}
          height={secondPlaceHeight}
          containerStyle={styles.podiumItemContainer}
          trophyStyle={[styles.trophyImage, styles.secondTrophy]}
          podiumStyle={[styles.podiumItem, styles.secondPlace]}
          podiumTextStyle={styles.podiumText}
          underPodiumTextStyle={styles.underPodiumText}
        />

        {/* 1. Sıra */}
        <PodiumItemComponent
          rank={1}
          candidate={sortedCandidates[0]}
          height={firstPlaceHeight}
          containerStyle={styles.podiumItemContainer}
          trophyStyle={[styles.trophyImage, styles.firstTrophy]}
          podiumStyle={[styles.podiumItem, styles.firstPlace]}
          podiumTextStyle={styles.podiumText}
          underPodiumTextStyle={styles.underPodiumText}
        />

        {/* 3. Sıra */}
        <PodiumItemComponent
          rank={3}
          candidate={sortedCandidates[2]}
          height={thirdPlaceHeight}
          containerStyle={styles.podiumItemContainer}
          trophyStyle={[styles.trophyImage, styles.thirdTrophy]}
          podiumStyle={[styles.podiumItem, styles.thirdPlace]}
          podiumTextStyle={styles.podiumText}
          underPodiumTextStyle={styles.underPodiumText}
        />
      </View>
    </View>
  );
};

export default PodiumComponent;
