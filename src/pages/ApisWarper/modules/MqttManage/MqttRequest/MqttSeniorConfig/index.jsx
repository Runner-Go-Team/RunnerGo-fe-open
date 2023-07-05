import React, { useState, useEffect } from "react";
import './index.less';
import { Input, Checkbox, Select, Radio } from '@arco-design/web-react';

const { Group: RadioGroup } = Radio;

const { Option } = Select;

const MqttSeniorConfig = (props) => {
    const { data: { 
        mqtt_detail: { 
            higher_config: {
                connect_timeout_time,
                keep_alive_time,
                is_auto_retry,
                retry_num,
                retry_interval,
                mqtt_version,
                dialogue_timeout,
                is_save_message,
                service_quality,
                send_msg_interval_time
            }
        } 
    }, onChange } = props;
    return (
        <div className="mqtt-manage-request-senior">
            <div className="item">
                <p className="label">连接超时时长：</p>
                <Input value={connect_timeout_time ? connect_timeout_time : null} onChange={(e) => {
                    onChange('mqtt_connect_timeout_time', parseInt(e));
                }} />
                <p className="suffix">秒（默认为10，最大100）</p>
            </div>
            <div className="item">
                <p className="label">keep-alive时长：</p>
                <Input value={keep_alive_time ? keep_alive_time : null} onChange={(e) => {
                    onChange('mqtt_keep_alive_time', parseInt(e));
                }} />
                <p className="suffix">秒（默认为60，最大1000）</p>
            </div>
            <div className="item">
                <Checkbox value={is_auto_retry ? is_auto_retry : true} onChange={(e) => {
                    onChange('mqtt_is_auto_retry', e);
                }}>自动重连</Checkbox>
            </div>
            <div className="item">
                <p className="label">重连次数：</p>
                <Input value={retry_num ? retry_num : null} onChange={(e) => {
                    onChange('mqtt_retry_num', parseInt(e));
                }} />
                <p className="suffix">秒（默认为5，最大20）</p>
            </div>
            <div className="item">
                <p className="label">重连间隔时间：</p>
                <Input value={retry_interval ? retry_interval : null} onChange={(e) => {
                    onChange('mqtt_retry_interval', parseInt(e));
                }} />
                <p className="suffix">秒（默认为5000，最大10000）</p>
            </div>
            <div className="item">
                <p className="label">MQTT版本：</p>
                <Select value={mqtt_version ? mqtt_version : '5.0'} onChange={(e) => {
                    onChange('mqtt_mqtt_version', e);
                }}>
                    <Option key='5.0' value='5.0'>5.0</Option>
                </Select>
            </div>
            <div className="item">
                <p className="label">会话过期时间：</p>
                <Input value={dialogue_timeout ? dialogue_timeout : null} onChange={(e) => {
                    onChange('mqtt_dialogue_timeout', e);
                }} />
                <p className="suffix">秒（默认为空）</p>
            </div>
            <div className="item">
                <Checkbox value={is_save_message ? is_save_message : true} onChange={(e) => {
                    onChange('mqtt_is_save_message', e);
                }}>是否保留消息</Checkbox>
            </div>
            <div className="item">
                <p className="label">服务质量：</p>
                <RadioGroup value={service_quality ? service_quality : 0} onChange={(e) => {
                    onChange('mqtt_service_quality', e);
                }}>
                    <Radio value={0}>至多一次</Radio>
                    <Radio value={1}>至少一次</Radio>
                    <Radio value={2}>确保只有一次</Radio>
                </RadioGroup>
            </div>
            <div className="item">
                <p className="label">发送消息间隔时间：</p>
                <Input value={send_msg_interval_time ? send_msg_interval_time : null} onChange={(e) => {
                    onChange('mqtt_send_msg_interval_time', parseInt(e));
                }} />
                <p className="suffix">秒（默认为0，最大不能大于keep-alive）</p>
            </div>
        </div>
    )
};

export default MqttSeniorConfig;