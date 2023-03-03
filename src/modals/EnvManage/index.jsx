import React, { useState, useEffect } from "react";
import './index.less';
import { Modal, Button, Message } from 'adesign-react';
import {
    Search as SvgSearch,
    Delete as SvgDelete
} from 'adesign-react/icons';
import SvgClose from '@assets/logo/close';
import { cloneDeep, debounce } from 'lodash';
import { fetchEnvList, fetchSaveEnv, fetchDeleteEnv, fetchDeleteService } from '@services/env';
import { useTranslation } from 'react-i18next';
import { Input, Table } from '@arco-design/web-react';

const EnvManage = (props) => {
    const { onCancel, select } = props;
    const { t } = useTranslation();

    const [searchName, setSearchName] = useState('');
    const [envName, setEnvName] = useState('');
    const [envList, setEnvList] = useState([]);

    const [selectId, setSelectId] = useState(0);

    const [serviceList, setServiceList] = useState([]);

    const getSearchName = debounce((e) => setSearchName(e), 500);


    useEffect(() => {
        getEnvList();
    }, [searchName]);

    useEffect(() => {
        setSelectId(select);
    }, [select]);

    const getEnvList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            name: searchName
        };
        fetchEnvList(params).subscribe({
            next: (res) => {
                const { data } = res;
                setEnvList(data);
            }
        })
    }

    useEffect(() => {
        if (envList.length > 0) {
            let envNow = envList.find(item => item.id === selectId);


            if (selectId === 0) {
                setServiceList([{ name: '', content: '' }])
            } else if (envNow && envNow.service_list) {
                setEnvName(envNow.name);
                setServiceList([...envNow.service_list, { name: '', content: '' }])
            } else {
                setServiceList([{ name: '', content: '' }]);
            }
        } else {
            setServiceList([{ name: '', content: '' }])
        }
    }, [selectId, envList]);

    const handleChange = (rowData, rowIndex, newVal) => {
        const newList = [...serviceList];
        newList[rowIndex] = {
            ...rowData,
            ...newVal
        };
        if (rowIndex === serviceList.length - 1) {
            setServiceList([...newList, { name: '', content: '' }]);
        } else {
            setServiceList([...newList])
        }
    };


    const column = [
        {
            title: t('modal.serviceName'),
            dataIndex: 'name',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(e) => {
                            handleChange(rowData, rowIndex, { name: e });
                        }}
                    />
                )
            }
        },
        {
            title: t('modal.domain'),
            dataIndex: 'content',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(e) => {
                            handleChange(rowData, rowIndex, { content: e });
                        }}
                    />
                )
            }
        },
        {
            title: t('modal.handle'),
            dataIndex: 'handle',
            width: 60,
            render: (text, rowData, rowIndex) => {
                return <div className="delete-svg">
                    <SvgDelete onClick={debounce(() => deleteService(rowIndex), 1000)} />
                </div>
            }
        }
    ];

    const saveEnv = () => {
        if (envName.trim().length === 0) {
            Message('error', t('message.emptyEnvName'));
            return;
        }
        let _serviceList = cloneDeep(serviceList);
        _serviceList.splice(_serviceList.length - 1, 1);

        let emptyIndex = _serviceList.findIndex(item => !item.name.trim() || !item.content.trim());
        if (emptyIndex !== -1) {
            Message('error', t('message.emptyService'));
            return;
        }
        let params = {};
        if (selectId === 0) {
            params = {
                team_id: localStorage.getItem('team_id'),
                name: envName,
                service_list: _serviceList.length > 0 ? _serviceList.filter(item => item.name.trim() && item.content.trim()) : []
            }
        } else {
            params = {
                id: parseInt(selectId),
                team_id: localStorage.getItem('team_id'),
                name: envName,
                service_list: _serviceList.length > 0 ? _serviceList.filter(item => item.name.trim() && item.content.trim()) : []
            }
        }
        fetchSaveEnv(params).subscribe({
            next: (res) => {
                const { code, data } = res;
                if (code === 0) {
                    Message('success', t('message.saveSuccess'));
                    setSelectId(data.id);
                    getEnvList();
                }
            }
        })
    };

    const deleteEnv = () => {
        if (selectId === 0) {
            return;
        }
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteEnv'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    id: selectId,
                    team_id: localStorage.getItem('team_id')
                };
                fetchDeleteEnv(params).subscribe({
                    next: (res) => {
                        const { code } = res;
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            getEnvList();
                            setSelectId(0);
                            setServiceList([{ name: '', content: '' }])
                            setEnvName('');
                        }
                    }
                })
            }
        })
    };

    const deleteService = (index) => {
        const item = serviceList[index];

        if (!item.name && !item.content) {
            return;
        }

        if (!item.id) {
            let _serviceList = cloneDeep(serviceList);
            _serviceList.splice(index, 1);
            setServiceList(_serviceList);
            return;
        }
        const params = {
            id: item.id,
            team_env_id: selectId,
            team_id: localStorage.getItem('team_id')
        };
        fetchDeleteService(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    Message('success', t('message.deleteSuccess'));
                    getEnvList();
                }
            }
        })
    }

    const selectEnv = (item) => {
        const { id, name, service_list } = item;
        setSelectId(id);
        setEnvName(name);
        setServiceList(service_list);
    }
    return (
        <Modal
            className="env-manage"
            visible
            title={null}
            footer={null}
        >
            <div className="top">
                <p className="top-left">
                    {t('modal.envManage')}
                </p>
                <Button className="top-right" onClick={() => onCancel()}>
                    <SvgClose />
                </Button>
            </div>
            <div className="container">
                <div className="container-left">
                    <Button className='create-env' onClick={() => {
                        setSelectId(0);
                        setServiceList([{ name: '', content: '' }]);
                        setEnvName('');
                    }}>{t('btn.createEnv')}</Button>
                    <Input
                        className='search-env'
                        prefix={<SvgSearch />}
                        value={searchName}
                        placeholder={t('placeholder.searchEnv')}
                        onChange={(e) => setSearchName(e)}
                    />
                    <div className="env-menu">
                        {
                            envList.map(item => (
                                <p className={`env-menu-item ${selectId === item.id ? 'hover-item' : ''}`} onClick={() => selectEnv(item)}>{item.name}</p>
                            ))
                        }
                    </div>
                </div>
                <div className="container-right">
                    <div className="list-top">
                        <div className="list-top-left">
                            <p className="env-name">
                                <span>*</span>
                                <span>{t('modal.envName')}：</span>
                            </p>
                            <Input className="env-name-input" placeholder={t('placeholder.envName')} value={envName} onChange={(e) => setEnvName(e)} />
                        </div>
                        <div className="list-top-right">
                            <Button className="delete-btn" disabled={envList.length === 0  || !selectId} onClick={debounce(() => deleteEnv(), 1000)}>{t('btn.delete')}</Button>
                            <Button className="save-btn" onClick={() => saveEnv()}>{t('btn.save')}</Button>
                        </div>
                    </div>
                    <div className="env-list">
                        <Table
                            borderCell
                            columns={column}
                            data={serviceList}
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
};

export default EnvManage;