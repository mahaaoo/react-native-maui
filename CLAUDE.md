# React Native MAUI 组件库 - Claude 开发指南

> **版本**: v1.1.0
> **最后更新**: 2025-12-21
> **状态**: 活跃维护

> 本文档为 AI 助手（Claude Code）提供项目开发指导规范

---

## 项目概述

### 项目定位

这是一个 **React Native 端的 UI 组件库**，名为 `react-native-maui`。

**核心目标：**
- 提供高质量、可复用的 React Native 基础组件
- 遵循最佳实践和现代 API
- 支持 TypeScript
- 跨平台（iOS、Android、Web）

**设计理念：**
- 基础组件应该是"画布"而非"画" - 提供机制，不强加策略
- 零样式预设 - 完全由使用者控制视觉呈现
- 组合优于配置 - 通过组合实现复杂需求
- TypeScript First - 完整的类型安全

---

## 项目结构

### 目录组织

```
react-native-maui/
├── src/
│   ├── components/          # 组件目录（核心）
│   │   ├── Button/
│   │   │   ├── Button.tsx         # 组件实现
│   │   │   ├── types.ts           # TypeScript 类型定义
│   │   │   ├── index.tsx          # 导出文件
│   │   │   ├── __test__/          # 测试文件
│   │   │   │   └── Button.test.tsx
│   │   │   └── docs/              # 组件文档（重要！）
│   │   │       ├── DESIGN.md      # 设计方案
│   │   │       ├── API.md         # API 文档
│   │   │       └── EXAMPLES.md    # 使用示例
│   │   ├── Loading/
│   │   ├── TabBar/
│   │   └── ...                    # 其他组件
│   ├── hooks/               # 自定义 Hooks
│   ├── utils/               # 工具函数
│   └── types/               # 全局类型定义
├── example/                 # 示例应用
│   └── src/
│       └── pages/           # 组件示例页面
│           └── ButtonExample.tsx
├── package.json
└── tsconfig.json
```

### 组件文件夹结构规范

**每个组件必须遵循以下结构：**

```
ComponentName/
├── ComponentName.tsx        # 核心实现（必需）
├── types.ts                 # 类型定义（必需）
├── index.tsx                # 导出文件（必需）
├── utils.ts                 # 工具函数（可选）
├── hooks.ts                 # 组件专用 hooks（可选）
├── __test__/                # 测试文件夹（推荐）
│   └── ComponentName.test.tsx
└── docs/                    # 文档文件夹（必需）
    ├── DESIGN.md            # 设计方案文档
    ├── API.md               # API 参考文档
    └── EXAMPLES.md          # 使用示例文档
```

### 文档规范

#### 文档元信息要求

**所有文档都必须包含文档头部：**

```markdown
# 组件名称

> **版本**: v1.0.0
> **最后更新**: 2025-12-21
> **维护者**: [维护者名称]
> **状态**: 稳定 | 实验性 | 已废弃

---

## 更新日志

### v1.0.0 (2025-12-21)
- 初始版本
- 添加了基础功能

### v1.1.0 (2025-12-22)
- 新增 XXX 功能
- 修复 XXX 问题
- 优化了 XXX 性能

---

[文档正文开始]
```

**更新日志规范：**
- 每次修改文档必须更新"最后更新"日期
- 必须在"更新日志"部分添加条目
- 更新日志按时间倒序排列（最新的在最上面）
- 使用语义化版本号（major.minor.patch）
- 明确说明变更类型：新增、修复、优化、重构、废弃等

#### 1. DESIGN.md - 设计方案文档

**目的：** 说明设计决策和设计理念

**必须包含：**
- 文档元信息（版本、更新日志）
- 设计哲学和核心理念
- 核心设计决策（为什么这样设计）
- API 设计要点
- 使用场景
- 设计权衡
- 扩展性设计
- 非目标（明确不做什么）
- 技术约束
- 实现要点（关键逻辑，非完整实现）

**示例：** 参考 `src/components/Button/REDESIGN.md`

#### 2. API.md - API 参考文档

**目的：** 完整的 API 参考手册

**必须包含：**
- 文档元信息（版本、更新日志）
- Props 完整列表和说明
- TypeScript 类型定义
- 默认值
- 平台差异说明
- Methods（如果有）
- Events（如果有）
- 与设计文档的版本对应

