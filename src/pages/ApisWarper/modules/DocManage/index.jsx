import React from 'react';
import { Input, Button, Message } from 'adesign-react';
import cn from 'classnames';
import ApiStatus from '@components/ApiStatus';
import ManageGroup from '@components/ManageGroup';
import Markdown from '@components/MarkDown';
import Bus from '@utils/eventBus';
import { DocWrapper } from './style';
import { ApiHeaderWrapper } from '../../style';

const DocManage = (props) => {
  const { data, onChange } = props;

  const handleSaceDoc = () => {
    Bus.$emit('saveTargetById', {
      id: data?.target_id,
      callback: () => {
        Message('success', '保存成功');
      },
    });
  };

  return (
    <div className={DocWrapper}>
      <div className={cn(ApiHeaderWrapper, 'doc-header')}>
        <div className="doc-header-top">
          <ApiStatus
            value={data?.mark || 'developing'}
            onChange={(val) => {
              onChange('mark', val);
            }}
          ></ApiStatus>
          <ManageGroup target={data} />
        </div>
        <div className="doc-header-input">
          <Input
            value={data?.name || ''}
            onChange={(val) => {
              onChange('name', val);
            }}
          />
        </div>
      </div>
      <div className="markdown-box">
        <Markdown
          key={`doc${data?.update_dtime}`}
          value={data?.request?.description || ''}
          onChange={(val) => {
            onChange('description', val);
          }}
        ></Markdown>
      </div>
    </div>
  );
};

export default DocManage;
