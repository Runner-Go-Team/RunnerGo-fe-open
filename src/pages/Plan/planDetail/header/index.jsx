import React, { useState, useEffect } from 'react';
import './index.less';
import { Button, Input, Message, Modal, Dropdown } from 'adesign-react';
import {
    Left as SvgLeft,
    Save as SvgSave,
    CaretRight as SvgCareRight
} from 'adesign-react/icons';
import avatar from '@assets/logo/avatar.png';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TaskConfig from '../taskConfig';
import { cloneDeep } from 'lodash';
import Bus from '@utils/eventBus';
import { fetchPlanDetail, fetchSavePlan, fetchRunPlan, fetchStopPlan, fetchCreatePlan } from '@services/plan';
import { fetchUseVum } from '@services/pay';
import dayjs from 'dayjs';
import SvgSendEmail from '@assets/icons/SendEmail';
import SvgStop from '@assets/icons/Stop';
import { useTranslation } from 'react-i18next';
import InvitationModal from '@modals/ProjectInvitation';
import { fetchEmailList } from '@services/plan';
import { Tooltip } from '@arco-design/web-react';

const DetailHeader = (props) => {
    const { onGetDetail } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [preSet, setPreSet] = useState(false);
    const [mode_conf, setModeConf] = useState({});

    const task_config = useSelector((store) => store.plan.task_config);
    const email_list = useSelector((store) => store.plan.email_list);
    const { id: plan_id } = useParams();
    const [planDetail, setPlanDetail] = useState({});
    const [showEmail, setShowEmail] = useState(false);
    const [emailList, setEmailList] = useState([]);

    const taskList = {
        '0': '-',
        '1': t('plan.taskList.commonTask'),
        '2': t('plan.taskList.cronTask'),
        '3': t('plan.taskList.mixTask')
    };

    let plan_task_t = null;

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
        fetchEmailList(query).subscribe({
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
        fetchPlanDetail(query).subscribe({
            next: (res) => {
                const { data: { plan } } = res;
                const { status } = plan;
                if (status === 1 && plan_task_t) {
                    clearInterval(plan_task_t);
                } else if (status === 2 && !plan_task_t) {
                    plan_task_t = setInterval(() => {
                        getReportDetail();
                    }, 1000);
                }
                setPlanDetail(plan);
                onGetDetail(plan);
            }
        })
    }

    useEffect(() => {
        return () => {
            clearInterval(plan_task_t);
        }
    }, []);

    const savePreSet = (e) => {

    }

    const statusList = {
        '1': t('plan.notRun'),
        '2': <p style={{ color: 'var(--run-green)' }}>{t('plan.running')}</p>,
    }

    const onConfigChange = (type, value) => {
        if (type === 'task_type') {
            setTaskType(value);
        } else if (type === 'cron_expr') {
            setCronExpr(value);
        } else if (type === 'mode') {
            setMode(value);
        } else {
            const _mode_conf = cloneDeep(mode_conf);
            _mode_conf[type] = value;
            setModeConf(_mode_conf);
        }
    };

    const changePlanInfo = (type, value) => {
        if (value.trim().length === 0 && type === 'plan_name') {
            Message('error', t('message.PlanNameEmpty'));
            return;
        }
        let params = {
            team_id: localStorage.getItem('team_id'),
            plan_name: planDetail.plan_name,
            remark: planDetail.remark,
            task_type: planDetail.task_type,
            plan_id,
        };
        params[type] = value;
        fetchCreatePlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    getReportDetail();
                }
            }
        })
    }

    const [runLoading, setRunLoading] = useState(false);

    return (
        <>
            <div className='detail-header'>
                <div className='detail-header-left'>
                    <Button onClick={() => navigate('/plan/list')} >
                        <SvgLeft />
                    </Button>
                    <div className='detail'>
                        <div className='detail-top'>
                            <p className='name'>
                                {t('plan.planManage')} /
                                <Tooltip
                                    content={planDetail.plan_name}
                                >
                                    <div style={{ marginLeft: '8px' }}>
                                        <Input disabled={planDetail.status === 2} value={planDetail.plan_name} onBlur={(e) => changePlanInfo('plan_name', e.target.value)} />
                                    </div>
                                </Tooltip>
                            </p>
                            <p className='status' style={{ color: planDetail.status === 2 ? 'var(--run-green)' : 'var(--font-color)' }}>
                                {statusList[planDetail.status]}
                            </p>
                            <p className='task-type'>
                                {taskList[planDetail.task_type]}
                            </p>
                        </div>
                        <div className='detail-bottom'>
                            <div className='item'>
                                <p>{t('plan.createdBy')}：{planDetail.created_user_name}</p>
                                <img src={planDetail.created_user_avatar || avatar} />
                                <p style={{ marginLeft: '4px' }}></p>
                            </div>
                            <div className='item'>
                                {t('plan.createTime')}：{dayjs(planDetail.created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className='item'>
                                {t('plan.updateTime')}：{dayjs(planDetail.updated_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss')}
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
                    <Button className='notice' disabled={planDetail.status !== 1} preFix={<SvgSendEmail width="16" height="16" />} onClick={() => setShowEmail(true)}>{t('btn.notifyEmail')}</Button>
                    {
                        planDetail.status === 1
                            ? (
                                emailList && emailList.length > 0 ? <Tooltip content={t('message.runPlanTooltip')}>
                                    <Button className='run' preFix={<SvgCareRight width="16" height="16" />} onClick={() => {
                                        setRunLoading(true);
                                        setTimeout(() => {
                                            setRunLoading(false);
                                        }, 5000);
                                        Bus.$emit('runPlan', plan_id, (code) => {
                                            if (code === 0) {
                                                getReportDetail();
                                                // 轮询查计划的运行状态, 结束后就退出
                                                plan_task_t = setInterval(() => {
                                                    getReportDetail();
                                                }, 1000);
                                                if (planDetail.task_type === 1) {
                                                    Message('success', t('message.runSuccess'))
                                                    navigate('/report/list');
                                                } else if (planDetail.task_type === 2) {
                                                    Message('success', t('message.runTiming'));
                                                }
                                            }
                                        })
                                    }}>{t('btn.runPlan')}</Button>
                                </Tooltip> : <Button className='run' disabled={runLoading} preFix={<SvgCareRight width="16" height="16" />} onClick={() => {
                                    setRunLoading(true);
                                    setTimeout(() => {
                                        setRunLoading(false);
                                    }, 5000);
                                    Bus.$emit('runPlan', plan_id, (code) => {
                                        if (code === 0) {
                                            getReportDetail();
                                            // 轮询查计划的运行状态, 结束后就退出
                                            plan_task_t = setInterval(() => {
                                                getReportDetail();
                                            }, 1000);
                                            if (planDetail.task_type === 1) {
                                                Message('success', t('message.runSuccess'))
                                                navigate('/report/list');
                                            } else if (planDetail.task_type === 2) {
                                                Message('success', t('message.runTiming'));
                                            }
                                        }
                                    })
                                }}>{t('btn.runPlan')}</Button>
                            )
                            : <Button className='stop' preFix={<SvgStop width="10" height="10" />} onClick={() => Bus.$emit('stopPlan', plan_id, (code) => {
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
                preSet && (
                    <Modal title={t('plan.preinstall')} okText={t('btn.save')} cancelText={t('btn.cancel')} onOk={() => {
                        const { task_type, mode, cron_expr, mode_conf } = task_config;
                        Bus.$emit('savePreConfig', { task_type, mode, cron_expr, mode_conf }, () => {
                            setPreSet(false);
                            Message('success', t('message.saveSuccess'));
                        }, plan_id)
                    }} visible onCancel={() => setPreSet(false)}>
                        <TaskConfig onChange={(type, value) => onConfigChange(type, value)} from="preset" />
                    </Modal>
                )
            }
            {
                showEmail && <InvitationModal from="plan" email={true} onCancel={() => setShowEmail(false)} />
            }
        </>
    )
};

export default DetailHeader;