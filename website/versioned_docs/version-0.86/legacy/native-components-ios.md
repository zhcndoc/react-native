---
id: native-components-ios
title: iOS 原生 UI 组件
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

这里有大量可直接用于最新应用的原生 UI 组件——其中一些是平台自带的，另一些可作为第三方库使用，还有一些可能就在你自己的项目中被使用。React Native 已经封装了几个最关键的平台组件，比如 `ScrollView` 和 `TextInput`，但并不是全部，更不可能包括你在之前某个应用里自己写的那些组件。幸运的是，我们可以把这些现有组件包装起来，从而与 React Native 应用无缝集成。

和原生模块指南一样，这也是一份更高级的指南，默认你已经对 iOS 编程有一定了解。本指南将向你展示如何构建一个原生 UI 组件，并带你实现 React Native 核心库中现有 `MapView` 组件的一个子集。

## iOS MapView 示例

假设我们想在应用中添加一个可交互的地图——那不如直接使用 [`MKMapView`](https://developer.apple.com/library/prerelease/mac/documentation/MapKit/Reference/MKMapView_Class/index.html)，我们只需要让它能在 JavaScript 中使用即可。

原生视图由 `RCTViewManager` 的子类创建和管理。这些子类在功能上类似于视图控制器，但本质上是单例——桥接层只会为每个子类创建一个实例。它们将原生视图暴露给 `RCTUIManager`，后者再回调它们，按需设置和更新视图属性。`RCTViewManager` 通常也充当这些视图的代理，通过桥接层把事件发送回 JavaScript。

要暴露一个视图，你可以：

- 继承 `RCTViewManager` 来为你的组件创建一个管理器。
- 添加 `RCT_EXPORT_MODULE()` 标记宏。
- 实现 `-(UIView *)view` 方法。

```objectivec title='RNTMapManager.m'
#import <MapKit/MapKit.h>

#import <React/RCTViewManager.h>

@interface RNTMapManager : RCTViewManager
@end

@implementation RNTMapManager

RCT_EXPORT_MODULE(RNTMap)

- (UIView *)view
{
  return [[MKMapView alloc] init];
}

@end
```

:::note
不要试图在通过 `-view` 方法暴露出去的 `UIView` 实例上设置 `frame` 或 `backgroundColor` 属性。
React Native 会覆盖你自定义类设置的值，以匹配 JavaScript 组件的布局属性。
如果你需要这种细粒度控制，最好把你想要设置样式的 `UIView` 实例包装在另一个 `UIView` 里，然后返回这个包装后的 `UIView`。
更多背景信息请参见 [Issue 2948](https://github.com/facebook/react-native/issues/2948)。
:::

:::info
在上面的示例中，我们在类名之前加了 `RNT` 前缀。前缀用于避免与其他框架发生命名冲突。
Apple 框架使用两个字母的前缀，而 React Native 使用 `RCT` 作为前缀。为了避免命名冲突，我们建议你在自己的类中使用一个不同于 `RCT` 的三字母前缀。
:::

然后你需要一点 JavaScript，才能把它变成一个可用的 React 组件：

```tsx {3} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

export default requireNativeComponent('RNTMap');
```

`requireNativeComponent` 函数会自动将 `RNTMap` 解析为 `RNTMapManager`，并导出我们的原生视图供 JavaScript 使用。

```tsx title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView style={{flex: 1}} />;
}
```

:::note
渲染时，别忘了拉伸这个视图，否则你只会盯着一片空白屏幕。
:::

现在，这已经是一个在 JavaScript 中完全可用的原生地图视图组件了，支持捏合缩放和其他原生手势。只不过我们还不能真正从 JavaScript 控制它。

## 属性

为了让这个组件更实用，我们首先可以桥接一些原生属性。假设我们想禁用缩放并指定可见区域。禁用缩放是一个布尔值，所以我们添加这一行：

```objectivec title='RNTMapManager.m'
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
```

注意，我们显式将类型指定为 `BOOL`——React Native 在桥接通信时会在底层使用 `RCTConvert` 来转换各种不同的数据类型，而错误的值会触发方便的 “RedBox” 错误，尽快告诉你存在问题。像这样简单的情况，整个实现都由这个宏替你完成。

现在，为了真正禁用缩放，我们在 JavaScript 中设置该属性：

```tsx {4} title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView zoomEnabled={false} style={{flex: 1}} />;
}
```

为了给我们的 `MapView` 组件编写文档（以及它接受哪些值），我们添加一个包装组件，并使用 TypeScript 为接口编写文档：

```tsx {6-9} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * 用户是否可以使用捏合手势进行放大和缩小。
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

现在我们有了一个文档完善、便于使用的包装组件。

接下来，我们来添加更复杂的 `region` 属性。先添加原生代码：

```objectivec title='RNTMapManager.m'
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}
```

好吧，这比之前的 `BOOL` 情况复杂一些。现在我们有一个 `MKCoordinateRegion` 类型，它需要一个转换函数，而且我们还需要自定义代码，这样当我们从 JS 设置 region 时视图才会动画过渡。在我们提供的函数体中，`json` 指的是从 JS 传递过来的原始值。这里还有一个 `view` 变量，让我们可以访问管理器的视图实例，以及一个 `defaultView`，当 JS 发送给我们一个 null 哨兵值时，我们用它把属性重置回默认值。

你可以为你的视图编写任何你想要的转换函数——下面是通过 `RCTConvert` 的一个 category 实现的 `MKCoordinateRegion`。它使用了 React Native 现有的 category `RCTConvert+CoreLocation`：

```objectivec title='RNTMapManager.m'
#import "RCTConvert+Mapkit.h"
```

```objectivec title='RCTConvert+Mapkit.h'
#import <MapKit/MapKit.h>
#import <React/RCTConvert.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert+CoreLocation.h>

@interface RCTConvert (Mapkit)

+ (MKCoordinateSpan)MKCoordinateSpan:(id)json;
+ (MKCoordinateRegion)MKCoordinateRegion:(id)json;

@end

@implementation RCTConvert(MapKit)

+ (MKCoordinateSpan)MKCoordinateSpan:(id)json
{
  json = [self NSDictionary:json];
  return (MKCoordinateSpan){
    [self CLLocationDegrees:json[@"latitudeDelta"]],
    [self CLLocationDegrees:json[@"longitudeDelta"]]
  };
}

+ (MKCoordinateRegion)MKCoordinateRegion:(id)json
{
  return (MKCoordinateRegion){
    [self CLLocationCoordinate2D:json],
    [self MKCoordinateSpan:json]
  };
}

@end
```

这些转换函数被设计为能够安全处理 JS 可能传给它们的任何 JSON：当遇到缺失的键或其他开发者错误时，它们会显示 “RedBox” 错误并返回标准初始化值。

为了完成对 `region` 属性的支持，我们可以用 TypeScript 为它编写文档：

```tsx {6-25} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * 地图要显示的区域。
   *
   * 该区域由中心坐标以及要显示的坐标跨度定义。
   */
  region?: {
    /**
     * 地图中心的坐标。
     */
    latitude: number;
    longitude: number;

    /**
     * 要显示的最小和最大纬度/经度之间的距离。
     */
    latitudeDelta: number;
    longitudeDelta: number;
  };
  /**
   * 用户是否可以使用捏合手势进行放大和缩小。
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

现在我们可以把 `region` 属性传给 `MapView`：

```tsx {4-9,12} title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  const region = {
    latitude: 37.48,
    longitude: -122.16,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };
  return (
    <MapView
      region={region}
      zoomEnabled={false}
      style={{flex: 1}}
    />
  );
}
```

## 事件

到目前为止，我们已经有了一个可以从 JS 自由控制的原生地图组件，但我们该如何处理来自用户的事件，比如捏合缩放或拖动画布以改变可见区域呢？

直到现在，我们只是从管理器的 `-(UIView *)view` 方法返回了一个 `MKMapView` 实例。我们不能给 `MKMapView` 添加新属性，所以必须基于 `MKMapView` 创建一个新的子类，并把它用作我们的 View。然后我们就可以在这个子类上添加一个 `onRegionChange` 回调：

```objectivec title='RNTMapView.h'
#import <MapKit/MapKit.h>

#import <React/RCTComponent.h>

@interface RNTMapView: MKMapView

@property (nonatomic, copy) RCTBubblingEventBlock onRegionChange;

@end
```

```objectivec title='RNTMapView.m'
#import "RNTMapView.h"

@implementation RNTMapView

@end
```

注意，所有 `RCTBubblingEventBlock` 都必须以 `on` 作为前缀。接下来，在 `RNTMapManager` 上声明一个事件处理属性，让它成为所暴露所有视图的代理，并通过从原生视图中调用事件处理 block，把事件转发给 JS。

```objectivec {9,17,31-48} title='RNTMapManager.m'
#import <MapKit/MapKit.h>
#import <React/RCTViewManager.h>

#import "RNTMapView.h"
#import "RCTConvert+Mapkit.h"

@interface RNTMapManager : RCTViewManager <MKMapViewDelegate>
@end

@implementation RNTMapManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onRegionChange, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}

- (UIView *)view
{
  RNTMapView *map = [RNTMapView new];
  map.delegate = self;
  return map;
}

#pragma mark MKMapViewDelegate

- (void)mapView:(RNTMapView *)mapView regionDidChangeAnimated:(BOOL)animated
{
  if (!mapView.onRegionChange) {
    return;
  }

  MKCoordinateRegion region = mapView.region;
  mapView.onRegionChange(@{
    @"region": @{
      @"latitude": @(region.center.latitude),
      @"longitude": @(region.center.longitude),
      @"latitudeDelta": @(region.span.latitudeDelta),
      @"longitudeDelta": @(region.span.longitudeDelta),
    }
  });
}
@end
```

在代理方法 `-mapView:regionDidChangeAnimated:` 中，事件处理 block 会连同 region 数据一起在对应视图上被调用。调用 `onRegionChange` 事件处理 block 的结果，就是在 JavaScript 中调用同名的回调属性。这个回调会接收原始事件，我们通常会在包装组件中处理它，以简化 API：

```tsx {3-10,14-17,19} title="MapView.tsx"
// ...

type RegionChangeEvent = {
  nativeEvent: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
};

export default function MapView(props: {
  // ...
  /**
   * 当用户拖动地图时持续调用的回调。
   */
  onRegionChange: (event: RegionChangeEvent) => unknown;
}) {
  return <RNTMap {...props} onRegionChange={onRegionChange} />;
}
```

```tsx {6-9,14} title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  // ...

  const onRegionChange = useCallback(event => {
    const {region} = event.nativeEvent;
    // 使用 `region.latitude` 等数据执行某些操作。
  });

  return (
    <MapView
      // ...
      onRegionChange={onRegionChange}
    />
  );
}
```

## 处理多个原生视图

一个 React Native 视图在视图树中可以拥有多个子视图，例如：

```tsx
<View>
  <MyNativeView />
  <MyNativeView />
  <Button />
