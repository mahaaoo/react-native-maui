# Button 组件设计方案

> **版本**: 2.0.0
> **日期**: 2025-12-21
> **状态**: 设计阶段

---

## 设计哲学

### 核心理念

> **"一个基础组件应该像一块画布，而不是一幅画"**

Button作为最基础的交互组件，应该：

- **提供机制，不提供策略** - 处理交互逻辑，不预设视觉样式
- **组合优于配置** - 通过组合实现复杂需求，而非预设选项
- **完全透明** - 所有行为都可被理解和控制
- **零假设** - 不对使用场景做任何假设

### 设计目标

1. **极简API** - 开发者5分钟内理解全部功能
2. **零样式预设** - 不内置任何视觉样式
3. **完全可控** - 所有交互状态都可定制
4. **类型安全** - TypeScript First
5. **无障碍友好** - 默认支持accessibility

---

## 核心设计决策

### 决策1：使用 Pressable 而非 TouchableOpacity

**选择 Pressable 的原因：**

- React Native官方推荐的现代API
- 提供更细粒度的交互状态控制
- 支持Web平台的hover状态
- 更好的性能表现

**关键点：**
- Pressable的`style`接受函数参数 `({ pressed }) => StyleProp<ViewStyle>`
- 支持更丰富的交互回调（onPressIn、onPressOut等）

### 决策2：状态驱动的样式系统

**设计原则：**

不同的交互状态应该有独立的样式控制：

- `style` - 默认状态
- `pressedStyle` - 按下状态
- `disabledStyle` - 禁用状态
- `loadingStyle` - 加载状态（可选）

**为什么这样设计：**
- 符合开发者直觉
- 避免复杂的样式合并逻辑
- 每个状态独立控制，互不干扰

### 决策3：children 完全自由

**设计选择：**

`children` 接受任何 `React.ReactNode`，不做任何处理。

**这意味着：**
- 不内置Text组件
- 不处理字符串children
- 渐变、图标、复杂布局都通过children实现

**好处：**
- 完全的灵活性
- 减少组件复杂度
- 符合React组合模式

### 决策4：loading 是状态，不是UI

**设计原则：**

`loading` prop 只控制按钮是否可点击，不控制显示什么内容。

```typescript
// 开发者控制loading UI
<Button loading={isLoading} disabled={isLoading}>
  {isLoading ? <Spinner /> : <Text>提交</Text>}
</Button>
```

**为什么：**
- Loading UI可能是spinner、文字、进度条等多种形式
- 基础组件不应该假设UI实现

### 决策5：不提供默认交互反馈

**设计选择：**

- 不提供默认的 `activeOpacity`
- 不提供默认的 `pressedStyle`
- 开发者必须明确指定交互反馈

**理由：**
- 不同设计系统的反馈方式差异巨大
- iOS、Android、Material Design各有规范
- 强制开发者思考交互反馈

**但提供便捷选项：**
- 支持 `activeOpacity` prop 快速添加透明度反馈
- 支持 `android_ripple` 通过pressableProps传递

---

## API 设计

### 完整类型定义

```typescript
interface ButtonProps {
  // ==================== 核心交互 ====================

  /** 点击事件 */
  onPress?: () => void;

  /** 长按事件 */
  onLongPress?: () => void;

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否加载中（自动禁用按钮） */
  loading?: boolean;

  // ==================== 样式系统 ====================

  /** 默认样式 */
  style?: StyleProp<ViewStyle>;

  /** 按下时的样式 */
  pressedStyle?: StyleProp<ViewStyle>;

  /** 禁用时的样式 */
  disabledStyle?: StyleProp<ViewStyle>;

  /** 加载中的样式（可选） */
  loadingStyle?: StyleProp<ViewStyle>;

  // ==================== 内容 ====================

  /** 按钮内容 */
  children?: React.ReactNode;

  // ==================== 交互增强 ====================

  /** 快速设置按下时的透明度 */
  activeOpacity?: number;

  /** 触觉反馈强度 (iOS) */
  hapticFeedback?: boolean | 'light' | 'medium' | 'heavy';

  /** 透传给Pressable的其他属性 */
  pressableProps?: Omit<
    PressableProps,
    'onPress' | 'onLongPress' | 'disabled' | 'style' | 'children'
  >;

  // ==================== 无障碍 ====================

  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link';
  testID?: string;
}
```

