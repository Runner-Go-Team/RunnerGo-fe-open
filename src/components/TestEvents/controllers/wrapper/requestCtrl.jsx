import React from 'react';
import RequestPanel from '@busModules/Request/requestPanel';
import ResponsePanel from '@busModules/response/responsePanel';
import ApiURLPanel from '@pages/Apis/ApiManage/urlPanel';

const RequestCtrl = () => {
  const data = {
    parent_id: '0',
    project_id: '724c194b-303e-4c23-d450-eef895f57f62',
    target_id: 'c003f3ce-4e63-4c56-ba9b-3a66b80c1cde',
    target_type: 'api',
    name: '新建接口',
    sort: 17,
    version: 1,
    mark: 'developing',
    update_day: 1658246400000,
    update_dtime: 1658311013,
    create_dtime: 1658240896,
    status: 1,
    modifier_id: 'UF30JAAED4B6',
    method: 'POST',
    mock: '{}',
    mock_url: '',
    url: '',
    request: {
      url: '',
      description: '',
      auth: {
        type: 'noauth',
        kv: { key: '', value: '' },
        bearer: { key: '' },
        basic: { username: '', password: '' },
      },
      body: { mode: 'none', parameter: [], raw: '', raw_para: [] },
      event: { pre_script: '', test: '' },
      header: {
        parameter: [
          {
            description: '',
            field_type: 'String',
            is_checked: 1,
            key: '',
            value: '',
            not_null: 1,
            type: 'Text',
          },
          {
            description: '',
            field_type: 'String',
            is_checked: 1,
            key: '',
            value: '',
            not_null: 1,
            type: 'Text',
            static: true,
          },
        ],
      },
      query: { parameter: [] },
      cookie: { parameter: [] },
      resful: { parameter: [] },
    },
    response: { success: { expectId: '', raw: '', parameter: [] } },
    expect: {},
    is_example: -1,
    is_locked: -1,
    is_changed: -1,
    is_socket: 1,
  };

  const tempData = {};

  const onChange = (type, value, extension) => {

  };

  return (
    <div>
      <div>
        <ApiURLPanel data={data || {}} onChange={onChange}></ApiURLPanel>
      </div>
      <div className="top">
        <RequestPanel data={data?.request || {}} onChange={onChange} />
      </div>
      {/* <div className="bottom">
        <ResponsePanel tempData={tempData || {}} data={data || {}} onChange={onChange} />
      </div> */}
    </div>
  );
};

export default RequestCtrl;
