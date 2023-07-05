import React, { useState, useEffect } from "react";
import './index.less';
import { Radio, Input, Checkbox } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';

const { Group: RadioGroup } = Radio;

const TcpSendConfig = (props) => {
    const { data: {
        tcp_detail: {
            tcp_config: {
                connect_type,
                is_auto_send,
                connect_duration_time,
                send_msg_duration_time,
                connect_timeout_time,
                retry_num,
                retry_interval,
            }
        }
    }, onChange } = props;
    const { t } = useTranslation();


    return (
        <div className="tcp-manage-request-send-config">
            <RadioGroup defaultValue={connect_type ? connect_type : 1} onChange={(e) => {
                onChange('tcp_config_connect_type', e);
            }}>
                <Radio value={1}>{ t('apis.tcp.connectType.1') }</Radio>
                <Radio value={2}>{ t('apis.tcp.connectType.2') }</Radio>
            </RadioGroup>
            {
                connect_type === 1 ? <div className="is-auto-send-item">
                    <Checkbox checked={Boolean(is_auto_send)} onChange={(e) => {
                        onChange('tcp_auto_send', Number(e));
                    }}>{t('apis.tcp.autoSend.label')}</Checkbox>
                    <p className="explain">{t('apis.tcp.autoSend.explain')}</p>
                </div> : <></>
            }
            <div className="item">
                <div className="item-left">
                    <p>{ t('apis.tcp.connectDuration.label') }</p>
                    <p>{ t('apis.tcp.connectDuration.explain') }</p>
                </div>
                <div className="item-right">
                    <Input value={connect_duration_time} onChange={(e) => {
                        if (`${parseInt(e)}` === `${NaN}`) {
                            onChange('tcp_connect_duration', null);
                        } else if (parseInt(e) > 100) {
                            onChange('tcp_connect_duration', 100);
                        } else {
                            onChange('tcp_connect_duration', parseInt(e));
                        }
                    }} onBlur={(e) => {
                        if (connect_duration_time === null) {
                            onChange('tcp_connect_duration', 0);
                        }
                    }} />
                </div>
            </div>
            <div className="item">
                <div className="item-left">
                    <p>{ t('apis.tcp.sendMessageInterval.label') }</p>
                    <p>{ t('apis.tcp.sendMessageInterval.explain') }</p>
                </div>
                <div className="item-right">
                    <Input value={send_msg_duration_time} onChange={(e) => {
                        if (`${parseInt(e)}` === `${NaN}`) {
                            onChange('tcp_send_message_interval', null);
                        } else {
                            onChange('tcp_send_message_interval', parseInt(e));
                        }

                    }} onBlur={(e) => {
                        if (send_msg_duration_time === null) {
                            onChange('tcp_send_message_interval', 0);
                        }
                    }} />
                </div>
            </div>
            <div className="item">
                <div className="item-left">
                    <p>{ t('apis.tcp.connectTimeout.label') }</p>
                    <p>{ t('apis.tcp.connectTimeout.explain') }</p>
                </div>
                <div className="item-right">
                    <Input value={connect_timeout_time} onChange={(e) => {
                        if (`${parseInt(e)}` === `${NaN}`) {
                            onChange('tcp_connect_timeout_time', null);
                        } else {
                            onChange('tcp_connect_timeout_time', parseInt(e));
                        }
                    }} onBlur={(e) => {
                        if (connect_timeout_time === null) {
                            onChange('tcp_connect_timeout_time', 0);
                        }
                    }} />
                </div>
            </div>
            <div className="item">
                <div className="item-left">
                    <p>{ t('apis.tcp.retryNum.label') }</p>
                    <p>{ t('apis.tcp.retryNum.explain') }</p>
                </div>
                <div className="item-right">
                    <Input value={retry_num} onChange={(e) => {
                        if (`${parseInt(e)}` === `${NaN}`) {
                            onChange('tcp_retry_num', null);
                        } else {
                            onChange('tcp_retry_num', parseInt(e));
                        }

                    }} onBlur={(e) => {
                        if (retry_num === null) {
                            onChange('tcp_retry_num', 0);
                        }
                    }} />
                </div>
            </div>
            <div className="item">
                <div className="item-left">
                    <p>{ t('apis.tcp.retryInterval.label') }</p>
                    <p>{ t('apis.tcp.retryInterval.explain') }</p>
                </div>
                <div className="item-right">
                    <Input value={retry_interval} onChange={(e) => {
                        if (`${parseInt(e)}` === `${NaN}`) {
                            onChange('tcp_retry_interval', null);
                        } else {
                            onChange('tcp_retry_interval', parseInt(e));
                        }

                    }} onBlur={(e) => {
                        if (retry_interval === null) {
                            onChange('tcp_retry_interval', 0);
                        }
                    }} />
                </div>
            </div>
        </div>
    )
};

export default TcpSendConfig;