import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
// import WebView from 'react-native-android-fullscreen-webview-video';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  video: {
    width: '100%',
    minHeight: 250,
  }
})

class YoutubeVideo extends Component {

  onVideoStartedPlaying = () => {
    if (this.props.onVideoStartedPlaying) this.props.onVideoStartedPlaying();
    console.log("---VIDEO STARTED PLAYING---");
  }
  onVideoPaused = () => {
    if (this.props.onVideoPaused) this.props.onVideoPaused();
    console.log("---VIDEO PAUSED---");
  }
  onVideoBuffering = () => {
    if (this.props.onVideoBuffering) this.props.onVideoBuffering();
    console.log("---VIDEO BUFFERING---");
  }
  onVideoCued = () => {
    if (this.props.onVideoCued) this.props.onVideoCued();
    console.log('---VIDEO CUED---');
  }
  onVideoEnded = () => {
    if (this.props.onVideoEnded) this.props.onVideoEnded();
    console.log('---VIDEO ENDED---');
  }
  onVideoError = () => {
    if (this.props.onVideoError) this.props.onVideoError();
    console.log('---VIDEO ERROR---');
  }
  onVideoPlayerReady = () => {
    if (this.props.onVideoPlayerReady) this.props.onVideoPlayerReady();
    console.log('---VIDEO PLAYER READY---');
  }

  // 0 - video ended
  // 1 - video started playing
  // 2 - video paused
  // 3 - video buffering
  // 4 - video error
  // 5 - video cued
  // 6 - video player ready
  handleMessage = (evt) => {
    console.log("RECEIVED EVENT FROM VIDEO", evt.nativeEvent);
    switch(evt.nativeEvent.data) {
      case "0":
        return this.onVideoEnded();
      case "1":
        return this.onVideoStartedPlaying();
      case "2":
        return this.onVideoPaused();
      case "3":
        return this.onVideoBuffering();
      case "4":
        return this.onVideoError();
      case "5":
        return this.onVideoCued();
      case "6":
        return this.onVideoPlayerReady();
    }
  }

  // prevent navigation in webview
  navigationStateChangedHandler = ({url}) => {
    // if ((url.startsWith('https://') || url.startsWith('http://')) && url !== this.props.url) {
    //   this.webview && this.webview.stopLoading();
    // }
  }

  render() {
    return (
      <View style={styles.container}>
          <WebView
              ref={(c) => { this.webview = c }}
              style={styles.video}
              javaScriptEnabled={true}
              originWhitelist={['*']}
              onMessage={this.handleMessage}
              domStorageEnabled={true}
              mixedContentMode={'always'}
              thirdPartyCookiesEnabled={true}
              allowUniversalAccessFromFileURLs={true}
              onNavigationStateChange={this.navigationStateChangedHandler}

              html={`<html style="margin: 0; padding: 0; border: none;">
                  <body style="margin: 0; padding: 0; border: none;">
                    <div id="player" style="margin: 0; width: 100%; heigth: 100%; position: absolute; top: 0; bottom: 0;"></div>
                    <script type="text/javascript">
                      function sendMessage (data) {
                       window.ReactNativeWebView.postMessage(data.toString())
                      }

                      var player;
                      function onYouTubeIframeAPIReady() {
                        sendMessage("YOUTUBE INIT");
                        player = new YT.Player('player', {
                          height: '100%',
                          width: '100%',
                          videoId: '${this.props.id}',
                          fs: 1,
                          events: {
                            'onReady': onPlayerReady,
                            'onError': onPlayerError,
                            'onStateChange': onPlayerStateChange
                          }
                        });
                      }

                      function onPlayerStateChange(event) {
                        sendMessage(event.data);
                      }
                      function onPlayerReady(event) {
                        sendMessage("6");
                      }
                      function onPlayerError(event) {
                        sendMessage("4");
                      }
                    </script>
                   <script type="text/javascript" src="http://www.youtube.com/iframe_api"></script>
                  </body>
                </html>`}
          />
      </View>
    )
  }
}

YoutubeVideo.propTypes = {
  id: PropTypes.string, // youtube video id
  onVideoEnded: PropTypes.func,
  onVideoStartedPlaying: PropTypes.func,
  onVideoCued: PropTypes.func,
  onVideoBuffering: PropTypes.func,
  onVideoPaused: PropTypes.func,
  onVideoError: PropTypes.func,
  onVideoPlayerReady: PropTypes.func
}


export default YoutubeVideo
