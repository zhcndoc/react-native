---
id: native-components-ios
title: iOS 原生 UI 组件
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

目前有大量原生 UI 小部件可以直接用于最新的应用中——其中一些属于平台，另一些以第三方库的形式提供，还有更多可能已经在你自己的项目组合中使用。React Native 已经封装了几个最关键的平台组件，例如 `ScrollView` 和 `TextInput`，但并非全部都已封装，当然也不会包括你可能为之前的应用自行编写的组件。幸运的是，我们可以封装这些现有组件，使其与你的 React Native 应用无缝集成。

与原生模块指南一样，这也是一篇更高级的指南，假设你对 iOS 编程已有一定了解。本指南将向你展示如何构建原生 UI 组件，并带你逐步实现 React Native 核心库中现有 `MapView` 组件的一个子集。

## iOS MapView 示例

假设我们想在应用中添加一个交互式地图——不妨使用 [`MKMapView`](https://developer.apple.com/library/prerelease/mac/documentation/MapKit/Reference/MKMapView_Class/index.html)，我们只需要让它能够从 JavaScript 中使用。

原生视图由 `RCTViewManager` 的子类创建和操作。这些子类在功能上类似于视图控制器，但本质上是单例——桥接器只会为每个子类创建一个实例。它们会将原生视图暴露给 `RCTUIManager`，后者会在必要时委托它们设置和更新视图的属性。`RCTViewManager` 通常也是视图的代理，通过桥接器将事件发送回 JavaScript。

要暴露一个视图，你可以：

- 将 `RCTViewManager` 子类化，为你的组件创建一个管理器
- 添加 `RCT_EXPORT_MODULE()` 标记宏
- 实现 `-(UIView *)view` 方法

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
不要尝试在你通过 `-view` 方法暴露的 `UIView` 实例上设置 `frame` 或 `backgroundColor` 属性。
React Native 会覆盖自定义类设置的值，以匹配 JavaScript 组件的布局属性。
如果你需要这种粒度的控制，最好将你想要设置样式的 `UIView` 实例包装在另一个 `UIView` 中，并改为返回这个包装器 `UIView`。
有关更多背景信息，请参阅 [Issue 2948](https://github.com/facebook/react-native/issues/2948)。
:::

:::info
在上面的示例中，我们在类名中使用了 `RNT` 前缀。使用前缀可以避免与其他框架发生名称冲突。
Apple 框架使用两个字母的前缀，而 React Native 使用 `RCT` 作为前缀。为了避免名称冲突，我们建议你在自己的类中使用除 `RCT` 之外的三个字母前缀。
:::

然后你需要编写少量 JavaScript，使其成为可用的 React 组件：

```tsx {3} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

export default requireNativeComponent('RNTMap');
```

`requireNativeComponent` 函数会自动将 `RNTMap` 解析为 `RNTMapManager`，并导出我们的原生视图，以便在 JavaScript 中使用。

```tsx title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView style={{flex: 1}} />;
}
```

:::note
渲染时不要忘记拉伸视图，否则你看到的将是一片空白屏幕。
:::

现在，这已经是一个功能完整的 JavaScript 原生地图视图组件，并支持捏合缩放和其他原生手势。不过，我们还不能真正从 JavaScript 控制它。

## 属性

为了让这个组件更实用，我们首先可以桥接一些原生属性。假设我们希望能够禁用缩放并指定可见区域。禁用缩放是一个布尔值，因此我们添加下面这一行：

```objectivec title='RNTMapManager.m'
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
```

注意，我们明确将类型指定为 `BOOL`——React Native 在桥接通信时会在底层使用 `RCTConvert` 转换各种不同的数据类型，而错误的值会显示方便的 “RedBox” 错误，以便尽快告知你存在问题。像这样简单明了的情况，整个实现都由这个宏替你处理。

现在，要真正禁用缩放，我们在 JavaScript 中设置该属性：

```tsx {4} title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView zoomEnabled={false} style={{flex: 1}} />;
}
```

为了记录 MapView 组件的属性（以及它们接受的值），我们将添加一个包装组件，并使用 TypeScript 记录其接口：

```tsx {6-9} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * Whether the user may use pinch gestures to zoom in and out.
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

现在，我们有了一个文档完善的包装组件可供使用。

接下来，让我们添加更复杂的 `region` 属性。我们先添加原生代码：

```objectivec title='RNTMapManager.m'
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}
```

好的，这比之前的 `BOOL` 情况复杂一些。现在我们有一个需要转换函数的 `MKCoordinateRegion` 类型，并且还需要自定义代码，以便从 JS 设置区域时视图能够执行动画。在我们提供的函数体中，`json` 表示从 JS 传递过来的原始值。此外还有一个 `view` 变量，它让我们能够访问管理器的视图实例；还有一个 `defaultView`，当 JS 向我们发送 null 哨兵值时，我们可以使用它将属性重置为默认值。

你可以为视图编写任意转换函数——下面是通过 `RCTConvert` 的分类实现 `MKCoordinateRegion` 的方式。它使用了 ReactNative 中已经存在的 `RCTConvert+CoreLocation` 分类：

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

这些转换函数旨在安全地处理 JS 可能传入的任何 JSON：当遇到缺少键或其他开发者错误时，它们会显示 “RedBox” 错误，并返回标准的初始化值。

要完成对 `region` 属性的支持，我们可以使用 TypeScript 记录它：

```tsx {6-25} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * The region to be displayed by the map.
   *
   * The region is defined by the center coordinates and the span of
   * coordinates to display.
   */
  region?: {
    /**
     * Coordinates for the center of the map.
     */
    latitude: number;
    longitude: number;

    /**
     * Distance between the minimum and the maximum latitude/longitude
     * to be displayed.
     */
    latitudeDelta: number;
    longitudeDelta: number;
  };
  /**
   * Whether the user may use pinch gestures to zoom in and out.
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

现在，我们可以向 `MapView` 提供 `region` 属性：

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

现在我们有了一个可以从 JS 自由控制的原生地图组件，但要如何处理用户事件呢，例如捏合缩放或平移以改变可见区域？

到目前为止，我们只是在管理器的 `-(UIView *)view` 方法中返回一个 `MKMapView` 实例。我们无法向 `MKMapView` 添加新属性，因此必须从 `MKMapView` 创建一个新的子类，用作我们的 View。然后，我们可以在这个子类上添加一个 `onRegionChange` 回调：

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

注意，所有 `RCTBubblingEventBlock` 都必须以 `on` 开头。接下来，在 `RNTMapManager` 上声明一个事件处理器属性，让它成为所暴露全部视图的代理，并通过从原生视图调用事件处理器块，将事件转发给 JS。

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

在代理方法 `-mapView:regionDidChangeAnimated:` 中，会在对应的视图上调用事件处理器块，并传入区域数据。调用 `onRegionChange` 事件处理器块，会触发 JavaScript 中同名的回调属性。这个回调会接收原始事件，我们通常会在包装组件中对其进行处理，以简化 API：

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
   * Callback that is called continuously when the user is dragging the map.
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
    // Do something with `region.latitude`, etc.
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

React Native 视图在视图树中可以拥有多个子视图，例如：

```tsx
<View>
  <MyNativeView />
  <MyNativeView />
  <Button />
</View>
```

在这个示例中，`MyNativeView` 类是一个 `NativeComponent` 的包装器，并暴露了将在 iOS 平台上调用的方法。`MyNativeView` 定义在 `MyNativeView.ios.js` 中，并包含 `NativeComponent` 的代理方法。

当用户与组件交互时，例如点击按钮，`MyNativeView` 的 `backgroundColor` 会发生变化。在这种情况下，`UIManager` 不知道应该处理哪个 `MyNativeView`，以及应该更改哪个视图的 `backgroundColor`。下面是这个问题的一种解决方案：

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

现在，上面的组件引用了一个特定的 `MyNativeView`，这使我们能够使用 `MyNativeView` 的某个实例。这样，按钮就可以控制应该更改哪个 `MyNativeView` 的 `backgroundColor`。在这个示例中，我们假设 `callNativeMethod` 会更改 `backgroundColor`。

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

`callNativeMethod` 是我们自定义的 iOS 方法，例如可以更改通过 `MyNativeView` 暴露的 `backgroundColor`。这个方法使用了 `UIManager.dispatchViewManagerCommand`，它需要 3 个参数：

- `(nonnull NSNumber \*)reactTag`  -  react 视图的 id
- `commandID:(NSInteger)commandID`  -  应调用的原生方法的 Id
- `commandArgs:(NSArray<id> \*)commandArgs`  -  可以从 JS 传递给原生代码的原生方法参数

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

这里的 `callNativeMethod` 定义在 `RNCMyNativeViewManager.m` 文件中，并且只包含一个参数 `(nonnull NSNumber*) reactTag`。这个导出的函数会使用包含 `viewRegistry` 参数的 `addUIBlock` 查找特定视图，并根据 `reactTag` 返回组件，从而允许它在正确的组件上调用该方法。

## 样式

由于我们所有的原生 react 视图都是 `UIView` 的子类，大多数样式属性都可以像预期一样直接生效。不过，有些组件需要默认样式，例如固定尺寸的 `UIDatePicker`。这个默认样式对于布局算法按预期工作非常重要，但我们也希望在使用组件时能够覆盖默认样式。`DatePickerIOS` 通过将原生组件包装在一个额外的视图中实现了这一点：这个额外视图具有灵活的样式，而内部原生组件使用固定样式（该样式由原生代码传入的常量生成）：

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

`RCTDatePickerIOSConsts` 常量通过获取原生组件的实际 frame，从原生代码中导出，具体如下：

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

本指南介绍了桥接自定义原生组件的许多方面，但你可能还需要考虑更多内容，例如用于插入和布局子视图的自定义钩子。如果你想进一步深入了解，请查看一些已实现组件的[源代码](https://github.com/facebook/react-native/tree/main/packages/react-native/React/Views)。
