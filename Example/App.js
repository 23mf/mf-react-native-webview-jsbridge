/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';

import WebView from 'mf-react-native-webview-jsbridge';

export default class App extends Component {

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
          style={{ width: size.width, height: size.height - 20 }}
          source={ Platform.OS === 'ios' ? require('./jsbridge.html') : {uri: 'file:///android_asset/jsbridge.html'}}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
