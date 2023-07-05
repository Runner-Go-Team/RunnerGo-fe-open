import React, { useState, useEffect } from "react";
import './index.less';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import {
    Down as SvgDown,
    Right as SvgRight,
    More as SvgMore
} from 'adesign-react/icons';
import { Dropdown, Menu, Button } from '@arco-design/web-react';
import { Drawer } from 'adesign-react';
import SvgSql from '@assets/icons/sql';


const { Item: MenuItem } = Menu;

const MysqlBox = (props) => {
    const {
        data: {
            from,
            id,
        }
    } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    // 当前节点是否选中
    const [selectBox, setSelectBox] = useState(false);
    // 当前节点是否收起
    const [isHide, setIsHide] = useState(false);
    // 当前节点状态
    const [status, setStatus] = useState('default');

    const refresh_box = useSelector((store) => store.scene.refresh_box);
    const run_res_scene = useSelector((store) => store.scene.run_res);


    const id_apis_scene = useSelector((store) => store.scene.id_apis);
    const id_apis_plan = useSelector((store) => store.plan.id_apis);
    const id_apis_auto_plan = useSelector((store) => store.auto_plan.id_apis);
    const id_apis_case = useSelector((store) => store.case.id_apis);
    const run_res_plan = useSelector((store) => store.plan.run_res);

    const id_now_scene = useSelector((store) => store.scene.id_now);
    const id_now_plan = useSelector((store) => store.plan.id_now);
    const id_now_auto_plan = useSelector((store) => store.auto_plan.id_now);
    const id_now_case = useSelector((store) => store.case.id_now);
    const run_res_auto_plan = useSelector((store) => store.auto_plan.run_res);

    const select_box_scene = useSelector((store) => store.scene.select_box);
    const select_box_plan = useSelector((store) => store.plan.select_box);
    const select_box_auto_plan = useSelector((store) => store.auto_plan.select_box);
    const select_box_case = useSelector((store) => store.case.select_box);
    const run_res_case = useSelector((store) => store.case.run_res);


    const select_box_list = {
        'scene': select_box_scene,
        'plan': select_box_plan,
        'auto_plan': select_box_auto_plan,
        'case': select_box_case
    }
    const select_box = select_box_list[from];


    const id_apis_list = {
        'scene': id_apis_scene,
        'plan': id_apis_plan,
        'auto_plan': id_apis_auto_plan,
        'case': id_apis_case
    };
    const id_apis = id_apis_list[from];

    console.log(id_apis, id, id_apis[id]);

    const id_now_list = {
        'scene': id_now_scene,
        'plan': id_now_plan,
        'auto_plan': id_now_auto_plan,
        'case': id_now_case
    };

    const id_now = id_now_list[from];

    const run_res_list = {
        'scene': run_res_scene,
        'plan': run_res_plan,
        'auto_plan': run_res_auto_plan,
        'case': run_res_case
    }
    const run_res = run_res_list[from];

    useEffect(() => {
        if (run_res) {
            const now_res = run_res.filter(item => item.event_id === id)[0];
            if (now_res) {
                const { status } = now_res;
                setStatus(status);
            }
        }
    }, [run_res]);

    const clickBox = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectBox(true);

        const api_now = cloneDeep(id_apis[id]);
        api_now.id = id;

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateApiNow',
                payload: api_now,
            })
            // dispatch({
            //     type: 'scene/updateIdNow',
            //     payload: id,
            // })
            dispatch({
                type: 'scene/updateSelectBox',
                payload: id,
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateApiNow',
                payload: api_now,
            })
            // dispatch({
            //     type: 'plan/updateIdNow',
            //     payload: id,
            // })
            dispatch({
                type: 'plan/updateSelectBox',
                payload: id,
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateApiNow',
                payload: api_now,
            })
            // dispatch({
            //     type: 'auto_plan/updateIdNow',
            //     payload: id,
            // })
            dispatch({
                type: 'auto_plan/updateSelectBox',
                payload: id,
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateApiNow',
                payload: api_now,
            })
            // dispatch({
            //     type: 'case/updateIdNow',
            //     payload: id,
            // })
            dispatch({
                type: 'case/updateSelectBox',
                payload: id,
            })
        }
    }

    const hideOrOpen = () => {
        setIsHide(!isHide);
    }

    const deleteMysqlNode = () => {
        console.log(from, id_now, id);
        if (from === 'scene') {
            dispatch({
                type: 'scene/updateDeleteNode',
                payload: id,
            });

            if (id_now === id) {
                dispatch({
                    type: 'scene/updateApiConfig',
                    payload: {}
                })
            }
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateDeleteNode',
                payload: id,
            });

            if (id_now === id) {
                dispatch({
                    type: 'plan/updateApiConfig',
                    payload: {}
                })
            }
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateDeleteNode',
                payload: id,
            });

            if (id_now === id) {
                dispatch({
                    type: 'auto_plan/updateApiConfig',
                    payload: {}
                })
            }
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateDeleteNode',
                payload: id,
            });

            if (id_now === id) {
                dispatch({
                    type: 'case/updateApiConfig',
                    payload: {}
                })
            }
        }
    }

    const changeApiConfig = (e, id, showAssert) => {
        e.preventDefault();
        e.stopPropagation();
        const api_now = cloneDeep(id_apis[id]);
        api_now.id = id;

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateApiConfig',
                payload: {
                    type: 'sql',
                    status: true,
                    id,
                    api_now,
                }
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateApiConfig',
                payload: {
                    type: 'sql',
                    status: true,
                    id,
                    api_now,
                }
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateApiConfig',
                payload: {
                    type: 'sql',
                    status: true,
                    id,
                    api_now,
                }
            })
            dispatch({
                type: 'auto_plan/updateShowAssert',
                payload: !!showAssert
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateApiConfig',
                payload: {
                    type: 'sql',
                    status: true,
                    id,
                    api_now,
                }
            })
            dispatch({
                type: 'case/updateShowAssert',
                payload: !!showAssert
            })
        }
    };

    const dropList = (
        <Menu>
            <MenuItem key="1" onClick={(e) => changeApiConfig(e, id)}>编辑</MenuItem>
            <MenuItem key="1" onClick={deleteMysqlNode}>删除</MenuItem>
        </Menu>
    );


    useEffect(() => {
        document.addEventListener('click', (e) => clickOutSide(e));


        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
        }
    }, []);

    const clickOutSide = (e) => {

        let _box = document.querySelector('.selectBox');
        let _drawer = document.querySelector('.api-config-drawer');


        if (_box && !_box.contains(e.target) && _drawer && !_drawer.contains(e.target) && ![...e.target.classList].includes('drawer-save-btn') && ![...e.target.classList].includes('drawer-close-btn')) {

            setSelectBox(false);
        }
    }

    useEffect(() => {

        if (select_box === id && !selectBox) {

            setSelectBox(true);
        } else if (select_box !== id) {

            setSelectBox(false);
        }
    }, [select_box]);


    return (
        <>
            <div
                className={cn('scene-mysql-box', {
                    selectBox: selectBox
                })}
                style={{ height: isHide ? (status === 'success' || status === 'failed' ? '76px' : '50px')  : 'auto' }}
                onClick={clickBox}
            >
                <div className='header'>
                    <p>前置条件</p>
                    <div className='drag-content'>

                    </div>
                    {
                        isHide ? <SvgRight onClick={hideOrOpen} /> : <SvgDown onClick={hideOrOpen} />
                    }
                </div>

                {
                    !isHide ? <div className={cn('container', {
                        'success': status === 'success',
                        'failed': status === 'failed'
                    })}>
                        <div className="left" style={{ color: status === 'success' || status === 'failed' ? 'var(--common-white)' : 'var(--font-1)' }}>
                            <SvgSql />
                            <p>{(id_apis && id_apis[id]) ? id_apis[id].name : '新建SQL'}</p>
                        </div>
                        <Dropdown droplist={dropList} position='bl' trigger='click'>
                            <SvgMore />
                        </Dropdown>
                    </div> : <></>
                }
                {
                    status === 'success' || status === 'failed' ? <div className="view-result">
                        <Button onClick={(e) => changeApiConfig(e, id)}>查看结果</Button>
                    </div> : <></>
                }
            </div>
        </>
    )
};

export default MysqlBox;