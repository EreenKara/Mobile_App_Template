import React from 'react';
import { ListRenderItem, ListRenderItemInfo, FlatList, FlatListProps } from 'react-native';
import Animated, { FadeIn, BounceIn } from 'react-native-reanimated';

type FlatListComponentProps = Omit<FlatListProps<string>, 'renderItem' | 'data'> & {
   data: any[];
   renderItem: ListRenderItem<any>;
};

const FlatListComponent: React.FC<FlatListComponentProps> = ({
   data,
   renderItem,
   ...flatListProps
}) => {
   const myRenderItem = (listItemProps: ListRenderItemInfo<any>) => {
      const { index } = listItemProps;
      return (
         <Animated.View
            className={'px-4 py-3 mx-4 my-2 rounded-lg bg-appCardBackground shadow-md'}
            entering={BounceIn.duration(1000).delay(index * 100)}>
            {renderItem(listItemProps)}
         </Animated.View>
      );
   };

   return (
      <Animated.View className={'flex-1'} entering={FadeIn.duration(300)}>
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