</View>
```

在这个示例中，类 `MyNativeView` 是一个 `NativeComponent` 的包装器，并暴露了一些方法，这些方法会在 iOS 平台上被调用。`MyNativeView` 定义在 `MyNativeView.ios.js` 中，并包含 `NativeComponent` 的代理方法。

当用户与组件交互时，比如点击按钮，`MyNativeView` 的 `backgroundColor` 会发生变化。在这种情况下，`UIManager` 不知道应该处理哪个 `MyNativeView`，以及应该让哪个 `MyNativeView` 改变 `backgroundColor`。下面你会看到这个问题的解决方案：

```tsx
<View>
  <MyNativeView ref={this.myNativeReference} />
  <MyNativeView ref={this.myNativeReference2} />
  <Button
    onPress={() => {
      this.myNativeReference.callNativeMethod();
    }}
  />
</View>
```

现在，上面的组件引用了一个特定的 `MyNativeView`，这使我们能够使用 `MyNativeView` 的特定实例。这样按钮就可以控制哪个 `MyNativeView` 应该改变它的 `backgroundColor`。在这个例子中，我们假设 `callNativeMethod` 会改变 `backgroundColor`。

```tsx title="MyNativeView.ios.tsx"
class MyNativeView extends React.Component {
  callNativeMethod = () => {
    UIManager.dispatchViewManagerCommand(
      ReactNative.findNodeHandle(this),
      UIManager.getViewManagerConfig('RNCMyNativeView').Commands
        .callNativeMethod,
      [],
    );
  };