#### 3. EXAMPLES.md - 使用示例文档

**目的：** 展示常见使用场景

**必须包含：**
- 文档元信息（版本、更新日志）
- 基础用法
- 常见场景（至少 5 个）
- 高级用法
- 与其他组件组合使用
- 性能优化示例
- 每个示例都应该可运行

---

## React / React Native 最佳实践

### 1. 闭包陷阱 - 必须规避

#### 问题：闭包捕获旧值

```typescript
// ❌ 错误：闭包陷阱
const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1); // 始终使用初始的 count = 0
  }, 1000);
  return () => clearInterval(timer);
}, []); // 空依赖，count 被闭包捕获

// ✅ 正确：使用函数式更新
const [count, setCount] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // 使用最新值
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

#### 规则：

**当你需要基于旧状态计算新状态时，永远使用函数式更新：**

```typescript
// ✅ 正确
setState(prevState => prevState + 1);
setState(prev => ({ ...prev, newField: value }));

// ❌ 错误（除非你确定依赖完整）
setState(state + 1);
```

### 2. useState vs useRef - 正确选择

#### 何时使用 useState

**规则：** 当数据变化需要触发 UI 重新渲染时

```typescript
// ✅ 使用 useState：UI 需要响应变化
const [isVisible, setIsVisible] = useState(false);

return (
  <View>
    {isVisible && <Modal />}
    <Button onPress={() => setIsVisible(true)}>Show</Button>
  </View>
);
```

#### 何时使用 useRef

**规则：** 当数据变化不需要触发重新渲染时

```typescript
// ✅ 使用 useRef：保存可变值，不触发渲染
const timerRef = useRef<NodeJS.Timeout | null>(null);
const isFirstRender = useRef(true);
const previousValue = useRef(initialValue);

useEffect(() => {
  timerRef.current = setTimeout(() => {
    // do something
  }, 1000);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };
}, []);
```

#### 常见用途对比

| 场景 | 使用 |
|------|------|
| 保存 DOM/组件引用 | `useRef` |
| 保存定时器 ID | `useRef` |
| 保存上一次的值 | `useRef` |
| 标记是否首次渲染 | `useRef` |
| 保存不需要响应式的值 | `useRef` |
| 控制 UI 显示/隐藏 | `useState` |
| 表单输入值 | `useState` |
| 列表数据 | `useState` |
| 任何需要触发渲染的值 | `useState` |

### 3. useCallback 和 useMemo - 正确使用

#### useCallback - 缓存函数引用

**规则：** 当函数作为 props 传递给子组件，且子组件使用了 `React.memo` 时使用

```typescript
// ✅ 正确使用
const MyComponent = () => {
  const [count, setCount] = useState(0);

  // 子组件使用了 memo，需要缓存函数引用
  const handlePress = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // 依赖为空，函数永远不变

  return <MemoizedChild onPress={handlePress} />;
};

const MemoizedChild = React.memo(({ onPress }) => {
  return <Button onPress={onPress}>Click</Button>;
});
```

**不要过度使用：**

```typescript
// ❌ 过度优化：没有必要
const handlePress = useCallback(() => {
  console.log('pressed');
}, []);

return <Button onPress={handlePress}>Click</Button>;
// Button 没有 memo，useCallback 无意义

// ✅ 直接定义即可
const handlePress = () => {
  console.log('pressed');
};

return <Button onPress={handlePress}>Click</Button>;
```

#### useMemo - 缓存计算结果

**规则：** 只在计算开销大时使用

```typescript
// ✅ 正确：计算开销大
const sortedData = useMemo(() => {
  return largeArray
    .filter(item => item.active)
    .sort((a, b) => a.score - b.score)
    .slice(0, 100);
}, [largeArray]);

// ❌ 过度优化：计算很简单
const fullName = useMemo(() => {
  return `${firstName} ${lastName}`;
}, [firstName, lastName]);

// ✅ 直接计算即可
const fullName = `${firstName} ${lastName}`;
```

### 4. useEffect - 依赖数组规则

#### 规则 1：依赖数组必须完整

```typescript
// ❌ 错误：缺少依赖
useEffect(() => {
  fetchData(userId); // 使用了 userId
}, []); // 但没有声明依赖

