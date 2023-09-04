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
import { debounce, cloneDeep } from 'lodash';
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
import ResizableTable from "@components/ResizableTable";


import { DatePicker, Table, Pagination } from '@arco-design/web-react';

let auto_plan_t = null;

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
    const _auto_plan_list = useSelector((store) => store.auto_plan.auto_plan_list);

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
                        <SvgDelete style={{ fill: 'var(--table-delete)', marginRight: 0 }} onClick={() => {
                            Modal.confirm({
                                title: t('modal.look'),
                                content: t('modal.deletePlan'),
                                okText: t('btn.ok'),
                                cancelText: t('btn.cancel'),
                                onOk: () => {
                                    Bus.$emit('deleteTPlan', plan_id, (code) => {
                                        if (code === 0) {
                                            Message('success', t('message.deleteSuccess'));
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
        let setIntervalList = window.setIntervalList;

        if (auto_plan_t) {
            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === auto_plan_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }
            clearInterval(auto_plan_t);
        }
        auto_plan_t = setInterval(getPlanList, 1000);


        if (setIntervalList) {
            setIntervalList.push(auto_plan_t);
        } else {
            setIntervalList = [auto_plan_t];
        }
        window.setIntervalList = setIntervalList;

        return () => {

            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === auto_plan_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }

            clearInterval(auto_plan_t);
        }
    }, [refreshList, keyword, currentPage, pageSize, startTime, endTime, taskType, status, sort, language]);

    useEffect(() => {
        if (_auto_plan_list) {
            const { auto_plan_list, total } = _auto_plan_list;
            if (auto_plan_list && auto_plan_list.length === 0 && currentPage > 1) {
                pageChange(currentPage - 1, pageSize);
            }
            setTotal(total);
            const planList = auto_plan_list ? auto_plan_list.map(item => {
                const { status } = item;
                return {
                    ...item,
                    canDelete: status === 1,
                    handle: <HandleContent data={item} />
                }
            }) : [];
            setPlanList(planList);
        }
    }, [_auto_plan_list, currentPage, pageSize]);

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

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "auto_plan_list",
            param: JSON.stringify(params)
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
            render: (col, item) => {
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
            width: 135,
            render: (col, item) => {
                return taskList[col];
            }
        },
        {
            title: t('plan.createTime'),
            dataIndex: 'created_at',
            width: 190,
            sorter: true,
            render: (col, item) => {
                return dayjs(col * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: t('plan.updateTime'),
            dataIndex: 'updated_at',
            width: 190,
            sorter: true,
            render: (col, item) => {
                return dayjs(col * 1000).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: t('plan.operator'),
            dataIndex: 'user_name',
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


    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectPlan, setSelectPlan] = useState([]);

    useEffect(() => {
        setSelectedRowKeys([]);
        setSelectPlan([]);
    }, [refreshList]);


    return (
        <div className='plan'>
            <TPlanListHeader onChange={getNewkeyword} onDateChange={getSelectDate} selectPlan={selectPlan} />
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
                            console.log(selected, selectedRows);
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
            {showTeamExpiration && <TeamExpiration onCancel={() => setShowExpiration(false)} />}
        </div>
    )
};

export default TestPlanList;