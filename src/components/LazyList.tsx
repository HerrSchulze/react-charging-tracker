import React, { useMemo } from 'react';
import { FlatList, FlatListProps } from 'react-native';

interface LazyListProps<T> extends Omit<FlatList<T>['props'], 'data'> {
  data: T[];
  renderItem: (item: { item: T; index: number }) => React.ReactElement;
  keyExtractor: (item: T, index: number) => string;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
}

export const LazyList = React.memo(
  React.forwardRef<FlatList, LazyListProps<any>>(
    (
      {
        data,
        renderItem,
        keyExtractor,
        initialNumToRender = 10,
        maxToRenderPerBatch = 10,
        updateCellsBatchingPeriod = 50,
        ...props
      },
      ref
    ) => {
      const memoizedData = useMemo(() => data, [data]);

      return (
        <FlatList
          ref={ref}
          data={memoizedData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialNumToRender={initialNumToRender}
          maxToRenderPerBatch={maxToRenderPerBatch}
          updateCellsBatchingPeriod={updateCellsBatchingPeriod}
          removeClippedSubviews={true}
          {...props}
        />
      );
    }
  )
);

LazyList.displayName = 'LazyList';
