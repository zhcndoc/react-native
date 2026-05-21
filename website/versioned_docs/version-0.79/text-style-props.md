---
id: text-style-props
title: 文本样式属性
---

### 示例

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=TextStyleProps&supportedPlatforms=ios,android&ext=js&dependencies=@react-native-community/slider
import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const fontStyles = ['normal', 'italic'];
const fontVariants = [
  undefined,
  'small-caps',
  'oldstyle-nums',
  'lining-nums',
  'tabular-nums',
  'proportional-nums',
];
const fontWeights = [
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];
const textAlignments = ['auto', 'left', 'right', 'center', 'justify'];
const textDecorationLines = [
  'none',
  'underline',
  'line-through',
  'underline line-through',
];
const textDecorationStyles = ['solid', 'double', 'dotted', 'dashed'];
const textTransformations = ['none', 'uppercase', 'lowercase', 'capitalize'];
const textAlignmentsVertical = ['auto', 'top', 'bottom', 'center'];
const writingDirections = ['auto', 'ltr', 'rtl'];

const App = () => {
  const [fontSize, setFontSize] = useState(20);
  const [fontStyleIdx, setFontStyleIdx] = useState(0);
  const [fontWeightIdx, setFontWeightIdx] = useState(0);
  const [lineHeight, setLineHeight] = useState(24);
  const [textAlignIdx, setTextAlignIdx] = useState(0);
  const [textDecorationLineIdx, setTextDecorationLineIdx] = useState(0);
  const [includeFontPadding, setIncludeFontPadding] = useState(false);
  const [textVerticalAlignIdx, setTextVerticalAlignIdx] = useState(0);
  const [fontVariantIdx, setFontVariantIdx] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textDecorationStyleIdx, setTextDecorationStyleIdx] = useState(0);
  const [textTransformIdx, setTextTransformIdx] = useState(0);
  const [writingDirectionIdx, setWritingDirectionIdx] = useState(0);
  const [textShadowRadius, setTextShadowRadius] = useState(0);
  const [textShadowOffset, setTextShadowOffset] = useState({
    height: 0,
    width: 0,
  });

  const [, ...validFontVariants] = fontVariants;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.pargraphWrapper}>
          <Text
            style={[
              styles.paragraph,
              {
                fontSize,
                fontStyle: fontStyles[fontStyleIdx],
                fontWeight: fontWeights[fontWeightIdx],
                lineHeight,
                textAlign: textAlignments[textAlignIdx],
                textDecorationLine: textDecorationLines[textDecorationLineIdx],
                textTransform: textTransformations[textTransformIdx],
                textAlignVertical: textAlignmentsVertical[textVerticalAlignIdx],
                fontVariant:
                  fontVariantIdx === 0
                    ? undefined
                    : [validFontVariants[fontVariantIdx - 1]],
                letterSpacing,
                includeFontPadding,
                textDecorationStyle:
                  textDecorationStyles[textDecorationStyleIdx],
                writingDirection: writingDirections[writingDirectionIdx],
                textShadowOffset,
                textShadowRadius,
              },
            ]}>
            Lorem Ipsum 只是印刷和排版行业的虚拟文本。112 个赞
          </Text>
        </View>
        <ScrollView style={{padding: 12}}>
          <View>
            <Text>通用平台属性</Text>
            <CustomSlider
              label="文本阴影偏移 - 高度"
              value={textShadowOffset.height}
              minimumValue={-40}
              maximumValue={40}
              handleValueChange={val =>
                setTextShadowOffset(prev => ({...prev, height: val}))
              }
            />
            <CustomSlider
              label="文本阴影偏移 - 宽度"
              value={textShadowOffset.width}
              minimumValue={-40}
              maximumValue={40}
              handleValueChange={val =>
                setTextShadowOffset(prev => ({...prev, width: val}))
              }
            />
            <CustomSlider
              label="字体大小"
              value={fontSize}
              maximumValue={40}
              handleValueChange={setFontSize}
            />
            <CustomPicker
              label="字体样式"
              data={fontStyles}
              currentIndex={fontStyleIdx}
              onSelected={setFontStyleIdx}
            />
            <CustomPicker
              label="字体粗细"
              data={fontWeights}
              currentIndex={fontWeightIdx}
              onSelected={setFontWeightIdx}
            />
            <CustomSlider
              label="行高"
              value={lineHeight}
              minimumValue={10}
              maximumValue={50}
              handleValueChange={setLineHeight}
            />
            <CustomPicker
              label="文本对齐"
              data={textAlignments}
              currentIndex={textAlignIdx}
              onSelected={setTextAlignIdx}
            />
            <CustomPicker
              label="文本装饰线"
              data={textDecorationLines}
              currentIndex={textDecorationLineIdx}
              onSelected={setTextDecorationLineIdx}
            />
            <CustomSlider
              label="文本阴影半径"
              value={textShadowRadius}
              handleValueChange={setTextShadowRadius}
            />
            <CustomPicker
              label="字体变体"
              data={fontVariants}
              currentIndex={fontVariantIdx}
              onSelected={setFontVariantIdx}
            />
            <CustomSlider
              label="字母间距"
              step={0.1}
              value={letterSpacing}
              handleValueChange={setLetterSpacing}
            />
            <CustomPicker
              label="文本转换"
              data={textTransformations}
              currentIndex={textTransformIdx}
              onSelected={setTextTransformIdx}
            />
          </View>
          {Platform.OS === 'android' && (
            <View style={styles.platformContainer}>
              <Text style={styles.platformContainerTitle}>
                仅 Android 属性
              </Text>
              <CustomPicker
                label="文本垂直对齐"
                data={textAlignmentsVertical}
                currentIndex={textVerticalAlignIdx}
                onSelected={setTextVerticalAlignIdx}
              />
              <CustomSwitch
                label="包含字体内边距"
                handleValueChange={setIncludeFontPadding}
                value={includeFontPadding}
              />
            </View>
          )}
          {Platform.OS === 'ios' && (
            <View style={styles.platformContainer}>
              <Text style={styles.platformContainerTitle}>
                仅 iOS 属性
              </Text>
              <CustomPicker
                label="文本装饰样式"
                data={textDecorationStyles}
                currentIndex={textDecorationStyleIdx}
                onSelected={setTextDecorationStyleIdx}
              />
              <CustomPicker
                label="书写方向"
                data={writingDirections}
                currentIndex={writingDirectionIdx}
                onSelected={setWritingDirectionIdx}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const CustomSwitch = ({label, handleValueChange, value}) => {
  return (
    <>
      <Text style={styles.title}>{label}</Text>
      <View style={{alignItems: 'flex-start'}}>
        <Switch
          trackColor={{false: '#767577', true: '#DAA520'}}
          thumbColor={value ? '#DAA520' : '#f4f3f4'}
          onValueChange={handleValueChange}
          value={value}
        />
      </View>
    </>
  );
};

const CustomSlider = ({
  label,
  handleValueChange,
  step = 1,
  minimumValue = 0,
  maximumValue = 10,
  value,
}) => {
  return (
    <>
      {label && (
        <Text style={styles.title}>{`${label} (${value.toFixed(2)})`}</Text>
      )}
      <View style={styles.wrapperHorizontal}>
        <Slider
          thumbTintColor="#06bcee"
          minimumTrackTintColor="#64d7ffbb"
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          onValueChange={handleValueChange}
          value={value}
        />
      </View>
    </>
  );
};

const CustomPicker = ({label, data, currentIndex, onSelected}) => {
  return (
    <>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.wrapperHorizontal}>
        <FlatList
          bounces
          horizontal
          data={data}
          keyExtractor={item => String(item)}
          renderItem={({item, index}) => {
            const selected = index === currentIndex;
            return (
              <TouchableWithoutFeedback onPress={() => onSelected(index)}>
                <View
                  style={[
                    styles.itemStyleHorizontal,
                    selected && styles.itemSelectedStyleHorizontal,
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: selected ? 'black' : 'grey',
                      fontWeight: selected ? 'bold' : 'normal',
                    }}>
                    {item + ''}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pargraphWrapper: {
    backgroundColor: 'black',
  },
  paragraph: {
    color: '#fff',
    textDecorationColor: 'yellow',
    textShadowColor: 'red',
    textShadowRadius: 1,
    padding: 24,
  },
  wrapperHorizontal: {
    justifyContent: 'center',
    color: 'black',
  },
  itemStyleHorizontal: {
    marginRight: 10,
    height: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  itemSelectedStyleHorizontal: {
    borderWidth: 2,
    borderColor: '#06bcee',
  },
  platformContainer: {
    marginTop: 8,
    borderTopWidth: 1,
  },
  platformContainerTitle: {
    marginTop: 8,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=TextStyleProps&supportedPlatforms=ios,android&ext=tsx&dependencies=@react-native-community/slider
import React, {useState} from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableWithoutFeedback,
  View,
  TextStyle,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [fontSize, setFontSize] = useState(20);
  const [fontStyleIdx, setFontStyleIdx] = useState(0);
  const [fontWeightIdx, setFontWeightIdx] = useState(0);
  const [lineHeight, setLineHeight] = useState(24);
  const [textAlignIdx, setTextAlignIdx] = useState(0);
  const [textDecorationLineIdx, setTextDecorationLineIdx] = useState(0);
  const [includeFontPadding, setIncludeFontPadding] = useState(false);
  const [textVerticalAlignIdx, setTextVerticalAlignIdx] = useState(0);
  const [fontVariantIdx, setFontVariantIdx] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textDecorationStyleIdx, setTextDecorationStyleIdx] = useState(0);
  const [textTransformIdx, setTextTransformIdx] = useState(0);
  const [writingDirectionIdx, setWritingDirectionIdx] = useState(0);
  const [textShadowRadius, setTextShadowRadius] = useState(0);
  const [textShadowOffset, setTextShadowOffset] = useState({
    height: 0,
    width: 0,
  });

  const [, ...validFontVariants] = fontVariants;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.pargraphWrapper}>
          <Text
            style={[
              styles.paragraph,
              {
                fontSize,
                fontStyle: fontStyles[fontStyleIdx],
                fontWeight: fontWeights[fontWeightIdx],
                lineHeight,
                textAlign: textAlignments[textAlignIdx],
                textDecorationLine: textDecorationLines[textDecorationLineIdx],
                textTransform: textTransformations[textTransformIdx],
                textAlignVertical: textAlignmentsVertical[textVerticalAlignIdx],
                fontVariant:
                  fontVariantIdx === 0
                    ? undefined
                    : [validFontVariants[fontVariantIdx - 1]],
                letterSpacing,
                includeFontPadding,
                textDecorationStyle:
                  textDecorationStyles[textDecorationStyleIdx],
                writingDirection: writingDirections[writingDirectionIdx],
                textShadowOffset,
                textShadowRadius,
              } as TextStyle,
            ]}>
            Lorem Ipsum 只是印刷和排版行业的虚拟文本。112 个赞
          </Text>
        </View>
        <ScrollView style={{padding: 12}}>
          <View>
            <Text>通用平台属性</Text>
            <CustomSlider
              label="文本阴影偏移 - 高度"
              value={textShadowOffset.height}
              minimumValue={-40}
              maximumValue={40}
              handleValueChange={(val: number) =>
                setTextShadowOffset(prev => ({...prev, height: val}))
              }
            />
            <CustomSlider
              label="文本阴影偏移 - 宽度"
              value={textShadowOffset.width}
              minimumValue={-40}
              maximumValue={40}
              handleValueChange={(val: number) =>
                setTextShadowOffset(prev => ({...prev, width: val}))
              }
            />
            <CustomSlider
              label="字体大小"
              value={fontSize}
              maximumValue={40}
              handleValueChange={setFontSize}
            />
            <CustomPicker
              label="字体样式"
              data={fontStyles}
              currentIndex={fontStyleIdx}
              onSelected={setFontStyleIdx}
            />
            <CustomPicker
              label="字体粗细"
              data={fontWeights}
              currentIndex={fontWeightIdx}
              onSelected={setFontWeightIdx}
            />
            <CustomSlider
              label="行高"
              value={lineHeight}
              minimumValue={10}
              maximumValue={50}
              handleValueChange={setLineHeight}
            />
            <CustomPicker
              label="文本对齐"
              data={textAlignments}
              currentIndex={textAlignIdx}
              onSelected={setTextAlignIdx}
            />
            <CustomPicker
              label="文本装饰线"
              data={textDecorationLines}
              currentIndex={textDecorationLineIdx}
              onSelected={setTextDecorationLineIdx}
            />
            <CustomSlider
              label="文本阴影半径"
              value={textShadowRadius}
              handleValueChange={setTextShadowRadius}
            />
            <CustomPicker
              label="字体变体"
              data={fontVariants}
              currentIndex={fontVariantIdx}
              onSelected={setFontVariantIdx}
            />
            <CustomSlider
              label="字母间距"
              step={0.1}
              value={letterSpacing}
              handleValueChange={setLetterSpacing}
            />
            <CustomPicker
              label="文本转换"
              data={textTransformations}
              currentIndex={textTransformIdx}
              onSelected={setTextTransformIdx}
            />
          </View>
          {Platform.OS === 'android' && (
            <View style={styles.platformContainer}>
              <Text style={styles.platformContainerTitle}>
                仅 Android 属性
              </Text>
              <CustomPicker
                label="文本垂直对齐"
                data={textAlignmentsVertical}
                currentIndex={textVerticalAlignIdx}
                onSelected={setTextVerticalAlignIdx}
              />
              <CustomSwitch
                label="包含字体内边距"
                handleValueChange={setIncludeFontPadding}
                value={includeFontPadding}
              />
            </View>
          )}
          {Platform.OS === 'ios' && (
            <View style={styles.platformContainer}>
              <Text style={styles.platformContainerTitle}>
                仅 iOS 属性
              </Text>
              <CustomPicker
                label="文本装饰样式"
                data={textDecorationStyles}
                currentIndex={textDecorationStyleIdx}
                onSelected={setTextDecorationStyleIdx}
              />
              <CustomPicker
                label="书写方向"
                data={writingDirections}
                currentIndex={writingDirectionIdx}
                onSelected={setWritingDirectionIdx}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

type CustomSwitchProps = {
  label: string;
  value: boolean;
  handleValueChange: (value: boolean) => void;
};

const CustomSwitch = ({label, handleValueChange, value}: CustomSwitchProps) => {
  return (
    <>
      <Text style={styles.title}>{label}</Text>
      <View style={{alignItems: 'flex-start'}}>
        <Switch
          trackColor={{false: '#767577', true: '#DAA520'}}
          thumbColor={value ? '#DAA520' : '#f4f3f4'}
          onValueChange={handleValueChange}
          value={value}
        />
      </View>
    </>
  );
};

type CustomSliderProps = {
  label: string;
  value: number;
  handleValueChange: (value: number) => void;
  step?: number;
  minimumValue?: number;
  maximumValue?: number;
};

const CustomSlider = ({
  label,
  handleValueChange,
  step = 1,
  minimumValue = 0,
  maximumValue = 10,
  value,
}: CustomSliderProps) => {
  return (
    <>
      {label && (
        <Text style={styles.title}>{`${label} (${value.toFixed(2)})`}</Text>
      )}
      <View style={styles.wrapperHorizontal}>
        <Slider
          thumbTintColor="#06bcee"
          minimumTrackTintColor="#64d7ffbb"
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={step}
          onValueChange={handleValueChange}
          value={value}
        />
      </View>
    </>
  );
};

type CustomPickerProps = {
  label: string;
  data?: ArrayLike<any> | null;
  currentIndex: number;
  onSelected: (index: number) => void;
};

const CustomPicker = ({
  label,
  data,
  currentIndex,
  onSelected,
}: CustomPickerProps) => {
  return (
    <>
      <Text style={styles.title}>{label}</Text>
      <View style={styles.wrapperHorizontal}>
        <FlatList
          horizontal
          data={data}
          keyExtractor={item => String(item)}
          renderItem={({item, index}: {item: string; index: number}) => {
            const selected = index === currentIndex;
            return (
              <TouchableWithoutFeedback onPress={() => onSelected(index)}>
                <View
                  style={[
                    styles.itemStyleHorizontal,
                    selected && styles.itemSelectedStyleHorizontal,
                  ]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: selected ? 'black' : 'grey',
                      fontWeight: selected ? 'bold' : 'normal',
                    }}>
                    {item + ''}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            );
          }}
        />
      </View>
    </>
  );
};

const fontStyles = ['normal', 'italic'];
const fontVariants = [
  undefined,
  'small-caps',
  'oldstyle-nums',
  'lining-nums',
  'tabular-nums',
  'proportional-nums',
];
const fontWeights = [
  'normal',
  'bold',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
];
const textAlignments = ['auto', 'left', 'right', 'center', 'justify'];
const textDecorationLines = [
  'none',
  'underline',
  'line-through',
  'underline line-through',
];
const textDecorationStyles = ['solid', 'double', 'dotted', 'dashed'];
const textTransformations = ['none', 'uppercase', 'lowercase', 'capitalize'];
const textAlignmentsVertical = ['auto', 'top', 'bottom', 'center'];
const writingDirections = ['auto', 'ltr', 'rtl'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pargraphWrapper: {
    backgroundColor: 'black',
  },
  paragraph: {
    color: '#fff',
    textDecorationColor: 'yellow',
    textShadowColor: 'red',
    textShadowRadius: 1,
    padding: 24,
  },
  wrapperHorizontal: {
    justifyContent: 'center',
    color: 'black',
  },
  itemStyleHorizontal: {
    marginRight: 10,
    height: 50,
    padding: 8,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    textAlign: 'center',
    justifyContent: 'center',
  },
  itemSelectedStyleHorizontal: {
    borderWidth: 2,
    borderColor: '#06bcee',
  },
  platformContainer: {
    marginTop: 8,
    borderTopWidth: 1,
  },
  platformContainerTitle: {
    marginTop: 8,
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default App;
```

</TabItem>
</Tabs>

# 参考

## 属性

### `color`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `fontFamily`

| 类型   |
| ------ |
| 字符串 |

通用字体家族 `system-ui`、`ui-sans-serif`、`ui-serif`、`ui-monospace` 和 `ui-rounded` 在 iOS 上受支持。

---

### `fontSize`

| 类型   |
| ------ |
| 数字 |

---

### `fontStyle`

| 类型                         |
| ---------------------------- |
| 枚举(`'normal'`, `'italic'`) |

---

### `fontWeight`

指定字体粗细。大多数字体支持 `'normal'` 和 `'bold'` 值。并非所有字体都有每个数值的变体，在这种情况下会选择最接近的一个。

| 类型                                                                                                                  | 默认值    |
| --------------------------------------------------------------------------------------------------------------------- | ---------- |
| 枚举(`'normal'`, `'bold'`, `'100'`, `'200'`, `'300'`, `'400'`, `'500'`, `'600'`, `'700'`, `'800'`, `'900'`) 或 数字 | `'normal'` |

---

### `includeFontPadding` <div className="label android">Android</div>

设置为 `false` 以移除旨在为某些上升部/下降部留出空间的额外字体内边距。对于某些字体，当垂直居中时，此内边距会使文本看起来略微错位。为了获得最佳效果，还将 `textAlignVertical` 设置为 `center`。

| 类型 | 默认值 |
| ---- | ------- |
| 布尔值 | `true`  |

---

### `fontVariant`

允许你设置字体的所有变体。可以通过使用枚举数组或空格分隔的字符串来设置，例如 `'small-caps common-ligatures'`。

<table>
  <thead>
    <tr>
      <th colspan="5">类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="5">
        枚举数组(`'common-ligatures'`, `'contextual'`, `'discretionary-ligatures'`, `'historical-ligatures'`, `'lining-nums'`, `'no-common-ligatures'`, `'no-contextual'`, `'no-discretionary-ligatures'`, `'no-historical-ligatures'`, `'oldstyle-nums'`, `'proportional-nums'`, `'small-caps'`, `'stylistic-eight'`, `'stylistic-eighteen'`, `'stylistic-eleven'`, `'stylistic-fifteen'`, `'stylistic-five'`, `'stylistic-four'`, `'stylistic-fourteen'`, `'stylistic-nine'`, `'stylistic-nineteen'`, `'stylistic-one'`, `'stylistic-seven'`, `'stylistic-seventeen'`, `'stylistic-six'`, `'stylistic-sixteen'`, `'stylistic-ten'`, `'stylistic-thirteen'`, `'stylistic-three'`, `'stylistic-twelve'`, `'stylistic-twenty'`, `'stylistic-two'`, `'tabular-nums'`) 或 字符串
      </td>
      <td>`[]`</td>
    </tr>
  </tbody>
</table>

---

### `letterSpacing`

增加或减少字符之间的间距。默认情况下没有额外的字母间距。

| 类型   |
| ------ |
| 数字 |

---

### `lineHeight`

控制文本元素内文本行之间垂直间距的数值。它指定连续文本行基线之间的距离。

| 类型   |
| ------ |
| 数字 |

---

### `textAlign`

指定文本对齐方式。在 Android 上，值 'justify' 仅在 Oreo (8.0) 或更高版本 (API level >= 26) 上受支持。在较低的 Android 版本上，该值将回退到 `left`。

| 类型                                                         | 默认值  |
| ------------------------------------------------------------ | -------- |
| 枚举(`'auto'`, `'left'`, `'right'`, `'center'`, `'justify'`) | `'auto'` |

---

### `textAlignVertical` <div className="label android">Android</div>

`verticalAlign` 样式属性的别名，如果同时使用这两个属性，`verticalAlign` 将优先于 `textAlignVertical`

| 类型                                            | 默认值  |
| ----------------------------------------------- | -------- |
| 枚举(`'auto'`, `'top'`, `'bottom'`, `'center'`) | `'auto'` |

---

### `textDecorationColor` <div className="label ios">iOS</div>

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `textDecorationLine`

| 类型                                                                        | 默认值 |
| --------------------------------------------------------------------------- | ------ |
| 枚举(`'none'`, `'underline'`, `'line-through'`, `'underline line-through'`) | `'none'` |

---

### `textDecorationStyle` <div className="label ios">iOS</div>

| 类型                                                | 默认值   |
| --------------------------------------------------- | --------- |
| 枚举(`'solid'`, `'double'`, `'dotted'`, `'dashed'`) | `'solid'` |

---

### `textShadowColor`

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `textShadowOffset`

| 类型                                        |
| ------------------------------------------- |
| 对象：`{width?: 数字，height?: 数字}` |

---

### `textShadowRadius`

| 类型   |
| ------ |
| 数字 |

---

### `textTransform`

| 类型                                                         | 默认值  |
| ------------------------------------------------------------ | -------- |
| 枚举(`'none'`, `'uppercase'`, `'lowercase'`, `'capitalize'`) | `'none'` |

---

### `verticalAlign` <div className="label android">Android</div>

| 类型                                            | 默认值  |
| ----------------------------------------------- | -------- |
| 枚举(`'auto'`, `'top'`, `'bottom'`, `'middle'`) | `'auto'` |

---

### `writingDirection` <div className="label ios">iOS</div>

| 类型                             | 默认值  |
| -------------------------------- | -------- |
| 枚举(`'auto'`, `'ltr'`, `'rtl'`) | `'auto'` |

---

### `userSelect`

它允许用户选择文本并使用原生复制和粘贴功能。优先级高于 `selectable` 属性。

| 类型                                                     | 默认值 |
| -------------------------------------------------------- | ------- |
| 枚举(`'auto'`, `'text'`, `'none'`, `'contain'`, `'all'`) | `none`  |