// ✅ 正确：完整依赖
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

#### 规则 2：不要撒谎依赖

```typescript
// ❌ 错误：使用了但故意不加入依赖
useEffect(() => {
  console.log(count); // 使用了 count
}, []); // eslint-disable-line react-hooks/exhaustive-deps

// ✅ 正确：要么加入依赖，要么用 ref
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
  console.log(countRef.current);
}, []);
```

#### 规则 3：清理副作用

```typescript
// ✅ 始终清理副作用
useEffect(() => {
  const subscription = API.subscribe(handleData);

  return () => {
    subscription.unsubscribe(); // 清理
  };
}, []);

// ✅ 清理定时器
useEffect(() => {
  const timer = setTimeout(() => {
    // do something
  }, 1000);

  return () => clearTimeout(timer);
}, []);
```

### 5. React Native 特有陷阱

#### 陷阱 1：FlatList 的 renderItem

```typescript
// ❌ 错误：每次渲染创建新函数
<FlatList
  data={data}
  renderItem={({ item }) => <Item data={item} />}
/>

// ✅ 正确：使用 useCallback 或提取到组件外
const renderItem = useCallback(({ item }) => {
  return <Item data={item} />;
}, []);

<FlatList
  data={data}
  renderItem={renderItem}
/>

// ✅ 更好：提取为独立组件
const ItemRenderer = ({ item }) => <Item data={item} />;

<FlatList
  data={data}
  renderItem={({ item }) => <ItemRenderer item={item} />}
/>
```

#### 陷阱 2：TouchableOpacity vs Pressable

```typescript
// ❌ 过时：TouchableOpacity
import { TouchableOpacity } from 'react-native';

<TouchableOpacity onPress={handlePress}>
  <Text>Click</Text>
</TouchableOpacity>

// ✅ 现代：Pressable（RN 0.63+）
import { Pressable } from 'react-native';

<Pressable
  onPress={handlePress}
  style={({ pressed }) => [
    styles.button,
    pressed && styles.pressed
  ]}
>
  <Text>Click</Text>
</Pressable>
```

#### 陷阱 3：StyleSheet.create vs 内联样式

```typescript
// ❌ 性能差：内联样式
<View style={{ padding: 16, backgroundColor: '#fff' }}>
  <Text>Hello</Text>
</View>
// 每次渲染都创建新对象

// ✅ 性能好：StyleSheet.create
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
});

<View style={styles.container}>
  <Text>Hello</Text>
</View>
```

#### 陷阱 4：不必要的重渲染

```typescript
// ❌ 错误：传递内联对象/数组
<MyComponent
  style={{ padding: 16 }}        // 每次新对象
  data={[1, 2, 3]}               // 每次新数组
  config={{ enabled: true }}      // 每次新对象
/>

// ✅ 正确：提取到外部或使用 useMemo
const style = { padding: 16 };
const data = [1, 2, 3];
const config = { enabled: true };

<MyComponent
  style={style}
  data={data}
  config={config}
/>

// ✅ 或使用 useMemo（如果值是动态的）
const config = useMemo(() => ({
  enabled: someCondition,
}), [someCondition]);
```

### 6. TypeScript 最佳实践

#### 规则 1：优先使用类型推断

```typescript
// ❌ 过度注解
const [count, setCount] = useState<number>(0);
const name: string = 'John';

// ✅ 让 TypeScript 推断
const [count, setCount] = useState(0); // 推断为 number
const name = 'John'; // 推断为 string
```

#### 规则 2：为 Props 定义明确的接口

```typescript
// ✅ 始终定义 Props 接口
interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({ onPress, disabled, children, style }) => {
  // implementation
};

// ✅ 导出类型供外部使用
export type { ButtonProps };
export { Button };
```

#### 规则 3：使用泛型而非 any

```typescript
// ❌ 错误：使用 any
const getValue = (obj: any, key: any) => obj[key];

// ✅ 正确：使用泛型
const getValue = <T, K extends keyof T>(obj: T, key: K): T[K] => {
  return obj[key];
};
```

---

## 组件开发规范

### 1. 组件结构模板

