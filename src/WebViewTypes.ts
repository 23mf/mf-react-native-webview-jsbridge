/* eslint-disable react/no-multi-comp */

import { ReactElement, Component } from 'react';
import {
  NativeSyntheticEvent,
  ViewProps,
  NativeMethodsMixin,
  Constructor,
  UIManagerStatic,
  NativeScrollEvent,
} from 'react-native';

export interface WebViewCommands {
  goForward: Function;
  goBack: Function;
  reload: Function;
  stopLoading: Function;
  postMessage: Function;
  injectJavaScript: Function;
  loadUrl: Function;
  registerHandler: Function;
  callHandler: Function;
}

export interface CustomUIManager extends UIManagerStatic {
  getViewManagerConfig?: (
    name: string,
  ) => {
    Commands: WebViewCommands;
  };
  dispatchViewManagerCommand: (
    viewHandle: number,
    command: Function,
    params: object | null,
  ) => void;
  RNCUIWebView: {
    Commands: WebViewCommands;
  };
  RNCWKWebView: {
    Commands: WebViewCommands;
  };
  RNCWebView: {
    Commands: WebViewCommands;
  };
}

type WebViewState = 'IDLE' | 'LOADING' | 'ERROR';

interface BaseState {
  viewState: WebViewState;
}

interface NormalState extends BaseState {
  viewState: 'IDLE' | 'LOADING';
  lastErrorEvent: WebViewError | null;
}

interface ErrorState extends BaseState {
  viewState: 'ERROR';
  lastErrorEvent: WebViewError;
}

export type State = NormalState | ErrorState;

// eslint-disable-next-line react/prefer-stateless-function
declare class NativeWebViewIOSComponent extends Component<
  IOSNativeWebViewProps
> {}
declare const NativeWebViewIOSBase: Constructor<NativeMethodsMixin> &
  typeof NativeWebViewIOSComponent;
export class NativeWebViewIOS extends NativeWebViewIOSBase {}

// eslint-disable-next-line react/prefer-stateless-function
declare class NativeWebViewAndroidComponent extends Component<
  AndroidNativeWebViewProps
> {}
declare const NativeWebViewAndroidBase: Constructor<NativeMethodsMixin> &
  typeof NativeWebViewAndroidComponent;
export class NativeWebViewAndroid extends NativeWebViewAndroidBase {}

export interface ContentInsetProp {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

export interface WebViewNativeEvent {
  url: string;
  loading: boolean;
  title: string;
  canGoBack: boolean;
  canGoForward: boolean;
  lockIdentifier: number;
}

export interface WebViewNativeProgressEvent extends WebViewNativeEvent {
  progress: number;
}

export interface WebViewNavigation extends WebViewNativeEvent {
  navigationType:
    | 'click'
    | 'formsubmit'
    | 'backforward'
    | 'reload'
    | 'formresubmit'
    | 'other';
}

export type DecelerationRateConstant = 'normal' | 'fast';

export interface WebViewMessage extends WebViewNativeEvent {
  data: string;
}

export interface WebViewError extends WebViewNativeEvent {
  /**
   * `domain` is only used on iOS
   */
  domain?: string;
  code: number;
  description: string;
}

export type WebViewEvent = NativeSyntheticEvent<WebViewNativeEvent>;

export type WebViewProgressEvent = NativeSyntheticEvent<WebViewNativeProgressEvent>;

export type WebViewNavigationEvent = NativeSyntheticEvent<WebViewNavigation>;

export type WebViewMessageEvent = NativeSyntheticEvent<WebViewMessage>;

export type WebViewErrorEvent = NativeSyntheticEvent<WebViewError>;

export type DataDetectorTypes
  = | 'phoneNumber'
  | 'link'
  | 'address'
  | 'calendarEvent'
  | 'trackingNumber'
  | 'flightNumber'
  | 'lookupSuggestion'
  | 'none'
  | 'all';

export type OverScrollModeType = 'always' | 'content' | 'never';

export interface WebViewSourceUri {
  /**
   * The URI to load in the `WebView`. Can be a local or remote file.
   */
  uri: string;

