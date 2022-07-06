import React, {useState, createContext, useCallback, useContext, useRef, useImperativeHandle, forwardRef} from 'react';
import {View, StyleSheet, StatusBar, StatusBarStyle} from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useTheme } from '../Theme';

export interface OverlayRef {
  /**
   * Add a componet to window, 
   * If you set key, this components is unique, 
   * If not the key assigned by the system and return, this key can used to remove itself
   */
  add: (node: React.ReactNode, key?: string) => string,
  /**
   * Remove a componet from window,
   * If you set key, this function will remove the key component
   * If not this function will remove the newest one
   * And if the component which will be removed has 'unMount' function, the unMount will be called before it be removed
   */
  remove: (key?: string) => void,
  /**
   * Remove all components without any animation
   */
  removeAll: () => void,
  /**
   * Check if the component already exists by key
   */
  isExist: (key: string) => boolean,
}

export interface OverlayContextProps extends OverlayRef {
  underScale: Animated.SharedValue<number>;
  underTranslateX: Animated.SharedValue<number>;
}

export const OverlayContext = createContext({} as OverlayContextProps);
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
  const {theme} = useTheme();

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  /**
   * When call this function with key, the component will be unique
   * Otherwise, Overlay will add key automatic，key will one by one And save at elementsIndex
   */
  const addNodeToOverlay = useCallback((node: any, key?: string) => {
    // If add the same key will be return
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

    /**
     * Before add compoonet to window, there are some props must handle
     * ref: in order to call unMount animation, the component if not have, will be create
     * innerKey: in order to support componet remove itself
     * onDisappear: when componet after be removed, forceUpdate Overlay to real delete
     */
    let nodeRef;
    if (!!node && !!node.ref) {
      nodeRef = node.ref;
    } else {
      nodeRef = React.createRef();
    }
    const onDisappear = node?.props?.onDisappear;
    const inner_key = key || 'overlay' + (elementsIndex.current + 1);
    elements.current.push({
      element: React.cloneElement(node, {
        ref: nodeRef,
        onDisappear: () => {
          console.log(`删除组件${inner_key}`);
          forceUpdate(update => update + 1);
          onDisappear && onDisappear();
        },
        innerKey: inner_key,
      }),
      key: inner_key,
      ref: nodeRef
    });

    elementsIndex.current++;
    forceUpdate(update => update + 1);
    return inner_key;
  }, [elements]);

  /**
   * Remove componet by key
   * If not set key, the function will remove the latest component
   */
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

    /**
     * Before the component be removed, check it has unMount function
     * it means the component has some animation must be invoke be itself be removed
     * And forceUpdate will be invoke at onDisappear function
     */
    const deleteAnimation = deleteElement?.ref.current?.unMount;
    if (!!deleteAnimation && typeof deleteAnimation === 'function') {
      deleteAnimation();
    } else {
      forceUpdate(update => update + 1);
    }
  }, [elements]);

  /**
   * Remove all components without Animation
   */
  const deleteAllNodeFromOverlay = useCallback(() => {
    elements.current = [];
    forceUpdate(update => update + 1);
  }, []);

  /**
   * Check the key indexOf elements.current
   */
  const isExist = useCallback((key: string) => {
    return elements.current.some(element => element.key === key);
  }, []);

  const mainViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: scale.value
      }, {
        translateX: translateX.value
      }]
    }
  }, [])

  useImperativeHandle(ref, () => ({
    add: addNodeToOverlay,
    remove: deleteNodeFromOverlay,
    removeAll: deleteAllNodeFromOverlay,
    isExist,
  }), []);

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      <StatusBar barStyle={theme.statusBarColor as StatusBarStyle} animated={true} />
      <OverlayContext.Provider value={{
        add: addNodeToOverlay,
        remove: deleteNodeFromOverlay,
        removeAll: deleteAllNodeFromOverlay,
        isExist,
        underScale: scale,
        underTranslateX: translateX,
      }}>
        <Animated.View style={[{flex: 1}, mainViewStyle]}>
          {children}
        </Animated.View>
        {elements.current.map((node: any) => {
          const pointerEvents = node.element.props.pointerEvents || 'auto';
          
          return (
            <View key={node.key} pointerEvents={pointerEvents} style={styles.overlay}>
              {node.element}
            </View>
          )
        })}
      </OverlayContext.Provider>
    </View>
  )
})

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default Overlay;
