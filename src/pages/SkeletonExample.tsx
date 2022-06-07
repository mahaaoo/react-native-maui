import React, { useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import {SkeletonContainer, SkeletonRect, Breath, Shine, Normal} from '../components/Skeleton';

const {width} = Dimensions.get('window');

interface SkeletonExampleProps {
};

const SkeletonExample: React.FC<SkeletonExampleProps> = props => {
  const {} = props;
  const [finished, setFinish] = useState(false);


  return (
    <View style={styles.container}>
      <SkeletonContainer animatedType={Normal} finished={finished}>
        <View 
          style={{ width, height: 200, backgroundColor: 'white' }}>
          <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
            <Text>测试效果</Text>
          </SkeletonRect>
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 100, height: 30, marginHorizontal: 15 }} />
        </View>
      </SkeletonContainer>

      <SkeletonContainer animatedType={Breath} finished={finished} reverse={true}>
        <View 
          style={{ width, height: 200, backgroundColor: 'white' }}>
          <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
            <Text>测试效果一</Text>
          </SkeletonRect>
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 100, height: 30, marginHorizontal: 15 }} />
        </View>
      </SkeletonContainer>

      <SkeletonContainer animatedType={Shine} finished={finished} reverse={false}>
        <View 
          style={{ width, height: 200, backgroundColor: 'white' }}>
          <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
            <Text>测试效果二</Text>
          </SkeletonRect>
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 100, height: 30, marginHorizontal: 15 }} />
        </View>
      </SkeletonContainer>

      <TouchableOpacity 
        onPress={() => {
          setFinish(!finished);
        }}
        style={{ height: 50, width: 100, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginTop: 14 }}
      >
        <Text>停止</Text>
      </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey'
  }
});

export default SkeletonExample;
