import { v4 as uuidv4 } from 'uuid';
import DayJs from 'dayjs';

export const getBaseProject = () => {
  const uuid = localStorage.getItem('uuid') || '-1';
  const project_id = uuidv4();
  const baseProject = {
    id: `${project_id}/${uuid}`,
    is_default: 1,
    is_lock: -1,
    is_manager: 1,
    is_push: -1,
    name: '新建项目',
    project_id,
    create_dtime: DayJs().unix(),
    role: 2, // 1.只读  2.写
    team_id: '-1',
    uuid,
    details: {
      request: {
        auth: {
          type: 'noauth',
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
        },
        query: [],
        header: [],
        body: [],
      },
      markList: [
        { key: 'developing', name: '开发中', color: '#3A86FF', is_default: true },
        { key: 'complated', name: '已完成', color: '#2BA58F', is_default: true },
        { key: 'modifying', name: '需修改', color: '#EC4646', is_default: true },
      ],
      script: {
        pre_script: '',
        pre_script_switch: 1,
        test: '',
        test_switch: 1,
      },
    },
  };
  return baseProject;
};

export const getBaseEnv = (project_id) => {
  const env_id = uuidv4();
  const baseProject = {
    env_id,
    id: `${project_id}/${env_id}`,
    list: {},
    name: '新建环境',
    pre_url: '',
    project_id,
    version: 1,
  };
  return baseProject;
};
