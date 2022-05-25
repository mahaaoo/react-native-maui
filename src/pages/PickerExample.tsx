import React from 'react';
import {View} from 'react-native';
import { Picker } from '../components/Picker';


const data: number[] = [];
for(let i = 0; i<20; i++) {
  data.push(1990 + i);
}

interface PickerExampleProps {
};

const PickerExample: React.FC<PickerExampleProps> = props => {
  const {} = props;
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Picker data={data} />
    </View>
  )
};

export default PickerExample;
