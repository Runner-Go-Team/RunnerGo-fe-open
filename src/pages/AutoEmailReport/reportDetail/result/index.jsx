import React, { useEffect, useState, useRef, useImperativeHandle } from "react";
import './index.less';
import { Tabs as TabComponent, Scale } from 'adesign-react';

const { Tabs, TabPan } = TabComponent;
import { Collapse } from '@arco-design/web-react';
const CollapseItem = Collapse.Item;
import SvgSuccess from '@assets/logo/success';
import SvgFailed from '@assets/logo/failed';
import SvgNotRun from '@assets/logo/not_run';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat } from '@utils';

import { useTranslation } from 'react-i18next';

import { Tooltip } from '@arco-design/web-react';

const { ScalePanel, ScaleItem } = Scale;

const TReportDetailResult = (props) => {
    const { result } = props;
    const { t } = useTranslation();

    const [sceneResult, setSceneResult] = useState([]);
    const [sceneResultNow, setSceneResultNow] = useState([]);
    const [apiResult, setApiResult] = useState([]);

    const [checkScene, setCheckScene] = useState({});

    const [checkCase, setCheckCase] = useState([]);
    const [filterCase, setFilterCase] = useState([]);
    const [checkApi, setCheckApi] = useState({});
    const [checkDetail, setCheckDetail] = useState({});

    const [caseTab, setCaseTab] = useState('1');

    useEffect(() => {
        if (Object.entries(result || {}).length > 0) {
            const { scene_result, scene_id_case_result_map } = result;

            setSceneResult(scene_result);
            setSceneResultNow(scene_result);
            setApiResult(scene_id_case_result_map);

            if (scene_result.length > 0) {
                setCheckScene(scene_result[0])
            }
        }
    }, [result]);

    useEffect(() => {
        if (Object.entries(apiResult || {}).length > 0 && Object.entries(checkScene || {}).length > 0) {
            const { scene_id } = checkScene;
            setCheckCase(apiResult[scene_id]);
            setFilterCase(apiResult[scene_id] || []);
            if (apiResult[scene_id]) {
                setCheckApi(apiResult[scene_id].length > 0 ? apiResult[scene_id][0] : []);
                if (Object.entries(apiResult[scene_id][0] || {}).length > 0 && apiResult[scene_id][0].api_list) {
                    setCheckDetail(Object.entries(apiResult[scene_id][0] || {}).length > 0 ? apiResult[scene_id][0].api_list[0] : {});
                }
            } else {
                setCheckApi([]);
                setCheckDetail({})
            }

            if (caseTab === '2') {
                let result = [];
                apiResult[scene_id].forEach(item => {
                    let _result = [];

                    item.api_list.forEach(elem => {
                        if (elem.status === 'failed') {
                            _result.push(elem);
                        }
                    })

                    if (_result.length > 0) {
                        result.push({
                            ...item,
                            api_list: _result
                        })
                    }
                })
                setFilterCase(result);
            } else if (caseTab === '3') {
                let result = [];
                apiResult[scene_id].forEach(item => {
                    let _result = [];

                    item.api_list.forEach(elem => {
                        if (elem.status === 'not_run') {
                            _result.push(elem);
                        }
                    })

                    if (_result.length > 0) {
                        result.push({
                            ...item,
                            api_list: _result
                        })
                    }
                })
                setFilterCase(result);
            }
        }
    }, [apiResult, checkScene])


    const CollapseHeader = (props) => {
        const { name, success, total } = props;
        return (
            <div className="collapse-header">
                <p>{name}</p>
                {
                    caseTab === "1" && <Tooltip content={t('autoReport.apiTooltip')}>
                        <p>{success}/{total}</p>
                    </Tooltip>
                }
            </div>
        )
    };

    const ApiResultItem = (props) => {
        const { state, name, method, url, size, time, code, event_id, item } = props;
        const stateSvg = {
            'success': <SvgSuccess className='success' />,
            'failed': <SvgFailed className='fail' />,
            'not_run': <SvgNotRun className='not-run' />
        }
        return (
            <div className={`api-result-item ${checkDetail.event_id === event_id ? 'item-hover' : ''}`} onClick={() => {
                // checkApi(item);
                setCheckDetail(item);
            }}>
                <div className="item-left">
                    {
                        stateSvg[state]
                    }
                    <Tooltip content={name}>
                        <p className="name">{name}:</p>
                    </Tooltip>
                    <p className="method">{method}</p>
                    <Tooltip content={url}>
                        <p className="url">{url}</p>
                    </Tooltip>
                </div>
                <div className="item-right">
                    <p className="size">{size}kb</p>
                    <p className="time">{time}ms</p>
                    <p className="code">{code}</p>
                </div>
            </div>
        )
    };

    const [reqTab, setReqTab] = useState('1');
    const [resTab, setResTab] = useState('1');
    const [editorDom, setEditorDom] = useState(null);
    const currentRef = useRef();


    const handleSetEditor = (editor) => {
        setEditorDom(editor);
    };
    useImperativeHandle(currentRef, () => ({
        searchOpen: () => {
            try {
                editorDom.getContribution('editor.contrib.findController')._start({}, true);
            } catch (error) {
            }
        },
    }));

    const defaultList1 = [
        { id: '1', title: t('autoReport.all'), content: '新建内容1' },
        { id: '2', title: t('autoReport.fail'), content: '新建内容2' },
        { id: '3', title: t('autoReport.success'), content: '新建内容2' },
    ];
    const defaultList2 = [
        { id: '1', title: t('autoReport.all'), content: '新建内容1' },
        { id: '2', title: t('autoReport.fail'), content: '新建内容2' },
        { id: '3', title: t('autoReport.success'), content: '新建内容2' },
        { id: '4', title: t('autoReport.notRun'), content: '新建内容3' },
    ];
    const defaultList3 = [
        {
            id: '1', title: t('autoReport.reqHeader'), content: <div className="req-header">
                <MonacoEditor
                    width="100%"
                    ref={currentRef}
                    language={EditFormat(checkDetail.request_header).language || 'json'}
                    options={{ minimap: { enabled: false } }}
                    editorDidMount={handleSetEditor}
                    showCheck={false}
                    value={EditFormat(checkDetail.request_header).value === 'undefined' ? '' : EditFormat(checkDetail.request_header).value}
                />
            </div>
        },
        {
            id: '2', title: t('autoReport.reqBody'), content: <div className="req-body">
                <MonacoEditor
                    width="100%"
                    ref={currentRef}
                    language={EditFormat(checkDetail.request_body).language || 'json'}
                    options={{ minimap: { enabled: false } }}
                    editorDidMount={handleSetEditor}
                    showCheck={false}
                    value={EditFormat(checkDetail.request_body).value === 'undefined' ? '' : EditFormat(checkDetail.request_body).value}
                />
            </div>
        },
        {
            id: '3', title: t('autoReport.resHeader'), content: <div className="res-header">
                <MonacoEditor
                    width="100%"
                    ref={currentRef}
                    language={EditFormat(checkDetail.response_header).language || 'json'}
                    options={{ minimap: { enabled: false } }}
                    editorDidMount={handleSetEditor}
                    showCheck={false}
                    value={EditFormat(checkDetail.response_header).value === 'undefined' ? '' : EditFormat(checkDetail.response_header).value}
                />
            </div>
        },
        {
            id: '4', title: t('autoReport.resBody'), content: <div className="res-body">
                <MonacoEditor
                    width="100%"
                    ref={currentRef}
                    language={EditFormat(checkDetail.response_body).language || 'json'}
                    options={{ minimap: { enabled: false } }}
                    editorDidMount={handleSetEditor}
                    showCheck={false}
                    value={EditFormat(checkDetail.response_body).value === 'undefined' ? '' : EditFormat(checkDetail.response_body).value}
                />
            </div>
        },
    ];
    // const defaultList4 = [
    //     { id: '1', title: t('autoReport.resHeader'), content: '新建内容1' },
    //     { id: '2', title: t('autoReport.resBody'), content: '新建内容2' },
    // ];

    return (
        <div className="tReport-email-detail-result">
            <div className="scene-result">
                <p className="title">{t('autoReport.sceneResult')}</p>
                <Tabs defaultActiveId="1" onChange={(e) => {
                    let result = [];
                    if (e === '1') {
                        result = sceneResult;
                    } else if (e === '2') {
                        result = sceneResult.filter(item => item.state === 2);
                    } else if (e === '3') {
                        result = sceneResult.filter(item => item.state === 1);
                    }
                    setSceneResultNow(result);
                }}>
                    {defaultList1.map((d) => (
                        <TabPan key={d.id} id={d.id} title={d.title}>
                            <div className="scene-result-detail">
                                {
                                    sceneResultNow.length > 0 &&
                                    sceneResultNow.map(item => (
                                        <div className={`item ${item.scene_id === checkScene.scene_id ? 'item-hover' : ''}`} onClick={() => {
                                            setCheckScene(item);
                                        }}>
                                            {
                                                item.state === 1 ? <SvgSuccess className="success" /> : <SvgFailed className="fail" />
                                            }
                                            <Tooltip content={item.scene_name}>
                                                <p className="name">{item.scene_name}：</p>
                                            </Tooltip>
                                            <div className="progress">
                                                <div className="progress-success" style={{ width: `${item.case_total_num === 0 ? '100%' : `${((item.case_total_num - item.case_fail_num) / item.case_total_num) * 100}%`}` }}></div>
                                            </div>
                                            <Tooltip content={t('autoReport.caseTooltip')}>
                                                <p className="num success">{item.case_total_num - item.case_fail_num}/{item.case_total_num}</p>
                                            </Tooltip>
                                        </div>
                                    ))
                                }
                            </div>
                        </TabPan>
                    ))}
                </Tabs>
            </div>
            <div className="api-result">
                <p className="title">{t('autoReport.caseResult')}</p>
                <Tabs defaultActiveId="1" onChange={(e) => {
                    setCaseTab(e);
                    if (e === '1') {
                        setFilterCase(checkCase || []);
                    } else if (e === '2') {
                        let result = [];
                        checkCase.forEach(item => {
                            let _result = [];

                            item.api_list.forEach(elem => {
                                if (elem.status === 'failed') {
                                    _result.push(elem);
                                }
                            })

                            if (_result.length > 0) {
                                result.push({
                                    ...item,
                                    api_list: _result
                                })
                            }
                        })
                        setFilterCase(result);
                    } else if (e === '4') {
                        let result = [];
                        checkCase.forEach(item => {
                            let _result = [];

                            item.api_list.forEach(elem => {
                                if (elem.status === 'not_run') {
                                    _result.push(elem);
                                }
                            })

                            if (_result.length > 0) {
                                result.push({
                                    ...item,
                                    api_list: _result
                                })
                            }
                        })
                        setFilterCase(result);
                    } else if (e === '3') {
                        let result = [];
                        checkCase.forEach(item => {
                            let _result = [];

                            item.api_list.forEach(elem => {
                                if (elem.status === 'success') {
                                    _result.push(elem);
                                }
                            })

                            if (_result.length > 0) {
                                result.push({
                                    ...item,
                                    api_list: _result
                                })
                            }
                        })
                        setFilterCase(result);
                    }
                }}>
                    {defaultList2.map((d) => (
                        <TabPan key={d.id} id={d.id} title={d.title}>
                            <div className="collapse-list">
                                <Collapse accordion style={{ width: '41vw' }} defaultActiveKey={0}>
                                    {
                                        filterCase.length > 0 &&
                                        filterCase.map((item, index) => (
                                            <CollapseItem header={<CollapseHeader name={`${item.case_name}`} success={item.succeed_num} total={item.total_num} event_id={item.event_id} />} name={index}>
                                                {
                                                    item.api_list &&
                                                    item.api_list.map(elem => (
                                                        <ApiResultItem event_id={elem.event_id} item={elem} state={elem.status} name={elem.api_name} method={elem.method} url={elem.url} size={elem.response_bytes.toFixed(2)} time={elem.request_time} code={elem.request_code} />
                                                    ))
                                                }
                                            </CollapseItem>
                                        ))
                                    }
                                </Collapse>
                            </div>
                        </TabPan>
                    ))}
                </Tabs>
            </div>
            <div className="api-detail">
                <p className="title">{t('autoReport.apiDetail')}</p>
                <div className="api-detail-container">
                    <div className="assert">
                        <p className="label">{t('autoReport.assert')}</p>
                        <div className="assert-container">
                            {
                                Object.entries(checkDetail || {}).length > 0 ?
                                    checkDetail.assertion_msg ?
                                        checkDetail.assertion_msg.map(item => (
                                            <div className={`assert-container-item ${item.is_succeed ? 'success' : 'fail'}`}>
                                                {item.msg}
                                            </div>
                                        ))
                                        : <div className="not-data">{t('autoReport.noData')}</div>
                                    : <div className="not-data">{t('autoReport.noData')}</div>
                            }
                        </div>
                    </div>
                    <div className="detail">
                        <p className="label">{t('autoReport.detail')}</p>
                        <Tabs defaultActiveId="1" onChange={(e) => setReqTab(e)}>
                            {defaultList3.map((d) => (
                                <TabPan key={d.id} id={d.id} title={d.title}>
                                    <div className="req">
                                        {
                                            d.content
                                        }
                                    </div>
                                </TabPan>
                            ))}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TReportDetailResult;