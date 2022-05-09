import React, {useState, createContext, useCallback, useContext, useRef} from 'react';
import {Animated, View, StyleSheet, Text} from 'react-native';
import Loading from '../Loading';
import OverlayContainer from './OverlayContainer';

const OverlayContext = createContext({
  add: (node: React.ReactNode) => {},
  remove: (key?: string) => {},
  removeAll: () => {},
  showLoading: () => {},
  closeLoading: () => {},
});

export const useOverlay = () => useContext(OverlayContext);

interface OverlayProps {

}

interface ElementType {
  element: React.ReactNode,
  key: string,
}

const Overlay: React.FC<OverlayProps> = props => {
  const {children} = props;
  const [elements, setElements] = useState<Array<ElementType>>([]);
  const elementsIndex = useRef<number>(0);
  const loadingRef = useRef<any>(null);

  const addNodeToOverlay = useCallback((node: React.ReactNode, key?: string) => {
    console.log('向overlays添加元素');
    const newElements = [...elements];
    newElements.push({
      element: node,
      key: 'overlay' + (elementsIndex.current + 1),
    });
    elementsIndex.current++;
    setElements(newElements);
    return 'overlay' + elementsIndex.current;
  }, [elements]);

  const deleteNodeFromOverlay = useCallback((key?: string) => {
    console.log('删除overlays元素');
    let newElements = [...elements];
    if (!!key && key?.length > 0) {
      newElements = newElements.filter((item: ElementType) => item.key !== key);
    } else {
      newElements.splice(newElements.length - 1, 1);
    }
    setElements(newElements);
  }, [elements]);

  const deleteAllNodeFromOverlay = useCallback(() => {
    setElements([]);
    loadingRef.current = null;
  }, []);

  const showLoading = useCallback(() => {
    if (!loadingRef.current) {
      const key = addNodeToOverlay(
        <OverlayContainer>
          <Loading />
        </OverlayContainer>
      );
      loadingRef.current = key;
      // setTimeout(() => {
      //   closeLoading();
      // }, 2000);
    }
  }, []);

  const closeLoading = useCallback(() => {
    if (loadingRef.current) {
      deleteNodeFromOverlay(loadingRef.current);
      loadingRef.current = null;
    }
  }, []);

  return (
    <View style={{flex: 1}}>
      <OverlayContext.Provider value={{
        add: addNodeToOverlay,
        remove: deleteNodeFromOverlay,
        removeAll: deleteAllNodeFromOverlay,
        showLoading,
        closeLoading,
      }}>
        <Animated.View style={{flex: 1}}>
          {children}
        </Animated.View>
      </OverlayContext.Provider>
      {elements.map((node: ElementType, index: number) => {
        return (
          <View key={node.key} style={styles.overlay} pointerEvents='none'>
            {node.element}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Overlay;
