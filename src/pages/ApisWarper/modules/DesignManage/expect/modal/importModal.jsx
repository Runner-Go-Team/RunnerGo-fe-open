import React, { useState } from 'react';
import cn from 'classnames';
import { Modal, Message } from 'adesign-react';
import MonacoEditor from '@components/MonacoEditor';
import { getSafeJSON } from '@utils';
import { isObject, isString } from 'lodash';
// import GenerateSchema from 'generate-schema';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import xml2js from 'xml-js';
import JSONToSchema from '@utils/json2Schema';
import { ImportModalWrapper } from './style';

const ImportModal = (props) => {
    const { onChange, jsonMode, onCancel } = props;

    const tabList =
        jsonMode === 'schema'
            ? [
                { key: 'JSON', value: 'json' },
                { key: 'XML', value: 'xml' },
                { key: 'JSON-SCHEMA', value: 'jsonschema' },
            ]
            : [];

    const [importValue, setImportValue] = useState('');
    const [activeKey, setActiveKey] = useState < 'json' | 'xml' | 'jsonschema' > ('jsonschema');

    const handleImport = async () => {
        let data = importValue;
        if (jsonMode === 'schema') {
            if (activeKey === 'jsonschema') {
                const jsonData = getSafeJSON(importValue);
                if (!isObject(jsonData)) {
                    Message('error', '数据无效');
                    return;
                }
                data = await $RefParser.dereference(jsonData, {
                    dereference: {
                        circular: 'ignore',
                    },
                });
                // data = getSafeJSON(importValue);
                if (!isObject(data)) {
                    Message('error', '数据无效');
                    return;
                }
            } else if (activeKey === 'json') {
                const rawData = getSafeJSON(importValue);
                if (!isObject(rawData)) {
                    Message('error', '导入数据无效');
                    return;
                }
                data = JSONToSchema(rawData);
            } else if (activeKey === 'xml') {
                if (!isString(importValue)) {
                    return Message('error', '导入数据无效');
                }

                const jsonText = xml2js.xml2json(importValue);
                const jsonData = getSafeJSON(jsonText);
                data = JSONToSchema(jsonData);
            }
        }
        onChange(jsonMode, data);
        onCancel();
    };
    return (
        <Modal
            className={ImportModalWrapper}
            visible
            title="导入"
            onOk={handleImport}
            onCancel={onCancel}
        >
            <div className="hope-import-content">
                <div className="apipost-design-tabs-header">
                    {tabList.map((item) => (
                        <div
                            key={item.value}
                            className={cn('header-item', { active: item.value === activeKey })}
                            style={{ width: 'auto' }}
                            onClick={() => {
                                setActiveKey(item.value);
                            }}
                        >
                            {item.key}
                        </div>
                    ))}
                </div>
                <div>
                    <MonacoEditor
                        Height={400}
                        value={importValue}
                        language={activeKey === 'xml' ? 'xml' : 'json'}
                        onChange={(val) => {
                            setImportValue(val);
                        }}
                    ></MonacoEditor>
                </div>
            </div>
        </Modal>
    );
};

export default ImportModal;
