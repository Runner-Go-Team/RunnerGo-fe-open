import React, { useState, useEffect } from "react";
import './index.less';
import { IconEye as SvgIconEye } from '@arco-design/web-react/icon';
import { Select } from '@arco-design/web-react';
import { fetchEnvList } from '@services/env';
import PreviewEnv from "@modals/PreviewEnv";
import { useTranslation } from 'react-i18next';
import SvgClose from './close';
import { useDispatch } from 'react-redux';

const { Option } = Select;

const EnvView = (props) => {
    const { onChange, env_id, from = 'apis' } = props;
    // 是否预览环境
    const [showPreviewEnv, setPreviewEnv] = useState(false);
    // 环境列表
    const [envList, setEnvList] = useState([]);
    // 环境名称
    const [envName, setEnvName] = useState('');
    // 环境ID
    const [envId, setEnvId] = useState(0);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        const params = {
            team_id: localStorage.getItem('team_id')
        };

        fetchEnvList(params).subscribe({
            next: (res) => {
                const { code, data } = res;
                if (code === 0) {
                    setEnvList(data);
                }
            }
        })
    }, []);

    useEffect(() => {
        if (envList.length > 0 && env_id) {
            const envItem = envList.find(item => item.env_id === env_id);
            if (envItem) {
                const { env_name } = envItem;
                setEnvName(env_name);
            }
            env_id && setEnvId(env_id);
        }
    }, [envList, env_id]);

    const initEnv = (e) => {
        if (from === 'case') {
            return;
        }
        e.stopPropagation();
        setEnvId(0);
        onChange('env_id', 0);
        onChange('sql_database_info', {});
        onChange('env_server_name', '');

        dispatch({
            type: 'env/updateSceneEnvId',
            payload: 0
        })
    }



    return (
        <>
            <div className="env-view-component">
                <SvgIconEye onClick={() => {
                    if (envId && envName) {
                        setPreviewEnv(true);
                    }
                }} />
                <p className="line"></p>
                {
                    envList.find(item => item.env_id === env_id) ?
                        <Select
                            key={1}
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            value={env_id}
                            disabled={from === 'case'}
                            onChange={(e) => {
                                setEnvId(e);
                                onChange('env_id', e);
                            }}
                            renderFormat={(item) => (
                                <p className="env-item">
                                    <p className="label">{item.children}</p>
                                    <SvgClose onClick={(e) => initEnv(e)} />
                                </p>
                            )}
                        >
                            {
                                envList && envList.map(item => (
                                    <Option key={item.env_id} value={item.env_id}>
                                        {item.env_name}
                                    </Option>
                                ))
                            }
                        </Select>
                        : <Select key={2} placeholder={t('placeholder.selectEnv')} disabled={from === 'case'} getPopupContainer={(triggerNode) => triggerNode.parentNode} onChange={(e) => {
                            setEnvId(e);
                            onChange('env_id', e);
                        }}>
                            {
                                envList && envList.map(item => (
                                    <Option key={item.env_id} value={item.env_id}>
                                        {item.env_name}
                                    </Option>
                                ))
                            }
                        </Select>
                }
            </div>
            {
                showPreviewEnv && <PreviewEnv envName={envName} envId={envId} onCancel={() => setPreviewEnv(false)} />
            }
        </>
    )
};

export default EnvView;