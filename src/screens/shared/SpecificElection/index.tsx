import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './index.style';
import PieChartComponent from '@components/PieChart/pie.chart';
import CommonStyles from '@styles/common/commonStyles';
import {CandidateViewModel} from '@viewmodels/candidate.viewmodel';
import ActivityIndicatorComponent from '@screens/shared/activity.indicator';
import {Dimensions} from 'react-native';
import {ProgressView} from '@react-native-community/progress-view';
import ChartLegendComponent from '@components/ChartLegend/chart.legend.style';
import CandidateItemComponent from '@icomponents/CandidateItem/candidate.item';
import Colors from '@styles/common/colors';
import styleNumbers from '@styles/common/style.numbers';
import {useSearchContext} from '@contexts/search.context';
import {useStyles} from '@hooks/Modular/use.styles';
import createStyles from './index.style';
import {SharedStackParamList} from '@navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import useElectionResult from '@hooks/use.election.result';
import calculateRemainingPercentage from '@utility/date.percantage';
import formatDate from '@utility/format.date';
import ButtonComponent from '@components/Button/Button';
import AnimatedBallotBoxComponent from '@icomponents/AnimatedBallotBox/animated.ballot.box';

const windowHeight = Dimensions.get('window').height;

type SpecificElectionScreenProps = NativeStackScreenProps<
  SharedStackParamList,
  'SpecificElection'
>;
const SpecificElectionScreen: React.FC<SpecificElectionScreenProps> = ({
  navigation,
  route,
}) => {
  const {election} = route.params;
  const {
    fetchCandidates,
    candidates,
    fetchCandidatesLoading,
    fetchCandidatesError,
    fetchCandidatesSuccess,
    fetchElection,
    fetchElectionLoading,
    fetchElectionError,
    fetchElectionSuccess,
  } = useElectionResult();
  const {search} = useSearchContext();
  const styles = useStyles(createStyles);
  const [percantage, setPercentage] = useState('');
  useEffect(() => {
    fetchCandidates(election.id);
    const value = calculateRemainingPercentage(
      election.startDate,
      election.endDate,
    ).elapsedPercentage.toString();
    setPercentage(value);
  }, []);
  useEffect(() => {
    console.log('candidates:', candidates);
  }, [candidates]);

  if (!fetchCandidatesSuccess) {
    return <ActivityIndicatorComponent />;
  } else {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={CommonStyles.textStyles.title}>{election.name}</Text>
          <Text style={CommonStyles.textStyles.subtitle}>{search.city}</Text>
        </View>
        <View style={styles.progressView}>
          <View style={{}}>
            {new Date() > new Date(election.endDate) ? (
              <>
                <Text
                  style={[
                    CommonStyles.textStyles.title,
                    {textAlign: 'center'},
                  ]}>
                  Seçim sona erdi
                </Text>
                <View style={{paddingTop: 20}}>
                  <AnimatedBallotBoxComponent
                    source={require('@assets/images/trophy.png')}
                    label="Kazananı Gör"
                    onPress={() => {
                      navigation.navigate('ElectionResult', {
                        election: election,
                      });
                    }}
                  />
                </View>
              </>
            ) : (
              <>
                <Text
                  style={[
                    CommonStyles.textStyles.title,
                    {textAlign: 'center'},
                  ]}>
                  Seçimin Bitmesine:
                </Text>
                <Text
                  style={[
                    CommonStyles.textStyles.subtitle,
                    {textAlign: 'center'},
                  ]}>
                  {formatDate(election.startDate)} -{' '}
                  {formatDate(election.endDate)}
                </Text>
                <View style={styles.iconss}>
                  <AnimatedBallotBoxComponent
                    onPress={() => {
                      navigation.navigate('Vote', {electionId: election.id});
                    }}
                  />
                  <AnimatedBallotBoxComponent
                    source={require('@assets/images/trophy.png')}
                    label="En Yüksek Oylar"
                    onPress={() => {
                      navigation.navigate('ElectionResult', {
                        election: election,
                      });
                    }}
                  />
                </View>
              </>
            )}
          </View>
          <View
            style={{
              marginTop: styleNumbers.space * 2,
              marginBottom: styleNumbers.space * 2,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <ProgressView
              progressViewStyle="bar"
              style={{
                height: 30,
                width: '75%',
                marginHorizontal: styleNumbers.space * 2,
              }}
              progressTintColor="red"
              trackTintColor={Colors.getTheme().indicator}
              progress={Number(percantage) / 100}
            />
            <Text
              style={[
                CommonStyles.textStyles.subtitle,
                {color: Colors.getTheme().text},
              ]}>
              {percantage}%
            </Text>
          </View>
        </View>
        <View style={styles.pieChartContainer}>
          <View style={{height: windowHeight * 0.3}}>
            {candidates?.some(candidate => candidate.votes > 0) ? (
              <PieChartComponent
                chartSize={windowHeight * 0.3}
                data={candidates ?? []}
              />
            ) : (
              <Text
                style={[
                  CommonStyles.textStyles.title,
                  {
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    paddingTop: 85,
                  },
                ]}>
                Bu Seçimde Hiç Bir Aday İçin Oy kullanılmadı
              </Text>
            )}
          </View>
          <View>
            <ChartLegendComponent candidates={candidates ?? []} />
          </View>
        </View>

        <View style={styles.candidateContainer}>
          {candidates?.map((candidate, index) => (
            <View key={index} style={styles.candidateItem}>
              <CandidateItemComponent candidate={candidate} />
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }
};

export default SpecificElectionScreen;
