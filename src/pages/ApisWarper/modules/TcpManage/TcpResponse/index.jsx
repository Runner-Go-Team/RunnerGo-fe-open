import React, { useState, useEffect } from "react";
import './index.less';
import { Input, Select, Tabs } from '@arco-design/web-react';
import { IconDelete, IconSearch, IconCopy } from '@arco-design/web-react/icon';
import { useSelector, useDispatch } from 'react-redux';
import { debounce, cloneDeep, isArray } from 'lodash';
import { useTranslation } from 'react-i18next';
import { copyStringToClipboard } from '@utils';


const { Option } = Select;
const { TabPane } = Tabs;

const TcpResponse = () => {
    // 搜索关键字
    const [keyword, setKeyword] = useState('');
    // 筛选消息状态, 0全部, 1成功, 2失败
    const [msgState, setMsgState] = useState(0);
    // 消息列表
    const [msgList, setMsgList] = useState([]);
    // 当前打开的tab
    const [tabId, setTabId] = useState('1');
    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const tcp_res = useSelector((store) => store.opens.tcp_res);
    const dispatch = useDispatch();
    const { t } = useTranslation();


    useEffect(() => {
        if (tcp_res) {
            if (tcp_res[open_api_now]) {
                setMsgList(tcp_res[open_api_now].result);
            } else {
                setMsgList([]);
            }
        }
    }, [tcp_res, open_api_now])

    useEffect(() => {
        if (tcp_res[open_api_now] && Object.entries(tcp_res[open_api_now] || {}.length > 0)) {

            let list = (tcp_res[open_api_now].result || []).filter(item => (tabId === '0' ? item.request_body : item.response_body).includes(keyword));

            setMsgList(list);
        }
    }, [keyword, tabId, tcp_res, open_api_now]);

    const clearMessage = () => {
        let _tcp_res = cloneDeep(tcp_res);

        _tcp_res[open_api_now] = {
            status: 'finish',
            result: []
        };
        dispatch({
            type: 'opens/updateTcpRes',
            payload: _tcp_res
        })
    }


    const tabList = [
        {
            id: '0',
            title: t('apis.tcp.requestMsg'),
            content: <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="tcp-manage-response-header">
                    <div className="left">
                        <p className="title">{t('apis.tcp.msgList')}</p>
                        <Input prefix={<IconSearch />} value={keyword} onChange={(e) => setKeyword(e)} />
                        <Select value={msgState} onChange={(e) => setMsgState(e)}>
                            <Option key={0} value={0}>{t('apis.tcp.msgState.0')}</Option>
                            <Option key={1} value={1}>{t('apis.tcp.msgState.1')}</Option>
                            <Option key={2} value={2}>{t('apis.tcp.msgState.2')}</Option>
                        </Select>
                        <div className="clear-message" onClick={clearMessage}>
                            <IconDelete />
                            <p>{t('apis.tcp.clearMsg')}</p>
                        </div>
                    </div>
                    {
                        tcp_res[open_api_now] && tcp_res[open_api_now].status === 'running' ?
                            <div className="connect-status">{t('apis.tcp.connectSuccess')}</div>
                            : <></>
                    }
                </div>
                <div className="tcp-manage-response-container">
                    {
                        isArray(msgList) && msgList.filter(item => {
                            if (msgState === 0) {
                                // 全部消息
                                return item;
                            } else if (msgState === 1) {
                                // 成功消息
                                return item.status && item.type === "send";
                            } else if (msgState === 2) {
                                // 失败消息
                                return !item.status && item.type === "send";
                            }
                        }).map(item => (
                            item.request_body.trim().length > 0 ?
                                <p className="item">{item.request_body} <IconCopy onClick={() => copyStringToClipboard(item.request_body, true)} /></p> : <></>
                        ))
                    }
                </div>
            </div>
        },
        {
            id: '1',
            title: t('apis.tcp.responseMsg'),
            content: <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="tcp-manage-response-header">
                    <div className="left">
                        <p className="title">{t('apis.tcp.msgList')}</p>
                        <Input prefix={<IconSearch />} value={keyword} onChange={(e) => setKeyword(e)} />
                        <Select value={msgState} onChange={(e) => setMsgState(e)}>
                            <Option key={0} value={0}>{t('apis.tcp.msgState.0')}</Option>
                            <Option key={1} value={1}>{t('apis.tcp.msgState.1')}</Option>
                            <Option key={2} value={2}>{t('apis.tcp.msgState.2')}</Option>
                        </Select>
                        <div className="clear-message" onClick={clearMessage}>
                            <IconDelete />
                            <p>{t('apis.tcp.clearMsg')}</p>
                        </div>
                    </div>
                    {
                        tcp_res[open_api_now] && tcp_res[open_api_now].status === 'running' ?
                            <div className="connect-status">{t('apis.tcp.connectSuccess')}</div>
                            : <></>
                    }
                </div>
                <div className="tcp-manage-response-container">
                    {
                        isArray(msgList) && msgList.filter(item => {
                            if (msgState === 0) {
                                // 全部消息
                                return item;
                            } else if (msgState === 1) {
                                // 成功消息
                                return item.status && item.type === "recv";
                            } else if (msgState === 2) {
                                // 失败消息
                                return !item.status && item.type === "recv";
                            }
                        }).map(item => (
                            item.response_body.trim().length > 0 ?
                                <p className="item">{item.response_body}  <IconCopy onClick={() => copyStringToClipboard(item.response_body, true)} /></p> : <></>
                        ))
                    }
                </div>
            </div>
        }
    ];

    return (
        <div className="tcp-manage-response">
            <Tabs defaultActiveTab='1' itemWidth={80} activeTab={tabId} onChange={(e) => setTabId(e)}>
                {
                    tabList.map((item, index) => (
                        <TabPane
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={item.id}
                            title={item.title}
                        >
                            {item.content}
                        </TabPane>
                    ))
                }
            </Tabs>

        </div>
    )
};

export default TcpResponse;