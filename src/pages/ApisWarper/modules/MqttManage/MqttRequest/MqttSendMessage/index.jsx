import React, { useState, useEffect } from "react";
import './index.less';
import MonacoEditor from '@components/MonacoEditor';
import { debounce } from 'lodash';

const MqttSendMessage = (props) => {
    const { data, onChange } = props;

    const handleRawChange = debounce((val) => onChange('mqtt_send_message', val), 500);
    
    return (
        <div className="mqtt-manage-request-send-message">
            <MonacoEditor
                value={data ? (data.mqtt_detail ? data.mqtt_detail.send_message : '') : ''}
                style={{ minHeight: '100%' }}
                Height="100%"
                language="json"
                onChange={handleRawChange}
            />
        </div>
    )
};

export default MqttSendMessage;