  render() {
    return <NativeComponent ref={NATIVE_COMPONENT_REF} />;
  }
}
```

`callNativeMethod` 是我们自定义的 iOS 方法，例如它会改变通过 `MyNativeView` 暴露出来的 `backgroundColor`。这个方法使用了 `UIManager.dispatchViewManagerCommand`，它需要 3 个参数：

- `(nonnull NSNumber \*)reactTag`  -  react 视图的 id。
- `commandID:(NSInteger)commandID`  -  应该被调用的原生方法的 Id
- `commandArgs:(NSArray<id> \*)commandArgs`  -  我们可以从 JS 传递到原生端的原生方法参数。

```objectivec title='RNCMyNativeViewManager.m'
#import <React/RCTViewManager.h>
#import <React/RCTUIManager.h>
#import <React/RCTLog.h>

RCT_EXPORT_METHOD(callNativeMethod:(nonnull NSNumber*) reactTag) {
    [self.bridge.uiManager addUIBlock:^(RCTUIManager *uiManager, NSDictionary<NSNumber *,UIView *> *viewRegistry) {
        NativeView *view = viewRegistry[reactTag];
        if (!view || ![view isKindOfClass:[NativeView class]]) {
            RCTLogError(@"Cannot find NativeView with tag #%@", reactTag);
            return;
        }
        [view callNativeMethod];
    }];

}
```

这里的 `callNativeMethod` 定义在 `RNCMyNativeViewManager.m` 文件中，并且只包含一个参数，即 `(nonnull NSNumber*) reactTag`。这个导出函数会通过 `addUIBlock` 查找某个特定视图，`addUIBlock` 中包含 `viewRegistry` 参数，并根据 `reactTag` 返回对应的组件，从而允许它在正确的组件上调用该方法。

## 样式

由于我们所有的原生 react 视图都是 `UIView` 的子类，大多数样式属性都可以像你预期的那样开箱即用。不过，有些组件会希望有一个默认样式，例如固定大小的 `UIDatePicker`。这个默认样式对于布局算法按预期工作很重要，但我们也希望在使用组件时能够覆盖默认样式。`DatePickerIOS` 的做法是将原生组件包装在一个额外的视图中，这个视图具有灵活的样式，并在内部原生组件上使用固定样式（该样式由从原生端传入的常量生成）：

```tsx title="DatePickerIOS.ios.tsx"
import {UIManager} from 'react-native';
const RCTDatePickerIOSConsts = UIManager.RCTDatePicker.Constants;
...
  render: function() {
    return (
      <View style={this.props.style}>
        <RCTDatePickerIOS
          ref={DATEPICKER}
          style={styles.rkDatePickerIOS}
          ...
        />
      </View>
    );
  }
});

const styles = StyleSheet.create({
  rkDatePickerIOS: {
    height: RCTDatePickerIOSConsts.ComponentHeight,
    width: RCTDatePickerIOSConsts.ComponentWidth,
  },
});
```

`RCTDatePickerIOSConsts` 常量是通过获取原生组件的实际 frame 从原生端导出的，如下所示：

```objectivec title='RCTDatePickerManager.m'
- (NSDictionary *)constantsToExport
{
  UIDatePicker *dp = [[UIDatePicker alloc] init];
  [dp layoutIfNeeded];

  return @{
    @"ComponentHeight": @(CGRectGetHeight(dp.frame)),
    @"ComponentWidth": @(CGRectGetWidth(dp.frame)),
    @"DatePickerModes": @{
      @"time": @(UIDatePickerModeTime),
      @"date": @(UIDatePickerModeDate),
      @"datetime": @(UIDatePickerModeDateAndTime),
    }
  };
}
```

本指南介绍了通过自定义原生组件进行桥接的许多方面，但你可能还需要考虑更多内容，例如用于插入和布局子视图的自定义钩子。如果你想更深入地了解，可以查看一些已实现组件的 [源代码](https://github.com/facebook/react-native/tree/main/packages/react-native/React/Views)。
