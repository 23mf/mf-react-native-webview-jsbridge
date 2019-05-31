/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.reactnativemf.webview;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * webView 状态发生变化时发送事件
 */
public class TopWebViewStateChangeEvent extends Event<TopWebViewStateChangeEvent> {

  public static final String EVENT_NAME = "topChange";
  private final WritableMap mData;

  public TopWebViewStateChangeEvent(int viewId, WritableMap data) {
    super(viewId);
    mData = data;
  }

  @Override
  public String getEventName() {
    return EVENT_NAME;
  }

  @Override
  public boolean canCoalesce() {
    return false;
  }

  @Override
  public short getCoalescingKey() {
    // All events for a given view can be coalesced.
    return 0;
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, mData);
  }
}
