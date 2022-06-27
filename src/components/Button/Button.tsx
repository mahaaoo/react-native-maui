import React from "react";
import { StyleProp, ViewStyle, Text, TextStyle } from "react-native";
import BaseButton, { BaseButtonProps } from "./BaseButton";
import {useType} from './hook';
import {ButtonType} from './type';

interface ButtonProps extends BaseButtonProps {  
  style?: StyleProp<ViewStyle>;
  type?: ButtonType;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { onPress, style, children, type = ButtonType.Default, disabled, textStyle, ...options } = props;
  const typeStyle = useType(type);

  return (
    <BaseButton style={[typeStyle, style]} {...{disabled, onPress, ...options }}>
      {
        typeof children === 'string' ? <Text style={textStyle}>{children}</Text> : children
      }
    </BaseButton>
  );
}

export default Button;
