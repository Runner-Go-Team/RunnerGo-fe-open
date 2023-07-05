import React, { useState, useEffect } from "react";
import './index.less';
import { Select, Button, Dropdown, Input } from '@arco-design/web-react';
import { Message, Scale } from 'adesign-react';
import InputText from "@components/InputText";
import {
    Iconeye as SvgIconEye,
    Down as SvgDown,
    Save as SvgSave
} from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import useFolders from '@hooks/useFolders';
import { cloneDeep } from 'lodash';
import EnvView from "@components/EnvView";
import ServicePreUrl from "@components/ServicePreUrl";

const Option = Select.Option;
const ButtonGroup = Button.Group;
const ScalePanel = Scale.ScalePanel;
const ScaleItem = Scale.ScaleItem;

const TcpHeader = (props) => {
    const { data = {}, onChange } = props;
    const { t } = useTranslation();
    const { apiFolders } = useFolders();
    const dispatch = useDispatch();
    // 状态, 0未连接, 1连接中, 2连接成功
    const [connecStatus, setConnectStatus] = useState(0);

    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const tcp_res = useSelector((store) => store.opens.tcp_res);

    const saveTcp = (pid, _callback) => {
        if (data.name.trim().length === 0) {
            Message('error', t('message.tcpNameEmpty'));
            return;
        }
        Bus.$emit('saveTcpById', {
            id: open_api_now,
            pid: _callback ? null : (pid ? pid : '0'),
            callback: (code, id) => {
                if (code === 0) {
                    if (_callback) {

                        dispatch({
                            type: 'opens/updateSaveId',
                            payload: id,
                        })

                        _callback && _callback();
                    } else {

                        Message('success', t('message.saveSuccess'));

                        dispatch({
                            type: 'opens/updateSaveId',
                            payload: id,
                        })
                    }
                }
            }
        });
    };

    const connectTcp = () => {
        setConnectStatus(1);
        saveTcp(null, () => {
            let _tcp_res = cloneDeep(tcp_res);
            _tcp_res[open_api_now] = {
                status: 'running'
            };
            dispatch({
                type: 'opens/updateTcpRes',
                payload: _tcp_res
            })
            Bus.$emit('connectTcp');
        })
    };

    const stopRunTcp = () => {
        Bus.$emit('stopRunTcp', () => {
            setConnectStatus(0);
        });
    };

    useEffect(() => {
        if (tcp_res[open_api_now]) {
            if (tcp_res[open_api_now].status === 'running') {
                setConnectStatus(2)
            } else if (tcp_res[open_api_now].status === 'finish') {
                setConnectStatus(0);
            }
        }
    }, [tcp_res, open_api_now]);

    return (
        <div className="tcp-manage-header">
            <div className="info-panel">
                <div className="info-panel-left">
                    <InputText
                        maxLength={30}
                        value={data.name || ''}
                        placeholder={t('placeholder.tcpName')}
                        onChange={(e) => {
                            if (e.trim().length === 0) {
                                return;
                            }
                            onChange('name', e);
                        }}
                    />
                </div>
                <div className="info-panel-right">
                    <EnvView env_id={data ? (data.env_info ? data.env_info.env_id : 0) : 0} onChange={onChange} />

                    <ButtonGroup>
                        <Button className="save-btn" onClick={() => saveTcp(data.parent_id ? data.parent_id : '')}><SvgSave /> {t('btn.save')}</Button>

                        <Dropdown
                            placement="bottom-end"
                            trigger='click'
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                            droplist={
                                <div className='drop-folder'>
                                    <div
                                        className="drop-item"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            saveTcp();
                                        }}
                                    >
                                        {t('apis.rootFolder')}
                                    </div>
                                    {apiFolders.map((item) => (
                                        <>
                                            <div
                                                className="drop-item"
                                                key={item.target_id}
                                                {...item}
                                                value={item.target_id}
                                                onClick={() => {
                                                    saveTcp(item.target_id);
                                                }}
                                            >
                                                {`|${new Array(item.level).fill('—').join('')}${item.name}`}
                                            </div>
                                        </>
                                    ))}
                                </div>
                            }

                        >
                            <Button className="save-more-btn" icon={<SvgDown />} />

                        </Dropdown>
                    </ButtonGroup>

                </div>
            </div>
            <div className="url-panel">
                <div className="url-view">
                    {
                        (data && data.env_info && data.env_info.env_id)
                            ?
                            <ScalePanel
                                defaultLayouts={{ 0: { width: 147 }, 1: { flex: 1, width: 0 } }}
                            >
                                <ScaleItem>
                                    <ServicePreUrl
                                        onChange={onChange}
                                        env_info={data ? data.env_info : {}}
                                    />
                                </ScaleItem>
                                <ScaleItem enableScale={false}>
                                    <Input
                                        className='url'
                                        value={data ? data.tcp_detail.url : ''}
                                        placeholder="请输入TCP请求或路径"
                                        onChange={(e) => {
                                            console.log(e);
                                            onChange('tcp_url', e);
                                        }}
                                    />
                                </ScaleItem>
                            </ScalePanel>
                            :
                            <Input
                                className='url'
                                value={data ? data.tcp_detail.url : ''}
                                placeholder="请输入TCP请求或路径"
                                onChange={(e) => {
                                    console.log(e);
                                    onChange('tcp_url', e);
                                }}
                            />
                    }

                </div>

                <Button className='connect-btn' onClick={connecStatus === 0 ? connectTcp : stopRunTcp} disabled={connecStatus === 1}>
                    { connecStatus === 0 ? t('btn.connect') : (connecStatus === 1 ? t('btn.connecting') : t('btn.stopConnect')) }
                </Button>
            </div>
        </div>
    )
};

export default TcpHeader