```typescript
// ComponentName.tsx
import React, { useCallback, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ComponentNameProps } from './types';

/**
 * ComponentName - 简短描述
 *
 * @example
 * ```tsx
 * <ComponentName prop1="value">
 *   <Text>Content</Text>
 * </ComponentName>
 * ```
 */
export const ComponentName = React.forwardRef<View, ComponentNameProps>((props, ref) => {
  const {
    // 解构 props
    onPress,
    disabled = false,
    children,
    style,
    testID = 'component-name',
  } = props;

  // Refs
  const internalRef = useRef<View>(null);

  // Memoized values
  const computedValue = useMemo(() => {
    // 复杂计算
    return someExpensiveComputation();
  }, [dependencies]);

  // Callbacks
  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress?.();
  }, [disabled, onPress]);

  // Render
  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      disabled={disabled}
      style={style}
      testID={testID}
    >
      {children}
    </Pressable>
  );
});

ComponentName.displayName = 'ComponentName';

// 内部样式（如果需要）
const styles = StyleSheet.create({
  // ...
});
```

### 2. 类型定义模板

```typescript
// types.ts
import type { ViewProps, StyleProp, ViewStyle } from 'react-native';

export interface ComponentNameProps {
  /**
   * 点击事件处理
   */
  onPress?: () => void;

  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;

  /**
   * 子元素
   */
  children?: React.ReactNode;

  /**
   * 自定义样式
   */
  style?: StyleProp<ViewStyle>;

  /**
   * 测试 ID
   * @default 'component-name'
   */
  testID?: string;
}
```

### 3. 导出规范

```typescript
// index.tsx
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './types';
```

### 4. 性能优化清单

**每个组件必须考虑：**

- [ ] 是否需要使用 `React.memo`
- [ ] 是否需要使用 `useCallback` 缓存函数
- [ ] 是否需要使用 `useMemo` 缓存计算
- [ ] 是否使用了 `StyleSheet.create`
- [ ] 是否正确处理了列表渲染（`key` prop）
- [ ] 是否避免了不必要的重渲染
- [ ] 是否正确清理了副作用（`useEffect` return）

---

## 测试规范

### 测试目标

**测试是确保组件行为与设计预期一致的关键手段**

每个组件必须：
- 测试覆盖率 ≥ 80%
- 包含单元测试、快照测试
- 测试所有公开的 API（props、methods、events）
- 测试边界情况和错误处理
- 确保与设计文档中的预期行为一致

### 测试类型

#### 1. 单元测试 (Unit Tests)

**目的：** 测试组件的独立功能单元

**必须测试：**
- [ ] Props 的所有可能值
- [ ] 回调函数是否正确触发
- [ ] 状态变化是否正确
- [ ] 条件渲染逻辑
- [ ] 边界值和异常情况
- [ ] 禁用状态下的行为

```typescript
// __test__/Button.test.tsx - 单元测试示例
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button - Unit Tests', () => {
  describe('Props', () => {
    it('should render with children', () => {
      const { getByText } = render(
        <Button onPress={() => {}}>
          <Text>Click Me</Text>
        </Button>
      );
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should apply custom style', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <Button style={customStyle} testID="test-button" onPress={() => {}} />
      );
      const button = getByTestId('test-button');
      expect(button.props.style).toContainEqual(customStyle);
    });

    it('should apply pressed style when pressed', () => {
      const pressedStyle = { opacity: 0.5 };
      const { getByTestId } = render(
        <Button
          pressedStyle={pressedStyle}
          testID="test-button"
          onPress={() => {}}
        />
      );
      const button = getByTestId('test-button');
      fireEvent.pressIn(button);
      expect(button.props.style).toContainEqual(pressedStyle);
    });

    it('should apply disabled style when disabled', () => {
      const disabledStyle = { opacity: 0.3 };
      const { getByTestId } = render(
        <Button
          disabled
          disabledStyle={disabledStyle}
          testID="test-button"
          onPress={() => {}}
        />
      );
      const button = getByTestId('test-button');
      expect(button.props.style).toContainEqual(disabledStyle);
    });
  });

  describe('Events', () => {
    it('should call onPress when pressed', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button onPress={onPress} testID="test-button" />
      );
      fireEvent.press(getByTestId('test-button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('should call onLongPress when long pressed', () => {
      const onLongPress = jest.fn();
      const { getByTestId } = render(
        <Button onLongPress={onLongPress} testID="test-button" />
      );
      fireEvent(getByTestId('test-button'), 'onLongPress');
      expect(onLongPress).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button disabled onPress={onPress} testID="test-button" />
      );
      fireEvent.press(getByTestId('test-button'));
      expect(onPress).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button loading onPress={onPress} testID="test-button" />
      );
      fireEvent.press(getByTestId('test-button'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined onPress gracefully', () => {
      const { getByTestId } = render(
        <Button testID="test-button" />
      );
      expect(() => {
        fireEvent.press(getByTestId('test-button'));
      }).not.toThrow();
    });

    it('should handle rapid clicks', async () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Button onPress={onPress} testID="test-button" />
      );
      const button = getByTestId('test-button');

      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);

      expect(onPress).toHaveBeenCalledTimes(3);
    });

    it('should work with null children', () => {
      expect(() => {
        render(<Button onPress={() => {}}>{null}</Button>);
      }).not.toThrow();
    });
  });
});
```

