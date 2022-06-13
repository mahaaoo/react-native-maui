import { useMemo } from "react";
import { Dimensions } from "react-native";
import { Position } from "./ImageContainer";

const {width: Width, height: Height} = Dimensions.get('window');

export const useInitialPosition = (position: Position, paddingTop: number) => {
  const { width: w, height: h, pageX: x, pageY: y } = position;
  const initial = useMemo(() => {
    const initialX = x == undefined ? Width / 2 : x;
    const initialY = (y == undefined ? Height / 2 : y) - paddingTop;
    const initialW = w == undefined ? 0 : w;
    const initialH = h == undefined ? 0 : h;
    return {
      initialX,
      initialY,
      initialW,
      initialH,
    }
  }, [position, paddingTop]);
  return initial
};