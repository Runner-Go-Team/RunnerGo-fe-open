import React, { useState, useEffect } from "react";
import { Button, Message, Tooltip, Modal, Dropdown } from 'adesign-react';
import './index.less';
import {
    Iconeye as SvgEye,
    Copy as SvgCopy,
    Delete as SvgDelete,
    CaretRight as SvgRun,

} from 'adesign-react/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import Bus from '@utils/eventBus';
// import Pagination from '@components/Pagination';
import SvgEmpty from '@assets/img/empty';
import { useTranslation } from 'react-i18next';
import SvgStart from '@assets/icons/Start';
import SvgStop from '@assets/icons/Stop';
import TPlanListHeader from "./listHeader";
import { fetchTPlanList } from '@services/auto_plan';
import dayjs from "dayjs";
import { global$ } from '@hooks/useGlobal/global';
import { fetchCopyPlan } from '@services/auto_plan';


import { DatePicker, Table, Pagination } from '@arco-design/web-react';

const TestPlanList = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [planList, setPlanList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(parseInt(localStorage.getItem('plan_pagesize')) || 10);
    const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('plan_page')) || 1);

    const [taskType, setTaskType] = useState(0);
    const [taskMode, setTaskMode] = useState(0);
    const [status, setStatus] = useState(0);
    const [sort, setSort] = useState(0);

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);

    const [showTeamExpiration, setShowExpiration] = useState(false);

    const dispatch = useDispatch();
    const refreshList = useSelector((store) => store.auto_plan.refreshList);

    const language = useSelector((d) => d.user.language);
    const theme = useSelector((d) => d.user.theme);

    const modeList = {
        '1': t('plan.modeList.1'),
        '2': t('plan.modeList.2'),
        '3': t('plan.modeList.3'),
        '4': t('plan.modeList.4'),
        '5': t('plan.modeList.5'),
        '6': t('plan.modeList.6'),
        '7': t('plan.modeList.7')
    };

    const taskList = {
        '0': '-',
        '1': t('plan.taskList.commonTask'),
        '2': t('plan.taskList.cronTask'),
        '3': t('plan.taskList.mixTask')
    };
    const statusList = {
        '1': t('plan.statusList.1'),
        '2': <p style={{ color: 'var(--run-green)' }}>{t('plan.statusList.2')}</p>,
    };

    const copyPlan = (plan_id) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            plan_id,
        };
        fetchCopyPlan(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.copySuccess'));
                    getPlanList();
                } else {
                    Message('error', t('message.copyError'));
                }
            }
        })
    }

    const [runLoading, setRunLoading] = useState(false);

    const HandleContent = (props) => {
        const { data } = props;
        const { status, plan_id } = data;
        return (
            <div className='handle-content'>
                {status === 2 ? <Tooltip bgColor="var(--select-hover)" content={t('tooltip.stop')}>
                    <div>
                        <Button preFix={<SvgStop />} className='stop-btn' onClick={() => Bus.$emit('stopAutoPlan', plan_id, (code) => {
                            if (code === 0) {
                                Message('success', t('message.stopSuccess'));
                                getPlanList();
                            } else {
                                Message('error', t('message.stopError'));
                            }
                        })}>{t('btn.finish')}</Button>
                    </div>
                </Tooltip> :
                    <Tooltip bgColor="var(--select-hover)" content={t('tooltip.start')}>
                        <div>
                            <Button preFix={<SvgStart />} className='run-btn' disabled={runLoading} onClick={() => {
                                setRunLoading(true);
                                setTimeout(() => {
                                    setRunLoading(false);
                                }, 5000);
                                Bus.$emit('runAutoPlan', plan_id, (code, data) => {
                                    if (code === 0) {
                                        const { task_type } = data;
                                        getPlanList();
                                        if (task_type === 1) {
                                            Message('success', t('message.runSuccess'))
                                            navigate('/Treport/list');
                                        } else if (task_type === 2) {
                                            Message('success', t('message.runTiming'));
                                        }
                                    }
                                })
                            }}>{t('btn.start')}</Button>
                        </div>
                    </Tooltip>}
                {/* <div className='handle-icons'> */}
                <Tooltip bgColor="var(--select-hover)" content={t('tooltip.view')}>
                    <div>
                        <SvgEye onClick={() => {
                            dispatch({
                                type: 'auto_plan/updateOpenPlan',
                                payload: data
                            })
                            dispatch({
                                type: 'auto_plan/updateOpenScene',
                                payload: null,
                            })

                            dispatch({
                                type: 'case/updateShowCase',
                                payload: false
                            })
                            dispatch({
                                type: 'case/updateOpenCase',
                                payload: null,
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
                                payload: null
                            })

                            // 进去后默认打开第一个
                            dispatch({
                                type: 'auto_plan/updateOpenFirst',
                                payload: true
                            })

                            dispatch({
                                type: 'auto_plan/updatePlanMenu',
                                payload: {}
                            })

                            setTimeout(() => {
                                global$.next({
                                    action: 'RELOAD_LOCAL_AUTO_PLAN',
                                    id: plan_id,
                                });
                                navigate(`/Tplan/detail/${plan_id}`);
                            }, 100);
                        }} />
                    </div>
                </Tooltip>
                <Tooltip bgColor="var(--select-hover)" content={t('tooltip.copy')}>
                    <div>
                        <SvgCopy onClick={debounce(() => copyPlan(plan_id), 250)} />
                    </div>
                </Tooltip>
                <Tooltip bgColor="var(--select-hover)" content={t('tooltip.delete')}>
                    <div>
                        <SvgDelete style={{ fill: '#f00', marginRight: 0 }} onClick={() => {
                            Modal.confirm({
                                title: t('modal.look'),
                                content: t('modal.deletePlan'),
                                okText: t('btn.ok'),
                                cancelText: t('btn.cancel'),
                                onOk: () => {
                                    Bus.$emit('deleteTPlan', plan_id, (code) => {
                                        if (code === 0) {
                                            Message('success', t('message.deleteSuccess'));
                                        } else {
                                            Message('error', t('message.deleteError'));
                                        }
                                    })
                                }
                            })
                        }} />
                    </div>
                </Tooltip>
                {/* </div> */}
            </div>
        )
    }

    let auto_plan_t = null;
    useEffect(() => {
        getPlanList();
        if (auto_plan_t) {
            clearInterval(auto_plan_t);
        }
        auto_plan_t = setInterval(getPlanList, 1000);

        return () => {
            clearInterval(auto_plan_t);
        }
    }, [refreshList, keyword, currentPage, pageSize, startTime, endTime, taskType, status, sort, language]);

    const getPlanList = () => {
        const params = {
            page: currentPage,
            size: pageSize,
            team_id: localStorage.getItem('team_id'),
            plan_name: keyword,
            start_time_sec: startTime,
            end_time_sec: endTime,
            task_type: taskType,
            status,
            sort
        };
        fetchTPlanList(params).subscribe({
            next: (res) => {
                const { data: { auto_plan_list, total } } = res;
                if (auto_plan_list && auto_plan_list.length === 0 && currentPage > 1) {
                    pageChange(currentPage - 1, pageSize);
                }
                setTotal(total);
                const planList = auto_plan_list ? auto_plan_list.map(item => {
                    const { task_type, mode, status, created_at, updated_at, plan_name, user_name, remark } = item;
                    return {
                        ...item,
                        plan_name:
                            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} className='tooltip-diy' content={<div>{plan_name}</div>}>
                                <div className='ellipsis'>{plan_name}</div>
                            </Tooltip>,
                        user_name:
                            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} className='tooltip-diy' content={<div>{user_name}</div>}>
                                <div className='ellipsis'>{user_name}</div>
                            </Tooltip>,
                        remark:
                            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} className='tooltip-diy' content={<div>{remark}</div>}>
                                <div className='ellipsis'>{remark}</div>
                            </Tooltip>,
                        task_type: taskList[task_type],
                        mode: modeList[mode],
                        status: statusList[status],
                        canDelete: status === 1,
                        created_at: dayjs(created_at * 1000).format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: dayjs(updated_at * 1000).format('YYYY-MM-DD HH:mm:ss'),
                        handle: <HandleContent data={item} />
                    }
                }) : [];
                setPlanList(planList);
            }
        })
    }


    const columns = [
        {
            title: t('plan.rankId'),
            dataIndex: 'rank_id',
            // width: 84,
        },
        {
            title: t('plan.status'),
            dataIndex: 'status',
            filterMultiple: false,
            filters: [
                { text: t('plan.statusList.1'), value: 1 },
                { text: t('plan.statusList.2'), value: 2 }
            ],
            onFilter: (value, item) => {
                setStatus(value);
                return true;
            },
            // width: 190,
        },
        {
            title: t('plan.planName'),
            dataIndex: 'plan_name',
            ellipsis: true
            // width: 190,
        },
        {
            title: t('plan.taskType'),
            dataIndex: 'task_type',
            filterMultiple: false,
            // filters: [
            //     { text: t('plan.taskList.commonTask'), value: 1 },
            //     { text: t('plan.taskList.cronTask'), value: 2 },
            //     { text: t('plan.taskList.mixTask'), value: 3 },
            // ],
            // onFilter: (value, item) => {
            //     setTaskType(value);
            //     return true;
            // },
            width: 135
        },
        {
            title: t('plan.createTime'),
            dataIndex: 'created_at',
            width: 190,
            sorter: true
        },
        {
            title: t('plan.updateTime'),
            dataIndex: 'updated_at',
            width: 190,
            sorter: true
        },
        {
            title: t('plan.operator'),
            dataIndex: 'user_name',
            ellipsis: true
            // width: 190,
        },
        {
            title: t('plan.remark'),
            dataIndex: 'remark',
            ellipsis: true
            // width: 190,
        },
        {
            title: t('plan.handle'),
            dataIndex: 'handle',
            width: 196,
            fixed: 'right'
        }
    ];

    const getNewkeyword = debounce((e) => setKeyword(e), 500);

    const getSelectDate = (startTime, endTime) => {
        setStartTime(startTime);
        setEndTime(endTime);
    }

    const pageChange = (page, size) => {
        if (size !== pageSize) {
            localStorage.setItem('plan_pagesize', size);
        }
        sessionStorage.setItem('plan_page', page)
        page !== currentPage && setCurrentPage(page);
        size !== pageSize && setPageSize(size);
    }

    const renderRow = (tableData, renderRowItem) => {
        return (
            <tbody>
                {tableData.map((tableRowData, rowIndex) => {
                    const rowComp = React.cloneElement(renderRowItem(tableRowData, rowIndex), {
                        key: rowIndex,
                        onDoubleClick(tableRowData) {
                            const { plan_id } = tableData[rowIndex];

                            dispatch({
                                type: 'plan/updateOpenPlan',
                                payload: tableData[rowIndex]
                            })
                            dispatch({
                                type: 'plan/updateOpenScene',
                                payload: null,
                            })
                            // let planMap = JSON.parse(localStorage.getItem('planMap') || '{}');
                            // if (planMap[plan_id]) {
                            //     Bus.$emit('addOpenPlanScene', { target_id: planMap[plan_id] }, id_apis_plan, node_config_plan)
                            // }
                            navigate(`/plan/detail/${plan_id}`);
                        },
                    });
                    return rowComp;
                })}
            </tbody>
        );
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectPlan, setSelectPlan] = useState([]);

    useEffect(() => {
        setSelectedRowKeys([]);
        setSelectPlan([]);
    }, [refreshList]);


    return (
        <div className='plan'>
            <TPlanListHeader onChange={getNewkeyword} onDateChange={getSelectDate} selectPlan={selectPlan} />
            <Table
                className="plan-table"
                showSorterTooltip={false}
                border={{
                    wrapper: true,
                    cell: true,
                }}
                scroll={{
                    x: 1737,
                }}
                pagination={false}
                columns={columns}
                data={planList}
                noDataElement={<div className='empty'><SvgEmpty /> <p>{t('index.emptyData')}</p> </div>}
                rowKey='plan_id'
                rowSelection={
                    {
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setSelectPlan(selectedRows);
                        },
                    }
                }
                onChange={(a, sort, filter, c) => {
                    if (!filter.hasOwnProperty('mode')) {
                        setTaskMode(0);
                    } else {
                        setTaskMode(parseInt(filter.mode[0]));
                    }
                    if (!filter.hasOwnProperty('task_type')) {
                        setTaskType(0);
                    } else {
                        setTaskType(parseInt(filter.task_type[0]));
                    }
                    if (!filter.hasOwnProperty('status')) {
                        setStatus(0);
                    } else {
                        setStatus(parseInt(filter.status[0]));
                    }
                    if (sort.hasOwnProperty('field') && sort.hasOwnProperty('direction') && sort.direction) {
                        if (sort.field === 'created_at') {
                            setSort(sort.direction === 'ascend' ? 2 : 1);
                        } else if (sort.field === 'updated_at') {
                            setSort(sort.direction === 'ascend' ? 4 : 3);
                        }
                    } else {
                        setSort(0);
                    }
                }}
                onRow={(record, index) => {
                    return {
                        onDoubleClick: (event) => {
                            const { plan_id } = record;

                            dispatch({
                                type: 'auto_plan/updateOpenPlan',
                                payload: record
                            })
                            dispatch({
                                type: 'auto_plan/updateOpenScene',
                                payload: null,
                            })

                            dispatch({
                                type: 'case/updateShowCase',
                                payload: false
                            })
                            dispatch({
                                type: 'case/updateOpenCase',
                                payload: null,
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
                                payload: null
                            })

                            // 进去后默认打开第一个
                            dispatch({
                                type: 'auto_plan/updateOpenFirst',
                                payload: true
                            })

                            dispatch({
                                type: 'auto_plan/updatePlanMenu',
                                payload: {}
                            })

                            setTimeout(() => {
                                global$.next({
                                    action: 'RELOAD_LOCAL_AUTO_PLAN',
                                    id: plan_id,
                                });
                                navigate(`/Tplan/detail/${plan_id}`);
                            }, 100);
                        },
                    };
                }}
            />
            {total > 0 &&
                <Pagination
                    showTotal
                    total={total}
                    showJumper
                    sizeCanChange
                    pageSize={pageSize}
                    current={currentPage}
                    sizeOptions={[5, 10, 15, 20]}
                    onChange={(page, pageSize) => pageChange(page, pageSize)}
                />}
            { showTeamExpiration && <TeamExpiration onCancel={() => setShowExpiration(false)} /> }
        </div>
    )
};

export default TestPlanList;