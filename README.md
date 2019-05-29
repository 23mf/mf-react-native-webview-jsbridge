# React Native WebView - a Modern, Cross-Platform WebView for React Native

**React Native WebView jsbridge** 是在[react-native-community/react-native-webview](https://github.com/react-native-community/discussions-and-proposals/pull/3)基础上开发的实现的native与web的通信。

## 支持的平台

- [x] iOS (both UIWebView and WKWebView)
- [x] Android


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

###使用CocoaPods
1. `npm install mf-react-native-webview-jsbridge -save`.
2. 配置Podfile，然后指定NPM安装路径：
```
pod 'mf-react-native-webview-jsbridge', path: '../node_modules/mf-react-native-webview-jsbridge'
```
3. `pod install`


##手动安装
###iOS
1. `Libraries`文件下右键`Add Files to 'xxx'...`,添加`RNCWebView.xcodeproj`.
2. 在`Linked Frameworks and Libraries`添加`libRNCWebView.a`

###Android


## 使用

Import the `WebView` component from `react-native-webview` and use it like so:

```jsx
import React, { Component } from "react";
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

// ...
class MyWebComponent extends Component {
  componentDidMount() {
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
          source={{ uri }}
        />
      </View>
    );
  }
  handPress = () => {
    this.webviewRef.callHandlerIgnoreDataParameter('getJsMethod', (data) => {
      Alert.alert(data);
    });
  }
}
```

For more, read the [API Reference](./docs/Reference.md)


## 故障排除

- 如果你遇到 `Invariant Violation: Native component for "RNCWKWebView does not exist"` 你可以使用 `react-native link` 或者手动链接


## License

MIT
