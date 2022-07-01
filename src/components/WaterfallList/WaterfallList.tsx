import React, { useCallback, useEffect, useRef, useState } from 'react';
import {FlatList, View, LayoutChangeEvent} from 'react-native';
import { getMinHeight, getArrayTotalLength } from './utils';
import { RefreshList, RefreshState, RefreshListProps } from '../RefreshList';

export enum WaterfallListStatus {
  Idle = 0 << 1, 
  Queueing = 1 << 1,
  Removing = 2 << 3,
}

interface WaterfallListProps extends RefreshListProps {
  numColumns: number;
};

const WaterfallList: React.FC<WaterfallListProps> = props => {
  const {data, renderItem, numColumns, refreshState = RefreshState.Idle, onFooterRefresh, ...others} = props;  
  const dataQueue = useRef<any[]>([]);
  const [dataSource, setDataSource] = useState<Array<any>[]>(new Array(numColumns).fill(0).map(_ => new Array()));
  const heightList = useRef(new Array(numColumns).fill(0));
  const waterfallStatus = useRef<WaterfallListStatus>(WaterfallListStatus.Idle);

  useEffect(() => {    
    if (data.length > 0 && dataQueue.current.length === 0) {
      const total = getArrayTotalLength(dataSource);
      console.log('渲染', [total, data.length]);
      if (data.length > total) {
        // 这次要渲染的数据变多，即加载
        dataQueue.current = data.slice(total);
        waterfallStatus.current = WaterfallListStatus.Queueing;
        pushItemToDatabase();
      }
      if (data.length <= total) {
        // 代表刷新了数据 下拉刷新
        heightList.current = new Array(numColumns).fill(0);
        dataQueue.current = [...data];
        waterfallStatus.current = WaterfallListStatus.Removing;

        const clearDataSource = new Array(numColumns).fill(0).map(_ => new Array());
        setDataSource(clearDataSource);
      }
    }
  }, [data])

  useEffect(() => {
    const total = getArrayTotalLength(dataSource);
    if (total == 0 && dataQueue.current.length > 0) {
      waterfallStatus.current = WaterfallListStatus.Queueing;
      pushItemToDatabase();
    }
  }, [dataSource])

  const pushItemToDatabase = () => {
    if (dataQueue.current.length <= 0) {
      waterfallStatus.current = WaterfallListStatus.Idle;
      return;
    };
    const next = dataQueue.current.shift();
    const minIndex = getMinHeight(heightList.current);
    
    const temp = [...dataSource];
    temp[minIndex].push(next);
    
    setDataSource(temp);
  }

  // why this function must add dependencies?
  // const handleLayout = useCallback(({
  //   nativeEvent: {
  //     layout: { height: h },
  //   },
  // }) => {
  //   const index = useMinHeight(heightList.current);
  //   heightList.current[index] = heightList.current[index] + h;
  //   pushItemToDatabase();
  // }, [dataSource]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const height = e.nativeEvent.layout.height;
    const index = getMinHeight(heightList.current);
    heightList.current[index] = heightList.current[index] + height;
    pushItemToDatabase();
  };

  const handleOnFooterRefresh = useCallback(() => {
    if (waterfallStatus.current !== WaterfallListStatus.Idle) return;
    onFooterRefresh && onFooterRefresh();
  }, [waterfallStatus.current]);

  return (
    <RefreshList
      refreshState={refreshState}
      listKey={"ccc112"}
      data={dataSource}
      numColumns={numColumns}
      removeClippedSubviews={true}
      keyExtractor={(item, index) => `_key${index.toString()}`}      
      renderItem={({ item, index: group }) => {        
        return (
          <FlatList
            listKey={`${group}_cccc123`}
            removeClippedSubviews={true}
            scrollEnabled={false}
            data={item}
            style={{flex: 1}}
            keyExtractor={(item, index) => `item_key${index.toString()}`}      
            renderItem={({ item, index, ...props }) => {
              return (
                <View onLayout={handleLayout}>
                  {renderItem && renderItem({ item, index, ...props })}
                </View>
              )
            }}
          />
        )
      }}
      onFooterRefresh={handleOnFooterRefresh}
      {...{...others}}
    />
  )
};

export default WaterfallList;
