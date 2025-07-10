import React from 'react';
import {
  ListRenderItem,
  ListRenderItemInfo,
  FlatList,
  FlatListProps,
} from 'react-native';
import Animated, {FadeIn, BounceIn} from 'react-native-reanimated';
import {useStyles} from '@hooks/Modular/use.styles';
import createStyles from './flat.list.style';

type FlatListComponentProps = Omit<
  FlatListProps<string>,
  'renderItem' | 'data'
> & {
  data: any[];
  renderItem: ListRenderItem<any>;
};

const FlatListComponent: React.FC<FlatListComponentProps> = ({
  data,
  renderItem,
  ...flatListProps
}) => {
  const styles = useStyles(createStyles);

  const myRenderItem = (listItemProps: ListRenderItemInfo<any>) => {
    const {index} = listItemProps;
    return (
      <Animated.View entering={BounceIn.duration(1000).delay(index * 100)}>
        {renderItem(listItemProps)}
      </Animated.View>
    );
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <FlatList
        data={data}
        initialNumToRender={10}
        renderItem={myRenderItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        windowSize={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={30}
        {...flatListProps}
      />
    </Animated.View>
  );
};

export default FlatListComponent;
