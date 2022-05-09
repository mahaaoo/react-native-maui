import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react'
import {
  View, 
  TouchableOpacity, 
  LayoutAnimation, 
  UIManager, 
  StyleSheet, 
  Text, 
  TextStyle, 
  Dimensions, 
  Animated, 
  Easing, 
  ViewStyle
} from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

interface PanelParams {
  stickyHeight: number; // 展开高度

  isOpen?: boolean; // 控制是否打开/默认是否开启
  title?: string; // 标题
  titleStyle?: TextStyle;
  style?: ViewStyle; // 标题头样式

  arrowImage?: any; // 箭头图片
  arrowPosition?: 'left' | 'right'; // 箭头默认位置
  stickyComponent?: React.ReactNode; // 自定义头部
  duration?: number; // 展开动画执行时间

  onPress?: () => void; // 点击展开/关闭的时候
  onChange?: (isOpen: boolean) => void; // 展开关闭动画执行完毕
}

const Panel: React.FC<PanelParams> = (props) => {
  const {
    stickyHeight,
    isOpen = false,
    title,
    titleStyle,
    style,
    arrowImage = require("./arrow.png"),
    arrowPosition = 'left',
    stickyComponent,
    duration = 200,
    onPress,
    onChange,
  } = props;
  const {children} = props;
  const [height, setHeight] = useState<number>(isOpen === true ? stickyHeight : 0);
  const imageAngle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        duration,
        LayoutAnimation.Types.linear,
        LayoutAnimation.Properties.opacity,
      ),
    );
  })

  useEffect(() => {
    if (isOpen) {
      openPanel();
    } else {
      closePanel();
    }
  }, [isOpen]);

  const handlePress = useCallback(() => {
    onPress && onPress();
    if (height === 0) {
      openPanel();
    } else {
      closePanel();
    }
  }, [height])

  const openPanel = useCallback(() => {
    setHeight(stickyHeight);
    Animated.timing(imageAngle, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      onChange && onChange(true);
    });  
  }, []);

  const closePanel = useCallback(() => {
    setHeight(0);
    Animated.timing(imageAngle, {
      toValue: 0,
      duration: duration,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      onChange && onChange(false);
    });
  }, []);

  const clickComponent = useMemo(() => {
    if (stickyComponent) {
      return stickyComponent;
    }
    return (
      <View style={[styles.container, style, {justifyContent: arrowPosition === 'right' ? 'space-between' : 'flex-start' }]}>
        {
          arrowPosition === 'left' ? (
            <Animated.Image 
              source={arrowImage} 
              style={{ width: 25, height: 25,
                transform: [{rotate: imageAngle
                  .interpolate({inputRange: [0, 1],outputRange: ['0deg', '90deg']})
                }]}
              } 
            />
          ) : null
        }
        <Text style={titleStyle}>{title}</Text>
        {
          arrowPosition === 'right' ? (
            <Animated.Image 
              source={arrowImage} 
              style={{ width: 25, height: 25,
                transform: [{rotate: imageAngle
                  .interpolate({inputRange: [0, 1],outputRange: ['0deg', '90deg']})
                }]}
              } 
            />
          ) : null
        }
      </View>
    )
  }, [stickyComponent, title, arrowPosition, arrowImage]);

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={1}>
        {clickComponent}
      </TouchableOpacity>
      <View style={[styles.content, { height: height }]}>
        {children}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  content: {
    width: Dimensions.get("window").width,
    overflow: 'hidden',
  }
})

export default Panel;
