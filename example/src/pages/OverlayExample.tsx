import * as React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { useOverlay, OverlayUtil, TranslateContainer, NormalContainer, OpacityContainer, Button, DrawerContainer } from 'react-native-maui';
import Section from '../components/Section';

const {width, height} = Dimensions.get('window');

export default function OverlayExample() {
  const {add, remove, removeAll} = useOverlay();
  const elementIndex = React.useRef(0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Section title="关闭视图">
        <Button onPress={() => {
          remove();
        }}>
          <Text>删除最近添加的一个子视图</Text>
        </Button>
        <Button style={{ marginLeft: 15 }} onPress={() => {
          removeAll();
        }}>
          <Text>删除全部子视图</Text>
        </Button>
      </Section>

      <Section title="自定义视图">
        <Button onPress={() => {
          const index = add(
            <View style={{ marginTop: 100 }}>
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
              <Text onPress={() => {
                remove(index);
              }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
            </View>
          );
          elementIndex.current++;
        }}>
          <Text>自定义子视图-hook</Text>
        </Button>
        <Button style={{ marginLeft: 15 }} onPress={() => {
          const index = OverlayUtil.add(
            <View style={{ marginTop: 100 }}>
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
              <Text onPress={() => {
                remove(index);
              }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
            </View>
          );
          elementIndex.current++;
        }}>
          <Text>自定义子视图-function</Text>
        </Button>
      </Section>

      <Section title="NormalContainer">
        <Button onPress={() => {
          const index = add(
            <NormalContainer
              pointerEvents='none'
              onAppear={() => {
                console.log('子视图已弹出');
              }}
              onDisappear={() => {
                console.log('子视图已消失');
              }}
            >
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
            </NormalContainer>
          );
          elementIndex.current++;
        }}>
          <Text>pointerEvents='none'</Text>
        </Button>
        <Button style={{ marginLeft: 15 }} onPress={() => {
          const index = add(
            <NormalContainer
              onAppear={() => {
                console.log('子视图已弹出');
              }}
              onDisappear={() => {
                console.log('子视图已消失');
              }}
            >
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
              <Text onPress={() => {
                remove(index);
              }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
            </NormalContainer>
          );
          elementIndex.current++;
        }}>
          <Text>pointerEvents='auto'</Text>
        </Button>
      </Section>

      <Section title="OpacityContainer">
        <Button onPress={() => {
          add(
            <OpacityContainer
              onAppear={() => {
                console.log('子视图已弹出');
              }}
              onDisappear={() => {
                console.log('子视图已消失');
              }}
            >
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
            </OpacityContainer>
          );
          elementIndex.current++;
        }}>
          <Text>点击遮罩关闭</Text>
        </Button>
        <Button style={{ marginLeft: 15 }}onPress={() => {
          let index = add(
            <OpacityContainer
              modal={true}
              onAppear={() => {
                console.log('子视图已弹出');
              }}
              onDisappear={() => {
                console.log('子视图已消失');
              }}
            >
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
              <Text onPress={() => {
                remove(index);
              }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
            </OpacityContainer>
          );
          elementIndex.current++;
        }}>
          <Text>遮罩不可点</Text>
        </Button>
        <Button style={{ marginLeft: 15 }}onPress={() => {
          let index = add(
            <OpacityContainer
              modal={true}
              mask={false}
              onAppear={() => {
                console.log('子视图已弹出');
              }}
              onDisappear={() => {
                console.log('子视图已消失');
              }}
            >
              <Text style={{ marginTop: 100, fontSize: 24 }}>子视图{elementIndex.current}</Text>
              <Text onPress={() => {
                remove(index);
              }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
            </OpacityContainer>
          );
          elementIndex.current++;
        }}>
          <Text>无遮罩</Text>
        </Button>
      </Section>

      <Section title="TranslateContainer" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={() => {
            OverlayUtil.add(
              <TranslateContainer>
                <View style={{ height: 500, width, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Bottom</Text>
          </Button>
          <Button style={{ marginLeft: 15 }} onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from="top">
                <View style={{ height: 200, width, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Top</Text>
          </Button>
          <Button style={{ marginLeft: 15 }} onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from='left'>
                <View style={{ width: 200, height, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>,
              'pop-view-left'
            )
            elementIndex.current++;
          }}>
            <Text>Left</Text>
          </Button>
          <Button style={{ marginLeft: 15 }} onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from='right'>
                <View style={{ width: 200, height, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Right</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button onPress={() => {
            OverlayUtil.add(
              <TranslateContainer gesture={true}>
                <View style={{ height: 500, width, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Bottom-Gesture</Text>
          </Button>
          <Button style={{ marginLeft: 15 }} onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from='left' gesture={true}>
                <View style={{ width: 200, height, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>,
              'pop-view-left'
            )
            elementIndex.current++;
          }}>
            <Text>Left-Gesture</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button onPress={() => {
            let index = OverlayUtil.add(
              <TranslateContainer modal={true}>
                <View style={{ height: 500, width, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                  <Text onPress={() => {
                    remove(index);
                  }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Bottom-Modal</Text>
          </Button>
          <Button style={{ marginLeft: 15 }} onPress={() => {
            OverlayUtil.add(
              <TranslateContainer mask={false}>
                <View style={{ height: 500, width, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Bottom-NoMask</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button onPress={() => {
            let index = OverlayUtil.add(
              <TranslateContainer gesture={true} underView={{ isScale: true }}>
                <View style={{ height: 500, width, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Bottom-Scale</Text>
          </Button>
          <Button style={{ marginLeft: 15 }} onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from='left' gesture={true} underView={{ isScale: true }}>
                <View style={{ width: 300, height, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Left-Scale</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from='left' gesture={true} underView={{ isTranslate: true }}>
                <View style={{ width: 300, height, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Left-Translate</Text>
          </Button>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <Button onPress={() => {
            OverlayUtil.add(
              <TranslateContainer from='left' gesture={true} underView={{ isTranslate: true, isScale: true }}>
                <View style={{ width: 300, height, backgroundColor: '#fff' }}>
                  <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                </View>
              </TranslateContainer>
            )
            elementIndex.current++;
          }}>
            <Text>Left-Translate-Scale</Text>
          </Button>
        </View>
      </Section>

      <Section title="DrawerContainer">
        <Button onPress={() => {
          let index = OverlayUtil.add(
            <DrawerContainer position='left'>
              <View style={{ width: 300, height, backgroundColor: '#fff' }}>
                <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                <Text onPress={() => {
                  remove(index);
                }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
              </View>
            </DrawerContainer>,
            'draw-view-left'
          )
          elementIndex.current++;
        }}>
          <Text>Left</Text>
        </Button>
        <Button style={{ marginLeft: 15 }} onPress={() => {
          let index = OverlayUtil.add(
            <DrawerContainer position='right'>
              <View style={{ width: 220, height, backgroundColor: '#fff' }}>
                <Text style={{ marginTop: 100, fontSize: 24 }}>Funtion子视图{elementIndex.current}</Text>
                <Text onPress={() => {
                  remove(index);
                }} style={{ marginTop: 20, fontSize: 24 }}>关闭</Text>
              </View>
            </DrawerContainer>,
            'draw-view-right'
          )
          elementIndex.current++;
        }}>
          <Text>Right</Text>
        </Button>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
});
