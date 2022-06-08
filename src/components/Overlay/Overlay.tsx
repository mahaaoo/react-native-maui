import React, {useState, createContext, useCallback, useContext, useRef, useImperativeHandle, forwardRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

export interface OverlayRef {
  add: (node: React.ReactNode, key?: string) => string,
  remove: (key?: string) => void,
  removeAll: () => void,
}

export const OverlayContext = createContext({} as OverlayRef);
export const useOverlay = () => useContext(OverlayContext);

interface OverlayProps {
  children: React.ReactNode,
}

interface ElementType {
  element: React.ReactNode,
  key: string,
}

const Overlay = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
  const {children} = props;
  const elements = useRef<Array<ElementType>>([]);
  const [update, forceUpdate] = useState(0);
  const elementsIndex = useRef<number>(0);
  const loadingRef = useRef<any>(null);

  const addNodeToOverlay = useCallback((node: React.ReactNode, key?: string) => {
    // 如果添加的内容，已存在则返回
    if (typeof key === 'string') {
      const alreadyExists = elements.current.some(element => element.key === key);
      if (alreadyExists) return key;
    }

    elements.current.push({
      element: node,
      key: key || 'overlay' + (elementsIndex.current + 1),
    });

    elementsIndex.current++;
    forceUpdate(update => update + 1);
    return key || 'overlay' + elementsIndex.current;
  }, [elements]);

  const deleteNodeFromOverlay = useCallback((key?: string) => {
    if (!!key && key?.length > 0) {
      elements.current = elements.current.filter((item: ElementType) => item.key !== key);
    } else {
      elements.current.splice(elements.current.length - 1, 1);
    }
    forceUpdate(update => update + 1);
  }, [elements]);

  const deleteAllNodeFromOverlay = useCallback(() => {
    elements.current = [];
    forceUpdate(update => update + 1);
    loadingRef.current = null;
  }, []);

  useImperativeHandle(ref, () => ({
    add: addNodeToOverlay,
    remove: deleteNodeFromOverlay,
    removeAll: deleteAllNodeFromOverlay,
  }), []);

  return (
    <View style={{flex: 1}}>
      <OverlayContext.Provider value={{
        add: addNodeToOverlay,
        remove: deleteNodeFromOverlay,
        removeAll: deleteAllNodeFromOverlay,
      }}>
        <Animated.View style={{flex: 1}}>
          {children}
        </Animated.View>
      </OverlayContext.Provider>
      {elements.current.map((node: ElementType) => {
        return (
          <View key={node.key} style={styles.overlay} pointerEvents='none'>
            {node.element}
          </View>
        )
      })}
    </View>
  )
})

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
