import * as React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import {
  useOverlay,
  OverlayUtil,
  TranslateContainer,
  NormalContainer,
  OpacityContainer,
  Button,
  DrawerContainer,
  ScaleContainer,
} from 'react-native-maui';
import Section from '../components/Section';

const { width, height } = Dimensions.get('window');

export default function OverlayExample() {
  const { add, remove, removeAll } = useOverlay();
  const elementIndex = React.useRef(0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.paddingBottom}
    >
      <Section title="关闭视图">
        <Button
          onPress={() => {
            remove();
          }}
        >
          <Text>删除最近添加的一个子视图</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            removeAll();
          }}
        >
          <Text>删除全部子视图</Text>
        </Button>
      </Section>

      <Section title="自定义视图">
        <Button
          onPress={() => {
            const index = add(
              <View style={styles.marginTop}>
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </View>
            );
            elementIndex.current++;
          }}
        >
          <Text>自定义子视图-hook</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = OverlayUtil.add(
              <View style={styles.marginTop}>
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </View>
            );
            elementIndex.current++;
          }}
        >
          <Text>自定义子视图-function</Text>
        </Button>
      </Section>

      <Section title="NormalContainer">
        <Button
          onPress={() => {
            add(
              <NormalContainer
                pointerEvents="none"
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
              </NormalContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>pointerEvents='none'</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
              <NormalContainer
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </NormalContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>pointerEvents='auto'</Text>
        </Button>
      </Section>

      <Section title="OpacityContainer">
        <Button
          onPress={() => {
            add(
              <OpacityContainer
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
              </OpacityContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>点击遮罩关闭</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
              <OpacityContainer
                modal={true}
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </OpacityContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>遮罩不可点</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
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
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </OpacityContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>无遮罩</Text>
        </Button>
      </Section>

      <Section title="TranslateContainer" style={styles.section}>
        <View style={styles.row}>
          <Button
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer from="top">
                  <View style={styles.top}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Top</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer from="left">
                  <View style={styles.left}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>,
                'pop-view-left'
              );
              elementIndex.current++;
            }}
          >
            <Text>Left</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer from="right">
                  <View style={styles.left}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Right</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer gesture={true}>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Gesture</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer from="left" gesture={true}>
                  <View style={styles.left}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>,
                'pop-view-left'
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Gesture</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              const index = OverlayUtil.add(
                <TranslateContainer modal={true}>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                    <Text
                      onPress={() => {
                        remove(index);
                      }}
                      style={styles.close}
                    >
                      关闭
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Modal</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer mask={false}>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-NoMask</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer
                  gesture={true}
                  underView={{ isScale: true }}
                >
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Scale</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer
                  from="left"
                  gesture={true}
                  underView={{ isScale: true }}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Scale</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer
                  from="left"
                  gesture={true}
                  underView={{ isTranslate: true }}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Translate</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              OverlayUtil.add(
                <TranslateContainer
                  from="left"
                  gesture={true}
                  underView={{ isTranslate: true, isScale: true }}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Translate-Scale</Text>
          </Button>
        </View>
      </Section>

      <Section title="DrawerContainer">
        <Button
          onPress={() => {
            const index = OverlayUtil.add(
              <DrawerContainer position="left">
                <View style={styles.left2}>
                  <Text style={styles.childText}>
                    Funtion子视图{elementIndex.current}
                  </Text>
                  <Text
                    onPress={() => {
                      remove(index);
                    }}
                    style={styles.close}
                  >
                    关闭
                  </Text>
                </View>
              </DrawerContainer>,
              'draw-view-left'
            );
            elementIndex.current++;
          }}
        >
          <Text>Left</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = OverlayUtil.add(
              <DrawerContainer position="right">
                <View style={styles.right}>
                  <Text style={styles.childText}>
                    Funtion子视图{elementIndex.current}
                  </Text>
                  <Text
                    onPress={() => {
                      remove(index);
                    }}
                    style={styles.close}
                  >
                    关闭
                  </Text>
                </View>
              </DrawerContainer>,
              'draw-view-right'
            );
            elementIndex.current++;
          }}
        >
          <Text>Right</Text>
        </Button>
      </Section>
      <Section title="ScaleContainer">
        <Button
          onPress={() => {
            add(
              <ScaleContainer>
                <View style={styles.scaleContainer}>
                  <Text>子视图{elementIndex.current}</Text>
                </View>
              </ScaleContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>Scale</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
              <ScaleContainer modal={true}>
                <View style={styles.scaleContainer}>
                  <Text>子视图{elementIndex.current}</Text>
                  <Text
                    onPress={() => {
                      remove(index);
                    }}
                    style={styles.close}
                  >
                    关闭
                  </Text>
                </View>
              </ScaleContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>Scale-Close</Text>
        </Button>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paddingBottom: {
    paddingBottom: 50,
  },
  marginTop: {
    marginTop: 100,
  },
  marginLeft: {
    marginLeft: 15,
  },
  childText: {
    marginTop: 100,
    fontSize: 24,
  },
  close: {
    marginTop: 20,
    fontSize: 24,
  },
  bottom: {
    height: 500,
    width,
    backgroundColor: '#fff',
  },
  top: {
    height: 200,
    width,
    backgroundColor: '#fff',
  },
  left: {
    width: 200,
    height,
    backgroundColor: '#fff',
  },
  viewContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  left2: {
    width: 300,
    height,
    backgroundColor: '#fff',
  },
  right: {
    width: 220,
    height,
    backgroundColor: '#fff',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  scaleContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