#### 2. 快照测试 (Snapshot Tests)

**目的：** 捕获组件的渲染输出，防止意外的 UI 变化

**何时使用快照测试：**
- 组件首次实现后
- 修改组件结构后
- 添加新的 props 后
- 不同状态下的渲染

**快照测试最佳实践：**
- 保持快照小而专注
- 为不同状态创建单独的快照
- 定期审查快照变化
- 快照应该易于理解

```typescript
// __test__/Button.snapshot.test.tsx - 快照测试示例
import React from 'react';
import { Text } from 'react-native';
import renderer from 'react-test-renderer';
import { Button } from '../Button';

describe('Button - Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const tree = renderer.create(
      <Button onPress={() => {}}>
        <Text>Default Button</Text>
      </Button>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when disabled', () => {
    const tree = renderer.create(
      <Button disabled onPress={() => {}}>
        <Text>Disabled Button</Text>
      </Button>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when loading', () => {
    const tree = renderer.create(
      <Button loading onPress={() => {}}>
        <Text>Loading Button</Text>
      </Button>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot with custom styles', () => {
    const tree = renderer.create(
      <Button
        style={{ padding: 20, backgroundColor: 'blue' }}
        pressedStyle={{ opacity: 0.5 }}
        disabledStyle={{ backgroundColor: 'gray' }}
        onPress={() => {}}
      >
        <Text>Styled Button</Text>
      </Button>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot with children variants', () => {
    const tree = renderer.create(
      <>
        <Button onPress={() => {}}>
          <Text>Text Only</Text>
        </Button>
        <Button onPress={() => {}}>
          <View>
            <Icon name="plus" />
            <Text>With Icon</Text>
          </View>
        </Button>
      </>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```

#### 3. 方法测试 (Method Tests)

**目的：** 如果组件暴露了方法（通过 ref），必须测试这些方法

```typescript
// __test__/Button.methods.test.tsx - 方法测试示例
import React, { createRef } from 'react';
import { render } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button - Method Tests', () => {
  it('should expose ref correctly', () => {
    const ref = createRef<View>();
    render(<Button ref={ref} onPress={() => {}} />);
    expect(ref.current).not.toBeNull();
  });

  // 如果组件有自定义方法
  it('should call custom method via ref', () => {
    const ref = createRef<ButtonRef>();
    const { getByTestId } = render(
      <Button ref={ref} testID="test-button" onPress={() => {}} />
    );

    // 假设 Button 有一个 focus 方法
    ref.current?.focus();

    // 验证方法效果
    expect(getByTestId('test-button')).toBeFocused();
  });
});
```

#### 4. 集成测试 (Integration Tests)

**目的：** 测试组件与其他组件或系统的交互

