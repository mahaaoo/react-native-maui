import React, { useCallback, useEffect, useRef, useState } from 'react';
import {View, FlatList, Dimensions, Image, Text} from 'react-native';
import { WaterfallList } from 'react-native-maui';

const {width} = Dimensions.get('window');


interface WaterFlowListExampleProps {
};

const WaterFlowListExample: React.FC<WaterFlowListExampleProps> = props => {
  const {} = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    const data: any = [];
    for(let i = 0; i<14; i++) {  
      const height = Math.round(Math.random() * (400 - 100) + 100);
      data.push({
        id: i,
        url: `https://picsum.photos/${width/3}/${height}/?random`,
        text: Math.random().toFixed(Math.round(Math.random() * (10 - 5) + 5)),
        height,
      })
    }
    setData(data);
  }, [])

  return (
    <WaterfallList
      numColumns={3}
      data={data}
      renderItem={(item, index) => (
        <>
          <Image source={{ uri: item.url }} style={{ width: '100%', height: item.height }} resizeMode="cover" />
          <Text style={{ fontSize: 30 }}>index:{item.id}</Text>
          <Text style={{ fontSize: 30 }}>id:{item.text}</Text>
        </>
      )}
    />
  )
};

export default WaterFlowListExample;