### API 设计要点

#### 1. 样式合并顺序

```
基础样式 (style)
  ↓
+ 按下样式 (pressed && pressedStyle)
  ↓
+ 禁用样式 (disabled && disabledStyle)
  ↓
+ 加载样式 (loading && loadingStyle)
  ↓
+ 透明度 (pressed && activeOpacity)
```

#### 2. 状态优先级

```
loading > disabled > pressed
```

即：loading时，按钮禁用且显示loadingStyle

#### 3. 事件处理

- `loading=true` 时，自动禁用所有点击事件
- `disabled=true` 时，不触发任何回调
- 支持事件冒泡（通过pressableProps控制）

---

## 使用场景

### 场景1：基础按钮

开发者完全控制样式：

```typescript
<Button
  onPress={handlePress}
  style={{ padding: 16, backgroundColor: '#007AFF', borderRadius: 8 }}
  pressedStyle={{ backgroundColor: '#0051D5' }}
>
  <Text style={{ color: 'white' }}>点击</Text>
</Button>
```

### 场景2：渐变按钮

通过children组合实现：

```typescript
<Button onPress={handlePress}>
  <LinearGradient
    colors={['#667eea', '#764ba2']}
    style={{ padding: 16, borderRadius: 12 }}
  >
    <Text style={{ color: 'white' }}>渐变按钮</Text>
  </LinearGradient>
</Button>
```

### 场景3：图标按钮

```typescript
<Button
  onPress={handleAdd}
  style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#34C759' }}
  pressedStyle={{ transform: [{ scale: 0.95 }] }}
>
  <Icon name="plus" size={24} color="white" />
</Button>
```

### 场景4：Loading状态

```typescript
<Button
  loading={isLoading}
  onPress={handleSubmit}
  style={styles.button}
>
  {isLoading ? <ActivityIndicator /> : <Text>提交</Text>}
</Button>
```

### 场景5：链接样式

```typescript
<Button
  onPress={handleNavigate}
  pressedStyle={{ opacity: 0.6 }}
>
  <Text style={{ color: '#007AFF' }}>了解更多 →</Text>
</Button>
```

---

## 设计权衡

### 权衡1：灵活性 vs 易用性

**选择：优先灵活性**

- ✅ 完全可定制
- ❌ 需要编写更多代码
- **解决方案：** 鼓励用户基于Button创建自己的组件库

### 权衡2：类型安全 vs 运行时开销

**选择：优先类型安全**

- ✅ 完整的TypeScript类型
- ❌ 略微增加bundle size
- **理由：** 类型错误的成本远高于几KB的体积

### 权衡3：默认样式 vs 零预设

**选择：零预设**

- ✅ 不限制设计系统
- ❌ 首次使用需要学习
- **理由：** 基础组件不应该有视觉倾向

### 权衡4：功能完整性 vs API简洁性

**选择：API简洁性**

- ✅ 核心功能清晰
- ❌ 一些高级功能需要通过pressableProps实现
- **理由：** 简单的API更容易维护和理解

---

## 扩展性设计

### 设计系统集成

Button设计时考虑了与设计系统的集成：

```typescript
// 用户可以基于Button创建自己的组件库
const PrimaryButton = (props) => (
  <Button
    style={theme.buttons.primary}
    pressedStyle={theme.buttons.primaryPressed}
    {...props}
  />
);
```

### 平台差异处理

不同平台有不同的交互规范：

- **iOS**: 透明度反馈、触觉反馈
- **Android**: Ripple效果
- **Web**: Hover状态

设计支持所有平台的差异化实现：

