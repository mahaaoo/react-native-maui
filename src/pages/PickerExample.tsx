import React from 'react';
import {View, Text} from 'react-native';
import { Picker } from '../components/Picker';


const data: number[] = [];
for(let i = 0; i<20; i++) {
  data.push(1990 + i);
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
  return (
    <View style={{
      flex: 1,
    }}>
      <Picker 
        dataSource={data} 
        renderItem={(item) => {
          return <Text style={{ fontSize: 20 }}>{item}</Text>
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Picker 
          style={{flex: 1}} 
          dataSource={data}
          renderItem={(item) => {
            return <Text style={{ fontSize: 20 }}>{item}</Text>
          }}  
        />
        <Picker 
          style={{flex: 1}} 
          dataSource={data2}
          renderItem={(item) => {
            return <Text style={{ fontSize: 20 }}>{item}</Text>
          }}  
        />
      </View>
    </View>
  )
};

export default PickerExample;
