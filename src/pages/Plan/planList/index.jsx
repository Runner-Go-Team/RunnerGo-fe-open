import React, { useEffect, useState } from 'react';
import { Button, Message, Tooltip, Modal, Dropdown } from 'adesign-react';
import './index.less';
import PlanHeader from '../planHeader';
import {
    Iconeye as SvgEye,
    Copy as SvgCopy,
    Delete as SvgDelete,
    CaretRight as SvgRun,

} from 'adesign-react/icons';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPlanList, fetchCopyPlan } from '@services/plan';
import { fetchUseVum } from '@services/pay';
import { cloneDeep, debounce } from 'lodash';
import dayjs from 'dayjs';
import Bus from '@utils/eventBus';

import SvgEmpty from '@assets/img/empty';
import { useTranslation } from 'react-i18next';
import { global$ } from '@hooks/useGlobal/global';
import SvgStart from '@assets/icons/Start';
import SvgStop from '@assets/icons/Stop';

import ResizableTable from '@components/ResizableTable';

import { DatePicker, Table, Pagination } from '@arco-design/web-react';

let plan_t = null;

const PlanList = () => {
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

    const dispatch = useDispatch();
    const refreshList = useSelector((store) => store.plan.refreshList);

    const plan_list = useSelector((store) => store.plan.plan_list);

    const language = useSelector((d) => d.user.language);
    const theme = useSelector((d) => d.user.theme);

    const modeList = {
        '0': '-',
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
        const { status, plan_id, task_type } = data;
        return (
            <div className='handle-content'>
                {status === 2 ? <Tooltip bgColor="var(--select-hover)" content={t('tooltip.stop')}>
                    <div>
                        <Button preFix={<SvgStop />} className='stop-btn' onClick={() => Bus.$emit('stopPlan', plan_id, (code) => {
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
                                Bus.$emit('runPlan', plan_id, (code) => {
                                    if (code === 0) {
                                        getPlanList();
                                        if (task_type === 1) {
                                            Message('success', t('message.runSuccess'))
                                            navigate('/report/list');
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
                                type: 'plan/updateOpenPlan',
                                payload: data
                            })
                            dispatch({
                                type: 'plan/updateOpenScene',
                                payload: null,
                            })
                            dispatch({
                                type: 'plan/updatePlanMenu',
                                payload: {}
                            })

                            // 进去后默认打开第一个
                            dispatch({
                                type: 'plan/updateOpenFirst',
                                payload: true
                            })
                            setTimeout(() => {
                                global$.next({
                                    action: 'RELOAD_LOCAL_PLAN',
                                    id: plan_id,
                                });
                                navigate(`/plan/detail/${plan_id}`);
                            }, 200);
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
                        <SvgDelete style={{ fill: 'var(--table-delete)', marginRight: 0, cursor: status === 2 ? 'not-allowed' : 'pointer' }} onClick={() => {
                            if (status === 2) {
                                Message('error', t('plan.cantDelete'));
                                return;
                            }

                            Modal.confirm({
                                title: t('modal.look'),
                                content: t('modal.deletePlan'),
                                okText: t('btn.ok'),
                                cancelText: t('btn.cancel'),
                                onOk: () => {
                                    Bus.$emit('deletePlan', plan_id, (code) => {
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

    useEffect(() => {
        getPlanList();
        if (plan_t) {
            clearInterval(plan_t);
        }
        plan_t = setInterval(getPlanList, 1000);

        let setIntervalList = window.setIntervalList;
        if (setIntervalList) {
            setIntervalList.push(plan_t);
        } else {
            setIntervalList = [plan_t];
        }
        window.setIntervalList = setIntervalList;

        return () => {
            let setIntervalList = window.setIntervalList;
            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === plan_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }
            clearInterval(plan_t);
        }
    }, [refreshList, keyword, currentPage, pageSize, startTime, endTime, taskMode, taskType, status, sort, language]);


    useEffect(() => {
        if (plan_list) {
            const { plans, total } = plan_list;
            if (plans && plans.length === 0 && currentPage > 1) {
                pageChange(currentPage - 1, pageSize);
            }
            setTotal(total);

            const planList = plans ? plans.map(item => {
                const { task_type, task_mode, status, created_time_sec, updated_time_sec, plan_name, created_user_name, remark } = item;

                return {
                    ...item,
                    task_type: taskList[task_type],
                    task_mode: modeList[task_mode],
                    canDelete: status === 1,
                    created_time_sec: dayjs(created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
                    updated_time_sec: dayjs(updated_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
                    handle: <HandleContent data={item} />
                }
            }) : [];
            setPlanList(planList);
        }
    }, [plan_list, currentPage, pageSize])


    const getPlanList = () => {
        const query = {
            page: currentPage,
            size: pageSize,
            team_id: localStorage.getItem('team_id'),
            keyword,
            start_time_sec: startTime,
            end_time_sec: endTime,
            task_type: taskType,
            task_mode: taskMode,
            status,
            sort
        };

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "stress_plan_list",
            param: JSON.stringify(query)
        }))
    }


    const columns = [
        {
            title: t('plan.rankId'),
            dataIndex: 'rank_id',
            width: 84,
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
            width: 190,
            render: (col, index) => {

                return statusList[col];
            }
        },
        {
            title: t('plan.planName'),
            dataIndex: 'plan_name',
            ellipsis: true,
            width: 190,
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
            title: t('plan.mode'),
            dataIndex: 'task_mode',
            filterMultiple: false,
            filters: [
                { text: t('plan.modeList.1'), value: 1 },
                { text: t('plan.modeList.2'), value: 2 },
                { text: t('plan.modeList.3'), value: 3 },
                { text: t('plan.modeList.4'), value: 4 },
                { text: t('plan.modeList.5'), value: 5 },
                { text: t('plan.modeList.7'), value: 7 },
            ],
            onFilter: (value, item) => {
                setTaskMode(value);
                return true;
            },
            width: 135
        },
        {
            title: t('plan.createTime'),
            dataIndex: 'created_time_sec',
            width: 190,
            sorter: true
        },
        {
            title: t('plan.updateTime'),
            dataIndex: 'updated_time_sec',
            width: 190,
            sorter: true
        },
        {
            title: t('plan.operator'),
            dataIndex: 'created_user_name',
            ellipsis: true,
            width: 190,
        },
        {
            title: t('plan.remark'),
            dataIndex: 'remark',
            ellipsis: true,
            width: 190,
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
            <PlanHeader onChange={getNewkeyword} onDateChange={getSelectDate} selectPlan={selectPlan} />
            <ResizableTable
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
                        checkboxProps: (record) => {
                            return {
                                disabled: record.status === 2,
                                onChange:(checked)=>{
                                    const { plan_id } = record;

                                    let _arr1 = cloneDeep(selectedRowKeys);
                                    let _arr2 = cloneDeep(selectPlan);
                                    if (checked) {
                                        if (!selectedRowKeys.find(item => item === plan_id)) {

                                            _arr1.push(plan_id);
                                            setSelectedRowKeys(_arr1);

                                            _arr2.push(record);
                                            setSelectPlan(_arr2);
                                        }
                                    } else {
                                        let index1 = selectedRowKeys.findIndex(item => item === plan_id);
                                        _arr1.splice(index1, 1);
                                        setSelectedRowKeys(_arr1);
                                        let index2 = selectPlan.findIndex(item => item.plan_id === plan_id);
                                        _arr2.splice(index2, 1);
                                        setSelectPlan(_arr2);
                                    }
                                }
                            }
                        },
                        onSelectAll: (selected, selectedRows) => {
                            let arr = selectedRows.filter(item => item.status === 1);
                            if (selected) {
                                setSelectPlan(arr);
                                setSelectedRowKeys(arr.map(item => item.plan_id));
                            } else {
                                setSelectPlan([]);
                                setSelectedRowKeys([]);
                            }
                        }
                    }
                }
                onChange={(a, sort, filter, c) => {
                    if (!filter.hasOwnProperty('task_mode')) {
                        setTaskMode(0);
                    } else {
                        setTaskMode(filter.task_mode[0]);
                    }
                    if (!filter.hasOwnProperty('task_type')) {
                        setTaskType(0);
                    } else {
                        setTaskType(filter.task_type[0]);
                    }
                    if (!filter.hasOwnProperty('status')) {
                        setStatus(0);
                    } else {
                        setStatus(filter.status[0]);
                    }
                    if (sort.hasOwnProperty('field') && sort.hasOwnProperty('direction') && sort.direction) {
                        if (sort.field === 'created_time_sec') {
                            setSort(sort.direction === 'ascend' ? 2 : 1);
                        } else if (sort.field === 'updated_time_sec') {
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
                                type: 'plan/updateOpenPlan',
                                payload: record
                            })
                            dispatch({
                                type: 'plan/updateOpenScene',
                                payload: null,
                            })
                            dispatch({
                                type: 'plan/updatePlanMenu',
                                payload: {}
                            })


                            // 进去后默认打开第一个
                            dispatch({
                                type: 'plan/updateOpenFirst',
                                payload: true
                            })

                            setTimeout(() => {
                                global$.next({
                                    action: 'RELOAD_LOCAL_PLAN',
                                    id: plan_id,
                                });
                                navigate(`/plan/detail/${plan_id}`);
                            }, 200);
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

        </div>
    )
};

export default PlanList;