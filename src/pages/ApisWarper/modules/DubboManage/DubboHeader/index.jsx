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

const DubboHeader = (props) => {
    const { data = {}, onChange } = props;
    const [popupVisible, setPopupVisible] = useState(false);
    const [runLoading, setRunLoading] = useState(false);
    const { t } = useTranslation();

    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const dubbo_res = useSelector((store) => store.opens.dubbo_res);

    const dispatch = useDispatch();
    const { apiFolders } = useFolders();

    const saveDubbo = (pid, _callback) => {
        if (data.name.trim().length === 0) {
            Message('error', t('message.tcpNameEmpty'));
            return;
        }
        Bus.$emit('saveDubboById', {
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

    const runDubbo = () => {
        setRunLoading(true);
        saveDubbo(null, () => {
            let _dubbo_res = cloneDeep(dubbo_res);
            _dubbo_res[open_api_now] = {
                status: 'running'
            };
            dispatch({
                type: 'opens/updateDubboRes',
                payload: _dubbo_res
            })
            Bus.$emit('runDubbo', () => {
                setRunLoading(false);
            });
        })
    };

    return (
        <div className="dubbo-manage-header">
            <div className="info-panel">
                <div className="info-panel-left">
                    <InputText
                        maxLength={30}
                        value={data.name || ''}
                        placeholder="请输入Dubbo名称"
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
                        <Button className="save-btn" onClick={() => saveDubbo(data.parent_id ? data.parent_id : '')}><SvgSave /> {t('btn.save')}</Button>

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
                                            saveDubbo();
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
                                                    saveDubbo(item.target_id);
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
                    <Select
                        className='dubbo-method-select'
                        defaultValue={data.dubbo_detail.dubbo_protocol ? data.dubbo_detail.dubbo_protocol : 'dubbo'}
                        getPopupContainer={(reactNode) => reactNode.parentNode}
                        onChange={(e) => {
                            onChange('dubbo_protocol', e);
                        }}
                    >
                        <Option key='dubbo' value='dubbo'>dubbo</Option>
                        <Option key='tri' value='tri'>tri</Option>
                    </Select>
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
                                    <div className="url-right">
                                        <Input
                                            className='url'
                                            value={data ? data.dubbo_detail.api_name : ''}
                                            placeholder="请输入API调用名称"
                                            onChange={(e) => {
                                                console.log(e);
                                                onChange('dubbo_api_name', e);
                                            }}
                                        />
                                        <Input
                                            className='url'
                                            style={{ marginLeft: '2px' }}
                                            value={data ? data.dubbo_detail.function_name : ''}
                                            placeholder="请输入方法名"
                                            onChange={(e) => {
                                                console.log(e);
                                                onChange('dubbo_function_name', e);
                                            }}
                                        />
                                    </div>
                                </ScaleItem>
                            </ScalePanel>
                            :
                            <div className="url-right">
                                <Input
                                    className='url'
                                    value={data ? data.dubbo_detail.api_name : ''}
                                    placeholder="请输入API调用名称"
                                    onChange={(e) => {
                                        console.log(e);
                                        onChange('dubbo_api_name', e);
                                    }}
                                />
                                <Input
                                    className='url'
                                    style={{ marginLeft: '2px' }}
                                    value={data ? data.dubbo_detail.function_name : ''}
                                    placeholder="请输入方法名"
                                    onChange={(e) => {
                                        console.log(e);
                                        onChange('dubbo_function_name', e);
                                    }}
                                />
                            </div>
                    }

                </div>
                <Button loading={runLoading} className='connect-btn' onClick={runDubbo}>发送</Button>
            </div>
        </div>
    )
};

export default DubboHeader