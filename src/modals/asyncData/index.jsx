import React, { useState } from 'react';
import { Button, Modal, Radio } from 'adesign-react';
import { GlobalModal } from './style';

const { Group } = Radio;

const AsyncData = (props) => {
    const { showAsync, handleShowAsync } = props;

    return (
        <div>
            <Modal className={GlobalModal} visible={showAsync} onCancel={() => { handleShowAsync(false) }} okText="确认同步" cancelText="不同步" title={null}>
                <div className='title'>是否同步【哎呀思（账号）】在Apipost中的接口和测试场景？</div>
                <div className='desc'>确认同步后, 将会同步该账号下所有在Apipost中拥有读写权限的项目, 项目数据无缝衔接。如未在当前页面同步, 也可在工作台中进行数据同步。</div>
                <Group value="A" className="radio-list">
                    <Radio value="A">只同步接口和测试用例</Radio>
                    <Radio value="B">只同步接口</Radio>
                    <Radio value="C">只同步测试场景</Radio>
                </Group>
                <p className='pass'>跳过</p>
            </Modal>
        </div>
    )
};

export default AsyncData;