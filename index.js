/**
 * 封装嵌入使用网页webview
 */
import React, { Component } from 'react';
import { View, StyleSheet, BackHandler, Linking, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { isEmpty, isUndefined, isEqual } from 'lodash';
import MFWebView from './js/WebView';

const patchPostMessageFunction = () => {
  const originalPostMessage = window.postMessage;
  const patchedPostMessage = (message, targetOrigin, transfer) => {
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = () => (
    String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
  );
  window.postMessage = patchedPostMessage;
};
const patchPostMessageJsCode = `(${String(patchPostMessageFunction)})();`;

export default class WebView extends Component {
  static propTypes = {
    uri: PropTypes.string,
    headers: PropTypes.object,
    handleMessage: PropTypes.func,
    renderError: PropTypes.func,
    onNavigationStateChange: PropTypes.func,
    allowsBackForwardNavigationGestures: PropTypes.bool,
    injectedJavaScript: PropTypes.string,
    clearHistory: PropTypes.bool,
    onLoadEnd: PropTypes.func,
    deviceId: PropTypes.string,
    handleUriCallback: PropTypes.func,
    onMessage: PropTypes.func,
    onLoadStart: PropTypes.func,
    originWhitelist: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    uri: '',
    allowsBackForwardNavigationGestures: true,
    clearHistory: false,
    originWhitelist: ['https://*', 'http://*', 'file://*'],
  };

  constructor(props) {
    super(props);
    // 回调栈
    this.callbackQueue = {};
    this.uniqueId = 0;
  }

  componentWillUnmount() {
    this.callbackQueue = {};
  }

  render() {
    const {
      allowsBackForwardNavigationGestures,
      injectedJavaScript, uri, headers, onNavigationStateChange, renderError, onMessage, onLoadStart, originWhitelist } = this.props;
    return (
      <MFWebView
        {...this.props}
        ref={refs => (this.webviewRef = refs)}
        source={{ uri, headers }}
        renderError={renderError}
        userAgent={userAgent}
        useWebKit
        allowsBackForwardNavigationGestures={allowsBackForwardNavigationGestures}
        onNavigationStateChange={onNavigationStateChange}
        javaScriptEnabled
        onMessage={onMessage}
        injectedJavaScript={`${patchPostMessageJsCode}${injectedJavaScript}`}
        onLoadStart={onLoadStart}
        onLoadEnd={this.onLoadEnd}
        onJsCallbackFunction={this.onJsCallbackFunction}
        originWhitelist={originWhitelist}
      />
    );
  }

  reload = () => { this.webviewRef && this.webviewRef.reload(); };

  clearHistory = () => {
    this.webviewRef && this.webviewRef.clearHistory();
  }

  onLoadEnd = () => {
    const { clearHistory, onLoadEnd } = this.props;
    if (clearHistory) {
      !global.isIOS && this.clearHistory();
    }
    onLoadEnd && onLoadEnd();
  }
  /**
   * 调用前端Js提供的方法
   * @param funcName 方法名,前端与客户端统一
   * @param data  传递的数据
   * @param callback 回调方法
   */
  callHandler = (funcName, data, callback) => {
    const callbackId = this.generateCbId(this.uniqueId);
    this.callbackQueue[callbackId] = callback;
    this.uniqueId = this.uniqueId + 1;
    this.webviewRef && this.webviewRef.callHandler(funcName, callbackId, data);
  }
  /**
   * 调用前端Js提供的方法，用于不用携带数据给web端这种场景
   * @param funcName 方法名,前端与客户端统一
   * @param callback 回调方法
   */
  callHandlerIgnoreDataParameter = (funcName, callback) => {
    this.callHandler(funcName, '', callback);
  }

  /**
   * 注册一个方法给前端js调用
   * @param funcName 方法名,前端与客户端统一
   * @param data 传递的数据
   * @param callback 回调方法
   */
  registerHandler = (funcName, data, callback = null) => {
    if (callback) {
      const callbackId = this.generateCbId(this.uniqueId);
      this.callbackQueue[callbackId] = callback;
      this.uniqueId = this.uniqueId + 1;
      this.webviewRef && this.webviewRef.registerHandler(funcName, callbackId, data);
    } else { // 无回调的情况
      this.webviewRef && this.webviewRef.registerHandler(funcName, '', data);
    }
  }
  /**
   * 注册一个方法给前端js调用,用于不用携带数据给web端这种场景
   * @param funcName 方法名,前端与客户端统一
   * @param callback 回调方法
   */
  registerHandlerIgnoreDataParameter = (funcName, callback) => {
    this.registerHandler(funcName, '', callback);
  }

  /**
   * 前端返回数据的回调方法
   * @param 返回的json 数据
   */
  onJsCallbackFunction = (event) => {
    const { callbackId, data } = event.nativeEvent;
    const callback = this.callbackQueue[callbackId];
    if (callback) {
      if (Platform.OS === 'ios') {
        callback(data);
      } else {
        // android 从原生端返回的是json字符串，序列化成对象
        callback(JSON.parse(data));
      }
    }
  }
  /**
   * 生成一个唯一的callback ID
   * @param 一个自增长数字
   */
  generateCbId = (unique) => {
    const timestamp = new Date().getTime();
    return `react-native:cb:${unique}:${timestamp}`;
  }
}