  /**
   * The HTTP Method to use. Defaults to GET if not specified.
   * NOTE: On Android, only GET and POST are supported.
   */
  method?: string;

  /**
   * Additional HTTP headers to send with the request.
   * NOTE: On Android, this can only be used with GET requests.
   */
  headers?: Object;

  /**
   * The HTTP body to send with the request. This must be a valid
   * UTF-8 string, and will be sent exactly as specified, with no
   * additional encoding (e.g. URL-escaping or base64) applied.
   * NOTE: On Android, this can only be used with POST requests.
   */
  body?: string;
}

export interface WebViewSourceHtml {
  /**
   * A static HTML page to display in the WebView.
   */
  html: string;
  /**
   * The base URL to be used for any relative links in the HTML.
   */
  baseUrl?: string;
}

export type WebViewSource = WebViewSourceUri | WebViewSourceHtml;

export interface ViewManager {
  startLoadWithResult: Function;
}

export interface WebViewNativeConfig {
  /**
   * The native component used to render the WebView.
   */
  component?: typeof NativeWebViewIOS | typeof NativeWebViewAndroid;
  /**
   * Set props directly on the native component WebView. Enables custom props which the
   * original WebView doesn't pass through.
   */
  props?: Object;
  /**
   * Set the ViewManager to use for communication with the native side.
   * @platform ios
   */
  viewManager?: ViewManager;
}

export type OnShouldStartLoadWithRequest = (
  event: WebViewNavigation,
) => boolean;

export interface CommonNativeWebViewProps extends ViewProps {
  cacheEnabled?: boolean;
  injectedJavaScript?: string;
  mediaPlaybackRequiresUserAction?: boolean;
  messagingEnabled: boolean;
  onScroll?: (event: NativeScrollEvent) => void;
  onLoadingError: (event: WebViewErrorEvent) => void;
  onLoadingFinish: (event: WebViewNavigationEvent) => void;
  onLoadingProgress: (event: WebViewProgressEvent) => void;
  onLoadingStart: (event: WebViewNavigationEvent) => void;
  onMessage: (event: WebViewMessageEvent) => void;
  onShouldStartLoadWithRequest: (event: WebViewNavigationEvent) => void;
  scalesPageToFit?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  // TODO: find a better way to type this.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
  userAgent?: string;
}

export interface AndroidNativeWebViewProps extends CommonNativeWebViewProps {
  allowFileAccess?: boolean;
  allowUniversalAccessFromFileURLs?: boolean;
  androidHardwareAccelerationDisabled?: boolean;
  domStorageEnabled?: boolean;
  geolocationEnabled?: boolean;
  javaScriptEnabled?: boolean;
  mixedContentMode?: 'never' | 'always' | 'compatibility';
  onContentSizeChange?: (event: WebViewEvent) => void;
  overScrollMode?: OverScrollModeType;
  saveFormDataDisabled?: boolean;
  textZoom?: number;
  thirdPartyCookiesEnabled?: boolean;
  urlPrefixesForDefaultIntent?: ReadonlyArray<string>;
}

export interface IOSNativeWebViewProps extends CommonNativeWebViewProps {
  allowsBackForwardNavigationGestures?: boolean;
  allowsInlineMediaPlayback?: boolean;
  allowsLinkPreview?: boolean;
  automaticallyAdjustContentInsets?: boolean;
  bounces?: boolean;
  contentInset?: ContentInsetProp;
  dataDetectorTypes?: DataDetectorTypes | ReadonlyArray<DataDetectorTypes>;
  decelerationRate?: number;
  directionalLockEnabled?: boolean;
  hideKeyboardAccessoryView?: boolean;
  incognito?: boolean;
  pagingEnabled?: boolean;
  scrollEnabled?: boolean;
  useSharedProcessPool?: boolean;
}

export interface IOSWebViewProps extends WebViewSharedProps {
  /**
   * If true, use WKWebView instead of UIWebView.
   * @platform ios
   */
  useWebKit?: boolean;

