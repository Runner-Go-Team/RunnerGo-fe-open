import React, { useContext, useMemo, useState } from 'react';
import { Modal, Select, Input, Switch, Message } from 'adesign-react';
import { v4 as uuidV4 } from 'uuid';
import { EXPECT_HTTP_CODE, EXPECT_CONTENT_TYPE } from '@constants/expect';
import { CreateModalWrapper } from './style';
import Context from '../../designContext';

const Option = Select.Option;

const AddExpect = (props) => {
    const { onCancel, handleAddExpect } = props;
    const { data } = useContext(Context);

    const [expectInfo, setExpectInfo] = useState({
        name: '',
        isDefault: -1,
        code: 200,
        contentType: 'json',
        schema: '',
        mock: '',
    });

    const defaultExpect = useMemo(() => {
        let defExpect = null;
        if (Array.isArray(data?.expect)) {
            data.expect.forEach((item) => {
                if (item.isDefault > 0) {
                    defExpect = item;
                }
            });
        }
        return defExpect;
    }, [data?.expect]);

    const handleUpdateExpect = (key, value) => {
        const newData = {
            ...expectInfo,
            [key]: value,
        };
        setExpectInfo(newData);
    };

    const handleAdd = () => {
        if (expectInfo.name.length === 0) {
            Message('error', '请输入期望名称');
            return;
        }
        const expectId = uuidV4();
        handleAddExpect(
            {
                expect: { ...expectInfo },
                raw: '',
                parameter: [],
            },
            expectId
        );
        onCancel();
    };

    return (
        <Modal
            className={CreateModalWrapper}
            visible
            onOk={handleAdd}
            onCancel={onCancel}
            title="新建期望"
        >
            <div className="create-hope">
                <div className="create-hope-code">
                    <div className="panel-item">
                        <div className="">HTTP状态码</div>
                        <Select value={expectInfo.code} onChange={handleUpdateExpect.bind(null, 'code')}>
                            {EXPECT_HTTP_CODE.map((item) => (
                                <Option key={item} value={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className="panel-item">
                        <div>名称</div>
                        <Input
                            maxLength={10}
                            size="small"
                            value={expectInfo.name}
                            onChange={handleUpdateExpect.bind(null, 'name')}
                        />
                    </div>
                </div>
                <div className="panel-item">
                    <div>内容格式</div>
                    <Select
                        value={expectInfo.contentType}
                        onChange={handleUpdateExpect.bind(null, 'contentType')}
                    >
                        {EXPECT_CONTENT_TYPE.map((item) => (
                            <Option key={item} value={item}>
                                {item}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="create-hope-default">
                    <div>设为默认值</div>
                    <div>
                        {defaultExpect !== null && (
                            <>
                                当前默认： {defaultExpect?.name}({defaultExpect?.code})&nbsp;
                            </>
                        )}
                        <Switch
                            size="small"
                            checked={expectInfo.isDefault > 0}
                            onChange={(checked) => {
                                handleUpdateExpect('isDefault', checked ? 1 : -1);
                            }}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddExpect;
