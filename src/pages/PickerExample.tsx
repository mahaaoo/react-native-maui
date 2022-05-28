import React from 'react';
import {View} from 'react-native';
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
      <Picker data={data} />
      <View style={{ flexDirection: 'row' }}>
        <Picker style={{flex: 1}} data={data} />
        <Picker style={{flex: 1}} data={data2} />
      </View>
    </View>
  )
};

export default PickerExample;
