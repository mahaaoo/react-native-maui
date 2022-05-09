import React, {useState, useCallback, useEffect, useMemo} from 'react'
import Panel from './panel';

interface CollapseParams {
  defaultActive?: Array<number>; // 默认展开
  onChange?: (index: number, isOpen: boolean) => void; // 每次展开或者关闭的时候回掉
  accordion?: boolean; // 手风琴模式
}

const Collapse: React.FC<CollapseParams> = (props) => {
  const {children, defaultActive, onChange, accordion = false} = props;
  const [activeArray, setActiveArray] = useState<Array<boolean>>([]);

  useEffect(() => {
    children && React.Children.forEach(children, (child: any) => {
      if (child && child.type !== Panel) {
        console.warn('[maui warning]: Only Panel can be used as a child component of Collapse');
      }
    })
  }, []);

  // 过滤除了Panel的其他子组件
  const validChildren = useMemo(() => {
    return React.Children.map(children, (child: any) => {
      if (child && child.type === Panel) {
        return child;
      }
    })
  }, [children]);

 useEffect(() => {
    const activeArray = new Array(validChildren?.length).fill(false);
    defaultActive && defaultActive.length > 0 && defaultActive.forEach((key) => {
      if (key >= activeArray.length) {
        console.warn('[maui warning]: defaultActive key out of range');
      } else {
        activeArray[key] = true;
      }
    });
    setActiveArray(activeArray);
  }, [defaultActive, validChildren]);

  // 手风琴模式处理当前展开的子组件
  const handleChildPress = useCallback((index: number) => {
    if (accordion) {
      const activeArray = new Array(validChildren?.length).fill(false);
      activeArray[index] = true;
      setActiveArray(activeArray);
    }
  }, []);

  return (
    <>
      {validChildren?.map((child, index) => {
        const childOnChange = child.props.onChange;
        const clildOnPress = child.props.onPress;
        return React.cloneElement(child, {
          key: `collapse_item_${index}`,
          isOpen: activeArray[index],
          onPress: () => {
            clildOnPress && clildOnPress();
            handleChildPress(index);
          },
          onChange: (isOpen: boolean) => {
            childOnChange && childOnChange(isOpen);
            onChange && onChange(index, isOpen);
          }
        });
      })}
    </>
  )
}

export { Collapse, Panel };
