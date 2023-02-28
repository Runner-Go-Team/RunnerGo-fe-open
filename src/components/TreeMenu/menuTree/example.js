import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, Dropdown, Message } from 'adesign-react';
import Bus from '@utils/eventBus';
import { SaveMultiArchiveTarget } from '@services/apis';
import SvgFlash from '@assets/apis/flash';
import { global$ } from '@hooks/useGlobal/global';
import { TreeIcon, TreeMenuItem } from './style';

// 归档组件
const Example = (props) => {
    const { value } = props;

    // 项目信息
    const workspace = useSelector((store) => store?.workspace);
    const { CURRENT_PROJECT_ID, CURRENT_TEAM_ID } = workspace;

    const refDropdown = useRef(null);

    const handleSaveMultiArchiveTargets = () => {
        SaveMultiArchiveTarget({
            team_id: CURRENT_TEAM_ID,
            project_id: CURRENT_PROJECT_ID,
            action_type: 2,
            target_ids: [value?.nodeKey],
            is_socket: 1,
        }).subscribe({
            next: async (resp) => {
                if (resp?.code === 10000) {
                    Message('success', '取消归档成功');
                    // 批量取消操作后对redux，indexdb数据进行操作

                    // 更新collection
                    await Bus.$emit('updateCollectionById', {
                        id: value?.nodeKey,
                        data: { is_example: 0 },
                    });
                    // 更新opens
                    await Bus.$emit('updateOpensById', {
                        id: value?.nodeKey,
                        data: { is_example: 0 },
                    });
                    global$.next({
                        action: 'RELOAD_LOCAL_COLLECTIONS',
                        payload: CURRENT_PROJECT_ID,
                    });
                }
            },
            error: () => { },
        });
        refDropdown.current?.setPopupVisible(false);
    };

    return (
        <>
            <Tooltip content="已归档">
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <Dropdown
                        ref={refDropdown}
                        content={
                            <>
                                <div className={TreeMenuItem} onClick={handleSaveMultiArchiveTargets}>
                                    取消归档
                                </div>
                            </>
                        }
                    >
                        <div className={TreeIcon}>
                            <SvgFlash style={{ fill: '#FFC01E' }} />
                        </div>
                    </Dropdown>
                </div>
            </Tooltip>
        </>
    );
};

export default Example;
