import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import './index.less';
import { fetchDebugLog } from '@services/report';
import { useParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { EditFormat } from '@utils';
import { Explain as SvgExplain } from 'adesign-react/icons';
import ResPonsePanel from '@components/response/responsePanel';
import ScalePanelTwoItem from '@components/ScalePanelTwoItem';
import { cloneDeep } from 'lodash';

let debug_t = null;

const DebugLog = (props) => {
    const { stopDebug, end, status, tab, plan_id } = props;
    // const { id: report_id } = useParams();
    const { search } = useLocation();
    const { id: report_id, contrast } = qs.parse(search.slice(1));
    const [log, setLog] = useState([]);
    const [selectApi, setSelectApi] = useState(null);
    const select_plan = useSelector((store) => (store.plan.select_plan));
    // const debug_list = useSelector((store) => store.report.debug_list);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        let setIntervalList = window.setIntervalList;
        if (report_id && plan_id) {

            getDebug();
            if (end && tab !== '2') {
                if (setIntervalList) {
                    let _index = setIntervalList.findIndex(item => item === debug_t);
                    setIntervalList.splice(_index, 1);
                    window.setIntervalList = setIntervalList;
                }

                clearInterval(debug_t);
            } else if (!end) {
                debug_t = setInterval(getDebug, 3000);

                if (setIntervalList) {
                    setIntervalList.push(debug_t);
                } else {
                    setIntervalList = [debug_t];
                }
                window.setIntervalList = setIntervalList;
            }
        }

        return () => {
            if (setIntervalList) {
                let _index = setIntervalList.findIndex(item => item === debug_t);
                setIntervalList.splice(_index, 1);
                window.setIntervalList = setIntervalList;
            }
            clearInterval(debug_t);
        }
    }, [end, tab, plan_id]);

    const getDebug = () => {
        const query = {
            report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
            team_id: localStorage.getItem('team_id'),
            plan_id,
        };

        fetchDebugLog(query).subscribe({
            next: (res) => {
                const { data } = res;
                setLog(data ? data : []);
            }
        })
    }

    const [editorDom, setEditorDom] = useState(null);
    const { mode: language, value: editValue } = EditFormat(log);
    const currentRef = useRef(null);
    const containerRef = useRef(null);

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


    return (
        <div className='debug-log'>
            <div className='debug-log-tips'>
                <SvgExplain />
                <p>{t('report.debugLogTips')}</p>
            </div>
            <div className='container' ref={containerRef}>
                {
                    (selectApi && log.length > 0) ? <ScalePanelTwoItem
                        refWrapper={containerRef}
                        leftMin={<></>}
                        left={<div className='debug-log-list'>
                            {
                                log.length > 0 ? log.map(item => (
                                    <div className={`debug-log-list-item ${selectApi.uuid === item.uuid ? 'select' : ''}`} onClick={() => {
                                        dispatch({
                                            type: 'report/updateDebugRes',
                                            payload: item
                                        })
                                        setSelectApi(item);
                                    }}>
                                        <div className='left'>
                                            <p className='name'>{item.api_name}：</p>
                                            <p className={item.method === 'GET' ? 'get' : 'post'}>{item.method}</p>
                                            <p className='url'>{item.request_url}</p>
                                        </div>
                                        <div className='right'>
                                            <p className='size'>{item.response_bytes}kb</p>
                                            <p className='time'>{item.request_time}ms</p>
                                            <p className={`code ${item.request_code === 200 ? 'success' : 'error'}`}>{item.request_code}</p>
                                        </div>
                                    </div>
                                )) : ''
                            }
                        </div>}
                        rightMin={<></>}
                        right={
                            <ResPonsePanel
                                tempData={{}}
                                data={selectApi || {}}
                                from='report'
                                showRight={false}
                            />
                        }
                    /> : <div className='debug-log-list'>
                        {
                            log.length > 0 ? log.map(item => (
                                <div className={`debug-log-list-item`} onClick={() => {
                                    dispatch({
                                        type: 'report/updateDebugRes',
                                        payload: item
                                    })
                                    setSelectApi(item);
                                }}>
                                    <div className='left'>
                                        <p className='name'>{item.api_name}：</p>
                                        <p className={item.method === 'GET' ? 'get' : 'post'}>{item.method}</p>
                                        <p className='url'>{item.request_url}</p>
                                    </div>
                                    <div className='right'>
                                        <p className='size'>{item.response_bytes}kb</p>
                                        <p className='time'>{item.request_time}ms</p>
                                        <p className={`code ${item.request_code === 200 ? 'success' : 'error'}`}>{item.request_code}</p>
                                    </div>
                                </div>
                            )) : ''
                        }
                    </div>
                }

            </div>
        </div>
    )
};

export default DebugLog;