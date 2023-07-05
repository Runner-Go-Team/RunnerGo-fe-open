import React, { useState, useEffect, useRef } from "react";
import './index.less';
import { Select, Input, Button, Dropdown } from '@arco-design/web-react';
import { Message } from 'adesign-react';
import InputText from "@components/InputText";
import {
    Iconeye as SvgIconEye,
    CaretRight as SvgCareRight,
    Down as SvgDown,
    Save as SvgSave
} from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEnvList } from '@services/env';
import useFolders from '@hooks/useFolders';
import { cloneDeep } from "lodash";
import EnvView from "@components/EnvView";


const Option = Select.Option;
const ButtonGroup = Button.Group;

const OracleHeader = (props) => {
    const { data, onChange } = props;
    const { t } = useTranslation();
    const [envList, setEnvList] = useState([]);
    const [envId, setEnvId] = useState(null);
    const [envName, setEnvName] = useState('');
    const [runLoading, setRunLoading] = useState(false);

    const open_api_now = useSelector((store) => store.opens.open_api_now);
    const _saveId = useSelector((store) => store.opens.saveId);
    const sql_res = useSelector((store) => store.opens.sql_res);

    const dispatch = useDispatch();
    const { apiFolders } = useFolders();

    const saveOracle = (pid, _callback) => {
        if (data.name.trim().length === 0) {
            Message('error', t('message.SqlNameEmpty'));
            return;
        }
        Bus.$emit('saveSqlById', {
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

    const runOracle = () => {
        setRunLoading(true);
        saveOracle(null, () => {
            let _sql_res = cloneDeep(sql_res);
            _sql_res[open_api_now] = {
                status: 'running'
            };
            dispatch({
                type: 'opens/updateSqlRes',
                payload: _sql_res
            })
            Bus.$emit('runSql', () => {
                setRunLoading(false);
            });
        })
    };

    return (
        <>
            <div className="sql-manage-detail-header">
                <div className="header-left">
                    {/* <Select
                    className='mysql'
                >
                    <Option style={{ color: 'var(--mysql)' }} key='mysql' value='mysql'>
                        MySQL
                    </Option>
                </Select> */}
                    <InputText
                        maxLength={30}
                        value={data.name || ''}
                        placeholder={t('placeholder.sqlName')}
                        onChange={(e) => {
                            if (e.trim().length === 0) {
                                Message('error', t('message.SqlNameEmpty'));
                                return;
                            }
                            onChange('name', e);
                        }}
                    />
                </div>
                <div className="header-right">
                    <EnvView env_id={data ? (data.env_info ? data.env_info.env_id : 0) : 0}  onChange={onChange} />
                    <Button loading={runLoading} className='run-btn' icon={<SvgCareRight />} onClick={runOracle}>
                        执行
                    </Button>
                    <ButtonGroup>
                        <Button className="save-btn" onClick={() => saveOracle(data.parent_id ? data.parent_id : '')}><SvgSave /> {t('btn.save')}</Button>

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
                                            saveOracle();
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
                                                    saveOracle(item.target_id);
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
        </>
    )
};

export default OracleHeader;