import React, { useContext } from 'react';
import { Input, Button } from 'adesign-react';
import { useSelector } from 'react-redux';
// import { RD_MOCK_URL, CLIENT_MOCK_ADDRESS } from '@config/index';
import { isString } from 'lodash';
import { copyStringToClipboard } from '@utils';
import Context from '../designContext';

const Mock = (props) => {
  const { data, onChange } = useContext(Context);

  const clientAddress = useSelector((store) => store?.global?.clientAddress);
  const CURRENT_PROJECT_ID = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);
  const clientMockHost = CLIENT_MOCK_ADDRESS.replace('{CLIENT_IP_ADDRESS}', clientAddress);

  const copyLocalData = () => {
    copyStringToClipboard(
      `${clientMockHost}/${CURRENT_PROJECT_ID}${
        isString(data?.mock_url) ? `${data?.mock_url}` : ''
      }`
    );
  };
  const copyServerData = () => {
    copyStringToClipboard(
      `${RD_MOCK_URL}/${CURRENT_PROJECT_ID}${isString(data?.mock_url) ? `${data?.mock_url}` : ''}`
    );
  };

  return (
    <div className="mock-item">
      <div className="mock-url-group">
        <span className="item-name">Mock Url</span>
        <Input
          readonly
          size="mini"
          style={{ flex: 1 }}
          value={`${clientMockHost}/${CURRENT_PROJECT_ID}`}
        />
        <Input
          size="mini"
          placeholder="Mock url 相对路径"
          style={{ width: '20%' }}
          value={data?.mock_url}
          onChange={onChange.bind(null, 'mock_url')}
        />
      </div>
      <Button size="mini" onClick={copyLocalData}>
        复制本地Mock
      </Button>
      <Button size="mini" onClick={copyServerData}>
        复制云端Mock
      </Button>
      <Button
        size="mini"
        onClick={() => {
          onChange('enable_server_mock', data?.enable_server_mock > 0 ? -1 : 1);
        }}
      >
        {data?.enable_server_mock > 0 ? '关闭' : '开启'}
        云端Mock
      </Button>
    </div>
  );
};

export default Mock;