```typescript
// __test__/Button.integration.test.tsx - 集成测试示例
import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';
import { Modal } from '../Modal';

describe('Button - Integration Tests', () => {
  it('should work with Modal component', () => {
    const TestComponent = () => {
      const [visible, setVisible] = useState(false);
      return (
        <>
          <Button onPress={() => setVisible(true)} testID="open-button">
            <Text>Open Modal</Text>
          </Button>
          <Modal visible={visible} onClose={() => setVisible(false)}>
            <Text>Modal Content</Text>
          </Modal>
        </>
      );
    };

    const { getByTestId, getByText } = render(<TestComponent />);

    fireEvent.press(getByTestId('open-button'));
    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('should work with form submission', async () => {
    const onSubmit = jest.fn();
    const TestForm = () => {
      const [loading, setLoading] = useState(false);

      const handleSubmit = async () => {
        setLoading(true);
        await onSubmit();
        setLoading(false);
      };

      return (
        <Button loading={loading} onPress={handleSubmit} testID="submit-button">
          <Text>{loading ? 'Submitting...' : 'Submit'}</Text>
        </Button>
      );
    };

    const { getByTestId, getByText } = render(<TestForm />);

    fireEvent.press(getByTestId('submit-button'));
    expect(getByText('Submitting...')).toBeTruthy();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
      expect(getByText('Submit')).toBeTruthy();
    });
  });
});
```

### 测试覆盖率要求

**最低要求：**
- 整体覆盖率 ≥ 80%
- 语句覆盖率 (Statements) ≥ 80%
- 分支覆盖率 (Branches) ≥ 75%
- 函数覆盖率 (Functions) ≥ 80%
- 行覆盖率 (Lines) ≥ 80%

**运行覆盖率报告：**

```bash
# 运行测试并生成覆盖率报告
npm test -- --coverage

# 查看详细覆盖率
npm test -- --coverage --verbose
```

### 与设计预期一致性验证

**每个测试文件都应该包含一个 "Design Compliance" 测试套件：**

```typescript
describe('Button - Design Compliance', () => {
  it('should implement all required props from design spec', () => {
    // 根据 DESIGN.md 中定义的 API
    const requiredProps = {
      onPress: jest.fn(),
      // 其他必需的 props
    };

    expect(() => {
      render(<Button {...requiredProps} />);
    }).not.toThrow();
  });

  it('should behave as specified in design doc', () => {
    // 测试设计文档中描述的关键行为
    // 例如：loading 状态应该自动禁用按钮
    const onPress = jest.fn();
    const { getByTestId } = render(
      <Button loading onPress={onPress} testID="test-button" />
    );

    fireEvent.press(getByTestId('test-button'));

    // 验证设计预期：loading 时点击无效
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should follow state priority as designed', () => {
    // 验证状态优先级：loading > disabled > pressed
    // 根据设计文档验证这一行为
  });
});
```

### 测试文件组织

```
ComponentName/
└── __test__/
    ├── ComponentName.test.tsx           # 单元测试（主要）
    ├── ComponentName.snapshot.test.tsx  # 快照测试
    ├── ComponentName.methods.test.tsx   # 方法测试（如果有）
    ├── ComponentName.integration.test.tsx # 集成测试（可选）
    └── __snapshots__/                   # 快照文件夹
        └── ComponentName.snapshot.test.tsx.snap
```

### 测试最佳实践

1. **使用描述性的测试名称**
   ```typescript
   // ❌ 不好
   it('test 1', () => {});

   // ✅ 好
   it('should disable button when loading prop is true', () => {});
   ```

2. **遵循 AAA 模式**（Arrange-Act-Assert）
   ```typescript
   it('should call onPress when pressed', () => {
     // Arrange - 准备
     const onPress = jest.fn();
     const { getByTestId } = render(
       <Button onPress={onPress} testID="test-button" />
     );

     // Act - 执行
     fireEvent.press(getByTestId('test-button'));

     // Assert - 断言
     expect(onPress).toHaveBeenCalledTimes(1);
   });
   ```

3. **每个测试只测一件事**
   ```typescript
   // ❌ 不好：测试了多个行为
   it('should handle button states', () => {
     // 测试 disabled
     // 测试 loading
     // 测试 pressed
   });

   // ✅ 好：分开测试
   it('should not trigger onPress when disabled', () => {});
   it('should not trigger onPress when loading', () => {});
   it('should apply pressed style when pressed', () => {});
   ```

4. **清理副作用**
   ```typescript
   afterEach(() => {
     jest.clearAllMocks();
     cleanup(); // 来自 @testing-library/react-native
   });
   ```

