import { useState, useMemo, useCallback } from 'react';
import { SharedValue, AnimatedRef } from 'react-native-reanimated';

interface ChildInfoType {
  scrollValue: SharedValue<number>;
  scrollRef: AnimatedRef<any>;
}

export const useNest = () => {
  const [childInfo, setChildInfo] = useState<{
    [index: number]: ChildInfoType;
  }>({});

  // 子scroll的Native容器引用ref
  const [childNativeRefs, setChildNativeRefs] = useState<
    React.RefObject<any>[]
  >([]);

  const isReady = useMemo(() => {
    return Object.keys(childInfo).length > 0 && childNativeRefs.length > 0;
  }, [childInfo, childNativeRefs]);

  // 用Gesture.Native包裹内部scrollview并获取此ref
  const registerNativeRef = useCallback(
    (ref: React.RefObject<any>) => {
      if (!ref) return;
      const findRef = childNativeRefs?.find(
        (item) => item.current === ref.current
      );
      if (findRef) return;
      setChildNativeRefs((prechildRefs) => {
        return [...prechildRefs, ref];
      });
    },
    [childNativeRefs]
  );

  const registerChildInfo = useCallback(
    (
      index: number,
      scrollValue: SharedValue<number>,
      scrollRef: AnimatedRef<any>
    ) => {
      setChildInfo((preChildInfo) => {
        return {
          ...preChildInfo,
          [index]: {
            scrollValue,
            scrollRef,
          },
        };
      });
    },
    []
  );

  return {
    registerNativeRef,
    childNativeRefs,
    registerChildInfo,
    childInfo,
    isReady,
  };
};
