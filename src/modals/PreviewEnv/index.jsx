import React, { useState, useEffect } from "react";
import './index.less';
import { Modal, Button, Table, Pagination } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';
import { fetchDbList, fetchServiceList } from '@services/env';
import { Tabs as TabComponent } from 'adesign-react';

const { Tabs, TabPan } = TabComponent;

const PreviewEnv = (props) => {
    const { onCancel, envId, envName } = props;

    // 服务列表
    const [serviceList, setServiceList] = useState([]);
    // 数据库列表
    const [dbList, setDbList] = useState([]);
    // 服务 当前页
    const [page, setPage] = useState(1);
    // 服务 当前页数据量大小
    const [size, setSize] = useState(10);
    // 服务 总数据量
    const [total, setTotal] = useState(0);

    // 数据库 当前页
    const [page1, setPage1] = useState(1);
    // 数据库 当前页数据量大小
    const [size1, setSize1] = useState(10);
    // 数据库 总数据量
    const [total1, setTotal1] = useState(0);

    const { t } = useTranslation();

    useEffect(() => {
        getServiceList();
    }, [page, size]);

    useEffect(() => {
        getDbList();
    }, [page1, size1]);

    const columns1 = [
        {
            title: t('env.serviceName'),
            dataIndex: 'service_name'
        },
        {
            title: t('env.serviceContent'),
            dataIndex: 'content'
        }
    ];

    const columns2 = [
        {
            title: t('env.dbType'),
            dataIndex: 'type'
        },
        {
            title: t('env.name'),
            dataIndex: 'server_name'
        },
        {
            title: t('env.dbName'),
            dataIndex: 'db_name'
        },
        {
            title: t('env.ip'),
            dataIndex: 'host'
        },
        {
            title: t('env.port'),
            dataIndex: 'port'
        }
    ]

    const tabList = [
        {
            id: '0',
            title: t('env.service'),
            content: <>
                <Table pagination={false} border borderCell columns={columns1} data={serviceList} />
                {total > 0 &&
                    <Pagination
                        showTotal
                        total={total}
                        showJumper
                        sizeCanChange
                        pageSize={size}
                        current={page}
                        sizeOptions={[5, 10, 15, 20]}
                        onChange={(page, pageSize) => pageChange(page, pageSize)}
                        selectProps={{
                            getPopupContainer: () => document.body
                        }}
                        
                    />}
            </>
        },
        {
            id: '1',
            title: t('env.database'),
            content: <>
                <Table pagination={false} border borderCell columns={columns2} data={dbList} />
                {total1 > 0 &&
                    <Pagination
                        showTotal
                        total={total1}
                        showJumper
                        sizeCanChange
                        pageSize={size1}
                        current={page1}
                        sizeOptions={[5, 10, 15, 20]}
                        onChange={(page, pageSize) => pageChange1(page, pageSize)}
                        selectProps={{
                            getPopupContainer: () => document.body
                        }}
                    />}
            </>
        }
    ];

    const getDbList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            env_id: envId,
            page: page1,
            size: size1
        };

        fetchDbList(params).subscribe({
            next: (res) => {
                const { code, data: { database_list, total } } = res;

                if (code === 0) {
                    setDbList(database_list);
                    setTotal1(total);
                }
            }
        })
    };

    const getServiceList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            env_id: envId,
            page,
            size
        };

        fetchServiceList(params).subscribe({
            next: (res) => {
                const { code, data: { service_list, total } } = res;

                if (code === 0) {
                    setServiceList(service_list);
                    setTotal(total);
                }
            }
        })
    }

    const pageChange = (_page, _size) => {
        page !== _page && setPage(_page);
        size !== _size && setSize(_size);
    }


    const pageChange1 = (_page, _size) => {
        page1 !== _page && setPage1(_page);
        size1 !== _size && setSize1(_size);
    }


    return (
        <Modal
            className='preview-env-modal'
            visible
            title={null}
            footer={null}
            onCancel={onCancel}
            onOk={() => { }}
        >
            <div className="header">
                <p className="title">{t('env.envManage')}</p>
                <Button className='close-btn' onClick={onCancel}>
                    <IconClose />
                </Button>
            </div>
            <div className="container">
                <div className="title">
                    {t('modal.envName')}：
                    {envName}
                </div>
                <Tabs defaultActiveId='0' itemWidth={80}>
                    {
                        tabList.map((item, index) => (
                            <TabPan
                                style={{ padding: '0 15px', width: 'auto !impoertant' }}
                                key={item.id}
                                id={item.id}
                                title={item.title}
                            >
                                {item.content}
                            </TabPan>
                        ))
                    }
                </Tabs>
            </div>
        </Modal>
    )
};

export default PreviewEnv;