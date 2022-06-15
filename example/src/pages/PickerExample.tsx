import React, { useState } from 'react';
import {View, Text} from 'react-native';
import { Picker } from 'react-native-maui';

const data: number[] = [];
for(let i = 0; i<50; i++) {
  data.push(i);
}

const data2: string[] = [];
for(let i = 0; i<2; i++) {
  if (i < 9) {
    data2.push(`0${i+1}`);
  } else {
    data2.push(`${i+1}`);
  }
}


interface PickerExampleProps {
};

const PickerExample: React.FC<PickerExampleProps> = props => {
  const {} = props;

  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  return (
    <View style={{
      flex: 1,
    }}>
      <Picker 
        dataSource={data} 
        renderItem={(item) => {
          return <Text style={{ fontSize: 20 }}>{item}</Text>
        }}
        onChange={(item) => {
          console.log('current pick:', item);
        }}
        options={{
          maxRender: 3,
        }}
      />
      {/* <View style={{ flexDirection: 'row', marginTop: 20 }}>
        <Picker 
          style={{flex: 1}} 
          dataSource={data}
          renderItem={(item) => {
            return <Text style={{ fontSize: 20 }}>{item}</Text>
          }}  
          onChange={(item) => {
            setYear(item)
          }}  
        />
        <Picker 
          style={{flex: 1}} 
          dataSource={data2}
          renderItem={(item) => {
            return <Text style={{ fontSize: 20 }}>{item}</Text>
          }}  
          onChange={(item) => {
            console.log(item);
            
            setMonth(item)
          }}  
        />
      </View>
      <View style={{ width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{`当前选择日期：${year}年-${month}月`}</Text>
      </View> */}
      <Text>TODO：该组件在大数据范围下，性能待优化</Text>
    </View>
  )
};

export default PickerExample;
