import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Popover, Button } from 'react-native-maui';

const { width } = Dimensions.get('window');

interface PopoverExampleProps {}

const PopoverExample: React.FC<PopoverExampleProps> = (props) => {
  const {} = props;
  const [modal, setModal] = useState(false);
  return (
    <View style={styles.container}>
      <Popover
        style={styles.popover}
        modal={modal}
        arrowColor={'black'}
        placement={'bottom'}
        arrowPosition={'center'}
        content={
          <View style={styles.popContainer}>
            <Text style={styles.options}>Hello</Text>
            <Text
              onPress={() => {
                setModal(false);
              }}
              style={styles.options}
            >
              取消
            </Text>
          </View>
        }
        onPressMask={() => {
          setModal(false);
        }}
      >
        <Button
          style={styles.button}
          onPress={() => {
            setModal(true);
          }}
        >
          <Text>点击</Text>
        </Button>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  popover: {
    marginLeft: (width - 150) / 2,
    marginTop: 100,
  },
  button: {
    width: 150,
    height: 80,
  },
  content: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popContainer: {
    flexDirection: 'row',
    backgroundColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  options: {
    fontSize: 16,
    color: 'white',
    padding: 10,
  },
});

export default PopoverExample;
