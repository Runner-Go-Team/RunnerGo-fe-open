import React, { useState, useEffect } from "react";
import './index.less';
import { Button, Tooltip, Tabs } from '@arco-design/web-react';
import {
    Delete as SvgDelete,
    Save as SvgSave
} from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import { Tabs as TabComponent, Message, Modal } from 'adesign-react';
import ServiceTab from "./ServiceTab";
import DbTab from "./DbTab";
import InputText from '@components/InputText';
import EnvEmpty from '@assets/icons/env_empty';
import { fetchUpdateEnvName, fetchDeleteEnv } from '@services/env';
import { useDispatch } from 'react-redux';

const { TabPane } = Tabs;

const EnvDetail = (props) => {
    const { selectEnvId, selectEnvName } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [empty, setEmpty] = useState(false);

    console.log(selectEnvId, selectEnvName);


    useEffect(() => {
        if (selectEnvId) {
            setEmpty(false);
        } else {
            setEmpty(true);
        }
    }, [selectEnvId]);

    const tabList = [
        {
            id: '0',
            title: <Tooltip content={ t('env.serviceTabExplain') }>
                { t('env.service') }
            </Tooltip>,
            content: <ServiceTab selectEnvId={selectEnvId} />
        },
        {
            id: '1',
            title: <Tooltip content={ t('env.dbTabExplain') }>
                { t('env.database') }
            </Tooltip>,
            content: <DbTab selectEnvId={selectEnvId} />
        }
    ];

    const deleteEnv = () => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteEnv'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    env_id: selectEnvId,
                    team_id: localStorage.getItem('team_id')
                };

                fetchDeleteEnv(params).subscribe({
                    next: (res) => {
                        const { code } = res;

                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));

                            setEmpty(true);

                            dispatch({
                                type: 'env/updateRefreshList'
                            })
                        }
                    }
                })
            }
        })

    }

    const updateEnvName = (e) => {
        if (e.trim().length > 0) {
            const params = {
                env_id: selectEnvId,
                env_name: e,
                team_id: localStorage.getItem('team_id')
            };

            fetchUpdateEnvName(params).subscribe({
                next: (res) => {
                    const { code } = res;

                    if (code === 0) {
                        dispatch({
                            type: 'env/updateRefreshList'
                        })
                    }
                }
            });
        }
    }

    return (
        <div className="env-detail">
            {
                (selectEnvId && !empty) ? <>
                    <div className="env-detail-header">
                        <div className="env-detail-header-left">
                            <p>{t('modal.envName')}：</p>
                            <InputText
                                maxLength={30}
                                value={selectEnvName}
                                placeholder={t('placeholder.envName')}
                                onChange={(e) => {
                                    updateEnvName(e)
                                }}
                            />
                        </div>
                        <div className="env-detail-header-right">
                            <Button className='delete-btn' icon={<SvgDelete />} onClick={deleteEnv}>{t('btn.delete')}</Button>
                        </div>
                    </div>
                    <div className="env-detail-container">
                        <Tabs defaultActiveTab='0' itemWidth={80}>
                            {
                                tabList.map((item, index) => (
                                    <TabPane
                                        style={{ padding: '0 15px', width: 'auto !impoertant' }}
                                        key={item.id}
                                        title={item.title}
                                    >
                                        {item.content}
                                    </TabPane>
                                ))
                            }
                        </Tabs>
                    </div>
                </> : <div className="empty">
                    <EnvEmpty />
                    <p>{t('env.empty')}</p>
                </div>
            }
        </div>
    )
};

export default EnvDetail;