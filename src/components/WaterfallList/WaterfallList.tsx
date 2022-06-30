import React, { useCallback, useEffect, useRef, useState } from 'react';
import {FlatList, Image, Text, View, LayoutChangeEvent} from 'react-native';
import { useMinHeight } from './hook';
import { RefreshList, RefreshState, RefreshListProps } from '../RefreshList';

interface WaterfallListProps extends RefreshListProps {
  numColumns: number;
};

const WaterfallList: React.FC<WaterfallListProps> = props => {
  const {data, renderItem, numColumns, refreshState = RefreshState.Idle, ...others} = props;  
  const dataQueue = useRef<any[]>([]);
  const [dataSource, setDataSource] = useState<Array<any>[]>(new Array(numColumns).fill(0).map(_ => new Array()));
  const heightList = useRef(new Array(numColumns).fill(0));

  useEffect(() => {    
    if (data.length > 0 && dataQueue.current.length === 0) {
      const total = dataSource.reduce((a,b) => a + b.length, 0);
      if (data.length > total) {
        console.log('上拉加载');
        // 这次要渲染的数据变多，即
        dataQueue.current = data.slice(total);
        pushItemToDatabase();
      }
      if (data.length <= total) {
        console.log('下拉刷新');
        // 代表刷新了数据 下拉刷新

        heightList.current = new Array(numColumns).fill(0);
        dataQueue.current = data;
                
        const clearDataSource = new Array(numColumns).fill(0).map(_ => new Array());
        setDataSource(clearDataSource);
      }
    }
  }, [data])

  useEffect(() => {
    const total = dataSource.reduce((a,b) => a + b.length, 0);
    if (total == 0 && dataQueue.current.length > 0) {
      pushItemToDatabase(2);
    }
  }, [dataSource])

  const pushItemToDatabase = (status?: number) => {
    if (dataQueue.current.length <= 0) return;
    const next = dataQueue.current.shift();
    const minIndex = useMinHeight(heightList.current);
    
    const temp = [...dataSource];
    temp[minIndex].push(next);
    
    // const total = temp.reduce((a,b) => a + b.length, 0);

    // console.log('数组的总藏毒', total, '生序长度', dataQueue.current.length);
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
    const index = useMinHeight(heightList.current);
    heightList.current[index] = heightList.current[index] + height;
    pushItemToDatabase();
  };

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
      {...{...others}}
    />
  )
};

export default WaterfallList;
