---
id: native-components-ios
title: iOS 原生 UI 组件
---

import NativeDeprecated from '../the-new-architecture/_markdown_native_deprecation.mdx'

<NativeDeprecated />

市面上有大量的原生 UI 控件可供最新的应用使用——其中一些是平台自带的，另一些则作为第三方库存在，还有更多可能已经在你自己的项目中使用。React Native 已经封装了几个最关键的平台组件，比如 `ScrollView` 和 `TextInput`，但并非全部，也肯定不包括你之前为了某个应用自己写的组件。幸运的是，我们可以将现有的组件封装起来，实现与 React Native 应用的无缝集成。

和原生模块指南一样，本指南也是进阶指南，假设你对 iOS 编程已有一定了解。本文将展示如何构建一个原生 UI 组件，带你实现 React Native 核心库中已有的 `MapView` 组件的一个子集。

## iOS MapView 示例

假设我们想在应用中添加一个交互式地图——可以直接使用 [`MKMapView`](https://developer.apple.com/library/prerelease/mac/documentation/MapKit/Reference/MKMapView_Class/index.html)，只需让它能被 JavaScript 使用即可。

原生视图由 `RCTViewManager` 的子类创建和操作。这些子类的功能类似于视图控制器，但本质上是单例——桥接只会创建一个实例。它们向 `RCTUIManager` 暴露原生视图，后者会委托给它们设置和更新视图的属性。`RCTViewManager` 通常也是视图的代理，用于通过桥接将事件传回 JavaScript。

要暴露一个视图，可以：

- 继承 `RCTViewManager` 创建你的组件管理器。
- 添加 `RCT_EXPORT_MODULE()` 宏。
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
不要试图在通过 `-view` 方法暴露的 `UIView` 实例上设置 `frame` 或 `backgroundColor` 属性。
React Native 会覆盖你自定义类设置的这些值，以匹配 JavaScript 组件的布局属性。
如果你需要如此细粒度地控制样式，最好将你想要样式化的 `UIView` 实例包裹在另一个 `UIView` 中，然后返回这个包裹的 `UIView`。
更多背景可见 [Issue 2948](https://github.com/facebook/react-native/issues/2948)。
:::

:::info
上例中，我们给类名前缀加了 `RNT`。前缀用于避免与其他框架的命名冲突。
Apple 框架使用两个字母的前缀，React Native 使用 `RCT` 作为前缀。为了避免冲突，建议你自己的类使用除 `RCT` 以外的三字母前缀。
:::

接下来需要一些 JavaScript 代码，使其成为可以用的 React 组件：

```tsx {3} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

export default requireNativeComponent('RNTMap');
```

`requireNativeComponent` 函数会自动将 `RNTMap` 解析到 `RNTMapManager`，并导出我们的原生视图供 JavaScript 使用。

```tsx title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView style={{flex: 1}} />;
}
```

:::note
渲染时别忘了拉伸视图，否则你看到的将是空白屏幕。
:::

这样，我们就有了一个功能完整的原生地图视图组件，支持捏合缩放等原生手势。不过目前我们还不能通过 JavaScript 控制它。

## 属性

要让组件更好用，首先可以桥接一些原生属性。假设我们想禁用缩放并能设置可视区域。禁用缩放是一个布尔值属性，我们只需加一行代码：

```objectivec title='RNTMapManager.m'
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
```

注意这里显式指定类型为 `BOOL`——React Native 底层使用 `RCTConvert` 转换各种类型数据，遇到无效值会显示“红框”快速帮你定位问题。像这种简单情况，这个宏会帮你完成所有实现。

要真正禁用缩放，你在 JS 里设置这个属性：

```tsx {4} title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView zoomEnabled={false} style={{flex: 1}} />;
}
```

为了给 MapView 组件的属性（及其可接受的值）做文档，我们加入一个包装组件，并用 TypeScript 注释接口：

```tsx {6-9} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * 是否允许用户通过捏合手势缩放地图。
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

这样我们就有了一个带良好文档的包装组件。

接着添加更复杂的 `region` 属性。首先添加原生代码：

```objectivec title='RNTMapManager.m'
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}
```

这比前面 `BOOL` 的情况复杂多了。`region` 是 `MKCoordinateRegion` 类型，需要转换函数；我们也写了自定义代码，确保从 JS 设置该属性时视图能动画。函数体中，`json` 是从 JS 传来的原始值，`view` 是管理器的视图实例，`defaultView` 用于重置为默认值（当 JS 传 null）。

你可以为你的视图写任意转换函数——这里演示了针对 `MKCoordinateRegion` 的 `RCTConvert` 类别实现，利用了 ReactNative 已有的 `RCTConvert+CoreLocation` 类别：

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

这些转换函数旨在安全处理 JS 传来的任意 JSON，遇缺失键或其它开发错误时会显示“红框”错误并返回默认初始化值。

支持完 `region` 属性后，我们用 TypeScript 文档化它：

```tsx {6-25} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * 地图显示的区域。
   *
   * 区域由中心坐标和显示的跨度定义。
   */
  region?: {
    /**
     * 地图中心的坐标。
     */
    latitude: number;
    longitude: number;

    /**
     * 显示的纬度/经度跨度范围。
     */
    latitudeDelta: number;
    longitudeDelta: number;
  };
  /**
   * 是否允许用户通过捏合手势缩放地图。
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

现在我们能给 `MapView` 传递 `region` 属性了：

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

## 事件处理

我们有了一个可由 JS 控制的原生地图组件，那么怎么处理用户操作产生的事件，比如捏合缩放、平移导致可视区域改变呢？

到目前为止，我们只在管理器的 `-(UIView *)view` 方法里返回了一个 `MKMapView` 实例。我们不能给 `MKMapView` 增加新属性，所以要创建一个继承自 `MKMapView` 的子类，并用它作为视图。这样我们就能在该子类中添加 `onRegionChange` 回调：

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

注意所有 `RCTBubblingEventBlock` 类型属性必须以 `on` 开头。接下来，在 `RNTMapManager` 声明事件处理属性，让管理器成为所有暴露视图的代理，并在代理方法中调用事件处理块将事件发送到 JS：

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

在代理方法 `-mapView:regionDidChangeAnimated:` 中，事件处理块会被调用并传入区域数据。调用 `onRegionChange` 事件处理块会触发 JS 中对应的回调属性。此回调带有原始事件，通常包装组件会简化这个 API：

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
   * 用户拖动地图时会持续触发的回调。
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
    // 使用 `region.latitude` 等字段做处理
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

React Native 视图树中可以有多个子视图，例如：

```tsx
<View>
  <MyNativeView />
  <MyNativeView />
  <Button />
</View>
```

在这个例子中，类 `MyNativeView` 是 `NativeComponent` 的包装，暴露了一些方法，这些方法会在 iOS 平台调用。`MyNativeView` 定义于 `MyNativeView.ios.js`，包含对 `NativeComponent` 的代理方法。

当用户与组件交互，比如点击按钮时，如果要改变某个 `MyNativeView` 的 `backgroundColor`，UIManager 本身并不知道应处理哪个 `MyNativeView`，哪个应该改变颜色。下面给出解决方案：

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

这样，组件就能引用特定的某个 `MyNativeView`，可以调用实例方法控制对应的组件改变 `backgroundColor`（假设 `callNativeMethod` 会改变颜色）：

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

`callNativeMethod` 是我们自定义的 iOS 方法，比如改变 `backgroundColor`，它通过 `UIManager.dispatchViewManagerCommand` 调用原生方法。该函数有三个参数：

- `(nonnull NSNumber *)reactTag` — React 视图的 id。
- `commandID:(NSInteger)commandID` — 要调用的原生方法的 id。
- `commandArgs:(NSArray<id> *)commandArgs` — 从 JS 传给原生的参数数组。

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

这里 `callNativeMethod` 在 `RNCMyNativeViewManager.m` 中定义，只有一个参数 `(nonnull NSNumber*) reactTag`。导出的方法通过 `addUIBlock` 访问 `viewRegistry`，根据 `reactTag` 找组件实例，确保调用正确的组件方法。

## 样式

由于所有原生 React 视图都是 `UIView` 的子类，大多数样式属性默认都能正常工作。不过有些组件需要默认样式，比如固定大小的 `UIDatePicker`。该默认样式对布局算法很重要，但我们也希望使用组件时能覆盖默认样式。`DatePickerIOS` 通过在一个额外的 `UIView` 包裹原生组件，包裹层支持灵活样式，内部原生组件使用固定样式（由原生传来的常量生成）实现：

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

`RCTDatePickerIOSConsts` 常量由原生导出，具体做法是读取原生组件实际的尺寸：

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

本指南涵盖了桥接自定义原生组件的诸多方面，但你可能还需要考虑更多，如插入和布局子视图的自定义钩子。若想深入了解，请查看一些已实现组件的 [源代码](https://github.com/facebook/react-native/tree/main/packages/react-native/React/Views)。