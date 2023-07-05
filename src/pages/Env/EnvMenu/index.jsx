import React, { useState, useEffect } from "react";
import './index.less';
import { Input, Button } from '@arco-design/web-react';
import {
    Environment as SvgEnv,
    Search as SvgSearch,
    More as SvgMore
} from 'adesign-react/icons';
import { Message, Modal } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import { fetchEnvList, fetchCreateEnv, fetchUpdateEnvName, fetchDeleteEnv, fetchCloneEnv } from '@services/env';
import { isArray, debounce } from "lodash";
import { handleShowContextMenu } from './contextMenu';
import { useDispatch, useSelector } from 'react-redux';

const EnvMenu = (props) => {
    const { handleSelectEnv, handleEnvName } = props;
    // 搜索关键字
    const [keyWord, setKeyWord] = useState('');
    // 环境列表
    const [envList, setEnvList] = useState([]);
    // 当前选中的环境id
    const [selectId, setSelectId] = useState(0);
    // 当前编辑名称的环境id
    const [editId, setEditId] = useState(0);

    const refresh = useSelector((store) => store.env.refresh);

    useEffect(() => {
        getEnvList(true);
    }, [keyWord, refresh]);

    const getEnvList = (default_open_first) => {
        const params = {
            name: keyWord,
            team_id: localStorage.getItem('team_id')
        };

        fetchEnvList(params).subscribe({
            next: (res) => {
                const { code, data } = res;
                if (code === 0) {
                    if (isArray(data)) {
                        setEnvList(data);
                        if (data.length > 0 && default_open_first) {
                            const { env_id, env_name } = data[0];
                            handleSelectEnv(env_id);
                            handleEnvName(env_name);
                            setSelectId(env_id);
                        } else if (data.length === 0) {
                            handleSelectEnv(0);
                            handleEnvName('');
                            setSelectId(0);
                        }
                    }
                }
            }
        })
    }

    const { t } = useTranslation();


    const createEnv = () => {
        const params = {
            team_id: localStorage.getItem('team_id')
        };

        fetchCreateEnv(params).subscribe({
            next: (res) => {
                const { code, data: { env_id, env_name } } = res;

                if (code === 0) {
                    getEnvList();
                    setSelectId(env_id);
                    handleSelectEnv(env_id);
                    handleEnvName(env_name);
                    setEditId(env_id);
                }
            }
        })
    };

    const selectEnv = (env_id, env_name) => {
        setSelectId(env_id);
        handleSelectEnv(env_id);
        handleEnvName(env_name);
    };

    const handleFocus = (event) => {
        event.target.select();
    };

    const updateEnvName = (env_name, env_id) => {
        if (env_name.trim().length === 0) {
            return;
        }

        const params = {
            env_id,
            env_name,
            team_id: localStorage.getItem('team_id')
        };
        fetchUpdateEnvName(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    setEditId(0);
                    getEnvList();
                }
            }
        })
    }

    const deleteEnv = (env_id) => {
        const params = {
            env_id,
            team_id: localStorage.getItem('team_id')
        };

        fetchDeleteEnv(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    Message('success', t('message.deleteSuccess'));
                    getEnvList();
                }
            }
        })
    }

    const cloneEnv = (env_id) => {
        const params = {
            env_id,
            team_id: localStorage.getItem('team_id')
        };

        fetchCloneEnv(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {
                    getEnvList();
                }
            }
        })
    }

    return (
        <div className="env-menu">
            <Input
                className='search-input'
                prefix={<SvgSearch />}
                value={keyWord}
                onChange={(e) => setKeyWord(e)}
                placeholder={t('placeholder.keyWord')}
            />

            <div className="create-env" onClick={createEnv}>
                <SvgEnv />
                <p>{t('env.createEnv')}</p>
            </div>

            <div className="env-list">
                {
                    envList.length > 0 && envList.map((item, index) => (
                        <>
                            {
                                editId !== item.env_id ?
                                    <div className={`env-list-item ${selectId === item.env_id ? 'select-item' : ''}`} key={item.env_id} onClick={() => selectEnv(item.env_id, item.env_name)}>
                                        <p>{item.env_name}</p>
                                        <Button
                                            className='btn-more'
                                            size='mini'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();

                                                handleShowContextMenu(
                                                    e,
                                                    item,
                                                    (state) => {
                                                        // 1: 编辑, 2: 克隆, 3: 删除
                                                        if (state === 1) {
                                                            setEditId(item.env_id);
                                                            setSelectId(item.env_id);
                                                            handleSelectEnv(item.env_id);
                                                            handleEnvName(item.env_name);
                                                        } else if (state === 2) {
                                                            cloneEnv(item.env_id);
                                                        } else if (state === 3) {
                                                            Modal.confirm({
                                                                title: t('modal.look'),
                                                                content: t('modal.deleteEnv'),
                                                                okText: t('btn.ok'),
                                                                cancelText: t('btn.cancel'),
                                                                onOk: () => {
                                                                    deleteEnv(item.env_id);
                                                                }
                                                            })
                                                        }
                                                    }
                                                );
                                            }}
                                        >
                                            <SvgMore width="12px" height="12px" />
                                        </Button>
                                    </div>
                                    :
                                    <Input maxLength={30} autoFocus onFocus={handleFocus} defaultValue={item.env_name} onBlur={(e) => updateEnvName(e.target.value, item.env_id)} />
                            }
                        </>

                    ))
                }
            </div>
        </div>
    )
};

export default EnvMenu;