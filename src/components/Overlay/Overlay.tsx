import React, {useState, createContext, useCallback, useContext, useRef, useImperativeHandle, forwardRef} from 'react';
import {Animated, View, StyleSheet} from 'react-native';

export interface OverlayRef {
  /**
   * add a componet to window, 
   * if you set key, this components is unique, 
   * if not the key assigned by the system and return, this key can used to remove itself
   */
  add: (node: React.ReactNode, key?: string) => string,
  /**
   * remove a componet from window,
   * if you set key, this function will remove the key component
   * if not this function will remove the newest one
   * and if the component which will be removed has 'unMount' function, the unMount will be called before it be removed
   */
  remove: (key?: string) => void,
  /**
   * remove all components without any animation
   */
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
  ref: any;
}

const Overlay = forwardRef<OverlayRef, OverlayProps>((props, ref) => {
  const {children} = props;
  const elements = useRef<Array<ElementType>>([]);
  const [update, forceUpdate] = useState(0);
  const elementsIndex = useRef<number>(0);
  const loadingRef = useRef<any>(null);

  // 如果指定一个key之后，无法重复添加
  // 如果没有指定，则会默认添加一个key，内部计数
  // TODO: can't solve typeof node
  const addNodeToOverlay = useCallback((node: any, key?: string) => {
    // 如果添加的内容，已存在则返回
    if (typeof key === 'string') {
      let addElement;
      for (let index = 0; index < elements.current.length; index++) {
        if (elements.current[index].key === key) {
          addElement = elements.current[index];
          break;
        }
      }
      if (addElement) {
        return key;
      };
    }

    let nodeRef;
    if (!!node && !!node.ref) {
      nodeRef = node.ref;
    } else {
      nodeRef = React.createRef();
    }
    const onDisappear = node?.props?.onDisappear;
    elements.current.push({
      element: React.cloneElement(node, {
        ref: nodeRef,
        onDisappear: () => {
          forceUpdate(update => update + 1);
          onDisappear && onDisappear();
        }
      }),
      key: key || 'overlay' + (elementsIndex.current + 1),
      ref: nodeRef
    });

    elementsIndex.current++;
    forceUpdate(update => update + 1);
    return key || 'overlay' + elementsIndex.current;
  }, [elements]);

  const deleteNodeFromOverlay = useCallback((key?: string) => {
    let deleteElement;
    if (!!key && key?.length > 0) {
      for (let index = 0; index < elements.current.length; index++) {
        if (elements.current[index].key === key) {
          deleteElement = elements.current[index];
          elements.current.splice(index, 1);
          break;
        }
      }
    } else {
      deleteElement = elements.current[elements.current.length - 1];
      elements.current.splice(elements.current.length - 1, 1);
    }

    const deleteAnimation = deleteElement?.ref.current?.unMount;
    if (!!deleteAnimation && typeof deleteAnimation === 'function') {
      deleteAnimation();
    } else {
      forceUpdate(update => update + 1);
    }
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
