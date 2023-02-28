import React from 'react';
import { Modal, Button } from 'adesign-react';
import { Clone as SvgClone } from 'adesign-react/icons';
import { copyStringToClipboard } from '@utils';
import MOCK_VARS from './mock';
import './index.less';

const MockVars = (props) => {
    const { onCancel } = props;

    return (
        <>
            <Modal
                visible
                title="内置环境变量"
                onCancel={() => {
                    onCancel && onCancel();
                }}
                footer={
                    <Button type="primary" onClick={onCancel}>
                        关闭
                    </Button>
                }
                className="mock_modal"
            >
                <div className="api_mock_content beautify-scroll-bar">
                    {Object.keys(MOCK_VARS).map((key) => (
                        <>
                            <div className="api_mock_content_title" key={key}>
                                {MOCK_VARS[key].name}
                                变量
                            </div>
                            <ul>
                                {MOCK_VARS[key].list.map((it) => (
                                    <li key={it.var}>
                                        <div className="li-left">
                                            {it.var}
                                            <SvgClone
                                                onClick={() => {
                                                    copyStringToClipboard(it.var);
                                                }}
                                                className="copy"
                                            />
                                        </div>
                                        <div className="li-right">{it.description}</div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default MockVars;
