import React, { useState, useEffect, useRef } from "react";
import './index.less';
import { Button, Input, Message, Switch, Modal } from 'adesign-react';
import {
    Add as SvgAdd,
    Cancel as SvgCancel,
    Search as SvgSearch,
    More as SvgMore
} from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import SvgExplain from '@assets/icons/Explain';
import { fetchCaseList, fetchCopyCase, fetchDeleteCase, fetchSwitchCase } from '@services/case';
import { useSelector, useDispatch } from 'react-redux';
import CreateCase from "@modals/CreateCase";
import Bus from '@utils/eventBus';
import cn from 'classnames';
import { debounce, isArray } from 'lodash';
import { handleShowContextMenu } from './contextMenu';
import { Tooltip } from '@arco-design/web-react';
import CaseList from "../CaseList";
import DragNode from "../TreeMenu/menuTree/dragNode";
import useNodeSort from "./useNodeSort";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const CaseMenu = (props) => {
    const { from } = props;
    const [keyword, setKeyword] = useState('');
    const [caseList, setCaseList] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const { t } = useTranslation();
    const refDropdown = useRef();
    const dispatch = useDispatch();
    const open_scene = useSelector((store) => store.scene.open_scene);
    const open_plan_scene = useSelector((store) => store.auto_plan.open_plan_scene);
    const open_list = {
        'scene': open_scene,
        'auto_plan': open_plan_scene
    }
    const open_data = open_list[from];
    const open_case = useSelector((store) => store.case.open_case);
    const refresh = useSelector((store) => store.case.refresh);

    const is_changed = useSelector((store) => store.case.is_changed);

    useEffect(() => {
        getCaseList(true);
    }, [open_data, keyword]);

    useEffect(() => {
        getCaseList();
    }, [refresh]);

    useEffect(() => {
        return () => {
            dispatch({
                type: 'case/updateShowCase',
                payload: false
            })
        }
    }, []);

    const getCaseList = (open) => {
        if (Object.entries(open_data || {}).length > 0) {
            const params = {
                scene_id: open_data.scene_id ? open_data.scene_id : open_data.target_id,
                case_name: keyword
            };

            fetchCaseList(params).subscribe({
                next: (res) => {
                    const { code, data: { case_assemble_list } } = res;
                    if (code === 0) {
                        setCaseList(case_assemble_list);
                        if (open && case_assemble_list.length > 0) {
                            openCase(case_assemble_list[0])
                        } else {
                            if (case_assemble_list.length === 0) {
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
                                dispatch({
                                    type: 'case/updateCaseName',
                                    payload: '',
                                })
                                dispatch({
                                    type: 'case/updateCaseDesc',
                                    payload: ''
                                })
                                dispatch({
                                    type: 'case/updateOpenInfo',
                                    payload: {}
                                })
                                dispatch({
                                    type: 'case/updateRunStatus',
                                    payload: 'finish',
                                })
                                dispatch({
                                    type: 'case/updateOpenCase',
                                    payload: {},
                                })
                            }
                        }
                        const caseMenu = {};
                        if (isArray(case_assemble_list)) {
                            for (let i = 0; i < case_assemble_list.length; i++) {
                                caseMenu[case_assemble_list[i].case_id] = case_assemble_list[i];
                            }
                            dispatch({
                                type: 'case/updateCaseMenu',
                                payload: caseMenu
                            })
                        }
                    }
                }
            })
        }
    }

    const open_info_scene = useSelector((store) => store.scene.open_info);
    const open_info_auto_plan = useSelector((store) => store.auto_plan.open_info);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((store) => store.auto_plan.node_config);
    const open_info_list = {
        'scene': open_info_scene,
        'auto_plan': open_info_auto_plan
    };
    const open_info = open_info_list[from];

    const openCase = (item) => {
        const { case_id, case_name, description } = item;
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
        dispatch({
            type: 'case/updateCaseName',
            payload: case_name || '',
        })
        dispatch({
            type: 'case/updateCaseDesc',
            payload: description || ''
        })
        dispatch({
            type: 'case/updateOpenInfo',
            payload: item
        })
        dispatch({
            type: 'case/updateRunStatus',
            payload: 'finish',
        })
        Bus.$emit('addOpenCase', case_id);
        Bus.$emit('clearFetchSceneState');
        Bus.$emit('clearFetchCaseState');
    };

    const changeSwitch = (case_id, value, e) => {
        e.preventDefault();
        e.stopPropagation();
        const params = {
            case_id,
            team_id: localStorage.getItem('team_id'),
            is_checked: value ? 1 : 2
        };
        fetchSwitchCase(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    getCaseList();
                }
            }
        })
    };

    const getSearchWord = debounce((e) => setKeyword(e), 500);

    const [editCase, setEditCase] = useState(null);

    const { handleNodeDragEnd } = useNodeSort();
    return (
        <>
            <div className="case-menu">
                <CaseList style={{ right: '-36px', left: 'auto', marginTop: '27.5px' }} lineStyle={{ borderLeftWidth: 0, borderRightWidth: '1px', borderRadius: '0px 3px 3px 0px' }} from={from} />
                <div className="top">
                    <div className="top-left">
                        <p className="title">{t('case.caseSet')}</p>
                    </div>
                </div>
                <Button className="create-case-btn" onClick={() => {
                    setEditCase(null);
                    setShowCreate(true);
                }}>{t('case.createCase')}</Button>
                {/* <Input
                    className="search-case"
                    value={keyword}
                    onChange={getSearchWord}
                    beforeFix={<SvgSearch />}
                    placeholder={t('placeholder.searchCase')}
                /> */}
                <DndProvider backend={HTML5Backend}>
                    <div className="case-menu-list">
                        {
                            caseList.map((item, index) => (
                                <DragNode
                                    index={index}
                                    nodeKey={item.case_id}
                                    key={item.case_id}
                                    moved={handleNodeDragEnd}
                                >
                                    <div className={cn('item', {
                                        select: open_case ? (open_case.scene_case_id ? open_case.scene_case_id : open_case.target_id) === item.case_id : false
                                    })} onClick={() => openCase(item)}>
                                        <div className="item-left">
                                            {
                                                from === 'auto_plan' && <Tooltip content={t('case.isRun')}>
                                                    <Switch checked={item.is_checked === 1} onChange={(value, e) => changeSwitch(item.case_id, value, e)} />
                                                </Tooltip>
                                            }
                                            <Tooltip content={item.case_name}>
                                                <p className="case-name" style={{ maxWidth: from === 'auto_plan' ? '50px' : '120px' }}>{item.case_name}</p>
                                            </Tooltip>
                                        </div>
                                        <Button className="more-btn" size="mini" onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            handleShowContextMenu(
                                                e,
                                                item,
                                                (state, editItem) => {
                                                    // 1: 编辑, 2: 删除
                                                    if (state === 1) {
                                                        setEditCase(editItem);
                                                        setShowCreate(true);
                                                    } else if (state === 2 || state === 3) {
                                                        getCaseList();
                                                    }
                                                }
                                            );
                                        }}>
                                            <SvgMore />
                                        </Button>

                                    </div>
                                </DragNode>
                            ))
                        }
                    </div>
                </DndProvider>
            </div>
            {
                showCreate && <CreateCase from={from} case={editCase} onCancel={() => {
                    setShowCreate(false);
                    setEditCase(null);
                }} />
            }
        </>
    )
};

export default CaseMenu;