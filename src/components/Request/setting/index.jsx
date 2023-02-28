import React, { useState, useEffect } from "react";
import { Checkbox, Input, InputTag } from '@arco-design/web-react';
import './index.less';
import { useTranslation } from 'react-i18next';

const Setting = (props) => {
    const { parameter, onChange } = props;
    const { t } = useTranslation();
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
            const { is_redirects, redirects_num, read_time_out, write_time_out } = parameter;
            setChecked(is_redirects);
            setRedirectNum(redirects_num);
            setReqTimeout(read_time_out);
            setResTimeout(write_time_out);
        }
    }, [parameter]);

    return (
        <div className="api-request-setting">
            <div className="item">
                <Checkbox checked={checked === 0 ? true : false} onChange={(e) => {
                    onChange('http_api_setup', {
                        ...parameter,
                        is_redirects: e ? 0 : 1,
                    });
                }} />
                <p className="is-follow-redirect">{t('apis.followRedirect')}</p>
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