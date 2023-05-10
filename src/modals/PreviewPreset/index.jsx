import React, { useState, useEffect } from "react";
import { Add as SvgAdd, Search as SvgSearch } from 'adesign-react/icons';
import { Button, Modal, Input } from 'adesign-react';
import { Table } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { fetchPresetList } from '@services/preset';
import Pagination from '@components/Pagination';
import './index.less';
import SvgEmpty from '@assets/img/empty';
import { cloneDeep, debounce } from 'lodash';
import CreatePreset from "../CreatePreset";
import SvgClose from '@assets/logo/close';
import ResizableTable from "@components/ResizableTable";


const PreviewPreset = (props) => {
    const { onCancel, taskType } = props;
    const { t } = useTranslation();
    const [total, setTotal] = useState(0);
    const [currentPage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [searchWord, setSearchWord] = useState('');

    const column = [
        {
            title: t('column.preset.name'),
            dataIndex: 'conf_name',
            width: 120,
        },
        {
            title: t('column.preset.creator'),
            dataIndex: 'user_name',
            width: 150,
        },
        {
            title: t('column.preset.taskType'),
            dataIndex: 'task_type',
            width: 150,
        },
        {
            title: t('column.preset.taskMode'),
            dataIndex: 'task_mode',
            width: 150,
        },
        {
            title: t('column.preset.controlMode'),
            dataIndex: 'control_mode',
            width: 150,
        },
        {
            title: t('column.preset.startConcurrency'),
            dataIndex: 'start_concurrency',
            width: 120,
        },
        {
            title: t('column.preset.step'),
            dataIndex: 'step',
            width: 120,
        },
        {
            title: t('column.preset.stepRunTime'),
            dataIndex: 'step_run_time',
            width: 120,
        },
        {
            title: t('column.preset.maxConcurrency'),
            dataIndex: 'max_concurrency',
            width: 120,
        },
        {
            title: t('column.preset.duration'),
            dataIndex: 'duration',
            width: 120,
        },
        {
            title: t('column.preset.roundNum'),
            dataIndex: 'round_num',
            width: 120,
        },
        {
            title: t('column.preset.concurrency'),
            dataIndex: 'concurrency',
            width: 120,
        },
        {
            title: t('column.preset.handle'),
            dataIndex: 'handle',
            width: 58,
            fixed: 'right'
        }
    ];

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

    const controlModeList = {
        "0": t('plan.controlModeList.0'),
        "1": t('plan.controlModeList.1')
    }

    const getPreList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            page: currentPage,
            size: pageSize,
            conf_name: searchWord,
            task_type: taskType
        };
        fetchPresetList(params).subscribe({
            next: (res) => {
                const { data: { preinstall_list, total } } = res;
                setTableData(preinstall_list.map(item => {
                    const { mode_conf, task_type, task_mode, control_mode } = item;
                    const _mode_conf = cloneDeep(mode_conf);
                    for (let i in _mode_conf) {
                        if (!_mode_conf[i]) {
                            _mode_conf[i] = '-';
                        }
                    }
                    
                    return {
                        ...item,
                        ..._mode_conf,
                        task_type: taskList[task_type],
                        task_mode: modeList[task_mode],
                        control_mode: controlModeList[control_mode],
                        handle: <div className='handle' onClick={() => {
                            for (let i in item.mode_conf) {
                                if (item.mode_conf[i] === '-') {
                                    item.mode_conf[i] = 0;
                                }
                            }
                            onCancel(item);
                        }}>
                            {t('header.import')}
                        </div>
                    }
                }));
                setTotal(total);
            }
        })
    }

    useEffect(() => {
        if (taskType > 0) {
            getPreList();
        }
    }, [searchWord, currentPage, pageSize, taskType]);

    const pageChange = (page, size) => {
        page !== currentPage && setPage(page);
        size !== pageSize && setPageSize(size);
    };

    const getNewSearchword = debounce((e) => setSearchWord(e), 500);
    const [showCreate, setShowCreate] = useState(false);

    return (
        <div>
            <Modal
                className="preview-preset"
                visible
                footer={null}
                title={null}
            >
                <div className='top'>
                    <div className='top-left'>
                        <p className='title'>{t('leftBar.preset')}</p>
                        <Input className='search-input' value={searchWord} beforeFix={<SvgSearch />} onChange={getNewSearchword} placeholder={t('placeholder.configSearch')} />
                    </div>
                    <div className='top-right'>
                        <Button className='close-btn' onClick={() => onCancel()}><SvgClose /></Button>

                        <Button className='create-btn' preFix={<SvgAdd />} onClick={() => setShowCreate(true)}>{t('index.create')}</Button>
                    </div>
                </div>
                <ResizableTable
                    className="preview-preset-table"
                    border={{
                        wrapper: true,
                        cell: true,
                    }}
                    scroll={{
                        x: 1600,
                    }}
                    columns={column}
                    data={tableData}
                    showSorterTooltip={false}
                    noDataElement={<div className='empty'> <SvgEmpty /> <p>{t('index.emptyData')}</p></div>}
                    pagination={false}
                />
                {total > 0 && <Pagination total={total} current={currentPage} size={pageSize} onChange={(page, pageSize) => pageChange(page, pageSize)} />}
            </Modal>

            {
                showCreate && <CreatePreset onCancel={(e) => {
                    if (e) {
                        getPreList();
                    }
                    setShowCreate(false);
                }} />
            }
        </div>
    )
};

export default PreviewPreset;