import React, { useEffect, useState, forwardRef } from 'react';
import { Button, Message, Tooltip, Modal } from 'adesign-react';
import './index.less';
import TReportListHeader from './reportListHeader';
import {
    Iconeye as SvgEye,
    Copy as SvgCopy,
    Delete as SvgDelete,
    CaretRight as SvgRun,

} from 'adesign-react/icons';
import { useNavigate } from 'react-router-dom';
import { fetchReportList, fetchDeleteReport } from '@services/auto_report';
import { debounce, cloneDeep } from 'lodash';
import dayjs from 'dayjs';
// import Pagination from '@components/Pagination';
import SvgEmpty from '@assets/img/empty';
import { useTranslation } from 'react-i18next';

import { Table, Pagination } from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import ResizableTable from '@components/ResizableTable';

import Bus from '@utils/eventBus';

let report_t = null;

const TestReportList = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [reportList, setReportList] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(parseInt(sessionStorage.getItem('report_page')) || 1);
    const [pageSize, setPageSize] = useState(parseInt(localStorage.getItem('report_pagesize')) || 10);

    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [taskType, setTaskType] = useState(0);
    const [taskMode, setTaskMode] = useState(0);
    const [status, setStatus] = useState(0);
    const [sort, setSort] = useState(0);

    const language = useSelector((d) => d.user.language);
    const theme = useSelector((d) => d.user.theme);
    const refreshList = useSelector((store) => store.auto_report.refreshList);
    const auto_report_list = useSelector((store) => store.auto_report.auto_report_list);

    const modeList = {
        '1': t('autoReport.taskMode.1'),
    };

    const caseRunList = {
        '1': t('autoReport.testCaseRunOrder.1'),
        '2': t('autoReport.testCaseRunOrder.2'),
    };

    const sceneRunList = {
        '1': t('autoReport.sceneRunOrder.1'),
        '2': t('autoReport.sceneRunOrder.2'),
    }
    const taskList = {
        '0': '-',
        '1': t('plan.taskList.commonTask'),
        '2': t('plan.taskList.cronTask'),
        '3': t('plan.taskList.mixTask')
    };
    const statusList = {
        '1': <p style={{ color: 'var(--run-green)' }}>{t('report.statusList.1')}</p>,
        '2': t('report.statusList.2'),
    };

    const HandleContent = (props) => {
        const { report_id } = props;
        return (
            <div className='handle-content'>
                <Tooltip bgColor="var(--select-hover)" content={t('tooltip.view')}>
                    <div>
                        <SvgEye onClick={() => navigate(`/Treport/detail/${report_id}`)} />
                    </div>
                </Tooltip>
                {/* <SvgCopy /> */}
                <Tooltip bgColor="var(--select-hover)" content={t('tooltip.delete')}>
                    <div>
                        <SvgDelete className='delete-svg' onClick={() => {
                            Modal.confirm({
                                title: t('modal.look'),
                                content: t('modal.deleteReport'),
                                okText: t('btn.ok'),
                                cancelText: t('btn.cancel'),
                                onOk: () => {
                                    deleteReport(report_id);
                                }
                            })
                        }} />
                    </div>
                </Tooltip>
            </div>
        )
    };

    const deleteReport = (report_id) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            report_ids: [report_id],
        };

        fetchDeleteReport(params).subscribe({
            next: (res) => {
                Message('success', t('message.deleteSuccess'));
                getReportData();
            }
        });
    }

    useEffect(() => {
        getReportData();
        let setIntervalList = window.setIntervalList;

        if (report_t) {
            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === report_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }
            clearInterval(report_t);
        }
        report_t = setInterval(getReportData, 1000);

        if (setIntervalList) {
            setIntervalList.push(report_t);
        } else {
            setIntervalList = [report_t];
        }
        window.setIntervalList = setIntervalList;

        return () => {

            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === report_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }

            clearInterval(report_t);
        }
    }, [keyword, currentPage, pageSize, startTime, endTime, taskType, status, sort, language]);


    useEffect(() => {
        if (auto_report_list) {
            const { auto_plan_report_list, total } = auto_report_list;
            if (auto_plan_report_list && auto_plan_report_list.length === 0 && currentPage > 1) {
                pageChange(currentPage - 1, pageSize);
            }
            setTotal(total);
            const list = auto_plan_report_list ? auto_plan_report_list.map(item => {
                const { status, report_id } = item;

                return {
                    ...item,
                    canDelete: status === 2,
                    handle: <HandleContent report_id={report_id} />
                }
            }) : [];

            setReportList(list);
        }
    }, [auto_report_list, currentPage, pageSize]);

    const getReportData = () => {
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
            route_url: "auto_report_list",
            param: JSON.stringify(params)
        }))
    }

    const columns = [
        {
            title: t('index.rankId'),
            dataIndex: 'rank_id',
            width: 84,
        },
        {
            title: t('index.status'),
            dataIndex: 'status',
            width: 120,
            filterMultiple: false,
            filters: [
                { text: t('report.statusList.1'), value: 1 },
                { text: t('report.statusList.2'), value: 2 }
            ],
            onFilter: (value, item) => {
                setStatus(value);
                return true;
            },
            render: (col, item) => {
                return statusList[col];
            }
        },
        {
            title: t('index.reportName'),
            dataIndex: 'report_name',
            ellipsis: true,
            width: 200
        },
        {
            title: t('index.planName'),
            dataIndex: 'plan_name',
            ellipsis: true,
            width: 200
        },
        {
            title: t('index.taskType'),
            dataIndex: 'task_type',
            filterMultiple: false,
            filters: [
                { text: t('plan.taskList.commonTask'), value: 1 },
                { text: t('plan.taskList.cronTask'), value: 2 }
            ],
            onFilter: (value, item) => {
                setTaskType(value);
                return true;
            },
            width: 200,
            render: (col, item) => {
                return taskList[col];
            }
        },
        {
            title: t('autoReport.runMode'),
            dataIndex: 'task_mode',
            width: 135,
            render: (col, item) => {
                return modeList[col];
            }
        },
        {
            title: t('autoReport.caseOrder'),
            dataIndex: 'test_case_run_order',
            width: 150,
            render: (col, item) => {
                return caseRunList[col];
            }
        },
        {
            title: t('autoReport.sceneOrder'),
            dataIndex: 'scene_run_order',
            width: 150,
            render: (col, item) => {
                return sceneRunList[col];
            }
        },
        {
            title: t('index.startTime'),
            dataIndex: 'start_time_sec',
            width: 200,
            sorter: true,
            render: (col, item) => {
                return dayjs(col * 1000).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {
            title: t('index.endTime'),
            dataIndex: 'end_time_sec',
            width: 200,
            sorter: true,
            render: (col, item) => {
                const { status } = item;
                return status === 1 ? '-' : dayjs(col * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: t('index.performer'),
            dataIndex: 'run_user_name',
            ellipsis: true,
            width: 200
        },
        {
            title: t('index.handle'),
            dataIndex: 'handle',
            width: 112,
            fixed: 'right'
        }
    ];

    const getNewkeyword = debounce((e) => setKeyword(e), 500);

    const pageChange = (page, size) => {
        if (size !== pageSize) {
            localStorage.setItem('report_pagesize', size);
        }
        sessionStorage.setItem('report_page', page);
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

                            const { report_id } = tableData[rowIndex]
                            navigate(`/report/detail/${report_id}`)
                        },
                    });
                    return rowComp;
                })}
            </tbody>
        );
    };

    const getSelectDate = (startTime, endTime) => {
        setStartTime(startTime);
        setEndTime(endTime);
    }

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectReport, setSelectReport] = useState([]);

    useEffect(() => {
        setSelectedRowKeys([]);
        setSelectReport([]);
    }, [refreshList]);

    // const [_columns, setColumns] = useState(
    //     columns.map((column, index) => {
    //         if (column.width) {
    //             return {
    //                 ...column,
    //                 onHeaderCell: (col) => ({
    //                     width: col.width,
    //                     onResize: handleResize(index),
    //                 }),
    //             };
    //         }

    //         return column;
    //     })
    // );

    // const handleResize = (index) => {
    //     return (e, { size }) => {
    //         setColumns((prevColumns) => {
    //             const nextColumns = [...prevColumns];
    //             nextColumns[index] = { ...nextColumns[index], width: size.width };
    //             return nextColumns;
    //         });
    //     };
    // }

    // const components = {
    //     header: {
    //         th: ResizableTitle,
    //     },
    // };


    return (
        <div className='report-list'>
            <TReportListHeader onChange={getNewkeyword} onDateChange={getSelectDate} selectReport={selectReport} />
            <ResizableTable
                className="report-table"
                border
                borderCell
                scroll={{
                    x: 1737,
                }}
                showSorterTooltip={false}
                pagination={false}
                columns={columns}
                data={reportList}
                noDataElement={<div className='empty'><SvgEmpty /><p>{t('index.emptyData')}</p></div>}
                rowKey='report_id'
                rowSelection={
                    {
                        type: 'checkbox',
                        selectedRowKeys,
                        onChange: (selectedRowKeys, selectedRows) => {
                            setSelectedRowKeys(selectedRowKeys);
                            setSelectReport(selectedRows);
                        },
                        checkboxProps: (record) => {
                            return {
                                disabled: record.status === 1,
                                onChange:(checked)=>{
                                    const { report_id } = record;

                                    let _arr1 = cloneDeep(selectedRowKeys);
                                    let _arr2 = cloneDeep(selectReport);
                                    if (checked) {
                                        if (!selectedRowKeys.find(item => item === report_id)) {

                                            _arr1.push(report_id);
                                            setSelectedRowKeys(_arr1);

                                            _arr2.push(record);
                                            setSelectReport(_arr2);
                                        }
                                    } else {
                                        let index1 = selectedRowKeys.findIndex(item => item === report_id);
                                        _arr1.splice(index1, 1);
                                        setSelectedRowKeys(_arr1);
                                        let index2 = selectReport.findIndex(item => item.report_id === report_id);
                                        _arr2.splice(index2, 1);
                                        setSelectReport(_arr2);
                                    }
                                }
                            }
                        },
                        onSelectAll: (selected, selectedRows) => {
                            let arr = selectedRows.filter(item => item.status === 2);
                            if (selected) {
                                setSelectReport(arr);
                                setSelectedRowKeys(arr.map(item => item.report_id));
                            } else {
                                setSelectReport([]);
                                setSelectedRowKeys([]);
                            }
                        }
                    }
                }
                onChange={(a, sort, filter, c) => {
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
                        if (sort.field === 'start_time_sec') {
                            setSort(sort.direction === 'ascend' ? 2 : 1);
                        } else if (sort.field === 'end_time_sec') {
                            setSort(sort.direction === 'ascend' ? 4 : 3);
                        }
                    } else {
                        setSort(0);
                    }
                }}
                onRow={(record, index) => {
                    return {
                        onDoubleClick: (event) => {
                            const { report_id } = record;
                            navigate(`/Treport/detail/${report_id}`)
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

export default TestReportList;