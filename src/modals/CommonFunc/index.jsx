import React, { useState, useEffect } from 'react';
import { Modal } from 'adesign-react';
import { Copy as SvgCopy } from 'adesign-react/icons';
import { CommonFunctionModal, HeaderTitleStyle, VarNameStyle } from './style';
import { copyStringToClipboard } from '@utils';
import { useTranslation } from 'react-i18next';
import { Table } from '@arco-design/web-react';
import { fetchPublicFunction } from '@services/dashboard';

const CommonFunction = (props) => {
    const { onCancel } = props;
    const { t } = useTranslation();
    const [list, setList] = useState([]);
    const columns = [
        {
            title: '函数名称',
            dataIndex: 'function',
            width: 138
        },
        {
            title: '函数',
            dataIndex: 'function_name'
        },
        {
            title: '备注',
            dataIndex: 'remark'
        }
    ];

    const VarName = (props) => {
        const { name } = props;
        return (
            <div className={VarNameStyle}>
                <p>{name}</p>
                <SvgCopy onClick={() => copyStringToClipboard(name)} />
            </div>
        )
    }
    useEffect(() => {
        fetchPublicFunction().subscribe({
            next: (res) => {
                const { data } = res;
                setList(data.map(item => {
                    const { function_name } = item;
                    return {
                        ...item,
                        function_name: <VarName name={function_name} />
                    }
                }))
            }
        })
    }, []);
    const HeaderTitle = () => {
        return (
            <div className={HeaderTitleStyle}>
                <p className='header-title'>{ t('header.commonFunc')}</p>
            </div>
        )
    }

    return (
        <Modal className={CommonFunctionModal} visible={true} title={<HeaderTitle />} footer={null} onCancel={onCancel} >
            <Table borderCell columns={columns} data={list} pagination={false} />
        </Modal>
    )
};

export default CommonFunction;