import React, { useEffect, useState } from 'react';
import { Scale } from 'adesign-react';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import isObject from 'lodash/isObject';
import {
    Console as ConsoleSvg,
    Clear as ClearSvg,
    Close as CloseSvg,
    Duration as DurationSvg,
} from 'adesign-react/icons';
import MultiLevel from '@components/MultiLevel';
import { getJSONObj } from '@utils';
import { isArray, isPlainObject } from 'lodash';
import { ConsoleWrapper } from './style';

const { ScaleItem, ScalePanel } = Scale;
const defaultLayouts = {
    0: { height: 500 },
};

const MIN_CONSOLE_HEIGHT = 30;

const Console = (props) => {
    const { ConsoleList, visible, setVisible } = props;
    const [consoleList, setConsoleList] = useState(ConsoleList || []);
    const [layouts, setLayouts] = useState({ 0: { height: 0 } });

    const dispatch = useDispatch();

    const handleLayoutsChange = (newLayouts) => {
        if (newLayouts?.[0]?.height < MIN_CONSOLE_HEIGHT) {
            setVisible(false);
            // setLayouts({ 0: { height: 0 } });
        } else {
            setLayouts(newLayouts);
        }
    };

    useEffect(() => {
        if (visible === true) {
            setLayouts(defaultLayouts);
        } else {
            setLayouts({ 0: { height: 0 } });
        }
    }, [visible]);

    useEffect(() => {
        // User.get(localStorage.getItem('uuid') || '-1').then((userInfo) => {
        //     if (isPlainObject(userInfo?.config)) {
        //         const MAX_CONSOLE_LOG = userInfo.config?.MAX_CONSOLE_LOG || 10;
        //         if (MAX_CONSOLE_LOG > 0) setConsoleList(ConsoleList.slice(MAX_CONSOLE_LOG * -1));
        //     }
        // });
        setConsoleList(ConsoleList);
    }, [ConsoleList]);

    const LevelTitle = (consoleRes) => {
        if (consoleRes.type === 'console') {
            return (
                <div className="item">
                    <div className="time">{consoleRes.time}</div>
                    <div className="req-body">
                        {isObject(consoleRes.data) ? JSON.stringify(consoleRes.data) : consoleRes.data}
                    </div>
                </div>
            );
        }
        const { data } = consoleRes;
        const { General = {} } = data || {};

        return (
            <div className="item">
                <div className="time">{General?.['Request Time'] || consoleRes?.time}</div>
                <div className="req-body">
                    <span
                        className={classNames('Request_Method method', {
                            [General['Request Method'].toLowerCase()]: true,
                        })}
                    >
                        {General['Request Method']}
                    </span>
                    <span className="Request_URL">{General['Request URL']}</span>
                </div>
                <div className={`code ${data.hasOwnProperty('Error') ? 'error' : ''}`}>
                    响应码：<span>{General['Status Code']}</span>
                </div>
                <div className={`reqTime ${data.hasOwnProperty('Error') ? 'error' : ''}`}>
                    <DurationSvg /> {consoleRes?.time || 0}毫秒
                </div>
            </div>
        );
    };

    const JsonString = (str) => {
        try {
            const jsonObj = JSON.parse(str);
            return JSON.stringify(jsonObj);
        } catch (error) {
            return `"${str}"`;
        }
    };

    const RenderDeep = (cons) => {
        const isObj = isObject(cons);
        return (
            <div className="level-item">
                {isObj ? (
                    <>
                        {Object.keys(cons).map((key, index) => (
                            <>
                                {isObject(cons[key]) || key === 'Response Body' ? (
                                    <MultiLevel key={index} title={key}>
                                        {RenderDeep(cons[key])}
                                    </MultiLevel>
                                ) : (
                                    <div key={index} className={key === 'Error' ? 'error' : ''}>
                                        <strong>{typeof key === 'string' ? `${key || '""'}` : JsonString(key)}:</strong>{' '}
                                        {cons[key]}
                                    </div>
                                )}
                            </>
                        ))}
                    </>
                ) : (
                    <div className="apipost-level">
                        {typeof cons === 'string' ? `${cons || '""'}` : JsonString(cons)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {layouts[0].height > MIN_CONSOLE_HEIGHT && (
                <ScalePanel
                    style={{
                        position: 'absolute',
                        overflow: 'visible',
                        height: 'auto',
                        bottom: 40,
                    }}
                    enableOverflow
                    className={ConsoleWrapper}
                    defaultLayouts={{ 0: { height: 0 } }}
                    direction="vertical"
                    onLayoutsChange={handleLayoutsChange}
                    layouts={layouts}
                >
                    <ScaleItem minHeight={0} maxHeight={590} barLocation="start">
                        <div className="apipost-console">
                            <div className="apipost-console-header">
                                <div className="header-left">
                                    <ConsoleSvg />
                                    控制台
                                    <span>（默认最多展示10条记录，可以在设置中自定义更改）</span>
                                </div>
                                <div className="header-right">
                                    <div
                                        onClick={() => {
                                            dispatch({
                                                type: 'console/coverConsoleList',
                                                payload: [],
                                            });
                                        }}
                                    >
                                        <ClearSvg /> 清除
                                    </div>
                                    <div onClick={setVisible.bind(null, false)}>
                                        <CloseSvg /> 关闭
                                    </div>
                                </div>
                            </div>
                            <div className="apipost-console-content">
                                {isArray(consoleList) &&
                                    consoleList.map((item, index) => (
                                        <MultiLevel key={index} showDefaultIcon={false} title={<>{LevelTitle(item)}</>}>
                                            {item.type === 'network' && RenderDeep(item.data)}
                                            {item.type === 'console' && RenderDeep(getJSONObj(item.data))}
                                        </MultiLevel>
                                    ))}
                            </div>
                        </div>
                    </ScaleItem>
                </ScalePanel>
            )}
        </>
    );
};

export default Console;
