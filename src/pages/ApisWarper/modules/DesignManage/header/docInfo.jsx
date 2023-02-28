import React, { useContext } from 'react';
import { Input, Button, Message } from 'adesign-react';
import dayjs from 'dayjs';
import { isNumber, isString } from 'lodash';
import Bus from '@utils/eventBus';
import Content from '../designContext';

const DocInfo = (props) => {
  const { data, onChange } = useContext(Content);

  return (
    <>
      <div className="apis-name">
        <Input
          placeholder="请输入接口名称"
          size="mini"
          value={data?.name}
          onChange={onChange.bind(null, 'name')}
        />
        <Button
          size="mini"
          type="primary"
          onClick={() => {
            Bus.$emit('saveTargetById', {
              id: data?.target_id,
              callback: () => {
                Message('success', '保存成功');
              },
            });
          }}
        >
          保存
        </Button>
      </div>
      <div className="user-msg">
        {/* 创建人：
        <img className="avatar" src="" alt="" /> */}
        更新时间：{' '}
        {isString(data?.update_dtime) ||
          (isNumber(data?.update_dtime) &&
            dayjs(data.update_dtime * 1000).format('YYYY-MM-DD HH:mm:ss'))}
      </div>
    </>
  );
};

export default DocInfo;
