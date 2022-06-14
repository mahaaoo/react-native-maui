import { useMemo } from "react";
import { Dimensions } from "react-native";
import { Position } from "./ImageContainer";

const {width: Width, height: Height} = Dimensions.get('window');

export const useInitialPosition = (position: Position, paddingTop: number, paddingBottom: number) => {
  const { width: w, height: h, pageX: x, pageY: y } = position;
  const initial = useMemo(() => {
    const initialX = x == undefined ? Width / 2 : x;
    const initialY = (y == undefined ? Height / 2 : y) - paddingTop;
    const initialW = w == undefined ? 0 : w;
    const initialH = h == undefined ? 0 : h;
    const toHeight = Height - paddingTop - paddingBottom;

    return {
      initialX,
      initialY,
      initialW,
      initialH,
      toHeight,
    }
  }, [position, paddingTop, paddingBottom]);
  return initial
};