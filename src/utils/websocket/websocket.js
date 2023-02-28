// import { isJSON, isElectron, getCookie } from '@utils';
// import { onlineStatus, isLogin } from '@utils/common';
// import Bus from '@utils/eventBus';
// import { refreshIdentity } from '@services/user';
// import { STATIC_TIME } from '@constants/websocket';
// import { RD_WEBSOCKET_URL } from '@config/index';

// export const webSocket = {};
// let WEB_SOCKET = null;
// const heartCheck = {
//   lockReconnect: false, // 避免ws重复连接
//   maxReconnectionDelay: 30 * STATIC_TIME.MINUTE,
//   minReconnectionDelay: 10 * STATIC_TIME.SECOND,
//   reconnectionDelayGrowFactor: 1.5,
//   connectionTimeout: 10 * STATIC_TIME.SECOND,
//   pongTime: 30 * STATIC_TIME.SECOND, // 30秒接收心跳
//   pingTime: ((30 * STATIC_TIME.SECOND) / 10) * 8,
//   timeoutObj: null,
//   serverTimeoutObj: null,
//   reset() {
//     // clearTimeout(this.timeoutObj);
//     clearTimeout(this.serverTimeoutObj);
//     return this;
//   },
//   PingStart() {
//     const self = this;
//     this.timeoutObj = setTimeout(function () {
//       // 这里发送一个心跳，后端收到后，返回一个心跳消息，
//       // onmessage拿到返回的心跳就说明连接正常
//       if (WEB_SOCKET != null && WEB_SOCKET.readyState === WebSocket.OPEN) {
//         WEB_SOCKET.send('PING');
//         self.PingStart();
//       }
//     }, this.pingTime); // 10秒发送一次心跳
//   },
//   PongStart() {
//     const self = this;
//     self.serverTimeoutObj = setTimeout(function () {
//       // 如果超过一定时间还没重置，说明后端主动断开了
//       if (WEB_SOCKET != null) {
//         // console.log('服务器30秒没有响应，关闭连接');
//         WEB_SOCKET.close();
//       }
//     }, self.pongTime);
//   },
// };
// // ws://8.131.62.161:8088/v5/apipost.io?  wss://ws.apipost.cn/v5/apipost.io
// webSocket.reconnect = () => {
//   if (heartCheck.lockReconnect) return;

//   heartCheck.lockReconnect = true;
//   setTimeout(function () {
//     // 没连接上会一直重连，设置延迟避免请求过多
//     webSocket.socketInit(true);
//     heartCheck.lockReconnect = false;
//   }, heartCheck.connectionTimeout);

//   if (
//     heartCheck.connectionTimeout >= heartCheck.minReconnectionDelay &&
//     heartCheck.connectionTimeout < heartCheck.maxReconnectionDelay
//   ) {
//     heartCheck.connectionTimeout *= heartCheck.reconnectionDelayGrowFactor;
//   } else {
//     heartCheck.connectionTimeout = heartCheck.minReconnectionDelay;
//   }
// };

// webSocket.socketInit = () =>
//   new Promise((resolve, reject) => {
//     const storage = window.localStorage;
//     const { identity } = storage;
//     // const token = getCookie('token');
//     if (onlineStatus() && isLogin()) {
//       if (WEB_SOCKET == null) {
//         if (!identity || identity === undefined || identity === 'NOLOGIN') {
//           webSocket.reconnect(); // 重新连接
//           resolve(true);
//         } else {
//           WEB_SOCKET = new WebSocket(
//             `${RD_WEBSOCKET_URL}?userToken=${identity}&terminal=${isElectron() ? 'client' : 'web'}`
//           );
//           WEB_SOCKET.onopen = function (evt) {
//             // console.log('连接成功，发送ping');
//             WEB_SOCKET.send('PING');
//             heartCheck.PingStart();
//             heartCheck.reset().PongStart(); // 打开心跳检测
//             resolve(true);
//           };
//           WEB_SOCKET.onerror = function (err) {
//             if (WEB_SOCKET != null) {
//               // console.log('异常，关闭连接', err);
//               WEB_SOCKET.close();
//             } else {
//               webSocket.reconnect(); // 重新连接
//             }
//             reject(err);
//           };
//           WEB_SOCKET.onmessage = function (evt) {
//             // console.log(evt);
//             heartCheck.reset().PongStart(); // 拿到任何消息都说明当前连接是正常的 心跳检测重置
//             if (WEB_SOCKET != null) {
//               let data = evt.data;
//               if (!isJSON(data)) {
//                 return;
//               }
//               try {
//                 data = JSON.parse(data);
//               } catch (error) {
//                 return;
//               }
//               Bus.$emit('websocket_worker', data);
//               // 连接达上限
//               // 参入的数据不是对象 直接返回store
//               if (data.code === 2003) {
//                 // console.log('用户超过最大连接数，将被顶掉');
//                 WEB_SOCKET.close();
//                 heartCheck.lockReconnect = true;
//               } else if (data.code === 2001) {
//                 refreshIdentity().subscribe({
//                   next(res) {
//                     if (res.code === 10000) {
//                       window.localStorage.setItem('identity', res?.data?.identity);
//                     }
//                   },
//                 });
//               }
//             }
//           };

//           WEB_SOCKET.onclose = function (evt) {
//             // console.log("Connection closed.");
//             webSocket.reconnect(); // 重新连接
//             resolve(true);
//           };
//         }
//       } else {
//         switch (WEB_SOCKET.readyState) {
//           case WebSocket.CONNECTING: // 表示正在连接。
//             // console.log("正在连接");
//             resolve(true);
//             break;
//           case WebSocket.OPEN: // 表示连接成功，可以通信了。
//             // console.log("已经连接");
//             resolve(true);
//             break;
//           case WebSocket.CLOSING: // 表示连接正在关闭。
//             // console.log("正在关闭,1秒后再次尝试连接");
//             setTimeout(() => {
//               webSocket.socketInit();
//             }, 1000);
//             resolve(true);
//             break;
//           case WebSocket.CLOSED: // 表示连接已经关闭，或者打开连接失败
//             // console.log("已经关闭,再次连接");
//             WEB_SOCKET = null;
//             webSocket.socketInit(true);
//             resolve(true);
//             break;
//           default:
//             // this never happens
//             break;
//         }
//       }
//     } else {
//       webSocket.reconnect(); // 重新连接
//       reject(false);
//     }
//   }).catch((e) => {
//     webSocket.reconnect(); // 重新连接
//   });

// // ap-body-tab-notice-panel-count
// export default { webSocket };
