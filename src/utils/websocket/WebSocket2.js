import { STATIC_TIME } from '@constants/websocket';
import { onlineStatus } from '@utils/common';
import Bus, { useEventBus } from '@utils/eventBus';
import { getCookie } from '@utils';

class WebSocket2 {
  WEB_SOCKET;

  lockReconnect;

  maxReconnectionDelay;

  reconnectionDelayGrowFactor;

  connectionTimeout;

  pongTime;

  pingTime;

  timeoutObj;

  serverTimeoutObj;

  minReconnectionDelay;

  constructor() {
    this.lockReconnect = false; // 避免ws重复连接
    this.maxReconnectionDelay = 30 * STATIC_TIME.MINUTE;
    this.minReconnectionDelay = 10 * STATIC_TIME.SECOND;
    this.reconnectionDelayGrowFactor = 1.5;
    this.connectionTimeout = 10 * STATIC_TIME.SECOND;
    this.pongTime = 150 * STATIC_TIME.SECOND; // 150秒接收心跳
    this.pingTime = 10 * STATIC_TIME.SECOND;
    this.timeoutObj = null;
    this.serverTimeoutObj = null;
    this.WEB_SOCKET = null;
  }

  reconnect(url) {
    const that = this;
    if (that.lockReconnect) return;

    that.lockReconnect = true;
    setTimeout(function () {
      // 没连接上会一直重连，设置延迟避免请求过多
      that.connect(url);
      that.lockReconnect = false;
    }, that.connectionTimeout);

    if (
      that.connectionTimeout >= that.minReconnectionDelay &&
      that.connectionTimeout < that.maxReconnectionDelay
    ) {
      that.connectionTimeout *= that.reconnectionDelayGrowFactor;
    } else {
      that.connectionTimeout = that.minReconnectionDelay;
    }
  }

  connect(url) {
    try {
      return new Promise((resolve, reject) => {
        const that = this;
        if (onlineStatus() && getCookie('token')) {
          if (that.WEB_SOCKET == null) {
            that.WEB_SOCKET = new WebSocket(url);
            that.WEB_SOCKET.onopen = function () {
              that.WEB_SOCKET.send(JSON.stringify({
                route_url: "start_heartbeat",
                param: JSON.stringify({
                  token: getCookie('token')
                })
              }));
              that.PingStart();
              that.reset().PongStart(); // 打开心跳检测
              resolve(that.WEB_SOCKET);
              Bus.$emit('websocket_change_state', true);
            };
            that.WEB_SOCKET.onerror = function (err) {
              if (that.WEB_SOCKET != null) {
                that.WEB_SOCKET.close();
              } else {
                that.reconnect(url); // 重新连接
              }
              reject(err);
            };
            that.WEB_SOCKET.onmessage = function ({ data }) {
              Bus.$emit('websocket_worker', JSON.parse(data));
              that.reset().PongStart(); // 拿到任何消息都说明当前连接是正常的 心跳检测重置
            };

            that.WEB_SOCKET.onclose = function () {
              that.reconnect(url); // 重新连接
              resolve(true);
            };
          } else {
            switch (that.WEB_SOCKET.readyState) {
              case WebSocket.CONNECTING: // 表示正在连接。
                resolve(true);
                break;
              case WebSocket.OPEN: // 表示连接成功，可以通信了。
                resolve(true);
                break;
              case WebSocket.CLOSING: // 表示连接正在关闭。
                setTimeout(() => {
                  that.connect(url);
                }, 1000);
                resolve(true);
                break;
              case WebSocket.CLOSED: // 表示连接已经关闭，或者打开连接失败
                that.WEB_SOCKET = null;
                that.connect(url);
                resolve(true);
                break;
              default:
                // that never happens
                break;
            }
          }
        } else {
          that.reconnect(url); // 重新连接
          reject(false);
        }
      });
    } catch (e) {
      this.reconnect(url); // 重新连接
    }
  }

  close() {
    clearInterval(this.serverTimeoutObj);
    clearInterval(this.timeoutObj);
    this.WEB_SOCKET?.close();
    Bus.$emit('websocket_change_state', false);
  }

  reset() {
    // clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  }

  PingStart() {
    const that = this;
    this.timeoutObj = setTimeout(function () {
      // 这里发送一个心跳，后端收到后，返回一个心跳消息，
      // onmessage拿到返回的心跳就说明连接正常
      if (that.WEB_SOCKET != null && that.WEB_SOCKET.readyState === WebSocket.OPEN) {
        that.WEB_SOCKET.send(JSON.stringify({
          route_url: "start_heartbeat",
          param: JSON.stringify({
            token: getCookie('token'),
            team_id: localStorage.getItem('team_id')
          })
        }));
        that.PingStart();
      }
    }, that.pingTime); // 10秒发送一次心跳
  }

  PongStart() {
    const that = this;
    that.serverTimeoutObj = setTimeout(function () {
      // 如果超过一定时间还没重置，说明后端主动断开了
      if (that.WEB_SOCKET != null) {
        that.WEB_SOCKET.close();
      }
    }, that.pongTime);
  }

  Send(data) {
    const that = this;
    if (that.WEB_SOCKET !== null && that.WEB_SOCKET.readyState === WebSocket.OPEN) {
      // data在传过来之前先用JSON.stringify转一下
      that.WEB_SOCKET.send(data);
    }
  }
}

export default WebSocket2;
