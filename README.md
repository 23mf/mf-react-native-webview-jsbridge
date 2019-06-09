# React Native WebView jsbridge - Complete the Correspondence between web and Native
<p align="left">
  <a href="https://github.com/23mf/mf-react-native-webview-jsbridge/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="mf-react-native-webview-jsbridge is released under the MIT license." />
  </a>
  <a href="https://github.com/23mf/mf-react-native-webview-jsbridge/blob/master/docs/Reference.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
</p>


**React Native WebView jsbridge** 是在[react-native-community/react-native-webview](https://github.com/react-native-community/react-native-webview)基础上开发的native与web的通信，做到开箱即用。

## 支持的平台

- [x] iOS (支持 UIWebView，WKWebView)
- [x] Android (使用腾讯X5内核)


## 自动安装

使用npm
```
$ npm install mf-react-native-webview-jsbridge -save
```
或使用yarn
```
$ yarn add mf-react-native-webview-jsbridge
```
然后
```
$ react-native link mf-react-native-webview-jsbridge
```


## 手动安装

**iOS**
1. `Libraries`文件下右键`Add Files to 'xxx'...`,添加`RNCWebView.xcodeproj`.
2. 在`Linked Frameworks and Libraries`添加`libRNCWebView.a`

**Android**
1. 在你的工程下的`android/settings.gradle`:

```java
...
include ':mf-react-native-webview-jsbridge'
project(':mf-react-native-webview-jsbridge').projectDir = new File(rootProject.projectDir, '../node_modules/mf-react-native-webview-jsbridge/lib/android')
```
2. 在你的工程下的`android/app/build.gradle`:

```java
...
dependencies {
  ...
  implementation project(':mf-react-native-webview-jsbridge')
}
```
3. 添加 import `com.airbnb.android.react.maps.MapsPackage;`，`new MapsPackage()` 在你的 `MainApplication.java`

```java
import com.reactnativemf.webview.ReactNativeWebViewPackage;
...
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new ReactNativeWebViewPackage()
        );
    }
```

## 使用

Import the `WebView` component from `react-native-webview` and use it like so:

```jsx
import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

// ...
class MyWebComponent extends Component {
  componentDidMount() {
    /**
     * 参数1：名称
     * 参数2： 传递给js的参数
     * 参数3： 回调函数，获取js返回的参数
     */
    this.webviewRef && this.webviewRef.registerHandler('getJsInfo', 'oc传给了js一条信息', (res)=> {
      Alert.alert(res.msg);
    });
  }
  render() {
    const size = Dimensions.get('window');
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={this.handPress}
        >
          <Text>App调用Web端提供的方法</Text>
        </TouchableOpacity>
        <WebView
          ref={refs => (this.webviewRef = refs)}
          useWebKit
          style={{ width: size.width, height: size.height }}
          source={{ uri: '' }}
        />
      </View>
    );
  }
  handPress = () => {
    /**
     * 参数1：名称
     * 参数2： 传递给js的参数
     * 参数3： 回调函数，获取js返回的参数
     */
    this.webviewRef.callHandler('getJsMethod', '', (data) => {
      Alert.alert(data);
    });
  }
}
```

关于webview的[API Reference](./docs/Reference.md)


## 故障排除

- 如果你遇到 `Invariant Violation: Native component for "RNCWKWebView does not exist"` 你可以使用 `react-native link` 或者手动链接
- `'config.h' file not found`或`replace glog-0.3.X`：
```
cd node_modules/react-native/third-party/glog-0.3.4
./configure
```


## License

MIT
