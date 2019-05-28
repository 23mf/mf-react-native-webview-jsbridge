package com.reactnativecommunity.webview.events

import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.events.Event
import com.facebook.react.uimanager.events.RCTEventEmitter

/**
 * Event emitted when there is an error in loading.
 */
class TopMessageEvent(viewId: Int, private val mData: String) : Event<TopMessageEvent>(viewId) {
  companion object {
    const val EVENT_NAME = "topMessage"
  }

  override fun getEventName(): String = EVENT_NAME

  override fun canCoalesce(): Boolean = false

  override fun getCoalescingKey(): Short = 0

  override fun dispatch(rctEventEmitter: RCTEventEmitter) {
    val data = Arguments.createMap()
    data.putString("data", mData)
    rctEventEmitter.receiveEvent(viewTag, EVENT_NAME, data)
  }
}
