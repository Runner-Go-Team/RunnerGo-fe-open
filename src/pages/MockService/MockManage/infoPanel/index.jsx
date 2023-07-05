import React, { useState, useEffect, useRef } from 'react';
import { Input, Message, Dropdown, Select } from 'adesign-react';
import { Right as SvgRight, Down as SvgDown, Save as SvgSave } from 'adesign-react/icons';
import ApiStatus from '@components/ApiStatus';
import APIModal from '@components/ApisDescription';
import ManageGroup from '@components/ManageGroup';
// import { TYPE_MODAL_TYPE } from './types';
import Bus from '@utils/eventBus';
import './index.less';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHandleApi } from '@services/apis';
import { cloneDeep } from 'lodash';
import { tap } from 'rxjs';
import { global$ } from '@hooks/useGlobal/global';
import { useTranslation } from 'react-i18next';
import Mousetrap from 'mousetrap';
import 'mousetrap-global-bind';
import useMockFolders from '@hooks/useMockFolders';
import { DropWrapper } from './style';
import { Button } from '@arco-design/web-react';
import { IconDown } from '@arco-design/web-react/icon';
import InputText from '@components/InputText';
import EnvView from '@components/EnvView';
const ButtonGroup = Button.Group;
const Option = Select.Option;
const ApiInfoPanel = (props) => {
    const { data, onChange } = props;

    const refDropdown = useRef();
    const [modalType, setModalType] = useState('');
    const open_api_now = useSelector((store) => store?.mock?.open_api_now);

    const { t } = useTranslation();
    const { apiFolders } = useMockFolders();
    Mousetrap.bindGlobal(['command+s', 'ctrl+s'], () => {
        if (location.hash.split('/')[1] === 'apis' || location.hash.split('/')[1] === 'mockservice') {
            saveApi(data.parent_id ? data.parent_id : '');
        }
        return false;
    });


    const saveApi = (pid) => {
        if (data.name.trim().length === 0) {
            Message('error', t('message.apiNameEmpty'));
            return;
        }
        Bus.$emit('mock/saveTargetById', {
            id: open_api_now,
            pid: pid ? pid : '0'
        }, () => {
            Message('success', t('message.saveSuccess'));
        });
    }


    return (
        <>
            {modalType === 'description' && (
                <APIModal
                    value={data?.request?.description || ''}
                    onChange={onChange}
                    onCancel={setModalType.bind(null, '')}
                />
            )}
            <div className="api-manage">
                <div className="api-info-panel">
                    <Select
                        style={{ width: '107px' }}
                        value={data?.parent_id}
                        onChange={(val) => {
                            onChange('parent_id', val);
                        }}>
                        <Option key={'0'} value={'0'}>
                            {t('apis.rootFolder')}
                        </Option>

                        {apiFolders.map((item) =>
                            <Option key={item?.target_id} value={item?.target_id}>
                                {`|${new Array(item.level).fill('—').join('')}${item.name}`}
                            </Option>
                        )}
                    </Select>
                    <div className="api-name-group">
                        <InputText
                            maxLength={30}
                            value={data.name || ''}
                            placeholder={t('placeholder.apiName')}
                            onChange={(e) => {
                                if (e.trim().length === 0) {
                                    Message('error', t('message.apiNameEmpty'));
                                    return;
                                }
                                onChange('name', e);
                            }}
                        />
                    </div>
                </div>
                <div className='info-panel-right'>
                    <ButtonGroup>
                        <Button className="save-btn" onClick={() => saveApi(data.parent_id ? data.parent_id : '')}><SvgSave /> {t('btn.save')}</Button>
                        <Dropdown
                            ref={refDropdown}
                            placement="bottom-end"
                            content={
                                <div className={DropWrapper}>
                                    <div
                                        className="drop-item"
                                        onClick={() => {
                                            Bus.$emit('mock/saveTargetById', {
                                                id: open_api_now,
                                                options:{
                                                    operate_type: 2
                                                }
                                            }, () => {
                                                Message('success', t('message.saveToTargetSuccess'));
                                            });
                                        }}
                                    >
                                        {t('mock.saveTestObj')}
                                    </div>
                                    <div
                                        className="drop-item"
                                        onClick={() => {
                                            Bus.$emit('mock/saveTargetById', {
                                                id: open_api_now,
                                                options:{
                                                    operate_type: 3
                                                }
                                            }, () => {
                                                Message('success', t('message.syncToTargetSuccess'));
                                            });
                                        }}
                                    >
                                        {t('mock.syncToTestObj')}
                                    </div>
                                </div>
                            }

                        >
                            <Button className="save-more-btn" icon={<IconDown />} />

                        </Dropdown>
                    </ButtonGroup>
                </div>
            </div>
        </>
    );
};

export default ApiInfoPanel;
