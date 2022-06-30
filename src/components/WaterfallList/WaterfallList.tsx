import React, { useCallback, useEffect, useRef, useState } from 'react';
import {FlatList, Image, Text, View} from 'react-native';
import { useMinHeight } from './hook';

interface WaterfallListProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  numColumns: number
};

const WaterfallList: React.FC<WaterfallListProps> = props => {
  const {data, renderItem, numColumns} = props;  
  const originData = useRef<any[]>([]);
  const [dataSource, setDataSource] = useState<Array<any>[]>(new Array(numColumns).fill(0).map(_ => new Array()));
  const heightList = useRef(new Array(numColumns).fill(0));

  useEffect(() => {
    if (data.length > 0) {
      originData.current = data;
      pushItemToDatabase();  
    }
  }, [data])

  const pushItemToDatabase = useCallback(() => {
    if (originData.current.length <= 0) return;
    const next = originData.current.shift();
    const minIndex = useMinHeight(heightList.current);
    
    const temp = [...dataSource];
    temp[minIndex].push(next);
    
    setDataSource(temp);
  }, [])

  const handleLayout = useCallback(({
    nativeEvent: {
      layout: { height: h },
    },
  }) => {
    const index = useMinHeight(heightList.current);
    heightList.current[index] = heightList.current[index] + h;
    pushItemToDatabase();
  }, []);

  return (
    <FlatList
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
            renderItem={({ item, index }) => {
              return (
                <View onLayout={handleLayout}>
                  {renderItem && renderItem(item, index)}
                </View>
              )
            }}
          />
        )
      }}
    />
  )
};

export default WaterfallList;
