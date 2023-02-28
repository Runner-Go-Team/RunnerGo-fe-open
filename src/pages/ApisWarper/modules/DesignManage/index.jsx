import React, { useState } from 'react';
import { Button, Drawer, Message } from 'adesign-react';
import FooterToolbar from '@components/Footer';
import { getPathExpressionObj } from '@constants/pathExpression';
import Bus from '@utils/eventBus';
import Header from './header';
import Request from './request';
import Expect from './expect';
import './index.less';
import DesignContext from './designContext';
import Preview from './preview';

const { Provider } = DesignContext;

const DesignManage = (props) => {
    const { data } = props;
    const [visible, setVisible] = useState(false);

    const handleApiChange = (id, type, value, extension) => {
        // 统一修改

        Bus.$emit('updateTarget', {
            target_id: id,
            pathExpression: getPathExpressionObj(type, extension),
            value,
        });
    };

    return (
        <Provider
            value={{
                data,
                onChange: handleApiChange.bind(null, data.target_id),
            }}
        >
            <div className="design-wrapper">
                <div className="design-wrapper-content">
                    <Header />
                    <Request data={data.request} onChange={handleApiChange} />
                    <Expect data={data} onChange={handleApiChange} />
                    <div className="save-panel">
                        <Button
                            type="primary"
                            size="mini"
                            className="apipost-blue-btn"
                            onClick={() => {
                                setVisible(true);
                                Bus.$emit('saveTargetById', {
                                    id: data?.target_id,
                                    callback: () => {
                                        Message('success', '保存成功');
                                    },
                                });
                            }}
                        >
                            保存并预览文档
                        </Button>
                    </div>
                </div>
                <Drawer
                    visible={visible}
                    title={null}
                    footer={null}
                    width="1200"
                    onCancel={() => {
                        setVisible(false);
                    }}
                >
                    {visible && <Preview data={data}></Preview>}
                </Drawer>
            </div>
        </Provider>
    );
};

export default DesignManage;
