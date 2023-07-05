import React, { useState, useEffect } from "react";
import './index.less';
import { Input } from '@arco-design/web-react';

const DubboConfig = (props) => {
    const { data: { dubbo_detail: { dubbo_config: { registration_center_name, registration_center_address, version } } }, onChange } = props;
    return (
        <div className="dubbo-manage-request-config">
            <div className="item">
                <div className="left">
                    <p>*</p>
                    <p>注册中心</p>
                </div>
                <Input value={registration_center_name} placeholder="请输入注册中心" onChange={(e) => {
                    onChange('dubbo_config_registration_center_name', e);
                }} />
            </div>
            <div className="item">
                <div className="left">
                    <p>*</p>
                    <p>注册中心地址</p>
                </div>
                <Input value={registration_center_address} placeholder="请输入注册中心地址" onChange={(e) => {
                    onChange('dubbo_config_registration_center_address', e);
                }} />
            </div>
            <div className="item">
                <div className="left">
                    <p></p>
                    <p>版本号</p>
                </div>
                <Input value={version} placeholder="请输入版本号" onChange={(e) => {
                    onChange('dubbo_config_version', e);
                }} />
            </div>
        </div>
    )
};

export default DubboConfig;