import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import {Collapse, Panel}from '../components/Collapse';

export default function ButtonExample() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setOpen(true);
    }, 2000)
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{ height: 300 }}>
        <Text style={styles.dividerText}>基础功能</Text>
        <Panel
          title={"单独的折叠面板"}
          stickyHeight={100}
          isOpen={open}
        >
          <View style={{ backgroundColor: '#fff', flex: 1 }}>
            <Text>哈哈哈</Text>
          </View>
        </Panel>
      </View>
      <View style={{ height: 300 }}>
        <Text style={styles.dividerText}>折叠面板组</Text>
        <Collapse defaultActive={[1]} onChange={(index, isOpen) => {
          console.log(`点击的是第${index}个组件，当前是否展开:${isOpen}`)
        }}>
          <Panel
            title={"折叠面板一"}
            stickyHeight={50}
          >
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <Text>哈哈哈</Text>
            </View>
          </Panel>
          <Panel
            title={"折叠面板二"}
            stickyHeight={50}
          >
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <Text>哈哈哈</Text>
            </View>
          </Panel>
          <Panel
            title={"折叠面板三"}
            stickyHeight={50}
          >
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <Text>哈哈哈</Text>
            </View>
          </Panel>
        </Collapse>
      </View>
      <View style={{ height: 300 }}>
        <Text style={styles.dividerText}>手风琴折叠面板组</Text>
        <Collapse defaultActive={[1]} accordion onChange={(index, isOpen) => {
          console.log(`点击的是第${index}个组件，当前是否展开:${isOpen}`)
        }}>
          <Panel
            title={"手风琴折叠面板一"}
            stickyHeight={50}
          >
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <Text>哈哈哈</Text>
            </View>
          </Panel>
          <Panel
            title={"手风琴折叠面板二"}
            stickyHeight={50}
          >
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <Text>哈哈哈</Text>
            </View>
          </Panel>
          <Panel
            title={"手风琴折叠面板三"}
            stickyHeight={50}
          >
            <View style={{ backgroundColor: '#fff', flex: 1 }}>
              <Text>哈哈哈</Text>
            </View>
          </Panel>
        </Collapse>
      </View>
      <View style={{ height: 300 }}>
        <Text style={styles.dividerText}>自定义折叠面板</Text>
        <Panel 
          stickyComponent={
            <View style={styles.title}>
              <Text>自定义头部</Text>
            </View>
          } 
          stickyHeight={100}
        >
          <View style={{ backgroundColor: '#fff', flex: 1, width: 300 }}>
            <Text>哈哈哈</Text>
          </View>
        </Panel>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    width: 300,
    height: 60,
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  dividerText: {
    backgroundColor: '#fff', 
    padding: 15,
    fontSize: 15,
    fontWeight: 'bold',
  }
});
