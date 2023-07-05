import React, { useState, useEffect } from 'react';
import './index.less';
import { Button, Message, Modal, Tooltip, Dropdown } from 'adesign-react';
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
import { fetchUpdateTPlan } from '@services/auto_plan';
import dayjs from 'dayjs';
import SvgSendEmail from '@assets/icons/SendEmail';
import SvgStop from '@assets/icons/Stop';
import SvgTask from '@assets/icons/taskConfig';
import { useTranslation } from 'react-i18next';
import { fetchEmailList } from '@services/plan';
import { fetchTPlanEmailList } from '@services/auto_plan';
import TestTaskConfig from '@modals/TestTaskConfig';
import { Input } from '@arco-design/web-react';
import { debounce } from 'lodash';
import InputText from '@components/InputText';

let auto_plan_task_t = null;

const TPlanDetailHeader = (props) => {
    const { onGetDetail } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [preSet, setPreSet] = useState(false);
    const [mode, setMode] = useState(1);
    const [mode_conf, setModeConf] = useState({});
    const [task_type, setTaskType] = useState(1);
    const [cron_expr, setCronExpr] = useState('');
    const open_plan = useSelector((store) => store.auto_plan.open_plan);
    const task_config = useSelector((store) => store.auto_plan.task_config);
    const email_list = useSelector((store) => store.auto_plan.email_list);
    const auto_plan_detail = useSelector((store) => store.auto_plan.auto_plan_detail);
    const is_open = useSelector((store) => store.websocket.is_open);

    const { id: plan_id } = useParams();
    const [planDetail, setPlanDetail] = useState({});
    const [showEmail, setShowEmail] = useState(false);
    const [emailList, setEmailList] = useState([]);
    const [planName, setPlanName] = useState('');
    const [planDesc, setPlanDesc] = useState('');


    useEffect(() => {
        if (is_open) {
            getReportDetail();
        }
        return () => {
            clearInterval(auto_plan_task_t);
        }
    }, [is_open]);


    const loopFetchGet = () => {
        clearInterval(auto_plan_task_t);
        auto_plan_task_t = setInterval(() => {
            getReportDetail();
        }, 1000);
    }

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

    useEffect(() => {
        if (auto_plan_detail) {
            const { status, plan_name, remark } = auto_plan_detail;

            setPlanName(plan_name);
            setPlanDesc(remark);
            setPlanDetail(auto_plan_detail);
            onGetDetail(auto_plan_detail);

            if (status === 1) {
                clearInterval(auto_plan_task_t);
            } else if (status === 2) {
                loopFetchGet();
            }
        }
    }, [auto_plan_detail]);

    const getReportDetail = () => {
        const query = {
            team_id: localStorage.getItem('team_id'),
            plan_id,
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "auto_plan_detail",
            param: JSON.stringify(query)
        }))
    }


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
            plan_name: planName,
            remark: planDesc,
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

    const runPlan = () => {
        Bus.$emit('runAutoPlan', plan_id, (code, data) => {
            setRunLoading(true);
            setTimeout(() => {
                setRunLoading(false);
            }, 5000);
            if (code === 0) {
                const { task_type } = data;

                if (task_type === 1) {
                    Message('success', t('message.runSuccess'))
                    navigate('/Treport/list');
                } else if (task_type === 2) {
                    Message('success', t('message.runTiming'));
                }
            }
        })
    }

    const debounceRunPlan = debounce(runPlan, 500);

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
                        navigate('/Tplan/list');
                    }} >
                        <SvgLeft />
                    </Button>
                    <div className='detail'>
                        <div className='detail-top'>
                            <p className='name'>
                                {t('plan.planManage')} /
                                <Tooltip
                                    placement="top"
                                    content={<div>{planName}</div>}
                                >
                                    <div style={{ marginLeft: '8px' }}>
                                        <InputText 
                                            maxLength={30}
                                            disabled={planDetail.status === 2}
                                            value={planName}
                                            onChange={(e) => {
                                                changePlanInfo('plan_name', e.trim());
                                            }}
                                        />
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
                                <InputText 
                                    maxLength={50}
                                    maxWidth={200}
                                    disabled={planDetail.status === 2}
                                    value={planDesc}
                                    onChange={(e) => {
                                        changePlanInfo('remark', e.trim())
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='detail-header-right'>
                    {/* <Button className='notice' onClick={() => setPreSet(true)}>{t('plan.preinstall')}</Button> */}
                    <Button className='notice' disabled={planDetail.status === 2} preFix={<SvgSendEmail width="16" height="16" />} onClick={() => Bus.$emit('openModal','Notice',{event_id:103,plan_id ,options:{plan_ids:[plan_id]}})}>{t('btn.notif')}</Button>
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
                                    <Button className='run' preFix={<SvgCareRight width="16" height="16" />} onClick={debounceRunPlan}>{t('btn.runPlan')}</Button>
                                </Tooltip> : <Button className='run' disabled={runLoading} preFix={<SvgCareRight width="16" height="16" />} onClick={debounceRunPlan}>{t('btn.runPlan')}</Button>
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
                showTaskConfig && <TestTaskConfig plan_id={plan_id} onCancel={() => setTaskConfig(false)} />
            }
        </>
    )
};

export default TPlanDetailHeader;