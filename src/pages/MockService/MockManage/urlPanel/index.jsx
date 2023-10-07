import React, { useRef, useState, useEffect } from 'react';
import { Input, Select, Button, Message, Modal, Tooltip } from 'adesign-react';
import {
    Down as SvgDown,
    Search as SvgSearch,
    Copy as SvgCopy,
    Iconeye as SvgEye,
    Delete as SvgDelete
} from 'adesign-react/icons';
import { API_METHODS } from '@constants/methods';
import isFunction from 'lodash/isFunction';
import UrlInput from './urlInput';
import { useSelector, useDispatch } from 'react-redux';
import { copyStringToClipboard } from '@utils';
import Bus from '@utils/eventBus';
import { useParams } from 'react-router-dom';
import './index.less';
import { cloneDeep, debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import ServicePreUrl from '@components/ServicePreUrl';
import { fetchServiceList, fetchDeleteEnv } from '@services/env';

import { Scale } from 'adesign-react';

const { ScalePanel, ScaleItem } = Scale;

import { Dropdown, Menu } from '@arco-design/web-react';
const Option = Select.Option;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const ApiURLPanel = (props) => {
    const { data, onChange, tempData, from = 'apis' } = props;
    const { t } = useTranslation();
    const [btnName, setBtnName] = useState(t('btn.send'));
    const dispatch = useDispatch();
    const open_api_now = useSelector((store) => store.mock.open_api_now);

    const open_res = useSelector((store) => store.mock.open_res);

    const language = useSelector((store) => store.user.language);

    useEffect(() => {
        setBtnName(t('btn.send'));
    }, [language]);


    const res_now = open_res && open_res[open_api_now];

    useEffect(() => {
        if (res_now && res_now.status === 'finish') {
            if (from === 'auto_report') {
                setBtnName(t('apis.send'));
            } else {
                setBtnName(t('btn.send'));
            }
        }
    }, [res_now, from]);

    const pre_mock_url = useSelector((store) => store?.user?.pre_mock_url) || '';

    useEffect(() => {
        if (data && data.request && data.request.env_id) {
            getServiceList();
        }
    }, [data]);

    const getServiceList = () => {
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            env_id: data ? (data.request ? data.request.env_id : 0) : 0
        };
        fetchServiceList(params).subscribe({
            next: (res) => {
                const { data: { service_list }, code } = res;
                if (code === 0) {
                }
            }
        })
    }

    return (
        <>
            <div className="api-url-panel" style={{ paddingLeft: from === 'apis' ? '8px' : '' }}>
                <div className="api-url-panel-group">
                    <Select
                        className="api-status"
                        size="middle"
                        value={data?.method || 'GET'}
                        onChange={(value) => {
                            onChange('method', value);
                        }}
                    >
                        {API_METHODS.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                    {
                        <ScalePanel
                            className="flex-style"
                            defaultLayouts={{ 0: { width: 407, marginLeft: '2px', marginRight: '4px' }, 1: { flex: 1, width: 0 } }}
                        >
                            <ScaleItem>
                                <Tooltip content={<span>{pre_mock_url}</span>}>
                                    <div onClick={() => copyStringToClipboard(data?.url || data?.request?.url || pre_mock_url)} className='mock-url'>{pre_mock_url}</div>
                                </Tooltip>
                            </ScaleItem>
                            <ScaleItem enableScale={false}>
                                <UrlInput
                                    placeholder={t('mock.pathPlaceholder')}
                                    onChange={(value) => onChange('mock_path', value)}
                                    value={data?.mock_path || ''}
                                />
                            </ScaleItem>
                        </ScalePanel>
                    }
                </div>
                <div style={{ marginLeft: '10px' }} className="btn-send">
                    <Button
                        type="primary"
                        size="middle"
                        style={{ marginRight: from === 'apis' ? '10px' : '' }}
                        disabled={btnName === t('btn.sending')}
                        onClick={() => {
                            Bus.$emit('mock/saveTargetById', {
                                id: open_api_now,
                            }, () => {
                                setBtnName(t('btn.sending'));
                                Bus.$emit('mock/sendApi', open_api_now);
                            })
                        }}
                    >
                        {btnName}
                    </Button>
                    <Button
                        type="primary"
                        size="middle"
                        onClick={() => copyStringToClipboard(data?.url)}
                    >
                        {t('mock.copyMockUrl')}
                    </Button>
                </div>
            </div >
        </>
    );
};

export default ApiURLPanel;
