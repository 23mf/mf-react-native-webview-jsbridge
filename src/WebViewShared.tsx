import escapeStringRegexp from 'escape-string-regexp';
import React from 'react';
import {
  Linking,
  UIManager as NotTypedUIManager,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import {
  WebViewNavigationEvent,
  OnShouldStartLoadWithRequest,
  CustomUIManager,
} from './WebViewTypes';
import styles from './WebView.styles';

const UIManager = NotTypedUIManager as CustomUIManager;

const defaultOriginWhitelist = ['http://*', 'https://*'];

const extractOrigin = (url: string): string => {
  const result = /^[A-Za-z][A-Za-z0-9+\-.]+:(\/\/)?[^/]*/.exec(url);
  return result === null ? '' : result[0];
};

const originWhitelistToRegex = (originWhitelist: string): string =>
  `^${escapeStringRegexp(originWhitelist).replace(/\\\*/g, '.*')}`;

const passesWhitelist = (
  compiledWhitelist: ReadonlyArray<string>,
  url: string,
) => {
  const origin = extractOrigin(url);
  return compiledWhitelist.some(x => new RegExp(x).test(origin));
};

const compileWhitelist = (
  originWhitelist: ReadonlyArray<string>,
): ReadonlyArray<string> =>
  ['about:blank', ...(originWhitelist || [])].map(originWhitelistToRegex);

const createOnShouldStartLoadWithRequest = (
  loadRequest: (
    shouldStart: boolean,
    url: string,
    lockIdentifier: number,
  ) => void,
  originWhitelist: ReadonlyArray<string>,
  onShouldStartLoadWithRequest?: OnShouldStartLoadWithRequest,
) => {
  return ({ nativeEvent }: WebViewNavigationEvent) => {
    let shouldStart = true;
    const { url, lockIdentifier } = nativeEvent;

    if (!passesWhitelist(compileWhitelist(originWhitelist), url)) {
      Linking.openURL(url);
      shouldStart = false;
    }

    if (onShouldStartLoadWithRequest) {
      shouldStart = onShouldStartLoadWithRequest(nativeEvent);
    }

    loadRequest(shouldStart, url, lockIdentifier);
  };
};

const getViewManagerConfig = (
  viewManagerName: 'RNCUIWebView' | 'RNCWKWebView' | 'RNCWebView',
) => {
  if (!UIManager.getViewManagerConfig) {
    return UIManager[viewManagerName];
  }
  return UIManager.getViewManagerConfig(viewManagerName);
};

const defaultRenderLoading = () => (
  <View style={styles.loadingView}>
    <ActivityIndicator />
  </View>
);
const defaultRenderError = (
  errorDomain: string | undefined,
  errorCode: number,
  errorDesc: string,
) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTextTitle}>Error loading page</Text>
    <Text style={styles.errorText}>{`Domain: ${errorDomain}`}</Text>
    <Text style={styles.errorText}>{`Error Code: ${errorCode}`}</Text>
    <Text style={styles.errorText}>{`Description: ${errorDesc}`}</Text>
  </View>
);

export {
  defaultOriginWhitelist,
  createOnShouldStartLoadWithRequest,
  getViewManagerConfig,
  defaultRenderLoading,
  defaultRenderError,
};
