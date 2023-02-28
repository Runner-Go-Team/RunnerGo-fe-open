import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Radio, Input, Message } from 'adesign-react';
import cn from 'classnames';
import { trim } from 'lodash';
import useApi from '../../hooks/useApi';
import { ImportModalWrapper } from './style';

const RadioGroup = Radio.Group;
const IMPOR_TPRORO_TYPE = [
  { name: '本地导入', id: 'local' },
  { name: '在线导入', id: 'online' },
];

const ImportProto = (props) => {
  const { onCancel, data } = props;

  const [file, setFile] = useState(null);
  const [importType, setImportType] = useState<'local' | 'online'>('local');
  const [importUrl, setImportUrl] = useState('');
  const { getProtoAllMethodList } = useApi();
  const handleCheckFile = (e) => {
    const files = e?.target?.files[0];
    setFile(files);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(reader.result) || '';
      getProtoAllMethodList({ text, name: files?.name, path: files?.path }, data?.target_id, () => {
        Message('success', '导入proto文件成功');
        onCancel();
      });
    };
    reader.readAsText(files);
  };

  return (
    <>
      <Modal className={ImportModalWrapper} visible title="导入" onCancel={onCancel} footer={null}>
        <div className="import-tabs">
          {IMPOR_TPRORO_TYPE.map((item) => (
            <div
              key={item.id}
              className={cn('tab-item', { active: importType === item.id })}
              onClick={() => {
                setImportType(item.id);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
        {importType === 'local' && (
          <div className="tab-content">
            <div className="proto-upload">
              <input
                className="upload"
                type="file"
                onChange={(e) => {
                  handleCheckFile(e);
                }}
              />
              <Button className="apipost-blue-btn" type="primary">
                上传proto文件
              </Button>
            </div>
            <div className="file-name">{file?.name || ''}</div>
          </div>
        )}
        {importType === 'online' && (
          <div className="tab-content">
            <div className="online-url">在线地址</div>
            <Input
              value={importUrl}
              onChange={(val) => {
                setImportUrl(val);
              }}
            />
            <div className="import-interval">
              <Button
                className="apipost-blue-btn"
                type="primary"
                onClick={() => {
                  if (trim(importUrl).length <= 0) {
                    Message('error', '请输入地址。');
                    return;
                  }
                  axios
                    .get(importUrl)
                    .then(function (response) {
                      getProtoAllMethodList(
                        { text: response?.data || '', name: importUrl },
                        data?.target_id,
                        () => {
                          Message('success', '导入proto文件成功');
                          onCancel();
                        }
                      );
                    })
                    .catch(function (error) {
                      Message('error', String(error));
                    });
                }}
              >
                导入
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ImportProto;
