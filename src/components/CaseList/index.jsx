import React, { useEffect, useState } from "react";
import './index.less';
import { Button, Drawer, Input, Modal, Message } from 'adesign-react';
import {
    Right as SvgRight,
    Left as SvgLeft,
    Add as SvgAdd,
    Edit as SvgEdit,
    Copy as SvgCopy,
    Delete as SvgDelete,
    Search as SvgSearch,
    Save as SvgSave,
    CaretRight as SvgCaretRight
} from 'adesign-react/icons';
import SvgStop from '@assets/icons/Stop';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';
import CaseBox from "./CaseBox";
import CaseFooterConfig from "./footerConfig";
import ApiPicker from './apiPicker';
import { getPathExpressionObj } from '@constants/pathExpression';
import { useSelector, useDispatch } from 'react-redux';
import ApiManage from '@pages/ApisWarper/modules/ApiManage';
import { fetchSceneList } from '@services/scene';
import { useParams } from 'react-router-dom';
import Bus from '@utils/eventBus';

import { Table } from '@arco-design/web-react';


const CaseList = (props) => {
    const { from, style, lineStyle } = props;
    const [open, setOpen] = useState(false);
    const [showDrawer, setDrawer] = useState(false);
    const [showApiPicker, setApiPicker] = useState(false);
    const [showApiDrawer, setApiDrawer] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const apiConfig = useSelector((store) => store.case.showApiConfig);
    const api_now = useSelector((store) => store.case.api_now);
    const [apiName, setApiName] = useState(api_now ? api_now.name : '新建接口');
    const [caseName, setCaseName] = useState('');

    const { id } = useParams();
    useEffect(() => {
        setApiDrawer(apiConfig);
    }, [apiConfig]);

    useEffect(() => {
        setApiName(api_now.name)
    }, [api_now]);


    const closeApiConfig = () => {
        Bus.$emit('saveCaseApi', () => {
            // setDrawer(false)
            dispatch({
                type: 'case/updateApiConfig',
                payload: false
            })
        });
    };

    const onTargetChange = (type, value) => {
        Bus.$emit('updateCaseApi', {
            id: api_now.id,
            pathExpression: getPathExpressionObj(type),
            value,
        });
    };

    const is_changed = useSelector((store) => store.case.is_changed);
    const open_info_scene = useSelector((store) => store.scene.open_info);
    const open_info_auto_plan = useSelector((store) => store.auto_plan.open_info);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);

    console.log(open_info_scene, open_info_auto_plan, from);

    const open_info_list = {
        'scene': open_info_scene,
        'auto_plan': open_info_auto_plan
    };
    // const open_info = open_info_list[from];
    const open_info = open_info_scene ? open_info_scene : open_info_auto_plan;


    const closeCase = () => {
        console.log(is_changed, open_info);
        if (is_changed) {
            Modal.confirm({
                title: t('modal.tips'),
                content: t('modal.caseNotSave'),
                okText: t('btn.save'),
                cancelText: t('btn.cancel'),
                diyText: t('btn.notSave'),
                onOk: () => {
                    // 保存当前场景
                    Bus.$emit('saveCase', () => {
                        Message('success', t('message.saveSuccess'));

                        dispatch({
                            type: 'auto_plan/updateIsChanged',
                            payload: false
                        })

                        dispatch({
                            type: 'case/updateIsChanged',
                            payload: false
                        })

                        dispatch({
                            type: 'case/updateRunRes',
                            payload: null,
                        })
                        dispatch({
                            type: 'case/updateRunningScene',
                            payload: '',
                        })
                        dispatch({
                            type: 'case/updateNodes',
                            payload: [],
                        });
                        dispatch({
                            type: 'case/updateEdges',
                            payload: [],
                        })
                        dispatch({
                            type: 'case/updateCloneNode',
                            payload: [],
                        })
                        dispatch({
                            type: 'case/updateSuccessEdge',
                            payload: [],
                        });
                        dispatch({
                            type: 'case/updateFailedEdge',
                            payload: [],
                        });
                        dispatch({
                            type: 'case/updateApiConfig',
                            payload: false,
                        })
                        dispatch({
                            type: 'case/updateBeautify',
                            payload: false
                        })
                        if (open_info_scene) {
                            Bus.$emit('addOpenScene', open_info);
                        } else if (open_info_auto_plan) {
                            Bus.$emit('addOpenAutoPlanScene', open_info, id_apis_auto_plan, node_config_auto_plan);
                        }
                        dispatch({
                            type: 'case/updateShowCase',
                            payload: false
                        })
                    });

                },
                onCancel: () => {
                    // 取消弹窗

                },
                onDiy: () => {

                    dispatch({
                        type: 'auto_plan/updateIsChanged',
                        payload: false
                    })

                    dispatch({
                        type: 'case/updateIsChanged',
                        payload: false
                    })

                    dispatch({
                        type: 'case/updateRunRes',
                        payload: null,
                    })
                    dispatch({
                        type: 'case/updateRunningScene',
                        payload: '',
                    })
                    dispatch({
                        type: 'case/updateNodes',
                        payload: [],
                    });
                    dispatch({
                        type: 'case/updateEdges',
                        payload: [],
                    })
                    dispatch({
                        type: 'case/updateCloneNode',
                        payload: [],
                    })
                    dispatch({
                        type: 'case/updateSuccessEdge',
                        payload: [],
                    });
                    dispatch({
                        type: 'case/updateFailedEdge',
                        payload: [],
                    });
                    dispatch({
                        type: 'case/updateApiConfig',
                        payload: false,
                    })
                    dispatch({
                        type: 'case/updateBeautify',
                        payload: false
                    })
                    // 不保存, 直接跳转
                    if (open_info_scene) {
                        Bus.$emit('addOpenScene', open_info);
                    } else if (open_info_auto_plan) {
                        Bus.$emit('addOpenAutoPlanScene', open_info, id_apis_auto_plan, node_config_auto_plan);
                    }
                    dispatch({
                        type: 'case/updateShowCase',
                        payload: false
                    })
                }
            })
        } else {
            if (open_info_scene) {
                Bus.$emit('addOpenScene', open_info);
            } else if (open_info_auto_plan) {
                Bus.$emit('addOpenAutoPlanScene', open_info, id_apis_auto_plan, node_config_auto_plan);
            }
            dispatch({
                type: 'case/updateShowCase',
                payload: false
            })
        }
    };

    const nodes = useSelector((store) => store.auto_plan.nodes);
    const edges = useSelector((store) => store.auto_plan.edges);
    const id_apis = useSelector((store) => store.auto_plan.id_apis);
    const node_config = useSelector((store) => store.auto_plan.node_config);
    const open_scene = useSelector((store) => store.auto_plan.open_plan_scene);

    const showCase = () => {
        console.log(from);
        if (style) {
            closeCase();
        } else {
            const callback = () => {
                dispatch({
                    type: 'case/updateShowCase',
                    payload: true
                })
            }
            if (from === 'scene') {
                Bus.$emit('saveScene', callback);
            } else if (from === 'auto_plan') {
                Bus.$emit('saveSceneAutoPlan', nodes, edges, id_apis, node_config, open_scene, id, callback);
            }
        }
    }

    return (
        <>
            <div className="case-list" style={style}>
                <div className="default-case" style={lineStyle} onClick={() => showCase()}>
                    <p>{t('case.caseSet')}</p>
                    {
                        style ? <SvgLeft /> : <SvgRight />
                    }
                </div>
            </div>
        </>
    )
};

export default CaseList;