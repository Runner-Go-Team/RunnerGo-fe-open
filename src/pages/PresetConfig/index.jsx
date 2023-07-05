import React, { useState, useEffect } from 'react';
import { Button, Tabs as TabList, Input, Message, Modal } from 'adesign-react';
import {
    Add as SvgAdd,
    Copy as SvgCopy,
    Delete as SvgDelete,
    Iconeye as SvgEye,
    Search as SvgSearch,
} from 'adesign-react/icons';
import './index.less';
import { useTranslation } from 'react-i18next';
import { Table } from '@arco-design/web-react';
import CreatePreset from '@modals/CreatePreset';
// import Pagination from '@components/Pagination';
import { fetchPresetList, fetchDeletePreset, fetchCopyPreset } from '@services/preset';
import SvgEmpty from '@assets/img/empty';
import { debounce } from 'lodash';
import { Pagination } from '@arco-design/web-react';
import ResizableTable from '@components/ResizableTable';

const { Tabs, TabPan } = TabList;
const PresetConfig = () => {
    const { t } = useTranslation();
    const column = [
        {
            title: t('column.preset.name'),
            dataIndex: 'conf_name',
            width: 150,
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
            title: t('column.preset.debugMode'),
            dataIndex: 'debug_mode',
            width: 180,
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
            width: 120
        },
        {
            title: t('column.preset.step'),
            dataIndex: 'step',
            width: 120
        },
        {
            title: t('column.preset.stepRunTime'),
            dataIndex: 'step_run_time',
            width: 120
        },
        {
            title: t('column.preset.maxConcurrency'),
            dataIndex: 'max_concurrency',
            width: 120
        },
        {
            title: t('column.preset.duration'),
            dataIndex: 'duration',
            width: 120
        },
        {
            title: t('column.preset.roundNum'),
            dataIndex: 'round_num',
            width: 120
        },
        {
            title: t('column.preset.concurrency'),
            dataIndex: 'concurrency',
            width: 120,
        },
        {
            title: t('column.preset.handle'),
            dataIndex: 'handle',
            width: 108,
            fixed: 'right'
        }
    ];


    const [showCreate, setShowCreate] = useState(false);

    const [total, setTotal] = useState(0);
    const [currentPage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [tableData, setTableData] = useState([]);
    const [configDetail, setCofigDetail] = useState({});
    const [searchWord, setSearchWord] = useState('');
    const [totalData, setTotalData] = useState([]);

    const modeList = {
        '1': t('plan.modeList.1'),
        '2': t('plan.modeList.2'),
        '3': t('plan.modeList.3'),
        '4': t('plan.modeList.4'),
        '5': t('plan.modeList.5'),
        '6': t('plan.modeList.6'),
    };

    const taskList = {
        '0': '-',
        '1': t('plan.taskList.commonTask'),
        '2': t('plan.taskList.cronTask'),
        '3': t('plan.taskList.mixTask')
    };

    const debugModeList = {
        'stop': t('plan.debugMode-0'),
        'all': t('plan.debugMode-1'),
        'only_success': t('plan.debugMode-2'),
        'stop': t('plan.debugMode-3'),
    }

    const controlModeList = [t('plan.controlModeList.0'), t('plan.controlModeList.1')];

    const getTableData = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            page: currentPage,
            size: pageSize,
            conf_name: searchWord,
        };
        fetchPresetList(params).subscribe({
            next: (res) => {
                const { data: { preinstall_list, total } } = res;
                if (preinstall_list && preinstall_list.length === 0 && currentPage > 1) {
                    pageChange(currentPage - 1, pageSize);
                }
                setTotalData(preinstall_list ? preinstall_list : []);
                setTableData(preinstall_list ? preinstall_list.map(item => {
                    const { mode_conf, task_type, task_mode, control_mode, debug_mode } = item;

                    for (let i in mode_conf) {
                        if (!mode_conf[i]) {
                            mode_conf[i] = '-';
                        }
                    }

                    return {
                        ...item,
                        ...mode_conf,
                        task_type: taskList[task_type],
                        task_mode: modeList[task_mode],
                        control_mode: controlModeList[control_mode],
                        debug_mode: debugModeList[debug_mode ? debug_mode : "stop"],
                        handle: <div className='handle'>
                            <SvgEye onClick={() => {
                                let result = preinstall_list.find(elem => elem.id === item.id);
                                for (let i in result.mode_conf) {
                                    if (result.mode_conf[i] === '-') {
                                        result.mode_conf[i] = 0;
                                    }
                                }
                                setCofigDetail(result);
                                setShowCreate(true);
                            }} />
                            <SvgCopy onClick={() => copyPreset(item.id)} />
                            <SvgDelete className='delete' onClick={() => deletePreset(item.id, item.conf_name)} />
                        </div>
                    }
                }) : []);
                setTotal(total);
            }
        })
    }

    useEffect(() => {
        getTableData();
    }, [currentPage, pageSize, searchWord]);

    const copyPreset = (id) => {
        const params = {
            id,
            team_id: localStorage.getItem('team_id')
        };
        fetchCopyPreset(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.copySuccess'));
                    getTableData();
                }
            }
        })
    }

    const deletePreset = (id, name) => {
        Modal.confirm({
            title: t('modal.deletePresetTitle'),
            content: `${t('modal.deletePreset1')}${name}${t('modal.deletePreset2')}`,
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    id,
                    team_id: localStorage.getItem('team_id'),
                    conf_name: name
                };
                fetchDeletePreset(params).subscribe({
                    next: (res) => {
                        const { code } = res;
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            getTableData();
                        }
                    }
                })
            }
        })

    }

    const pageChange = (page, size) => {
        if (size !== pageSize) {
            localStorage.setItem('preset_pagesize', size);
        }
        sessionStorage.setItem('preset_page', page);
        page !== currentPage && setPage(page);
        size !== pageSize && setPageSize(size);
    };

    const defaultList = [
        { id: 0, title: t('preset.performance'), content: "123" },
        { id: 1, title: t('preset.automation'), content: "456", disabled: true },
    ];

    const getNewSearchword = debounce((e) => setSearchWord(e), 500);


    return (
        <div className='preset-config'>
            {/* <div className='tab'>
                <Tabs defaultActiveId={0}>
                    {defaultList.map((d) => (
                        <TabPan key={d.id} id={d.id} title={d.title} disabled={d.disabled} >

                        </TabPan>
                    ))}
                </Tabs>
            </div> */}
            <div className='top'>
                <div className='top-left'>
                    <p className='title'>{t('leftBar.preset')}</p>
                    <Input className='search-input' value={searchWord} beforeFix={<SvgSearch />} onChange={getNewSearchword} placeholder={t('placeholder.configSearch')} />
                </div>
                <div className='top-right'>
                    <Button preFix={<SvgAdd />} onClick={() => setShowCreate(true)}>{t('index.create')}</Button>
                </div>
            </div>
            <ResizableTable
                className="preset-table"
                border={{
                    wrapper: true,
                    cell: true,
                }}
                scroll={{
                    x: 1737,
                }}
                columns={column}
                data={tableData}
                showSorterTooltip={false}
                pagination={false}
                noDataElement={<div className='empty'> <SvgEmpty /> <p>{t('index.emptyData')}</p></div>}
                onRow={(record, index) => {
                    return {
                        onDoubleClick: (event) => {
                            let data = totalData.find(item => item.id === record.id);
                            for (let i in data.mode_conf) {
                                if (data.mode_conf[i] === '-') {
                                    data.mode_conf[i] = 0;
                                }
                            }
                            setCofigDetail(data);
                            setShowCreate(true);
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
                    onChange={(page, pageSize) => pageChange(page, pageSize)} />}

            {showCreate && <CreatePreset configDetail={configDetail} onCancel={(e) => {
                if (e) {
                    getTableData();
                }
                setShowCreate(false);
                setCofigDetail({});
            }} />}
        </div>
    )
};

export default PresetConfig;