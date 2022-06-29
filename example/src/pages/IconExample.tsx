import React from 'react';
import {Dimensions, View} from 'react-native';
import {Icon} from 'react-native-maui';
import Section from '../components/Section';

const {width} = Dimensions.get('window');
const Width = (width - 30) / 4;

interface IconExampleProps {
};

const allIcons = [
  'arrow-left',
  'arrow-right',
  'arrow-up',
  'arrow-down',
  'plus',
  'minus',
  'code',
  'check',
  'sorting',
  'favorites',
  'favorites-fill',
  'search',
]

const IconExample: React.FC<IconExampleProps> = props => {
  const {} = props;
  const colors = ['#f8e0b0', '#d2d97a', '#6e8b74', '#1491a8', '#d2568c', '#692a1b'];

  return (
    <View>
      <Section title="图标展示">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {allIcons.map((name: any, index) => {
            const color = colors[index % colors.length];
            return (
              <View key={index} style={{ width: Width, height: Width, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={name} size={50} color={color} />
              </View>
            )
          })}
        </View>
      </Section>
    </View>
  )
};

export default IconExample;
