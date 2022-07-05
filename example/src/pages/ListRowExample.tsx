import React from 'react';
import {View, StyleSheet, Text, Dimensions} from 'react-native';
import {Button, ListRow, Switch, Icon} from 'react-native-maui';
import Section from '../components/Section';

const {width} = Dimensions.get('window');
interface ListRowExampleProps {
};

const ListRowExample: React.FC<ListRowExampleProps> = props => {
  const {} = props;

  return (
    <View style={styles.container}>
      <Section title="基本使用" style={{ backgroundColor: '#F8F8F8', flexDirection: 'column' }}>
        <ListRow left="ListRow" />
        <ListRow left="Disable" disabled={true} />
        <ListRow left={<Text>ListRow</Text>} mid={<Text style={{ marginLeft: 10 }}>Content</Text>} right={(<Icon name='arrow-right' />)} />
      </Section>
      <Section title="自定义属性" style={{ backgroundColor: '#F8F8F8', flexDirection: 'column' }}>
        <ListRow left={<Text>Test Front</Text>} mid={<Text style={{ marginLeft: 10 }}>Test Mid</Text>} right={
          <Button onPress={() => {}}>
            <Text>Button</Text>
          </Button>      
        } />
        <ListRow left="NoDivider" divider={false} right={(<Icon name='arrow-right' />)} />
        <ListRow left="DividerProps" dividerProps={{
          start: 30,
          end: width, 
          color: 'red'     
        }} />
        <ListRow left="ListRow" style={{ marginTop: 10 }} right={(<Switch />)} />
      </Section>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ListRowExample;
