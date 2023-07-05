import React, { useState, useEffect } from "react";
import './index.less';
import { Input, Select } from '@arco-design/web-react';
import { IconDelete, IconSearch } from '@arco-design/web-react/icon';

const { Option } = Select;

const MqttResponse = () => {
    return (
        <div className="mqtt-manage-response">
            <div className="mqtt-manage-response-header">
                <p className="title">消息列表</p>
                <Input prefix={<IconSearch />} />
                <Select>
                    <Option>全部消息</Option>
                </Select>
                <div className="clear-message">
                    <IconDelete />
                    <p>清除消息</p>
                </div>
            </div>
        </div>
    )
};

export default MqttResponse;