import React, { useState, useEffect } from "react";
import './index.less';
import MonacoEditor from '@components/MonacoEditor';
import { debounce } from 'lodash';
import { Radio, Button } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const { Group: RadioGroup } = Radio;

const WsSendMessage = (props) => {
    const { data: {
        websocket_detail: {
            message_type,
            send_message,
            ws_config: {
                is_auto_send
            }
        }
    }, onChange } = props;
    const { t } = useTranslation();

    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const ws_res = useSelector((store) => store.opens.ws_res);

    const handleRawChange = debounce((val) => onChange('ws_send_message', val), 500);

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

    const sendWsMsg = () => {
        Bus.$emit('sendWsMsg', message_type, send_message);
    }

    return (
        <div className="ws-manage-request-send-message">
            <RadioGroup defaultValue={message_type ? message_type : 'json'} onChange={(e) => {
                onChange('ws_message_type', e);
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
                is_auto_send === 0 ? <Button disabled={(!send_message.trim()) || !(ws_res && ws_res[open_api_now] && ws_res[open_api_now].status === 'running')} className='send-btn' onClick={sendWsMsg}>{ t('apis.send') }</Button> : <></>
            }
        </div>
    )
};

export default WsSendMessage;