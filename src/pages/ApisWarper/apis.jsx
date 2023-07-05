import React from 'react';
import cn from 'classnames';
import { getPathExpressionObj } from '@constants/pathExpression';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import ApiManage from './modules/ApiManage';
import SqlManage from './modules/SqlManage';
import TcpManage from './modules/TcpManage';
import WsManage from './modules/WsManage';
import MqttManage from './modules/MqttManage';
import DubboManage from './modules/DubboManage';
import OracleManage from './modules/OracleManage';

const renderElement = (data, temp_apis, websockets, onTargetChange) => {
    const target_type = data?.target_type;
    const target_id = data?.target_id;
    const tempData = isObject(temp_apis?.[target_id]) ? temp_apis[target_id] : {};
    const tempSocketData = isObject(websockets?.[target_id]) ? websockets[target_id] : {};
    if (target_type === 'api') {
        return <ApiManage data={data} tempData={tempData} onChange={onTargetChange} />;
    }
    if (target_type === 'sql') {
        return <SqlManage data={data} onChange={onTargetChange} />;
    }
    if (target_type === 'tcp') {
        return <TcpManage data={data} onChange={onTargetChange} />
    }
    if (target_type === 'websocket') {
        return <WsManage data={data} onChange={onTargetChange} />;
    }
    if (target_type === 'mqtt') {
        return <MqttManage data={data} onChange={onTargetChange} />
    }
    if (target_type === 'dubbo') {
        return <DubboManage data={data} onChange={onTargetChange} />
    }
    if (target_type === 'oracle') {
        return <OracleManage data={data} onChange={onTargetChange} />
    }
    return <></>;
};

const Apis = (props) => {
    const { tabsList, activeId } = props;
    const opens = useSelector((store) => store.opens ? store.opens : {});
    const dispatch = useDispatch();
    const { temp_apis, websockets, open_api_now } = opens;
    const onTargetChange = (id, type, value, extension, ignore = false) => {
        // 统一修改
        if (open_api_now !== id) {
            dispatch({
                type: 'opens/updateOpenApiNow',
                payload: id
            })
        };
        Bus.$emit('updateTarget', {
            target_id: id,
            pathExpression: getPathExpressionObj(type, extension),
            value,
            ignore
        });
    };

    return (
        <>
            {tabsList.map((item, index) => (
                <div
                    key={index}
                    className={cn('tab-content-item', {
                        active: item?.id === activeId,
                    })}
                >
                    {renderElement(item?.data, temp_apis, websockets, onTargetChange.bind(null, item.id))}
                </div>
            ))}
        </>
    );
};

export default React.memo(Apis);
