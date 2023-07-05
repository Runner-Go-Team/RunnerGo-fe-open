import React, { useState, useEffect } from "react";
import { Checkbox, Input, InputTag } from '@arco-design/web-react';
import './index.less';
import { useTranslation } from 'react-i18next';
import { isBoolean, isNumber } from "lodash";

const CheckboxGroup = Checkbox.Group;


const Setting = (props) => {
    const { parameter, onChange } = props;
    const { t } = useTranslation();
    // 客户端名称
    const [clientName, setClientName] = useState('');
    // 是否勾选User-Agent
    const [selectUserAgent, setSelectUserAgent] = useState(true);
    // 是否勾选keep-alive
    const [selectKeepAlive, setSelectKeepAlive] = useState(true);
    // 最大空闲等待时间
    const [maxFreeWaitTime, setMaxFreeWaitTime] = useState(5);
    // 最大连接等待时间
    const [maxConnectWaitTime, setMaxConnectWaitTime] = useState(5);
    // 最大连接数
    const [maxConnectNum, setMaxConnectNum] = useState(10000);
    // 是否跟随重定向, 0: 是, 1: 否
    const [checked, setChecked] = useState(0);
    // 重定向次数
    const [redirectNum, setRedirectNum] = useState(3);
    // 请求读取超时限制
    const [reqTimeout, setReqTimeout] = useState(0);
    // 响应读取超时限制
    const [resTimeout, setResTimeout] = useState(0);

    useEffect(() => {
        if (Object.entries(parameter).length > 0) {
            const { is_redirects, redirects_num, read_time_out, write_time_out, client_name, user_agent, keep_alive, max_idle_conn_duration, max_conn_wait_timeout, max_conn_per_host } = parameter;
            setChecked(is_redirects);
            setRedirectNum(redirects_num);
            setReqTimeout(read_time_out);
            setResTimeout(write_time_out);
            // 兼容老数据
            setClientName(client_name ? client_name : '');
            setSelectUserAgent(isBoolean(user_agent) ? user_agent : true);
            setSelectKeepAlive(isBoolean(keep_alive) ? keep_alive : true);
            setMaxFreeWaitTime(isNumber(max_idle_conn_duration) ? max_idle_conn_duration : 5);
            setMaxConnectWaitTime(isNumber(max_conn_wait_timeout) ? max_conn_wait_timeout : 5);
            setMaxConnectNum(isNumber(max_conn_per_host) ? max_conn_per_host : 10000);
        }
    }, [parameter]);

    return (
        <div className="api-request-setting">
            <div className="item">
                <p className="title">{t('apis.clientName')}：</p>
                <Input
                    style={{ width: 140 }}
                    value={clientName}
                    placeholder={t('placeholder.clientName')}
                    onChange={(e) => {
                        onChange('http_api_setup', {
                            ...parameter,
                            client_name: e.trim()
                        })
                    }}
                />
                <Checkbox checked={selectUserAgent} onChange={(e) => {
                    onChange('http_api_setup', {
                        ...parameter,
                        user_agent: e,
                    });
                }}>User-Agent</Checkbox>
                <Checkbox checked={selectKeepAlive} onChange={(e) => {
                    onChange('http_api_setup', {
                        ...parameter,
                        keep_alive: e,
                    });
                }}>{ t('apis.keepAlive') }</Checkbox>
            </div>
            <div className="item">
                <p className="label">{t('apis.maxFreeWaitTime')}：</p>
                <Input style={{ width: 115 }} value={maxFreeWaitTime} placeholder="0-3600（默认5)" onChange={(e) => {
                    if (`${parseInt(e)}` === 'NaN' || (parseInt(e) < 0)) {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_idle_conn_duration: 0,
                        });
                    } else if (parseInt(e) > 3600) {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_idle_conn_duration: 3600,
                        });
                    } else {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_idle_conn_duration: parseInt(e),
                        });
                    }
                }} />
                <p>{t('apis.minute')}{maxFreeWaitTime === 0 ? t('apis.zeroExplain') : ''}</p>
            </div>
            <div className="item">
                <p className="label">{t('apis.maxConnectWaitTime')}：</p>
                <Input style={{ width: 115 }} value={maxConnectWaitTime} placeholder="0-3600（默认5)" onChange={(e) => {
                    if (`${parseInt(e)}` === 'NaN' || (parseInt(e) < 0)) {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_conn_wait_timeout: 0,
                        });
                    } else if (parseInt(e) > 3600) {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_conn_wait_timeout: 3600,
                        });
                    } else {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_conn_wait_timeout: parseInt(e),
                        });
                    }
                }} />
                <p>{t('apis.minute')}{maxConnectWaitTime === 0 ? t('apis.zeroExplain') : ''}</p>
            </div>
            <div className="item">
                <p className="label">{t('apis.maxConnectNum')}：</p>
                <Input style={{ width: 146 }} value={maxConnectNum} placeholder="0-10000（默认10000）" onChange={(e) => {
                    if (`${parseInt(e)}` === 'NaN' || (parseInt(e) < 0)) {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_conn_per_host: 0,
                        });
                    } else if (parseInt(e) > 10000) {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_conn_per_host: 10000,
                        });
                    } else {
                        onChange('http_api_setup', {
                            ...parameter,
                            max_conn_per_host: parseInt(e),
                        });
                    }
                }} />
                <p>{t('apis.number')}</p>
            </div>


            <div className="item">
                <Checkbox checked={checked === 0 ? true : false} onChange={(e) => {
                    onChange('http_api_setup', {
                        ...parameter,
                        is_redirects: e ? 0 : 1,
                    });
                }} />
                <p className="is-follow-redirect">{t('apis.followRedirect')}：</p>
                {
                    checked === 0 ? <>
                        <p className="label">{t('apis.redirectNums')}：</p>
                        <Input value={redirectNum} onChange={(e) => {
                            if (`${parseInt(e)}` === 'NaN' || (parseInt(e) < 0)) {
                                onChange('http_api_setup', {
                                    ...parameter,
                                    redirects_num: 0,
                                });
                            } else if (parseInt(e) > 99) {
                                onChange('http_api_setup', {
                                    ...parameter,
                                    redirects_num: 99,
                                });
                            } else {
                                onChange('http_api_setup', {
                                    ...parameter,
                                    redirects_num: parseInt(e),
                                });
                            }
                        }} />
                        <p>{t('apis.unit')}</p>
                    </> : <></>
                }
            </div>
            <div className="item">
                <p className="label">{t('apis.reqTimeout')}：</p>
                <Input value={reqTimeout} onChange={(e) => {
                    if (`${parseInt(e)}` === 'NaN' || (parseInt(e) < 0)) {
                        onChange('http_api_setup', {
                            ...parameter,
                            read_time_out: 0,
                        });
                    } else if (parseInt(e) > 99) {
                        onChange('http_api_setup', {
                            ...parameter,
                            read_time_out: 99,
                        });
                    } else {
                        onChange('http_api_setup', {
                            ...parameter,
                            read_time_out: parseInt(e),
                        });
                    }
                }} />
                <p>{t('apis.minute')}{reqTimeout === 0 ? t('apis.zeroExplain') : ''}</p>
            </div>
            <div className="item">
                <p className="label">{t('apis.resTimeout')}：</p>
                <Input value={resTimeout} onChange={(e) => {
                    if (`${parseInt(e)}` === 'NaN' || (parseInt(e) < 0)) {
                        onChange('http_api_setup', {
                            ...parameter,
                            write_time_out: 0
                        });
                    } else if (parseInt(e) > 99) {
                        onChange('http_api_setup', {
                            ...parameter,
                            write_time_out: 99
                        });
                    } else {
                        onChange('http_api_setup', {
                            ...parameter,
                            write_time_out: parseInt(e)
                        });
                    }
                }} />
                <p>{t('apis.minute')}{resTimeout === 0 ? t('apis.zeroExplain') : ''}</p>
            </div>
        </div>
    )
};

export default Setting;