5. **使用 testID 而不是文本查询**
   ```typescript
   // ❌ 脆弱：文本改变就会失败
   const button = getByText('Click Me');

   // ✅ 健壮：使用 testID
   const button = getByTestId('submit-button');
   ```

---

## 代码审查清单

### 在提交代码前，确保：

#### 功能
- [ ] 组件按预期工作
- [ ] 处理了所有边界情况
- [ ] 正确处理了错误状态

#### 性能
- [ ] 没有不必要的重渲染
- [ ] 使用了 `StyleSheet.create`
- [ ] 正确使用了 `useCallback` 和 `useMemo`
- [ ] 列表使用了正确的 `key`

#### TypeScript
- [ ] 所有 props 都有类型定义
- [ ] 没有使用 `any`（除非绝对必要）
- [ ] 导出了必要的类型

#### 文档
- [ ] `docs/DESIGN.md` 完整
- [ ] `docs/API.md` 完整
- [ ] `docs/EXAMPLES.md` 至少包含 5 个示例
- [ ] 代码注释清晰

#### 测试
- [ ] 测试覆盖率 > 80%
- [ ] 测试了主要功能
- [ ] 测试了边界情况

#### 无障碍
- [ ] 提供了 `accessibilityLabel`
- [ ] 提供了 `accessibilityRole`
- [ ] 支持屏幕阅读器

---

## 常见错误和解决方案

### 1. "Cannot update during an existing state transition"

**原因：** 在 render 过程中调用了 setState

```typescript
// ❌ 错误
const MyComponent = () => {
  const [count, setCount] = useState(0);

  setCount(1); // 在 render 中直接调用

  return <Text>{count}</Text>;
};

// ✅ 正确：使用 useEffect
const MyComponent = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(1);
  }, []);

  return <Text>{count}</Text>;
};
```

### 2. "Maximum update depth exceeded"

**原因：** useEffect 无限循环

```typescript
// ❌ 错误：依赖导致无限循环
useEffect(() => {
  setData({ ...data, newField: value });
}, [data]); // data 变化触发 effect，effect 又改变 data

// ✅ 正确：使用函数式更新或具体字段
useEffect(() => {
  setData(prev => ({ ...prev, newField: value }));
}, [value]); // 只依赖 value
```

### 3. "VirtualizedList: missing keys"

**原因：** FlatList 的 item 没有唯一 key

```typescript
// ❌ 错误：没有 key
<FlatList
  data={data}
  renderItem={({ item }) => <Item data={item} />}
/>

// ✅ 正确：提供 keyExtractor
<FlatList
  data={data}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <Item data={item} />}
/>
```

---

## 禁止行为

### 绝对禁止：

1. ❌ **使用 `var`** - 永远使用 `const` 或 `let`
2. ❌ **使用 `any` 类型** - 除非有充分理由并注释说明
3. ❌ **忽略 ESLint 警告** - 修复问题而不是禁用规则
4. ❌ **在 useEffect 中撒谎依赖** - 不要使用 `eslint-disable`
5. ❌ **提交未测试的代码** - 至少手动测试过
6. ❌ **跳过文档** - 每个组件必须有完整文档
7. ❌ **使用过时 API** - 使用 Pressable 而非 TouchableOpacity
8. ❌ **直接修改 state** - 永远创建新对象/数组

---

## 参考资源

### 官方文档
- [React Hooks 文档](https://react.dev/reference/react)
- [React Native 文档](https://reactnative.dev/docs/getting-started)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

### 最佳实践
- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Performance](https://react.dev/learn/render-and-commit)

---

## 版本历史

### v1.1.0 (2025-12-21)
- **新增** 文档更新日志规范
  - 所有组件文档必须包含版本和更新日志
  - 明确了文档元信息要求
- **扩展** 测试规范
  - 添加了完整的单元测试、快照测试、方法测试、集成测试示例
  - 明确测试覆盖率要求（≥ 80%）
  - 添加与设计预期一致性验证要求
  - 提供了测试最佳实践和文件组织结构

### v1.0.0 (2025-12-21)
- 初始版本
  - 定义项目结构
  - 制定开发规范
  - React/RN 最佳实践清单

---

**记住：好的代码不仅能工作，还要易读、易维护、高性能。**
