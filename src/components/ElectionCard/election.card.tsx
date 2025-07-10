import React, {useState} from 'react';
import {View, Text, SafeAreaView, ListRenderItem} from 'react-native';
import ElectionCardItemComponent from '../ElectionCardItem/election.card.item';
import createStyles from './election.card.style';
import FlatListComponent from '@components/List/flat.list';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@navigation/types';
import LightElectionViewModel from '@viewmodels/light.election.viewmodel';
import {useStyles} from '@hooks/Modular/use.styles';
import {BaseElectionViewModel} from '@viewmodels/base.election.viewmodel';
import ActivityIndicatorComponent from '@screens/shared/activity.indicator';
import {ScrollView} from 'react-native-gesture-handler';
type ElectionNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const sampleItems: LightElectionViewModel[] | null = [
  {
    id: '1',
    name: 'Seçim 1',
    description: 'Seçim 1 açıklaması',
    image: '',
    startDate: '2021-01-01',
    endDate: '2021-01-01',
  },
  {
    id: '2',
    name: 'Seçim 2',
    description: 'Seçim 2 açıklaması',
    image: '',
    startDate: '2021-01-01',
    endDate: '2021-01-01',
  },
];

interface ElectionCardComponentProps {
  title: string;
  renderItem?: ListRenderItem<any>;
  items?: BaseElectionViewModel[];
}

const ElectionCardComponent: React.FC<ElectionCardComponentProps> = ({
  title = 'Title girin',
  renderItem,
  items = sampleItems,
}) => {
  const styles = useStyles(createStyles);
  const navigation = useNavigation<ElectionNavigationProp>();

  const defaultRenderItem = ({item}: {item: BaseElectionViewModel}) => (
    <ElectionCardItemComponent
      election={item}
      navigatePress={() =>
        navigation.navigate('SpecificElection', {
          election: item as BaseElectionViewModel,
        })
      }
    />
  );
  const renderEmptyList = () => (
    <View style={styles.emptyList}>
      <Text style={styles.emptyText}>Gösterilecek seçim bulunamadı.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatListComponent
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        data={items}
        renderItem={renderItem ? renderItem : defaultRenderItem}
        ListEmptyComponent={renderEmptyList()}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

export default ElectionCardComponent;
