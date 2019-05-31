/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.reactnativemf.webview;


import com.tencent.smtt.sdk.WebView;

/**
 * Implement this interface in order to config your {@link WebView}. An instance of that
 * implementation will have to be given as a constructor argument to {@link ReactX5WebViewManager}.
 */
public interface WebViewConfig {

  void configWebView(WebView webView);
}
