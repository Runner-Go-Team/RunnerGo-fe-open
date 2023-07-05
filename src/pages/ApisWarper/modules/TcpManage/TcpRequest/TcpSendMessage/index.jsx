import React, { useState, useEffect } from "react";
import './index.less';
import MonacoEditor from '@components/MonacoEditor';
import { debounce } from 'lodash';
import { Radio, Button } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const { Group: RadioGroup } = Radio;

const TcpSendMessage = (props) => {
    const { data: {
        tcp_detail: {
            message_type,
            send_message,
            tcp_config: {
                is_auto_send
            }
        }
    }, onChange } = props;
    const { t } = useTranslation();

    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const tcp_res = useSelector((store) => store.opens.tcp_res);

    const handleRawChange = debounce((val) => onChange('tcp_send_message', val), 500);

    const radioList = [
        {
            text: 'Binary',
            value: 'binary'
        },
        {
            text: 'Text',
            value: 'text'
        },
        {
            text: 'Json',
            value: 'json'
        },
        {
            text: 'Xml',
            value: 'xml'
        }
    ];

    const sendTcpMsg = () => {
        Bus.$emit('sendTcpMsg', message_type, send_message);
    }
    
    return (
        <div className="tcp-manage-request-send-message">
            <RadioGroup defaultValue={message_type ? message_type : 'json'} onChange={(e) => {
                onChange('tcp_message_type', e);
            }}>
                {
                    radioList.map((item, index) => (
                        <Radio value={item.value}>{item.text}</Radio>
                    ))
                }
            </RadioGroup>
            <MonacoEditor
                value={send_message ? send_message : ''}
                style={{ minHeight: 'calc(100% - 16px)' }}
                Height="85%"
                language="json"
                onChange={handleRawChange}
            />
            {
                is_auto_send === 0 ? <Button className='send-btn' disabled={(!send_message.trim()) || !(tcp_res && tcp_res[open_api_now] && tcp_res[open_api_now].status === 'running')}  onClick={sendTcpMsg}>{ t('apis.send') }</Button> : <></>
            }
        </div>
    )
};

export default TcpSendMessage;