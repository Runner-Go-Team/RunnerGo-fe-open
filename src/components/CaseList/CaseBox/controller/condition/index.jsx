import React, { useState, useEffect, useRef } from 'react';
import { Switch, Input, Select, Dropdown, Button } from 'adesign-react';
import { More as SvgMore } from 'adesign-react/icons';
import './index.less';
import { Handle, MarkerType } from 'react-flow-renderer';
// import { COMPARE_IF_TYPE } from '@constants/compare';
import { useSelector, useDispatch } from 'react-redux';
import Bus from '@utils/eventBus';

import SvgSuccess from '@assets/logo/success';
import SvgFailed from '@assets/logo/failed';
import SvgRunning from '@assets/logo/running';
import { cloneDeep } from 'lodash';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import SvgClose from '@assets/logo/close';

const { Option } = Select;

const ConditionController = (props) => {
    const { data: { id, from } } = props;
    const refDropdown = useRef(null);
    const { t } = useTranslation();

    const COMPARE_IF_TYPE = [
        { type: 'eq', title: t('apis.compareSelect.eq') },
        { type: 'uneq', title: t('apis.compareSelect.uneq') },
        { type: 'gt', title: t('apis.compareSelect.gt') },
        { type: 'gte', title: t('apis.compareSelect.gte') },
        { type: 'lt', title: t('apis.compareSelect.lt') },
        { type: 'lte', title: t('apis.compareSelect.lte') },
        { type: 'includes', title: t('apis.compareSelect.includes') },
        { type: 'unincludes', title: t('apis.compareSelect.unincludes') },
        { type: 'null', title: t('apis.compareSelect.null') },
        { type: 'notnull', title: t('apis.compareSelect.notnull') },
    ];

    const run_res = useSelector((store) => store.case.run_res);
    const edges = useSelector((store) => store.case.edges);
    const node_config = useSelector((store) => store.case.node_config);
    const init_scene = useSelector((store) => store.case.init_scene);
    const success_edge = useSelector((store) => store.case.success_edge);
    const failed_edge = useSelector((store) => store.case.failed_edge);
    const to_loading = useSelector((store) => store.case.to_loading);
    const open_scene = useSelector((store) => store.case.open_case);
    const running_scene = useSelector((store) => store.case.running_scene);
    const select_box = useSelector((store) => store.case.select_box);
    const dispatch = useDispatch();
    // 变量
    const [_var, setVar] = useState('');
    // 关系
    const [compare, setCompare] = useState('');
    // 变量值
    const [val, setVal] = useState('');
    // 备注
    const [remark, setRemark] = useState('');

    const [status, setStatus] = useState('default');

    useEffect(() => {
        const my_config = node_config[id];
        if (my_config) {
            const { var: _var, compare, val, remark } = my_config;
            _var && setVar(_var);
            compare && setCompare(compare);
            val && setVal(val);
            remark && setRemark(remark);
        }
    }, [node_config]);

    useEffect(() => {
        setStatus('default');
    }, [init_scene]);

    useEffect(() => {

        if (open_scene) {
            if (to_loading && running_scene === open_scene.scene_id) {
                setStatus('running');
            }
        }
    }, [to_loading])

    useEffect(() => {
        if (run_res) {
            const now_res = run_res.filter(item => item.event_id === id)[0];
            if (now_res) {
                const { status } = now_res;
                setStatus(status);

                update(edges, status);
            }
        }
    }, [run_res]);

    useEffect(() => {
        if (status === 'success' || status === 'failed') {
            update();
        }
    }, [open_scene]);

    const update = (edges, status) => {
        // const _open_scene = cloneDeep(open_scene);
        let temp = false;
        if (status === 'success') {
            // 以当前节点为顶点的线id
            // const successEdge = [];
            // const Node = [];

            edges.forEach(item => {
                if (item.source === id && !success_edge.includes(item.id)) {
                    temp = true;
                    success_edge.push(item.id);
                }
            })

            if (success_edge.length > 0 && temp) {
                dispatch({
                    type: 'case/updateSuccessEdge',
                    payload: success_edge,
                })
            }

        } else if (status === 'failed') {

            edges.forEach(item => {
                if (item.source === id) {
                    temp = true;
                    failed_edge.push(item.id);
                }
            })

            if (failed_edge.length > 0 && temp) {
                dispatch({
                    type: 'case/updateFailedEdge',
                    payload: failed_edge,
                })
            }
        }
    }

    const onTargetChange = (type, value) => {

        Bus.$emit('updateCaseNodeConfig', type, value, id);
    }

    const topBgStyle = {
        'default': '',
        'success': 'var(--run-green)',
        'failed': 'var(--run-red)',
        'running': '',
    };

    const topStatus = {
        'default': <></>,
        'success': <SvgSuccess className='default' />,
        'failed': <SvgFailed className='default' />,
        'running': <SvgRunning className='default' />,
    };

    const [selectBox, setSelectBox] = useState(false);

    const condition = document.querySelector('.controller-condition');
    const svgMouse = document.querySelector('.svgMouse');

    useEffect(() => {
        const boxMouseOver = () => {
            svgMouse.style.display = 'none';
        }

        document.addEventListener('click', (e) => clickOutSide(e))
        condition && condition.addEventListener('onmouseover', boxMouseOver);

        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
            condition.removeEventListener('onmouseover', boxMouseOver);
        }
    }, []);

    const clickOutSide = (e) => {
        let _box = document.querySelector('.selectBox');

        if (_box && !_box.contains(e.target)) {
            setSelectBox(false);
        }
    }

    useEffect(() => {
        if (select_box === id && selectBox === false) {

            setSelectBox(true);
        } else if (select_box !== id) {

            setSelectBox(false);
        }
    }, [select_box]);


    return (
        <div className={cn({
            selectBox: selectBox
        })} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectBox(true);

            dispatch({
                type: 'case/updateSelectBox',
                payload: id,
            })

        }}>
            <Handle
                type="target"
                position="top"
                id="a"
                className="my_handle"
            />
            <div className="controller-condition"
            >

                <div className={cn('controller-condition-header', { 'white-run-color': status === 'success' || status === 'failed' })} style={{ backgroundColor: topBgStyle[status] }} >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className='type'>
                            {t('scene.condition')}
                        </div>
                        {
                            topStatus[status]
                        }
                    </div>
                    <div className='drag-content'></div>
                    <div className='header-right'>
                        <SvgClose onClick={() => {
                            dispatch({
                                type: 'case/updateDeleteNode',
                                payload: id,
                            });
                        }} />
                    </div>
                </div>
                <div className='controller-condition-main'>
                    <div className='item'>
                        <p>if</p>
                        <Input value={_var} size="mini" placeholder={t('placeholder.varName')} onChange={(e) => {
                            onTargetChange('var', e);
                            setVar(e);
                        }} />
                    </div>
                    <div className='item'>
                        <Select
                            value={compare}
                            placeholder={t('placeholder.plsSelect')}
                            onChange={(e) => {
                                onTargetChange('compare', e);
                                setCompare(e);
                            }}
                        >
                            {
                                COMPARE_IF_TYPE.map(item => (
                                    <Option value={item.type}>{item.title}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className='item'>
                        <Input size="mini" disabled={compare === 'null' || compare === 'notnull'} value={val} onChange={(e) => {
                            setVal(e);
                            onTargetChange('val', e);
                        }} placeholder={t('placeholder.varVal')} />
                    </div>
                    <div className='item'>
                        <Input size="mini" value={remark} onChange={(e) => {
                            setRemark(e);
                            onTargetChange('remark', e);
                        }} placeholder={t('placeholder.remark')} />
                    </div>
                </div>
            </div>
            <Handle
                type="source"
                position="bottom"
                id="b"
                className="my_handle"
            />
        </div>
    )
};

export default ConditionController;