import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Popover, Button } from 'react-native-maui';

interface PopoverExampleProps {}

const PopoverExample: React.FC<PopoverExampleProps> = (props) => {
  const {} = props;
  const [modal, setModal] = useState(false);

  return (
    <View style={styles.container}>
      <Popover
        modal={modal}
        arrowColor={'black'}
        placement={'bottom-start'}
        content={
          <View style={styles.popContainer}>
            <Text style={styles.options}>删除</Text>
            <Text style={styles.options}>全选</Text>
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
          onPress={() => {
            setModal(true);
          }}
        >
          <View style={styles.content}>
            <Text>点击</Text>
          </View>
        </Button>
      </Popover>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    width: 100,
    height: 45,
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
