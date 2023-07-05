import { v4 as uuidv4 } from 'uuid';
// import { User } from '@indexedDB/user';
const typeName = {
  api: '新建接口',
  doc: '新建文本',
  folder: '新建目录',
  websocket: '新建websocket',
  grpc: '新建grpc',
  mysql: '新建MySQL',
  tcp: '新建TCP',
  mqtt: '新建MQTT',
  dubbo: '新建DUBBO',
  oracle: '新建ORACLE',
  sql: '新建SQL',
}
const createTarget = (type, baseCollection) => {
  switch (type) {
    case 'api':
      const api = {
        ...baseCollection,
        method: 'POST',
        mock: '{}',
        mock_url: '',
        mock_path: '', // mock 接口路径
        url: '',
        request: {
          url: '',
          method: 'POST',
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
        expects: [], // 期望集合

        is_check_result: 1, // 是否开启校验返回结果 开关
        check_result_expectId: '', // 校验期望id
        is_example: -1,
        is_locked: -1,
        is_mock_open: 1, //mock服务是否开启 1开始 2关闭
      };
      return api;
      break;
    case 'sql':
      const mysql = {
        ...baseCollection,
        method: 'MySQL',

        sql_detail: {
          sql_string: '',
          assert: [],
          regex: [],
          sql_database_info: {
            server_name: '',
            host: '',
            user: '',
            password: '',
            port: 0,
            db_name: '',
            charset: ''
          }
        },
      };
      return mysql;
      break;
    case 'tcp':
      const tcp = {
        ...baseCollection,
        method: "TCP",
        assert: [],
        regex: [],

        tcp_detail: {
          send_message: "",
          url: "",
          message_type: "json",
          tcp_config: {
            connect_type: 1,
            is_auto_send: 0,
            connect_duration_time: 10,
            send_msg_duration_time: 500,
            connect_timeout_time: 0,
            retry_num: 5,
            retry_interval: 5000,
          }
        },
      };
      return tcp;
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
        method: "WS",
        target_type: 'websocket',
        websocket_detail: {
          send_message: "",
          message_type: "json",
          url: "",
          ws_header: [],
          ws_param: [],
          ws_event: [],
          ws_config: {
            connect_type: 1,
            is_auto_send: 0,
            connect_duration_time: 10,
            send_msg_duration_time: 500,
            connect_timeout_time: 0,
            retry_num: 5,
            retry_interval: 5000
          }
        },
      };
      return websocket;
      break;
    case 'mqtt':
      const mqtt = {
        ...baseCollection,
        method: "MQTT",
        target_type: "mqtt",
        mqtt_detail: {
          topic: "",
          send_message: "",
          common_config: {
            client_name: "",
            username: "",
            password: "",
            is_encrypt: true,
            auth_file: {
              file_name: "",
              file_url: ""
            }
          },
          higher_config: {
            connect_timeout_time: 10,
            keep_alive_time: 60,
            is_auto_retry: true,
            retry_num: 5,
            retry_interval: 5000,
            mqtt_version: "5.0",
            dialogue_timeout: 0,
            is_save_message: false,
            service_quality: 0,
            send_msg_interval_time: 0
          },
          will_config: {
            will_topic: "",
            is_open_will: true,
            service_quality: 0
          }
        }
      };
      return mqtt;
      break;
    case 'dubbo':
      const dubbo = {
        ...baseCollection,
        method: "DUBBO",
        target_type: "dubbo",
        dubbo_detail: {
          api_name: "",
          function_name: "",
          dubbo_protocol: "dubbo",
          dubbo_param: [],
          dubbo_assert: [],
          dubbo_regex: [],
          dubbo_config: {
            registration_center_name: "",
            registration_center_address: "",
            version: ""
          }
        }
      }
      return dubbo;
      break;
    case 'oracle':
      const oracle = {
        ...baseCollection,
        method: "ORACLE",
        target_type: "oracle",
        oracle_detail: {
          sql_string: '',
          assert: [],
          regex: [],
          oracle_database_info: {
            server_name: '',
            host: '',
            user: '',
            password: '',
            port: 0,
            db_name: '',
            charset: ''
          }
        }
      };
      return oracle;
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
    name: type && (typeName[type] || '新建未知'),
    sort: -1,
    version: 1,
    // mark: 'developing',
    // update_day: new Date(new Date().toLocaleDateString()).getTime() / 1000, // 更新当日0点时间戳
    update_dtime: ~~(new Date().getTime() / 1000), // 更新当前时间戳
    create_dtime: ~~(new Date().getTime() / 1000), // 创建时间戳
    status: 1, // 1.正常 -1删除 -2    -99彻底删除
    env_info: {
      env_id: 0,
      env_name: '',
      service_id: 0,
      service_name: '',
      pre_url: '',
      database_id: 0,
      server_name: ''
    }
    // modifier_id: localStorage.getItem('uuid') || '-1',
  };
  return createTarget(type, baseCollection);
};

export const getExpectNew = () => {
  const EXPECT_NEW = {
    "name": "新建期望",
    "expect_id": uuidv4(),
    "conditions": [],
    "response": {
      "content_type": "json",
      "json_schema": '',
      "json": "",
      "raw": ""
    }
  }
  return EXPECT_NEW;
}