  /**
   * Does not store any data within the lifetime of the WebView.
   */
  incognito?: boolean;

  /**
   * Boolean value that determines whether the web view bounces
   * when it reaches the edge of the content. The default value is `true`.
   * @platform ios
   */
  bounces?: boolean;

  /**
   * A floating-point number that determines how quickly the scroll view
   * decelerates after the user lifts their finger. You may also use the
   * string shortcuts `"normal"` and `"fast"` which match the underlying iOS
   * settings for `UIScrollViewDecelerationRateNormal` and
   * `UIScrollViewDecelerationRateFast` respectively:
   *
   *   - normal: 0.998
   *   - fast: 0.99 (the default for iOS web view)
   * @platform ios
   */
  decelerationRate?: DecelerationRateConstant | number;

  /**
   * Boolean value that determines whether scrolling is enabled in the
   * `WebView`. The default value is `true`.
   * @platform ios
   */
  scrollEnabled?: boolean;

  /**
   * If the value of this property is true, the scroll view stops on multiples
   * of the scroll view’s bounds when the user scrolls.
   * The default value is false.
   * @platform ios
   */
  pagingEnabled?: boolean;

  /**
   * Controls whether to adjust the content inset for web views that are
   * placed behind a navigation bar, tab bar, or toolbar. The default value
   * is `true`.
   * @platform ios
   */
  automaticallyAdjustContentInsets?: boolean;

  /**
   * The amount by which the web view content is inset from the edges of
   * the scroll view. Defaults to {top: 0, left: 0, bottom: 0, right: 0}.
   * @platform ios
   */
  contentInset?: ContentInsetProp;

  /**
   * Determines the types of data converted to clickable URLs in the web view's content.
   * By default only phone numbers are detected.
   *
   * You can provide one type or an array of many types.
   *
   * Possible values for `dataDetectorTypes` are:
   *
   * - `'phoneNumber'`
   * - `'link'`
   * - `'address'`
   * - `'calendarEvent'`
   * - `'none'`
   * - `'all'`
   *
   * With the new WebKit implementation, we have three new values:
   * - `'trackingNumber'`,
   * - `'flightNumber'`,
   * - `'lookupSuggestion'`,
   *
   * @platform ios
   */
  dataDetectorTypes?: DataDetectorTypes | ReadonlyArray<DataDetectorTypes>;

  /**
   * Boolean that determines whether HTML5 videos play inline or use the
   * native full-screen controller. The default value is `false`.
   *
   * **NOTE** : In order for video to play inline, not only does this
   * property need to be set to `true`, but the video element in the HTML
   * document must also include the `webkit-playsinline` attribute.
   * @platform ios
   */
  allowsInlineMediaPlayback?: boolean;
  /**
   * Hide the accessory view when the keyboard is open. Default is false to be
   * backward compatible.
   */
  hideKeyboardAccessoryView?: boolean;
  /**
   * A Boolean value indicating whether horizontal swipe gestures will trigger
   * back-forward list navigations.
   */
  allowsBackForwardNavigationGestures?: boolean;
  /**
   * A Boolean value indicating whether WebKit WebView should be created using a shared
   * process pool, enabling WebViews to share cookies and localStorage between each other.
   * Default is true but can be set to false for backwards compatibility.
   * @platform ios
   */
  useSharedProcessPool?: boolean;
  /**
   * The custom user agent string.
   */
  userAgent?: string;

  /**
   * A Boolean value that determines whether pressing on a link
   * displays a preview of the destination for the link.
   *
   * This property is available on devices that support 3D Touch.
   * In iOS 10 and later, the default value is `true`; before that, the default value is `false`.
   * @platform ios
   */
  allowsLinkPreview?: boolean;

