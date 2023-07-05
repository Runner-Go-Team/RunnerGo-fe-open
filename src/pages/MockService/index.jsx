import React, { useEffect } from 'react';
import { Scale, Tree } from 'adesign-react';
import { useSelector } from 'react-redux';
import { isObject } from 'lodash';
import Bus from '@utils/eventBus';
import TreeMenu from '@components/TreeMenu';
import ApiTabs from './ApiTabs';
import RunPanel from './mocks';
import './index.less';


const { ScalePanel, ScaleItem } = Scale;
const Apis = (props) => {
    const openApis = useSelector((store) => store?.mock?.mock_apis_open);
    const mockApis = useSelector((store) => store?.mock?.mock_apis);
    const open_api_now = useSelector((store) => store.mock.open_api_now);

    useEffect(() => {
        // 调用接口获取mockApis
        Bus.$emit('mock/getMockList');
    }, []);


    // 切换tabItem
    const handleTabChange = (target_id) => {
        Bus.$emit('mock/updateOpenApiNow', target_id);
    };

    // 被打开的api数据列表
    const apiDataList = isObject(openApis)
        ? Object.values(openApis).map((item) => {
            return {
                id: item?.target_id,
                title: item?.name,
                type: item?.target_type,
                method: item?.method,
                createTime: typeof item.target_id === 'number' ? item.created_time_sec : item.create_dtime,
                lastUpdate: typeof item.target_id === 'number' ? item.updated_time_sec : item.update_dtime,
                ifChanged: item.is_changed,
                data: item,
                unSave: true,
            };
        })
        : [];

    // 删除tabItem
    const handleRemoveTab = (id, api_now) => {
        id && Bus.$emit('mock/removeOpenItem', id, api_now);
    };

    const contentRender = ({ activeId }) => {
        return (
            <RunPanel {...{ tabsList: apiDataList, activeId }} />
        );
    };


    return (
        <ScalePanel
            realTimeRender
            className='mock-service-scale-panel'
            defaultLayouts={{ 0: { width: 270, marginRight: '2px' }, 1: { flex: 1, width: 0 } }}
        >
            <ScaleItem className="left-menus" minWidth={250} maxWidth={350}>
                <TreeMenu value={mockApis || []} type='mock' />
            </ScaleItem>
            <ScaleItem className="right-apis" enableScale={false}>
                <ApiTabs
                    onChange={handleTabChange}
                    defaultTabId={open_api_now}
                    apiList={apiDataList}
                    onRemoveTab={handleRemoveTab}
                    contentRender={contentRender}
                />
            </ScaleItem>
        </ScalePanel>
    )
};

export default Apis;