```typescript
<Button
  pressableProps={{
    // Android特有
    android_ripple: { color: 'rgba(0,0,0,0.1)' },
    // Web特有
    onHoverIn: handleHover,
    onHoverOut: handleHoverOut,
  }}
  // iOS特有
  hapticFeedback="medium"
>
  {children}
</Button>
```

### 主题系统支持

设计时考虑了与主题系统的配合：

```typescript
const MyButton = () => {
  const theme = useTheme();

  return (
    <Button
      style={{
        backgroundColor: theme.colors.primary,
        ...theme.shadows.small,
      }}
      pressedStyle={{
        backgroundColor: theme.colors.primaryDark,
      }}
    >
      {children}
    </Button>
  );
};
```

---

## 非目标 (Non-Goals)

明确Button组件**不会**提供的功能：

1. ❌ **预设样式** - 不提供Primary、Secondary等预设类型
2. ❌ **内置图标** - 不内置图标系统
3. ❌ **尺寸预设** - 不提供small、medium、large等预设
4. ❌ **颜色主题** - 不内置颜色系统
5. ❌ **动画** - 不内置复杂动画（简单的样式过渡可以通过Animated实现）
6. ❌ **防抖节流** - 由使用者根据业务需求实现
7. ❌ **Loading UI** - 不提供默认的loading样式

**原因：** 这些都是业务/设计层面的决策，不应该由基础组件承担。

---

## 技术约束

### 依赖要求

- `react-native >= 0.63.0` (Pressable引入版本)
- `react >= 16.8.0` (Hooks支持)
- TypeScript类型定义需要 `@types/react-native`

### 性能要求

- 组件本身不引入任何性能开销
- 不使用不必要的re-render
- 支持React.memo优化

### 兼容性

- iOS 11+
- Android 5.0+
- React Native Web
- Expo SDK 40+

---

## 实现要点

### 关键实现点1：样式函数

Pressable的style支持函数形式，需要正确处理：

```typescript
// 核心逻辑
<Pressable
  style={({ pressed }) => [
    style,
    pressed && pressedStyle,
    disabled && disabledStyle,
    loading && loadingStyle,
  ]}
>
  {children}
</Pressable>
```

### 关键实现点2：loading自动禁用

```typescript
const isDisabled = disabled || loading;
```

### 关键实现点3：触觉反馈

需要条件导入expo-haptics或react-native-haptic-feedback：

```typescript
// 可选依赖，不强制
if (hapticFeedback && Platform.OS === 'ios') {
  // 触发触觉反馈
}
```

### 关键实现点4：类型导出

所有类型都应该导出供使用者使用：

```typescript
export type { ButtonProps };
export { Button };
```

---

## 成功指标

如何判断这个设计是成功的：

1. **学习成本** - 新用户5分钟内能创建自己的第一个按钮
2. **灵活性** - 能够实现至少95%的常见按钮样式需求
3. **代码量** - 核心实现不超过200行代码
4. **类型覆盖** - 100%的TypeScript类型覆盖
5. **性能** - 与原生Pressable性能相当
6. **采用率** - 用户愿意基于Button创建自己的组件库

---

## 未来演进方向

### 可能的扩展点

- **ButtonGroup** - 按钮组组件（独立组件）
- **防抖支持** - 可选的内置防抖功能
- **动画预设** - 可选的常见动画效果
- **无障碍增强** - 更丰富的accessibility支持

### 不会改变的核心

- 零样式预设
- 完全可控的API
- 组合优于配置
- TypeScript First

---

## 总结

### 核心思想

Button组件的设计遵循一个核心思想：

> **提供最小但完整的交互机制，将所有视觉决策权交给使用者**

### 关键特性

1. 基于Pressable的现代API
2. 状态驱动的样式系统
3. 完全可控的children
4. 零视觉预设
5. TypeScript类型安全

### 设计价值

通过这个设计，我们得到了：

- **简单** - API简洁，易于理解
- **强大** - 可以实现任何样式需求
- **灵活** - 不限制使用场景
- **现代** - 使用最新的React Native API
- **可靠** - 完整的类型安全保障

Button不是一个UI组件，而是一个**交互组件基座**。
