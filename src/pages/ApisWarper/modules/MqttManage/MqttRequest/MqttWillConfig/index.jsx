import React, { useState, useEffect } from "react";
import './index.less';
import { Input, Checkbox, Radio } from "@arco-design/web-react";

const { Group: RadioGroup } = Radio;

const MqttWillConfig = (props) => {
    const { data: { 
        mqtt_detail: { 
            will_config: {
                topic,
                is_open_will,
                service_quality
            }
        } 
    }, onChange } = props;
    return (
        <div className="mqtt-manage-request-will">
            <div className="item">
                <p className="label">遗愿主题：</p>
                <Input value={topic ? topic : ''} onChange={(e) => {
                    onChange('mqtt_will_topic', e);
                }} />
                <Checkbox value={is_open_will ? is_open_will : true} onChange={(e) => {
                    onChange('mqtt_is_open_will', e);
                }}>开启遗愿</Checkbox>
            </div>
            <div className="item">
                <p className="label">服务质量：</p>
                <RadioGroup value={service_quality ? service_quality : 0} onChange={(e) => {
                    onChange('mqtt_will_service_quality', e);
                }}>
                    <Radio value={0}>至多一次</Radio>
                    <Radio value={1}>至少一次</Radio>
                    <Radio value={2}>确保只有一次</Radio>
                </RadioGroup>
            </div>
        </div>
    )
};

export default MqttWillConfig;