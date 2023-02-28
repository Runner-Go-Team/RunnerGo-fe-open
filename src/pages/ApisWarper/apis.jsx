import React from 'react';
import cn from 'classnames';
import { getPathExpressionObj } from '@constants/pathExpression';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import ApiManage from './modules/ApiManage';
import GrpcManage from './modules/GrpcManage';
import DocManage from './modules/DocManage';
import FolderManage from './modules/FolderManage';
import Websocket from './modules/Websocket';

const renderElement = (data, temp_apis, websockets, onTargetChange) => {
    const target_type = data?.target_type;
    const target_id = data?.target_id;

    const tempData = isObject(temp_apis?.[target_id]) ? temp_apis[target_id] : {};
    const tempSocketData = isObject(websockets?.[target_id]) ? websockets[target_id] : {};
    if (target_type === 'api') {
        return <ApiManage data={data} tempData={tempData} onChange={onTargetChange} />;
    }
    if (target_type === 'doc') {
        return <DocManage data={data} onChange={onTargetChange} />;
    }
    if (target_type === 'websocket') {
        return <Websocket data={data} tempData={tempSocketData} onChange={onTargetChange} />;
    }
    if (target_type === 'folder') {
        return <FolderManage data={data} onChange={onTargetChange} />;
    }
    if (target_type === 'grpc') {
        return <GrpcManage data={data} onChange={onTargetChange} />;
    }
    return <></>;
};

const Apis = (props) => {
    const { tabsList, activeId } = props;
    const opens = useSelector((store) => store.opens ? store.opens : {});
    const dispatch = useDispatch();
    const { temp_apis, websockets, open_api_now } = opens;

    const onTargetChange = (id, type, value, extension) => {
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
