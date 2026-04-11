---
id: native-components-ios
title: iOS 原生 UI 组件
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

市面上有大量的原生 UI 控件可供最新的应用程序使用——其中一些是平台的一部分，另一些可作为第三方库使用，还有更多可能就在你自己的作品集中使用。React Native 已经封装了一些最关键的平台组件，如 `ScrollView` 和 `TextInput`，但并不是全部，肯定不包括你为之前的应用自己编写的那些。幸运的是，我们可以封装这些现有组件，以便与你的 React Native 应用程序无缝集成。

像原生模块指南一样，这也是一个更高级的指南，假设你对 iOS 编程有一定的了解。本指南将向你展示如何构建一个原生 UI 组件，带你逐步实现核心 React Native 库中现有的 `MapView` 组件的子集。

## iOS MapView 示例

假设我们想向应用添加一个交互式地图——不妨使用 [`MKMapView`](https://developer.apple.com/library/prerelease/mac/documentation/MapKit/Reference/MKMapView_Class/index.html)，我们只需要使其可以从 JavaScript 使用。

原生视图由 `RCTViewManager` 的子类创建和操作。这些子类的功能类似于视图控制器，但本质上是单例——桥接为每个子类只创建一个实例。它们将原生视图暴露给 `RCTUIManager`，后者再委托它们根据需要设置和更新视图的属性。`RCTViewManager` 通常也是视图的代理，通过桥接将事件发送回 JavaScript。

要暴露一个视图，你可以：

- 子类化 `RCTViewManager` 为你的组件创建一个管理器。
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
不要尝试设置通过 `-view` 方法暴露的 `UIView` 实例上的 `frame` 或 `backgroundColor` 属性。
React Native 将覆盖你的自定义类设置的值，以匹配你的 JavaScript 组件的布局属性。
如果你需要这种粒度的控制，最好将你想要样式的 `UIView` 实例包装在另一个 `UIView` 中，并返回包装后的 `UIView`。
参见 [Issue 2948](https://github.com/facebook/react-native/issues/2948) 了解更多背景。
:::

:::info
在上面的示例中，我们将类名前缀设为 `RNT`。前缀用于避免与其他框架的名称冲突。
Apple 框架使用两个字母的前缀，React Native 使用 `RCT` 作为前缀。为了避免名称冲突，我们建议在自己的类中使用除 `RCT` 以外的三个字母前缀。
:::

然后你需要一点 JavaScript 代码使其成为一个可用的 React 组件：

```tsx {3} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

export default requireNativeComponent('RNTMap');
```

`requireNativeComponent` 函数自动将 `RNTMap` 解析为 `RNTMapManager` 并导出我们的原生视图供 JavaScript 使用。

```tsx title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView style={{flex: 1}} />;
}
```

:::note
渲染时，不要忘记拉伸视图，否则你将盯着一个空白屏幕。
:::

现在这是一个功能完备的原生地图视图组件，包括捏合缩放和其他原生手势支持。不过，我们还不能真正从 JavaScript 控制它。

## 属性

我们要使这个组件更易用的第一件事是桥接一些原生属性。假设我们想要能够禁用缩放并指定可见区域。禁用缩放是一个布尔值，所以我们添加这一行：

```objectivec title='RNTMapManager.m'
RCT_EXPORT_VIEW_PROPERTY(zoomEnabled, BOOL)
```

注意我们明确指定了类型为 `BOOL` —— React Native 在底层使用 `RCTConvert` 在通过桥接通信时转换各种不同类型的数据，错误的值将显示方便的 "RedBox" 错误，让你尽快知道有问题。当事情像这样简单时，整个实现都由这个宏为你处理。

现在要实际禁用缩放，我们在 JavaScript 中设置属性：

```tsx {4} title="MyApp.tsx"
import MapView from './MapView.tsx';

export default function MyApp() {
  return <MapView zoomEnabled={false} style={{flex: 1}} />;
}
```

为了文档化我们 MapView 组件的属性（以及它们接受哪些值），我们将添加一个包装组件并用 TypeScript 文档化接口：

```tsx {6-9} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * 用户是否可以使用捏合手势进行缩放。
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

现在有了一个文档完善的包装组件可供使用。

接下来，让我们添加更复杂的 `region` 属性。我们首先添加原生代码：

```objectivec title='RNTMapManager.m'
RCT_CUSTOM_VIEW_PROPERTY(region, MKCoordinateRegion, MKMapView)
{
  [view setRegion:json ? [RCTConvert MKCoordinateRegion:json] : defaultView.region animated:YES];
}
```

好吧，这比我们之前的 `BOOL` 情况更复杂。现在我们有一个需要转换函数的 `MKCoordinateRegion` 类型，并且我们有自定义代码，以便当我们从 JS 设置区域时视图将动画显示。在我们提供的函数体内，`json` 指的是从 JS 传递的原始值。还有一个 `view` 变量，让我们可以访问管理器的视图实例，以及一个 `defaultView`，如果 JS 发送给我们一个 null 哨兵值，我们用它将属性重置为默认值。

你可以为你的视图编写任何你想要的转换函数——这是通过 `RCTConvert` 上的类别实现 `MKCoordinateRegion` 的实现。它使用了一个已存在的 ReactNative `RCTConvert+CoreLocation` 类别：

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

这些转换函数旨在安全地处理 JS 可能抛给它们的任何 JSON，方法是显示 "RedBox" 错误，并在遇到缺失键或其他开发者错误时返回标准初始化值。

为了完成对 `region` 属性的支持，我们可以用 TypeScript 文档化它：

```tsx {6-25} title="MapView.tsx"
import {requireNativeComponent} from 'react-native';

const RNTMap = requireNativeComponent('RNTMap');

export default function MapView(props: {
  /**
   * 地图要显示的区域。
   *
   * 区域由中心坐标和要显示的坐标跨度定义。
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
   * 用户是否可以使用捏合手势进行缩放。
   */
  zoomEnabled?: boolean;
}) {
  return <RNTMap {...props} />;
}
```

我们现在可以向 `MapView` 提供 `region` 属性了：

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

所以现在有了一个可以从 JS 自由控制的原生地图组件，但我们如何处理来自用户的事件，如捏合缩放或平移以改变可见区域？

到目前为止，我们只从管理器的 `-(UIView *)view` 方法返回了一个 `MKMapView` 实例。我们无法向 `MKMapView` 添加新属性，所以我们必须从 `MKMapView` 创建一个新的子类，用于我们的视图。然后我们可以在此子类上添加一个 `onRegionChange` 回调：

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

注意所有 `RCTBubblingEventBlock` 必须以 `on` 为前缀。接下来，在 `RNTMapManager` 上声明一个事件处理属性，使其成为它暴露的所有视图的代理，并通过从原生视图调用事件处理块将事件转发给 JS。

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

在代理方法 `-mapView:regionDidChangeAnimated:` 中，事件处理块在相应视图上被调用，并带有区域数据。调用 `onRegionChange` 事件处理块会导致在 JavaScript 中调用相同的回调属性。此回调使用原始事件调用，我们通常在包装组件中处理它以简化 API：

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
   * 当用户拖动地图时连续调用的回调。
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
    // 对 `region.latitude` 等做一些处理
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

在此示例中，类 `MyNativeView` 是 `NativeComponent` 的包装器，并暴露将在 iOS 平台上调用的方法。`MyNativeView` 定义在 `MyNativeView.ios.js` 中，包含 `NativeComponent` 的代理方法。

当用户与组件交互时，例如点击按钮，`MyNativeView` 的 `backgroundColor` 会发生变化。在这种情况下，`UIManager` 将不知道应该处理哪个 `MyNativeView` 以及哪个应该更改 `backgroundColor`。下面您将找到解决此问题的方法：

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

现在上面的组件有一个对特定 `MyNativeView` 的引用，这允许我们使用 `MyNativeView` 的特定实例。现在按钮可以控制哪个 `MyNativeView` 应该更改其 `backgroundColor`。在此示例中，我们假设 `callNativeMethod` 会更改 `backgroundColor`。

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

`callNativeMethod` 是我们的自定义 iOS 方法，例如更改通过 `MyNativeView` 暴露的 `backgroundColor`。此方法使用 `UIManager.dispatchViewManagerCommand`，需要 3 个参数：

- `(nonnull NSNumber \*)reactTag` - react 视图的 id。
- `commandID:(NSInteger)commandID` - 应该调用的原生方法的 Id
- `commandArgs:(NSArray<id> \*)commandArgs` - 我们可以从 JS 传递到原生的原生方法的参数。

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

此处 `callNativeMethod` 定义在 `RNCMyNativeViewManager.m` 文件中，仅包含一个参数 `(nonnull NSNumber*) reactTag`。这个导出的函数将使用 `addUIBlock` 查找特定视图，其中包含 `viewRegistry` 参数，并根据 `reactTag` 返回组件，从而允许它在正确的组件上调用方法。

## 样式

由于我们所有的原生 react 视图都是 `UIView` 的子类，因此大多数样式属性将按预期开箱即用。然而，有些组件会需要默认样式，例如固定大小的 `UIDatePicker`。此默认样式对于布局算法按预期工作很重要，但我们也希望在使用组件时能够覆盖默认样式。`DatePickerIOS` 通过将原生组件包装在一个具有灵活样式的额外视图中，并在内部原生组件上使用固定样式（使用从原生传递的常量生成）来实现这一点：

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

`RCTDatePickerIOSConsts` 常量通过获取原生组件的实际帧从原生导出，如下所示：

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

本指南涵盖了桥接自定义原生组件的许多方面，但您可能还需要考虑更多内容，例如用于插入和布局子视图的自定义钩子。如果您想更深入地了解，请查看一些已实现组件的 [源代码](https://github.com/facebook/react-native/tree/main/packages/react-native/React/Views)。
