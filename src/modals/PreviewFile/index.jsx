import React, { useState, useEffect } from 'react';
import { Modal, Message } from 'adesign-react';
import './index.less';
import { useTranslation } from 'react-i18next';
import { Table } from '@arco-design/web-react';

const PreviewFile = (props) => {
    const { onCancel, data, fileType } = props;
    const [tableData, setTableData] = useState([]);
    const [tableColumn, setTableColumn] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        const column = [];
        if (data.length > 0 && fileType === 'csv') {
            for (let i in data[0]) {
                column.push({
                    title: i,
                    dataIndex: i,
                    // width: 150
                });
            }
            setTableColumn(column);
            let isErr = false;
            setTableData(data.map(item => {
               for (let i in item) {
                    if (typeof item[i] === 'object') {
                        isErr = true;
                        item[i] = ""
                    }
               };
               return item
            }));
            if (isErr) {
                Message('error', t('message.csvFileError'));
            }
        }
    }, []);

    return (
        <Modal className='preview-modal' title={t('modal.previewTitle')} visible={true} cancelText={t('btn.cancel')} okText={t('btn.ok')} onOk={() => onCancel()} onCancel={() => onCancel()} footer={null}>
            {
                fileType === 'csv' ? <Table scroll={{
                    x: 880,
                    y: 665,
                }} style={{ marginBottom: '12px' }} columns={tableColumn} data={tableData} pagination={false} /> : <div>{data}</div>
            }
        </Modal>
    )
};

export default PreviewFile;