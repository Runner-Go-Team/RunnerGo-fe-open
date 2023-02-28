import React, { useState, useEffect } from 'react';
import './index.less';
import { Button, Input, Message, Modal, Tooltip, Dropdown } from 'adesign-react';
import {
    Left as SvgLeft,
    Save as SvgSave,
    CaretRight as SvgCareRight
} from 'adesign-react/icons';
import avatar from '@assets/logo/avatar.png';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// import TaskConfig from '../taskConfig';
import { cloneDeep } from 'lodash';
import Bus from '@utils/eventBus';
import { fetchTPlanDetail, fetchUpdateTPlan } from '@services/auto_plan';
import dayjs from 'dayjs';
import SvgSendEmail from '@assets/icons/SendEmail';
import SvgStop from '@assets/icons/Stop';
import SvgTask from '@assets/icons/taskConfig';
import { useTranslation } from 'react-i18next';
import InvitationModal from '@modals/ProjectInvitation';
import { fetchEmailList } from '@services/plan';
import { fetchTPlanEmailList } from '@services/auto_plan';
import TestTaskConfig from '@modals/TestTaskConfig';

const TPlanDetailHeader = (props) => {
    const { onGetDetail } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [preSet, setPreSet] = useState(false);
    const [mode_conf, setModeConf] = useState({});
    const task_config = useSelector((store) => store.auto_plan.task_config);
    const email_list = useSelector((store) => store.auto_plan.email_list);
    const { id: plan_id } = useParams();
    const [planDetail, setPlanDetail] = useState({});
    const [showEmail, setShowEmail] = useState(false);
    const [emailList, setEmailList] = useState([]);

    let auto_plan_task_t = null;


    useEffect(() => {
        getReportDetail();
    }, [plan_id]);

    useEffect(() => {
        getEmailList();
    }, [email_list]);

    const getEmailList = () => {
        const query = {
            plan_id,
            team_id: localStorage.getItem('team_id'),
        }
        fetchTPlanEmailList(query).subscribe({
            next: (res) => {
                const { data: { emails } } = res;
                setEmailList(emails);
            }
        })
    }

    const getReportDetail = () => {
        const query = {
            team_id: localStorage.getItem('team_id'),
            plan_id,
        };
        fetchTPlanDetail(query).subscribe({
            next: (res) => {
                console.log(res);
                const { data } = res;
                const { status } = data;
                if (status === 1 && auto_plan_task_t) {
                    clearInterval(auto_plan_task_t);
                } else if (status === 2 && !auto_plan_task_t) {
                    auto_plan_task_t = setInterval(() => {
                        getReportDetail();
                    }, 1000);
                }
                setPlanDetail(data);
                onGetDetail(data);
            }
        })
    }

    useEffect(() => {
        return () => {
            clearInterval(auto_plan_task_t);
        }
    }, []);

    const statusList = {
        '1': t('plan.notRun'),
        '2': <p style={{ color: 'var(--run-green)' }}>{t('plan.running')}</p>,
    }


    const changePlanInfo = (type, value) => {
        if (value.trim().length === 0 && type === 'plan_name') {
            Message('error', t('message.PlanNameEmpty'));
            return;
        }
        let params = {
            team_id: localStorage.getItem('team_id'),
            plan_name: planDetail.plan_name,
            remark: planDetail.remark,
            plan_id,
        };
        params[type] = value;
        fetchUpdateTPlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    getReportDetail();
                }
            }
        })
    }

    const [runLoading, setRunLoading] = useState(false);
    const [showTaskConfig, setTaskConfig] = useState(false);

    const is_changed_case = useSelector((store) => store.case.is_changed);
    const is_changed = useSelector((store) => store.auto_plan.is_changed);
    const nodes_auto_plan = useSelector((store) => store.auto_plan.nodes);
    const edges_auto_plan = useSelector((store) => store.auto_plan.edges);
    const id_apis_auto_plan = useSelector((d) => d.auto_plan.id_apis);
    const node_config_auto_plan = useSelector((d) => d.auto_plan.node_config);
    const open_scene = useSelector((d) => d.auto_plan.open_plan_scene);



    return (
        <>
            <div className='detail-header'>
                <div className='detail-header-left'>
                    <Button onClick={() => {
                        if (is_changed_case) {
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
                                        if (is_changed) {
                                            Modal.confirm({
                                                title: t('modal.tips'),
                                                content: t('modal.caseNotSave'),
                                                okText: t('btn.save'),
                                                cancelText: t('btn.cancel'),
                                                diyText: t('btn.notSave'),
                                                onOk: () => {
                                                    // 保存当前场景
                                                    Bus.$emit('saveSceneAutoPlan', nodes_auto_plan, edges_auto_plan, id_apis_auto_plan, node_config_auto_plan, open_scene, plan_id, () => {
                                                        Message('success', t('message.saveSuccess'));
                                                        navigate('/Tplan/list');
                                                    });

                                                },
                                                onCancel: () => {
                                                    // 取消弹窗

                                                },
                                                onDiy: () => {
                                                    navigate('/Tplan/list');
                                                }
                                            })
                                        } else {
                                            navigate('/Tplan/list');
                                        }
                                    });

                                },
                                onCancel: () => {
                                    // 取消弹窗

                                },
                                onDiy: () => {

                                    // 不保存, 直接跳转
                                    if (is_changed) {
                                        Modal.confirm({
                                            title: t('modal.tips'),
                                            content: t('modal.caseNotSave'),
                                            okText: t('btn.save'),
                                            cancelText: t('btn.cancel'),
                                            diyText: t('btn.notSave'),
                                            onOk: () => {
                                                // 保存当前场景
                                                Bus.$emit('saveSceneAutoPlan', nodes_auto_plan, edges_auto_plan, id_apis_auto_plan, node_config_auto_plan, open_scene, plan_id, () => {
                                                    Message('success', t('message.saveSuccess'));
                                                    navigate('/Tplan/list');
                                                });

                                            },
                                            onCancel: () => {
                                                // 取消弹窗

                                            },
                                            onDiy: () => {
                                                // 不保存, 直接跳转
                                                navigate('/Tplan/list');
                                            }
                                        })
                                    } else {
                                        navigate('/Tplan/list');
                                    }
                                }
                            })
                        } else {
                            if (is_changed) {
                                Modal.confirm({
                                    title: t('modal.tips'),
                                    content: t('modal.caseNotSave'),
                                    okText: t('btn.save'),
                                    cancelText: t('btn.cancel'),
                                    diyText: t('btn.notSave'),
                                    onOk: () => {
                                        // 保存当前场景
                                        Bus.$emit('saveSceneAutoPlan', nodes_auto_plan, edges_auto_plan, id_apis_auto_plan, node_config_auto_plan, open_scene, plan_id, () => {
                                            Message('success', t('message.saveSuccess'));
                                            navigate('/Tplan/list');
                                        });

                                    },
                                    onCancel: () => {
                                        // 取消弹窗

                                    },
                                    onDiy: () => {
                                        // 不保存, 直接跳转
                                        navigate('/Tplan/list');
                                    }
                                })
                            } else {
                                navigate('/Tplan/list');
                            }
                        }
                    }} >
                        <SvgLeft />
                    </Button>
                    <div className='detail'>
                        <div className='detail-top'>
                            <p className='name'>
                                {t('plan.planManage')} /
                                <Tooltip
                                    placement="top"
                                    content={<div>{planDetail.plan_name}</div>}
                                >
                                    <div style={{ marginLeft: '8px' }}>
                                        <Input disabled={planDetail.status === 2} value={planDetail.plan_name} onBlur={(e) => changePlanInfo('plan_name', e.target.value)} />
                                    </div>
                                </Tooltip>
                            </p>
                            <p className='status' style={{ color: planDetail.status === 2 ? 'var(--run-green)' : 'var(--font-color)' }}>
                                {statusList[planDetail.status]}
                            </p>
                        </div>
                        <div className='detail-bottom'>
                            <div className='item'>
                                <p>{t('plan.createdBy')}：{planDetail.user_name}</p>
                                <img src={planDetail.avatar || avatar} />
                                <p style={{ marginLeft: '4px' }}></p>
                            </div>
                            <div className='item'>
                                {t('plan.createTime')}：{dayjs(planDetail.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className='item'>
                                {t('plan.updateTime')}：{dayjs(planDetail.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className='item'>
                                {t('plan.planDesc')}:
                                <Input disabled={planDetail.status === 2} value={planDetail.remark} onBlur={(e) => changePlanInfo('remark', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='detail-header-right'>
                    {/* <Button className='notice' onClick={() => setPreSet(true)}>{t('plan.preinstall')}</Button> */}
                    <Button className='notice' disabled={planDetail.status === 2} preFix={<SvgSendEmail width="16" height="16" />} onClick={() => setShowEmail(true)}>{t('btn.notifyEmail')}</Button>
                    {
                        planDetail.status === 1
                            ?
                            <Button className='notice' preFix={<SvgTask width="13" height="13" />} onClick={() => setTaskConfig(true)}>{t('plan.taskConfig')}</Button>
                            :
                            <Tooltip content={t('plan.cantEdit')}>
                                <Button className='notice' disabled={true} preFix={<SvgTask width="13" height="13" />} onClick={() => setTaskConfig(true)}>{t('plan.taskConfig')}</Button>
                            </Tooltip>
                    }
                    {
                        planDetail.status === 1
                            ? (
                                emailList && emailList.length > 0 ? <Tooltip placement="top-end" content={<div style={{ whiteSpace: 'nowrap' }}>{t('message.runPlanTooltip')}</div>}>
                                    <Button className='run' preFix={<SvgCareRight width="16" height="16" />} onClick={() => Bus.$emit('runAutoPlan', plan_id, (code, data) => {
                                        setRunLoading(true);
                                        setTimeout(() => {
                                            setRunLoading(false);
                                        }, 5000);
                                        if (code === 0) {
                                            const { task_type } = data;

                                            getReportDetail();

                                            auto_plan_task_t = setInterval(() => {
                                                getReportDetail();
                                            }, 1000);
                                            if (task_type === 1) {
                                                Message('success', t('message.runSuccess'))
                                                navigate('/Treport/list');
                                            } else if (task_type === 2) {
                                                Message('success', t('message.runTiming'));
                                            }
                                        }
                                    })}>{t('btn.runPlan')}</Button>
                                </Tooltip> : <Button className='run' disabled={runLoading} preFix={<SvgCareRight width="16" height="16" />} onClick={() => {
                                    setRunLoading(true);
                                    setTimeout(() => {
                                        setRunLoading(false);
                                    }, 5000);
                                    Bus.$emit('runAutoPlan', plan_id, (code, data) => {
                                        if (code === 0) {
                                            const { task_type } = data;
                                            getReportDetail();

                                            auto_plan_task_t = setInterval(() => {
                                                getReportDetail();
                                            }, 1000);
                                            if (task_type === 1) {
                                                Message('success', t('message.runSuccess'))
                                                navigate('/Treport/list');
                                            } else if (task_type === 2) {
                                                Message('success', t('message.runTiming'));
                                            }
                                        }
                                    })
                                }}>{t('btn.runPlan')}</Button>
                            )
                            : <Button className='stop' preFix={<SvgStop width="10" height="10" />} onClick={() => Bus.$emit('stopAutoPlan', plan_id, (code) => {
                                if (code === 0) {
                                    Message('success', t('message.stopSuccess'));
                                    getReportDetail();
                                } else {
                                    Message('error', t('message.stopError'));
                                }
                            })} >{t('btn.stopRun')}</Button>
                    }
                </div>
            </div>

            {
                showEmail && <InvitationModal from="auto_plan" email={true} onCancel={() => setShowEmail(false)} />
            }
            {
                showTaskConfig && <TestTaskConfig plan_id={plan_id} onCancel={() => setTaskConfig(false)} />
            }

        </>
    )
};

export default TPlanDetailHeader;