import { v4 as uuidv4 } from 'uuid';
// import { User } from '@indexedDB/user';

const createTarget = (type, baseCollection) => {
  switch (type) {
    case 'api':
      const api = {
        ...baseCollection,
        method: 'POST',
        mock: '{}',
        mock_url: '',
        url: '',
        request: {
          url: '',
          description: '', // 接口说明 接口描述 针对整个接口
          auth: {
            type: 'noauth', // 认证类型  noauth无需认证 kv私密键值对 bearer认证 basic认证
            kv: {
              key: '',
              value: '',
            },
            bearer: {
              key: '',
            },
            basic: {
              username: '',
              password: '',
            },
            digest: {
              username: '',
              password: '',
              realm: '',
              nonce: '',
              algorithm: '',
              qop: '',
              nc: '',
              cnonce: '',
              opaque: '',
            },
            hawk: {
              authId: '',
              authKey: '',
              algorithm: '',
              user: '',
              nonce: '',
              extraData: '',
              app: '',
              delegation: '',
              timestamp: '',
              includePayloadHash: -1,
            },
            awsv4: {
              accessKey: '',
              secretKey: '',
              region: '',
              service: '',
              sessionToken: '',
              addAuthDataToQuery: -1,
            },
            ntlm: {
              username: '',
              password: '',
              domain: '',
              workstation: '',
              disableRetryRequest: 1,
            },
            edgegrid: {
              accessToken: '',
              clientToken: '',
              clientSecret: '',
              nonce: '',
              timestamp: '',
              baseURi: '',
              headersToSign: '',
            },
            oauth1: {
              consumerKey: '',
              consumerSecret: '',
              signatureMethod: '',
              addEmptyParamsToSign: -1,
              includeBodyHash: -1,
              addParamsToHeader: -1,
              realm: '',
              version: '1.0',
              nonce: '',
              timestamp: '',
              verifier: '',
              callback: '',
              tokenSecret: '',
              token: '',
            },
            bidirectional: {
              ca_cert: '',
              ca_cert_name: ''
            }
          },
          body: {
            mode: 'none', // body 参数类型 none/form-data / urlencoded / json /xml /plain/html
            parameter: [],
            raw: '', // body参数类型为  json /xml /plain/html时的实际参数
            raw_para: [],
          },
          event: {
            pre_script: '', // 预执行脚本
            test: '', // 后执行脚本
          },
          header: {
            parameter: [],
          },
          query: {
            parameter: [],
          },
          cookie: {
            parameter: [],
          },
          resful: {
            parameter: [],
          },
        },
        response: {
          // 响应
          success: {
            // 成功响应示例 注：后期做成自定义响应示例
            raw: '', // 实际响应内容
            parameter: [],
            expect: {},
          },
          error: {
            raw: '',
            parameter: [],
            expect: {},
          },
        },
        assert: [],
        regex: [],
        http_api_setup: {
          is_redirects: 0,
          redirects_num: 3,
          read_time_out: 0,
          write_time_out: 0,
          client_name: '',
          user_agent: true,
          keep_alive: true,
          max_idle_conn_duration: 5,
          max_conn_wait_timeout: 5,
          max_conn_per_host: 10000
        },
        is_check_result: 1, // 是否开启校验返回结果 开关
        check_result_expectId: '', // 校验期望id
        is_example: -1,
        is_locked: -1,
      };
      return api;
      break;
    case 'doc':
      const doc = {
        ...baseCollection,
        request: {
          description: '',
        },
      };
      return doc;
      break;
    case 'folder':
      const folder = {
        ...baseCollection,
        script: {
          pre_script: '',
          // pre_script_switch: 1,
          test: '',
          // test_switch: 1,
        },
        request: {
          header: [],
          query: [],
          description: '',
          auth: {
            type: 'noauth', // 认证类型  noauth无需认证 kv私密键值对 bearer认证 basic认证
            kv: {
              key: '',
              value: '',
            },
            bearer: {
              key: '',
            },
            basic: {
              username: '',
              password: '',
            },
            // digest: {
            //   username: '',
            //   password: '',
            //   realm: '',
            //   nonce: '',
            //   algorithm: '',
            //   qop: '',
            //   nc: '',
            //   cnonce: '',
            //   opaque: '',
            // },
            // hawk: {
            //   authId: '',
            //   authKey: '',
            //   algorithm: '',
            //   user: '',
            //   nonce: '',
            //   extraData: '',
            //   app: '',
            //   delegation: '',
            //   timestamp: '',
            //   includePayloadHash: -1,
            // },
            // awsv4: {
            //   accessKey: '',
            //   secretKey: '',
            //   region: '',
            //   service: '',
            //   sessionToken: '',
            //   addAuthDataToQuery: -1,
            // },
            // ntlm: {
            //   username: '',
            //   password: '',
            //   domain: '',
            //   workstation: '',
            //   disableRetryRequest: 1,
            // },
            // edgegrid: {
            //   accessToken: '',
            //   clientToken: '',
            //   clientSecret: '',
            //   nonce: '',
            //   timestamp: '',
            //   baseURi: '',
            //   headersToSign: '',
            // },
            // oauth1: {
            //   consumerKey: '',
            //   consumerSecret: '',
            //   signatureMethod: '',
            //   addEmptyParamsToSign: -1,
            //   includeBodyHash: -1,
            //   addParamsToHeader: -1,
            //   realm: '',
            //   version: '1.0',
            //   nonce: '',
            //   timestamp: '',
            //   verifier: '',
            //   callback: '',
            //   tokenSecret: '',
            //   token: '',
            // },
          },
          url: '',
          body: {
            mode: 'none', // body 参数类型 none/form-data / urlencoded / json /xml /plain/html
            parameter: [],
            raw: '', // body参数类型为  json /xml /plain/html时的实际参数
            raw_para: [],
          },
        },
      };
      return folder;
      break;
    case 'websocket':
      const websocket = {
        ...baseCollection,
        method: 'Raw',
        request: {
          header: {
            parameter: [],
          },
          query: {
            parameter: [],
          },
          url: '',
          description: '',
        },
        socketConfig: {
          informationSize: 5, // 最大可接收内容大小，单位（MB），0表示不限制
          reconnectNum: 0, // 链接意外断开时，最大重新尝试链接次数
          reconnectTime: 5000, // 重连时间间隔，单位毫秒
          shakeHandsPath: '/socket.io', // 设置握手期间应使用的服务器路径
          shakeHandsTimeOut: 0, // 链接超时等待时长，毫秒为单位，0表示用不超时
          socketEventName: '', // 发送事件名
          socketIoEventListeners: [], // 后端事件监听列表
          socketIoVersion: 'v3', // method为Socket.IO类型时，用于链接服务器所使用的客户端版本
        },
        message: '', // 发送消息内容
        messageType: 'Text', // 发送消息类型 Text/Json/Xml/Base64/Hexadecimal
      };
      return websocket;
      break;
    case 'grpc':
      const grpc = {
        ...baseCollection,
        protos: {},
        request: {
          description: '',
        },
      };
      return grpc;
      break;
    
    case 'scene':
      const scene = {
        ...baseCollection,
        script: {
          pre_script: '',
          // pre_script_switch: 1,
          test: '',
          // test_switch: 1,
        },
        request: {
          header: [],
          query: [],
          description: '',
          auth: {
            type: 'noauth', // 认证类型  noauth无需认证 kv私密键值对 bearer认证 basic认证
            kv: {
              key: '',
              value: '',
            },
            bearer: {
              key: '',
            },
            basic: {
              username: '',
              password: '',
            },
            // digest: {
            //   username: '',
            //   password: '',
            //   realm: '',
            //   nonce: '',
            //   algorithm: '',
            //   qop: '',
            //   nc: '',
            //   cnonce: '',
            //   opaque: '',
            // },
            // hawk: {
            //   authId: '',
            //   authKey: '',
            //   algorithm: '',
            //   user: '',
            //   nonce: '',
            //   extraData: '',
            //   app: '',
            //   delegation: '',
            //   timestamp: '',
            //   includePayloadHash: -1,
            // },
            // awsv4: {
            //   accessKey: '',
            //   secretKey: '',
            //   region: '',
            //   service: '',
            //   sessionToken: '',
            //   addAuthDataToQuery: -1,
            // },
            // ntlm: {
            //   username: '',
            //   password: '',
            //   domain: '',
            //   workstation: '',
            //   disableRetryRequest: 1,
            // },
            // edgegrid: {
            //   accessToken: '',
            //   clientToken: '',
            //   clientSecret: '',
            //   nonce: '',
            //   timestamp: '',
            //   baseURi: '',
            //   headersToSign: '',
            // },
            // oauth1: {
            //   consumerKey: '',
            //   consumerSecret: '',
            //   signatureMethod: '',
            //   addEmptyParamsToSign: -1,
            //   includeBodyHash: -1,
            //   addParamsToHeader: -1,
            //   realm: '',
            //   version: '1.0',
            //   nonce: '',
            //   timestamp: '',
            //   verifier: '',
            //   callback: '',
            //   tokenSecret: '',
            //   token: '',
            // },
          },
          url: '',
          body: {
            mode: 'none', // body 参数类型 none/form-data / urlencoded / json /xml /plain/html
            parameter: [],
            raw: '', // body参数类型为  json /xml /plain/html时的实际参数
            raw_para: [],
          },
        },
      };
      return scene;
      default:
      return baseCollection;
      break;
  }
};

export const getBaseCollection = (type) => {
  const baseCollection = {
    parent_id: '0',
    // project_id: '-1',
    target_id: uuidv4(),
    target_type: type,
    name:
      type && type === 'api'
        ? '新建接口'
        : type === 'doc'
        ? '新建文本'
        : type === 'folder'
        ? '新建目录'
        : type === 'websocket'
        ? '新建websocket'
        : type === 'grpc'
        ? '新建grpc'
        : '新建未知',
    sort: -1,
    version: 1,
    // mark: 'developing',
    // update_day: new Date(new Date().toLocaleDateString()).getTime() / 1000, // 更新当日0点时间戳
    update_dtime: ~~(new Date().getTime() / 1000), // 更新当前时间戳
    create_dtime: ~~(new Date().getTime() / 1000), // 创建时间戳
    status: 1, // 1.正常 -1删除 -2    -99彻底删除
    // modifier_id: localStorage.getItem('uuid') || '-1',
  };
  return createTarget(type, baseCollection);
};
