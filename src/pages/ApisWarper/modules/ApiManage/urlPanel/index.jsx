import React, { useRef, useState, useEffect } from 'react';
import { Input, Select, Button, Message, Modal } from 'adesign-react';
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
import Bus from '@utils/eventBus';
import { useParams } from 'react-router-dom';
import './index.less';
import { cloneDeep, debounce } from 'lodash';
import { useTranslation } from 'react-i18next';
import EnvManage from '@modals/EnvManage';
import { fetchEnvList, fetchDeleteEnv, fetchCopyEnv } from '@services/env';
import { Scale } from 'adesign-react';
const { ScalePanel, ScaleItem } = Scale;

import { Dropdown, Menu } from '@arco-design/web-react';
const Option = Select.Option;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const ApiURLPanel = (props) => {
    const { data, onChange, tempData, from = 'apis' } = props;
    const { t } = useTranslation();
    const { id } = useParams();
    const [btnName, setBtnName] = useState(t('btn.send'));
    const [showEnv, setShowEnv] = useState(false);
    const dispatch = useDispatch();
    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const opens = useSelector((store) => store.opens.open_apis);

    const open_res = useSelector((store) => store.opens.open_res);

    const open_scene_res = useSelector((store) => store.scene.run_api_res)
    const open_scene = useSelector((store) => store.scene.open_scene);

    const open_plan_res = useSelector((store) => store.plan.run_api_res);
    const open_plan_scene = useSelector((store) => store.plan.open_plan_scene);

    const open_auto_plan_res = useSelector((store) => store.auto_plan.run_api_res);
    const open_auto_plan_scene = useSelector((store) => store.auto_plan.open_plan_scene);


    const open_case_res = useSelector((store) => store.case.run_api_res);
    const open_case_scene = useSelector((store) => store.case.open_plan_scene);

    const id_now = useSelector((store) => store.scene.id_now);
    const id_now_plan = useSelector((store) => store.plan.id_now);
    const id_now_auto_plan = useSelector((store) => store.auto_plan.id_now);
    const id_now_case = useSelector((store) => store.case.id_now);

    const _saveId = useSelector((store) => store.opens.saveId);

    const language = useSelector((store) => store.user.language);

    useEffect(() => {
        setBtnName(t('btn.send'));
    }, [language]);


    const res_list = {
        'apis': open_res && open_res[open_api_now],
        'scene': open_scene_res && open_scene_res[id_now],
        'plan': open_plan_res && open_plan_res[id_now_plan],
        'auto_plan': open_auto_plan_res && open_auto_plan_res[id_now_auto_plan],
        'case': open_case_res && open_case_res[id_now_case]
    };

    const res_now = res_list[from];

    useEffect(() => {
        if (res_now && res_now.status === 'finish') {
            setBtnName(t('btn.send'));
        }
    }, [res_now]);

    useEffect(() => {
        setSaveId(_saveId);
        // if (_saveId) {
        // setSaveId(_saveId);
        // }
    }, [_saveId]);

    const nodes_scene = useSelector((store) => store.scene.nodes);
    const edges_scene = useSelector((store) => store.scene.edges);
    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const node_config_scene = useSelector((store) => store.scene.node_config);
    const open_scene_scene = useSelector((store) => store.scene.open_scene);

    const nodes_plan = useSelector((store) => store.plan.nodes);
    const edges_plan = useSelector((store) => store.plan.edges);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const node_config_plan = useSelector((store) => store.plan.node_config);
    const open_scene_plan = useSelector((store) => store.plan.open_plan_scene);

    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);
    const open_scene_auto_plan = useSelector((store) => store.auto_plan.open_plan_scene);

    const nodes_case = useSelector((store) => store.case.nodes);
    const edges_case = useSelector((store) => store.case.edges);
    const id_apis_case = useSelector((store) => store.case.id_apis);
    const node_config_case = useSelector((store) => store.case.node_config);
    const open_scene_case = useSelector((store) => store.case.open_case);

    const nodes_list = {
        'scene': nodes_scene,
        'plan': nodes_plan,
        'auto_plan': nodes_auto_plan,
    }
    const nodes = nodes_list[from];
    const edges_list = {
        'scene': edges_scene,
        'plan': edges_plan,
        'auto_plan': edges_auto_plan
    }
    const edges = edges_list[from];
    const id_apis_list = {
        'scene': id_apis_scene,
        'plan': id_apis_plan,
        'auto_plan': id_apis_auto_plan,
    }
    const id_apis = id_apis_list[from];
    const node_config_list = {
        'scene': node_config_scene,
        'plan': node_config_plan,
        'auto_plan': node_config_auto_plan
    }
    const node_config = node_config_list[from];

    const refDropdown = useRef(null);
    const [saveId, setSaveId] = useState(null);
    const [searchEnv, setSearchEnv] = useState('');
    const [envList, setEnvList] = useState([]);
    const [selectId, setSelectId] = useState(0);

    const [env, setEnv] = useState('');


    const getSearchEnv = debounce((e) => setSearchEnv(e), 500);

    useEffect(() => {
        getEnvList();
    }, [searchEnv]);

    const getEnvList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            name: searchEnv
        };
        fetchEnvList(params).subscribe({
            next: (res) => {
                const { data, code } = res;
                if (code === 0) {
                    setEnvList(data);
                }
            }
        })
    }

    const deleteEnv = (id) => {
        setPopupVisible(false);
        const deleteEnvFn = () => {
            const params = {
                id,
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

        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteEnv'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: debounce(() => deleteEnvFn(), 300)
        })
    }

    const DropEnv1 = () => {
        return (
            <div className='drop-env'>
                <Button onClick={() => {
                    setShowEnv(true);
                    setSelectId(0);
                    setPopupVisible(false);
                }}>{t('btn.createEnv')}</Button>
                <Input
                    className="textBox"
                    value={searchEnv}
                    onChange={getSearchEnv}
                    beforeFix={<SvgSearch />}
                    placeholder={t('placeholder.searchEnv')}
                />
                <div className='env-list'>
                    <Menu mode='pop'>
                        {
                            envList.map((item, index) => {
                                if (item.service_list && item.service_list.length > 0) {
                                    return (
                                        <SubMenu triggerProps={{ trigger: "click" }} key={index} title={<div className='env-item'>
                                            <p className='label'>{item.name}</p>
                                            <div className='handle'>
                                                <SvgCopy onClick={() => {
                                                    const params = {
                                                        id: item.id,
                                                        team_id: localStorage.getItem('team_id')
                                                    };
                                                    fetchCopyEnv(params).subscribe({
                                                        next: (res) => {
                                                            const { code } = res;
                                                            if (code === 0) {
                                                                Message('success', t('message.copySuccess'));
                                                                getEnvList();
                                                            }
                                                        }
                                                    })
                                                }} />
                                                <SvgEye onClick={() => {
                                                    setShowEnv(true);
                                                    setSelectId(item.id);
                                                }} />
                                                <SvgDelete onClick={() => deleteEnv(item.id)} />
                                            </div>
                                        </div>}>
                                            {
                                                item.service_list &&
                                                item.service_list.map(elem => (
                                                    <MenuItem className='services-item' onClick={() => {
                                                        onChange('pre_url', elem.content);
                                                        onChange('env_service_id', elem.id);
                                                        setPopupVisible(false);
                                                    }}>{elem.name}: {elem.content}</MenuItem>
                                                ))
                                            }
                                        </SubMenu>
                                    )
                                }
                                return <div className='env-item'>
                                    <p>{item.name}</p>
                                    <div className='handle'>
                                        <SvgCopy onClick={() => {
                                            const params = {
                                                id: item.id,
                                                team_id: localStorage.getItem('team_id')
                                            };
                                            fetchCopyEnv(params).subscribe({
                                                next: (res) => {
                                                    const { code } = res;
                                                    if (code === 0) {
                                                        Message('success', t('message.copySuccess'));
                                                        getEnvList();
                                                    }
                                                }
                                            })
                                        }} />
                                        <SvgEye onClick={() => {
                                            setShowEnv(true);
                                            setSelectId(item.id);
                                        }} />
                                        <SvgDelete onClick={() => deleteEnv(item.id)} />
                                    </div>
                                </div>
                            })
                        }
                    </Menu>
                </div>
            </div>
        )
    }

    const [popupVisible, setPopupVisible] = useState(false);
    return (
        <>
            {
                showEnv && <EnvManage onCancel={() => {
                    setShowEnv(false);
                    getEnvList();
                }} select={selectId} />
            }
            <div className="api-url-panel" style={{ paddingLeft: from === 'apis' ? '16px' : '' }}>
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
                    <ScalePanel
                        className="flex-style"
                        defaultLayouts={{ 0: { width: 147, marginLeft: '2px', marginRight: '4px' }, 1: { flex: 1, width: 0 } }}
                    >
                        <ScaleItem>
                            <div className='env-input'>
                                <Input value={data.request.pre_url} onChange={(e) => onChange('pre_url', e)} placeholder={t('placeholder.envBeforeUrl')} />
                                <Dropdown
                                    ref={refDropdown}
                                    placement="br"
                                    popupVisible={popupVisible}
                                    onVisibleChange={(visible) => {
                                        setPopupVisible(visible);
                                    }}
                                    droplist={<DropEnv1 />}
                                >
                                    <Button className="down-btn" onClick={() => getEnvList()}>
                                        <SvgDown />
                                    </Button>
                                </Dropdown>
                            </div>
                        </ScaleItem>
                        <ScaleItem enableScale={false}>
                            <UrlInput
                                placeholder={t('placeholder.apiUrl')}
                                onChange={(value) => onChange('url', value)}
                                value={data?.url || ''}
                            />
                        </ScaleItem>
                    </ScalePanel>

                </div>
                <div style={{ marginLeft: '10px' }} className="btn-send">
                    <Button
                        type="primary"
                        size="middle"
                        style={{ marginRight: from === 'apis' ? '16px' : '' }}
                        disabled={btnName === t('btn.sending')}
                        onClick={() => {

                            if (from === 'scene') {
                                Bus.$emit('saveScene', () => {
                                    setBtnName(t('btn.sending'));
                                    Bus.$emit('sendSceneApi', open_scene_scene.scene_id || open_scene_scene.target_id, id_now, open_scene_res || {}, 'scene');
                                });
                            } else if (from === 'plan') {
                                Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_plan_scene, id, from, () => {
                                    setBtnName(t('btn.sending'));
                                    Bus.$emit('sendSceneApi', open_plan_scene.scene_id || open_plan_scene.target_id, id_now_plan, open_plan_res || {}, 'plan');
                                });
                            } else if (from === 'auto_plan') {
                                Bus.$emit('saveScenePlan', nodes, edges, id_apis, node_config, open_auto_plan_scene, id, from, () => {
                                    setBtnName(t('btn.sending'));
                                    Bus.$emit('sendSceneApi', open_auto_plan_scene.scene_id || open_auto_plan_scene.target_id, id_now_auto_plan, open_auto_plan_res || {}, 'auto_plan');
                                });
                            } else if (from === 'case') {
                                Bus.$emit('saveCase', () => {
                                    setBtnName(t('btn.sending'));
                                    Bus.$emit('sendSceneApi', open_scene_case.scene_id || open_scene_case.target_id, id_now_case, open_case_res || {}, 'case', open_scene_case.scene_case_id);
                                })
                            } else {
                                Bus.$emit('saveTargetById', {
                                    id: open_api_now,
                                    saveId: saveId,
                                }, {}, (code, id) => {
                                    setSaveId(id);
                                    if (code === 0) {
                                        setBtnName(t('btn.sending'));
                                        Bus.$emit('sendApi', id);
                                    }
                                })
                            }
                        }}
                    >
                        {btnName}
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ApiURLPanel;