  /**
   * Set true if shared cookies from HTTPCookieStorage should used for every load request in the
   * `RNCWKWebView`. The default value is `false`.
   * @platform ios
   */
  sharedCookiesEnabled?: boolean;

  /**
   * A Boolean value that determines whether scrolling is disabled in a particular direction.
   * The default value is `true`.
   * @platform ios
   */
  directionalLockEnabled?: boolean;

  /**
   * A Boolean value indicating whether web content can programmatically display the keyboard.
   *
   * When this property is set to true, the user must explicitly tap the elements in the
   * web view to display the keyboard (or other relevant input view) for that element.
   * When set to false, a focus event on an element causes the input view to be displayed
   * and associated with that element automatically.
   *
   * The default value is `true`.
   * @platform ios
   */
  keyboardDisplayRequiresUserAction?: boolean;
}

export interface AndroidWebViewProps extends WebViewSharedProps {
  onNavigationStateChange?: (event: WebViewNavigation) => void;
  onContentSizeChange?: (event: WebViewEvent) => void;

  /**
   * https://developer.android.com/reference/android/view/View#OVER_SCROLL_NEVER
   * Sets the overScrollMode. Possible values are:
   *
   * - `'always'` (default)
   * - `'content'`
   * - `'never'`
   *
   * @platform android
   */
  overScrollMode?: OverScrollModeType;

  /**
   * Sets whether Geolocation is enabled. The default is false.
   * @platform android
   */
  geolocationEnabled?: boolean;

  /**
   * Boolean that sets whether JavaScript running in the context of a file
   * scheme URL should be allowed to access content from any origin.
   * Including accessing content from other file scheme URLs
   * @platform android
   */
  allowUniversalAccessFromFileURLs?: boolean;

  /**
   * Sets whether the webview allow access to file system.
   * @platform android
   */
  allowFileAccess?: boolean;

  /**
   * Used on Android only, controls whether form autocomplete data should be saved
   * @platform android
   */
  saveFormDataDisabled?: boolean;

  /**
   * Used on Android only, controls whether the given list of URL prefixes should
   * make {@link com.facebook.react.views.webview.ReactWebViewClient} to launch a
   * default activity intent for those URL instead of loading it within the webview.
   * Use this to list URLs that WebView cannot handle, e.g. a PDF url.
   * @platform android
   */
  urlPrefixesForDefaultIntent?: ReadonlyArray<string>;

  /**
   * Boolean value to enable JavaScript in the `WebView`. Used on Android only
   * as JavaScript is enabled by default on iOS. The default value is `true`.
   * @platform android
   */
  javaScriptEnabled?: boolean;

  /**
   * Boolean value to disable Hardware Acceleration in the `WebView`. Used on Android only
   * as Hardware Acceleration is a feature only for Android. The default value is `false`.
   * @platform android
   */
  androidHardwareAccelerationDisabled?: boolean;

  /**
   * Boolean value to enable third party cookies in the `WebView`. Used on
   * Android Lollipop and above only as third party cookies are enabled by
   * default on Android Kitkat and below and on iOS. The default value is `true`.
   * @platform android
   */
  thirdPartyCookiesEnabled?: boolean;

  /**
   * Boolean value to control whether DOM Storage is enabled. Used only in
   * Android.
   * @platform android
   */
  domStorageEnabled?: boolean;

  /**
   * Sets the user-agent for the `WebView`.
   * @platform android
   */
  userAgent?: string;

  /**
   * Sets number that controls text zoom of the page in percent.
   * @platform android
   */
  textZoom?: number;

  /**
   * Specifies the mixed content mode. i.e WebView will allow a secure origin to load content from any other origin.
   *
   * Possible values for `mixedContentMode` are:
   *
   * - `'never'` (default) - WebView will not allow a secure origin to load content from an insecure origin.
   * - `'always'` - WebView will allow a secure origin to load content from any other origin, even if that origin is insecure.
   * - `'compatibility'` -  WebView will attempt to be compatible with the approach of a modern web browser with regard to mixed content.
   * @platform android
   */
  mixedContentMode?: 'never' | 'always' | 'compatibility';
}

export interface WebViewSharedProps extends ViewProps {
  /**
   * Loads static html or a uri (with optional headers) in the WebView.
   */
  source?: WebViewSource;

