import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip, Dropdown, Message } from 'adesign-react';
import Bus from '@utils/eventBus';
import { TreeIcon, TreeMenuItem } from './style';

// 归档组件
const MenuStatus = (props) => {
    const { value, markObj } = props;

    const refDropdown = useRef(null);
    const handleStatusChange = (key) => {
        // 左侧目录修改接口状态
        Bus.$emit('saveTargetByObj', {
            IncompleteObject: { target_id: value.data.target_id, mark: key },
            callback: () => {
                refDropdown?.current?.setPopupVisible(false);
                Message('success', '保存成功');
            },
        });
    };

    return (
        <>
            <Tooltip content={markObj[value.mark]?.name || '开发中'}>
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
                                {Object.keys(markObj).map((it) => (
                                    <div
                                        key={markObj[it].key}
                                        className={TreeMenuItem}
                                        onClick={() => {
                                            handleStatusChange(it);
                                        }}
                                    >
                                        <div style={{ color: markObj[it].color || 'var(--font-1)' }}>{markObj[it].name}</div>
                                    </div>
                                ))}
                            </>
                        }
                    >
                        <div className={TreeIcon}>
                            <div
                                className="icon-status"
                                style={{ backgroundColor: markObj[value.mark]?.color || 'transparent' }}
                            ></div>
                        </div>
                    </Dropdown>
                </div>
            </Tooltip>
        </>
    );
};

export default MenuStatus;
