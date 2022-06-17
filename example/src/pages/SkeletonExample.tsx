import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import {SkeletonContainer, SkeletonRect, Breath, Shine, Normal, Load, ShineOver} from 'react-native-maui';

const {width} = Dimensions.get('window');

interface SkeletonExampleProps {
};

const SkeletonExample: React.FC<SkeletonExampleProps> = props => {
  const {} = props;
  const [finished, setFinish] = useState(false);

  useEffect(() => {
  }, [])

  return (
    <ScrollView style={styles.container}>
      <SkeletonContainer childAnimation={Normal} finished={finished}>
        <View 
          style={{ width, height: 200, backgroundColor: 'white' }}>
          <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
            <Text>Test Normal</Text>
          </SkeletonRect>
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 100, height: 30, marginHorizontal: 15 }} />
        </View>
      </SkeletonContainer>

      <SkeletonContainer childAnimation={Breath} finished={finished} reverse={true}>
        <View style={{width, height: 200, backgroundColor: 'white',}}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <SkeletonRect style={{ height: 50, width: 50, borderRadius: 25 }} />
            </View>
            <View style={{ flex: 1 }}>
              <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
                <Text>Test Breath</Text>
              </SkeletonRect>
              <SkeletonRect style={{ height: 30, marginHorizontal: 15, marginTop: 15 }} />
            </View>
          </View>
          <SkeletonRect style={{ height: 30, marginLeft: 15, marginRight: 100, marginTop: 15 }} />
          <SkeletonRect style={{ height: 30, marginHorizontal: 15, marginTop: 15 }} />
        </View>
      </SkeletonContainer>

      <SkeletonContainer childAnimation={Normal} finished={finished} containerAnimation={Load}>
        <View 
          style={{ width, height: 200, backgroundColor: 'white' }}>
          <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
            <Text>Test Normal</Text>
          </SkeletonRect>
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 30, height: 30, marginHorizontal: 15 }} />
          <SkeletonRect style={{ marginTop: 15, width: width - 100, height: 30, marginHorizontal: 15 }} />
        </View>
      </SkeletonContainer>

      <SkeletonContainer childAnimation={Shine} finished={finished} reverse={false}>
        <View style={{width, height: 200, backgroundColor: 'white',}}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <SkeletonRect style={{ height: 50, width: 50, borderRadius: 25 }} />
            </View>
            <View style={{ flex: 1 }}>
              <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
                <Text>Test Shine</Text>
              </SkeletonRect>
              <SkeletonRect style={{ height: 30, marginHorizontal: 15, marginTop: 15 }} />
            </View>
          </View>
          <SkeletonRect style={{ height: 30, marginLeft: 15, marginRight: 100, marginTop: 15 }} />
          <SkeletonRect style={{ height: 30, marginHorizontal: 15, marginTop: 15 }} />
        </View>
      </SkeletonContainer>

      <SkeletonContainer childAnimation={Normal} finished={finished} reverse={false} containerAnimation={ShineOver}>
        <View style={{ width, height: 200, backgroundColor: 'white', flexDirection: 'row' }}>
          <View>
            <SkeletonRect style={{ height: 50, width: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Avatar</Text>
            </SkeletonRect>
          </View>
          <View style={{ flex: 1 }}>
            <SkeletonRect style={{ marginLeft: 15, marginTop: 15, height: 20, width: 150 }}>
              <Text>Text ShineOver</Text>
            </SkeletonRect>
            <SkeletonRect style={{ flex: 1, height: 30, marginHorizontal: 15, marginTop: 15 }} />
            <SkeletonRect style={{ flex: 1, height: 30, marginHorizontal: 15, marginTop: 15 }} />
            <SkeletonRect style={{ flex: 1, height: 30, marginHorizontal: 15, marginTop: 15 }} />
          </View>
        </View>
      </SkeletonContainer>
      <View style={{ marginVertical: 50, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={() => {
            setFinish(!finished);
          }}
          style={{ height: 50, width: 200, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginTop: 14 }}
        >
          <Text>stop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default SkeletonExample;