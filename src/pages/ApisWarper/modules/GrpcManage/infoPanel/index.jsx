import React, { useState } from 'react';
import { Input, Button } from 'adesign-react';
import DescriptionModal from '@components/ApisDescription';
import ApiStatus from '@components/ApiStatus';
import ManageGroup from '@components/ManageGroup';
import { InfoPanelWrapper } from './style';

const InfoPanel = (props) => {
  const { data, onChange } = props;
  const [descVisible, setDescVisible] = useState(false);
  return (
    <>
      {descVisible && (
        <DescriptionModal
          value={data?.request?.description || ''}
          onChange={onChange}
          onCancel={() => {
            setDescVisible(false);
          }}
        ></DescriptionModal>
      )}
      <div className={InfoPanelWrapper}>
        <div className="api-name-group">
          <ApiStatus
            value={data?.mark}
            onChange={(value) => {
              onChange('mark', value);
            }}
          ></ApiStatus>
          <Input
            value={data?.name || ''}
            size="mini"
            placeholder="请输入名称"
            onChange={(value) => {
              onChange('name', value);
            }}
          />
        </div>
        <Button
          className="grpc-desc-btn apipost-blue-btn"
          size="mini"
          onClick={() => {
            setDescVisible(true);
          }}
        >
          服务说明
        </Button>
        <ManageGroup target={data} />
      </div>
    </>
  );
};

export default InfoPanel;
