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
import { debounce } from 'lodash';
import dayjs from 'dayjs';
import Pagination from '@components/Pagination';
import SvgEmpty from '@assets/img/empty';
import { useTranslation } from 'react-i18next';

import { Table } from '@arco-design/web-react';
import { useSelector } from 'react-redux';


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
                <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('tooltip.view')}>
                    <div>
                        <SvgEye onClick={() => navigate(`/Treport/detail/${report_id}`)} />
                    </div>
                </Tooltip>
                {/* <SvgCopy /> */}
                <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('tooltip.delete')}>
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

    let report_t = null;

    useEffect(() => {
        getReportData();
        if (report_t) {
            clearInterval(report_t);
        }
        report_t = setInterval(getReportData, 1000);

        return () => {
            clearInterval(report_t);
        }
    }, [keyword, currentPage, pageSize, startTime, endTime, taskType, status, sort, language]);

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
        fetchReportList(params).subscribe({
            next: (res) => {
                const { data: { auto_plan_report_list, total } } = res;
                setTotal(total);
                // let bool = false;
                const list = auto_plan_report_list.map(item => {
                    const { task_type, status, start_time_sec, end_time_sec, report_id, plan_name, run_user_name, task_mode, test_case_run_order, scene_run_order } = item;

                    return {
                        ...item,
                        plan_name:
                            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} className='tooltip-diy' content={<div>{plan_name}</div>}>
                                <div className='ellipsis'>{plan_name}</div>
                            </Tooltip>,
                        run_user_name:
                            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} className='tooltip-diy' content={<div>{run_user_name}</div>}>
                                <div className='ellipsis'>{run_user_name}</div>
                            </Tooltip>,
                        status: statusList[status],
                        canDelete: status === 2,
                        task_type: taskList[task_type],
                        task_mode: modeList[task_mode],
                        scene_run_order: sceneRunList[scene_run_order],
                        test_case_run_order: caseRunList[test_case_run_order],
                        start_time_sec: dayjs(start_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
                        end_time_sec: status === 1 ? '-' : dayjs(end_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
                        handle: <HandleContent report_id={report_id} />
                    }
                });
                // if (!bool) {
                //     report_t && clearInterval(report_t);
                // }

                setReportList(list);
            }
        })
    }

    const columns = [
        {
            title: t('index.reportId'),
            dataIndex: 'report_id',
            // width: 84,
        },
        {
            title: t('index.planName'),
            dataIndex: 'plan_name',
            ellipsis: true,
            // width: 200
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
        },
        {
            title: t('autoReport.runMode'),
            dataIndex: 'task_mode',
        },
        {
            title: t('autoReport.caseOrder'),
            dataIndex: 'test_case_run_order',
        },
        {
            title: t('autoReport.sceneOrder'),
            dataIndex: 'scene_run_order',
        },
        {
            title: t('index.startTime'),
            dataIndex: 'start_time_sec',
            width: 200,
            sorter: true,
        },
        {
            title: t('index.endTime'),
            dataIndex: 'end_time_sec',
            width: 200,
            sorter: true
        },
        {
            title: t('index.performer'),
            dataIndex: 'run_user_name',
            ellipsis: true
            // width: 200
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
        },
        {
            title: t('index.handle'),
            dataIndex: 'handle',
            width: 112
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
        <div className='report'>
            <TReportListHeader onChange={getNewkeyword} onDateChange={getSelectDate} selectReport={selectReport} />
            <Table
                className="report-table"
                border
                borderCell
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
            {total > 0 && <Pagination total={total} size={pageSize} current={currentPage} onChange={(page, pageSize) => pageChange(page, pageSize)} />}
        </div>
    )
};

export default TestReportList;