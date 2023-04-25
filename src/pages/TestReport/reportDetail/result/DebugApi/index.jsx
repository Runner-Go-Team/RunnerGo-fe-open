import React, { useState, useEffect } from "react";
import './index.less';
import { Drawer, Button, Message, Input } from 'adesign-react';
import SvgClose from '@assets/logo/close';
import ApiManage from '@pages/ApisWarper/modules/ApiManage';
import { useTranslation } from 'react-i18next';
import { fetchAutoReportApi } from '@services/auto_report';
import { useSelector, useDispatch } from 'react-redux';
import { cloneDeep } from 'lodash';
import { getPathExpressionObj } from '@constants/pathExpression';
import Bus from '@utils/eventBus';


const DebugApi = (props) => {
    const { onCancel, eventId, caseId, apiName, apiInfo } = props;
    const dispatch = useDispatch();
    const open_res = useSelector((store) => store?.opens.open_res);

    const [apiNow, setApiNow] = useState({});
    const { t } = useTranslation();
    useEffect(() => {
        if (eventId.length > 0 && caseId.length > 0) {
            const params = {
                team_id: localStorage.getItem('team_id'),
                case_id: caseId,
                event_id: eventId
            };
            fetchAutoReportApi(params).subscribe({
                next: (res) => {
                    const { code, data: { api_detail } } = res;
                    if (code === 0) {
                        setApiNow(api_detail);
                        const _open_res = cloneDeep(open_res);
                        _open_res[api_detail.target_id] = {
                            ...apiInfo,
                            assertion: apiInfo.assertion_msg,
                            status: 'finish',
                        };
                        dispatch({
                            type: 'opens/updateOpenRes',
                            payload: _open_res
                        })
                        dispatch({
                            type: 'auto_report/updateDebugTargetId',
                            payload: api_detail
                        })
                    }
                }
            })
        }
    }, [eventId, caseId, apiInfo]);

    const DrawerHeader = () => {
        return (
            <div className='drawer-header'>
                <div className='drawer-header-left'>
                    <Button className='drawer-close-btn' style={{ marginRight: '8px' }} onClick={onCancel} >
                        <SvgClose />
                    </Button>
                    <Input size="mini" disabled value={apiName} placeholder={t('placeholder.apiName')} onBlur={(e) => {
                        if (e.target.value.trim().length === 0) {
                            Message('error', t('message.apiNameEmpty'));
                        }
                        onTargetChange('name', e.target.value.trim());
                    }} />
                </div>
                <div className='drawer-header-right'>

                    {/* {
                        (response_data || scene_result) ? <p>{t('scene.runTime')}：{response_data ? response_data.response_time : (scene_result ? scene_result.response_time : '')}</p> : <></>
                    } */}
                </div>
            </div>
        )
    };

    const onTargetChange = (type, value, extension) => {
        Bus.$emit('updateAutoReportApi', {
            id: apiNow.target_id,
            pathExpression: getPathExpressionObj(type, extension),
            value,
        });
    };

    return (
        <Drawer
            className='plan-drawer'
            visible={true}
            title={<DrawerHeader />}
            footer={null}
            mask={false}
        >
            <ApiManage from='auto_report' apiInfo={apiNow} showInfo={false} onChange={(type, val, extension) => onTargetChange(type, val, extension)} />
        </Drawer>
    )
};

export default DebugApi;