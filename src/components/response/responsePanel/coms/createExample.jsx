import React, { useEffect, useState, useRef } from 'react';
import { Modal, Input, Message } from 'adesign-react';
import MonacoEditor from '@components/MonacoEditor';
import { isPlainObject, trim } from 'lodash';
import { EXPECT_HTTP_CODE } from '@constants/expect';
import { CreateExampleModal } from '../style';


const CreateExample = (props) => {
  const { onCancel, onSubmit, example, exampleKey } = props;

  const [showCodeList, setShowCodeList] = useState(false);
  const [code, setCode] = useState('');
  const [exampleName, setExampleName] = useState('');
  const [raw, setRaw] = useState('');
  const refCodeList = useRef(null);
  const textObj = {
    success: '成功',
    error: '失败',
  };
  useEffect(() => {
    const handleClickOutSide = (e) => {
      // 判断用户点击的对象是否在DOM节点内部
      if (refCodeList.current?.contains(e.target)) {
        return;
      }
      setShowCodeList(false);
    };
    document.body.addEventListener('mousedown', handleClickOutSide);

    if (isPlainObject(example)) {
      setExampleName(example?.expect?.name || textObj[exampleKey]);
      setCode(example?.expect?.code || '');
      setRaw(example?.raw || '');
    }

    return () => {
      document.body.removeEventListener('mousedown', handleClickOutSide);
    };
  }, []);

  return (
    <Modal
      title={isPlainObject(example) ? '修改响应示例' : '新增响应示例'}
      className={CreateExampleModal}
      visible
      onCancel={onCancel}
      onOk={() => {
        if (trim(exampleName).length <= 0) {
          Message('error', '响应示例名称不能为空。');
          return;
        }
        onSubmit({
          expect: {
            name: exampleName,
            isDefault: -1,
            code,
            contentType: 'json',
            schema: '',
            mock: '',
          },
          raw,
          parameter: [],
        });
      }}
    >
      <div className="example-top">
        <div className="example-item">
          <div className="title">名称</div>
          <Input maxLength={50} value={exampleName} onChange={(val) => setExampleName(val)} />
        </div>
        <div className="example-item" ref={refCodeList}>
          <div className="title">HTTP状态码</div>
          <Input
            value={code}
            maxLength={20}
            onChange={(val) => setCode(val)}
            onFocus={() => {
              setShowCodeList(true);
            }}
          />
          {showCodeList && (
            <div className="http-status-code-list">
              {EXPECT_HTTP_CODE.map((item) => (
                <div
                  className="status-code-item"
                  key={item}
                  onClick={() => {
                    setCode(item);
                    setShowCodeList(false);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="example-editor">
        <MonacoEditor value={raw} onChange={(val) => setRaw(val)} Height="100%"></MonacoEditor>
      </div>
    </Modal>
  );
};

export default CreateExample;
