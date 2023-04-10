import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';
import './index.less';
import { fetchDebugLog } from '@services/report';
import { useParams, useLocation } from 'react-router-dom';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import MonacoEditor from '@components/MonacoEditor';
import { EditFormat } from '@utils';
import { Explain as SvgExplain } from 'adesign-react/icons';
import Bus from '@utils/eventBus';

let debug_t = null;

const DebugLog = (props) => {
    const { stopDebug, end, status, tab, plan_id } = props;
    // const { id: report_id } = useParams();
    const { search } = useLocation();
    const { id: report_id, contrast } = qs.parse(search.slice(1));
    const [log, setLog] = useState([]);
    const select_plan = useSelector((store) => (store.plan.select_plan));
    const debug_list = useSelector((store) => store.report.debug_list);
    const { t } = useTranslation();

    useEffect(() => {
        let setIntervalList = window.setIntervalList;

        if (report_id && plan_id !== 0) {
            getDebug();
            if (end && tab !== '2') {
                if (setIntervalList) {
                    let _index = setIntervalList.findIndex(item => item === debug_t);
                    setIntervalList.splice(_index, 1);
                    window.setIntervalList = setIntervalList;
                }

                clearInterval(debug_t);
            } else {
                debug_t = setInterval(getDebug, 1000);

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

    useEffect(() => {
        if (!report_id) {
            getDebug();
        }
    }, [select_plan]);

    useEffect(() => {
        if (debug_list) {
            setLog(JSON.stringify(debug_list));
        }
    }, [debug_list]);

    const getDebug = () => {
        const query = {
            report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
            team_id: localStorage.getItem('team_id'),
            plan_id,
        };
        
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "stress_report_debug",
            param: JSON.stringify(query)
        }))
    }

    const [editorDom, setEditorDom] = useState(null);
    const { mode: language, value: editValue } = EditFormat(log);
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

    return (
        <div className='debug-log'>
            {/* {
                log.length > 0 ? log.map(item => <p className='debug-log-item'>{item}</p>) : (stopDebug === 'stop' && status === 1 ? t('report.debugEmpty') : '')
            } */}
            <div className='debug-log-tips'>
                <SvgExplain />
                <p>{t('report.debugLogTips')}</p>
            </div>
            <MonacoEditor
                ref={currentRef}
                Height="76vh"
                language={language || 'json'}
                options={{ minimap: { enabled: false } }}
                editorDidMount={handleSetEditor}
                value={editValue !== 'null' ? editValue : '{}'}
            />
        </div>
    )
};

export default DebugLog;