  /**
   * Function that returns a view to show if there's an error.
   */
  renderError?: (
    errorDomain: string | undefined,
    errorCode: number,
    errorDesc: string,
  ) => ReactElement; // view to show if there's an error

  /**
   * Function that returns a loading indicator.
   */
  renderLoading?: () => ReactElement;

  /**
   * Function that is invoked when the `WebView` scrolls.
   */
  onScroll?: (event: NativeScrollEvent) => void;

  /**
   * Function that is invoked when the `WebView` has finished loading.
   */
  onLoad?: (event: WebViewNavigationEvent) => void;

  /**
   * Function that is invoked when the `WebView` load succeeds or fails.
   */
  onLoadEnd?: (event: WebViewNavigationEvent | WebViewErrorEvent) => void;

  /**
   * Function that is invoked when the `WebView` starts loading.
   */
  onLoadStart?: (event: WebViewNavigationEvent) => void;

  /**
   * Function that is invoked when the `WebView` load fails.
   */
  onError?: (event: WebViewErrorEvent) => void;

  /**
   * Function that is invoked when the `WebView` loading starts or ends.
   */
  onNavigationStateChange?: (event: WebViewNavigation) => void;

  /**
   * Function that is invoked when the webview calls `window.ReactNativeWebView.postMessage`.
   * Setting this property will inject this global into your webview.
   *
   * `window.ReactNativeWebView.postMessage` accepts one argument, `data`, which will be
   * available on the event object, `event.nativeEvent.data`. `data` must be a string.
   */
  onMessage?: (event: WebViewMessageEvent) => void;

  /**
   * Function that is invoked when the `WebView` is loading.
   */
  onLoadProgress?: (event: WebViewProgressEvent) => void;

  /**
   * Boolean value that forces the `WebView` to show the loading view
   * on the first load.
   */
  startInLoadingState?: boolean;

  /**
   * Set this to provide JavaScript that will be injected into the web page
   * when the view loads.
   */
  injectedJavaScript?: string;

  /**
   * Boolean value that determines whether a horizontal scroll indicator is
   * shown in the `WebView`. The default value is `true`.
   */
  showsHorizontalScrollIndicator?: boolean;

  /**
   * Boolean value that determines whether a vertical scroll indicator is
   * shown in the `WebView`. The default value is `true`.
   */
  showsVerticalScrollIndicator?: boolean;

  /**
   * Boolean that controls whether the web content is scaled to fit
   * the view and enables the user to change the scale. The default value
   * is `true`.
   *
   * On iOS, when `useWebKit=true`, this prop will not work.
   */
  scalesPageToFit?: boolean;

  /**
   * Boolean that determines whether HTML5 audio and video requires the user
   * to tap them before they start playing. The default value is `true`.
   */
  mediaPlaybackRequiresUserAction?: boolean;

  /**
   * List of origin strings to allow being navigated to. The strings allow
   * wildcards and get matched against *just* the origin (not the full URL).
   * If the user taps to navigate to a new page but the new page is not in
   * this whitelist, we will open the URL in Safari.
   * The default whitelisted origins are "http://*" and "https://*".
   */
  originWhitelist?: ReadonlyArray<string>;

  /**
   * Function that allows custom handling of any web view requests. Return
   * `true` from the function to continue loading the request and `false`
   * to stop loading. The `navigationType` is always `other` on android.
   */
  onShouldStartLoadWithRequest?: OnShouldStartLoadWithRequest;

  /**
   * Override the native component used to render the WebView. Enables a custom native
   * WebView which uses the same JavaScript as the original WebView.
   */
  nativeConfig?: WebViewNativeConfig;

  /**
   * Should caching be enabled. Default is true.
   */
  cacheEnabled?: boolean;
}
