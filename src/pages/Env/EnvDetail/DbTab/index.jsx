import React, { useState, useEffect } from "react";
import './index.less';
import { Button, Table, Pagination } from '@arco-design/web-react';
import { IconEye, IconDelete } from '@arco-design/web-react/icon';
import { Message, Modal } from 'adesign-react';
import AddDb from "@modals/AddDb";
import { fetchDbList, fetchDeleteDb } from '@services/env';
import { useTranslation } from 'react-i18next';


const DbTab = (props) => {
    const { selectEnvId } = props;
    const { t } = useTranslation();

    // 是否显示创建数据库的弹窗
    const [showAddDb, setShowAddDb] = useState(false);
    // 表格数据
    const [list, setList] = useState([]);
    // 某条数据库的详情
    const [dbDetail, setDbDetail] = useState({});
    // 当前页
    const [page, setPage] = useState(1);
    // 当前页数据量大小
    const [size, setSize] = useState(10);
    // 总数据量
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (selectEnvId) {
            getDbList();
        }
    }, [selectEnvId, page, size]);

    const getDbList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            env_id: selectEnvId,
            page,
            size
        };

        fetchDbList(params).subscribe({
            next: (res) => {
                const { code, data: { total, database_list } } = res;

                if (code === 0) {
                    setList(database_list);
                    setTotal(total);
                }
            }
        })
    }

    const deleteDb = (database_id) => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteDb'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    database_id,
                    env_id: selectEnvId,
                    team_id: localStorage.getItem('team_id')
                };

                fetchDeleteDb(params).subscribe({
                    next: (res) => {
                        const { code } = res;

                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            getDbList();
                        }
                    }
                })
            }
        })
    }

    const pageChange = (_page, _size) => {
        page !== _page && setPage(_page);
        size !== _size && setSize(_size);
    }

    const columns = [
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
        },
        {
            title: t('env.handle'),
            width: 73,
            render: (col, item, index) => {
                return (
                    <div className="handle-list">
                        <IconEye onClick={() => {
                            setDbDetail(item);
                            setShowAddDb(true);
                        }} />
                        <IconDelete onClick={() => deleteDb(item.database_id)} />
                    </div>
                )
            }
        }
    ]

    return (
        <div className="env-db-tab">
            <Button className='add-btn' onClick={() => setShowAddDb(true)}>添加数据库</Button>
            <Table border borderCell pagination={false} columns={columns} data={list} />
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
                />}
            {
                showAddDb && <AddDb item={dbDetail} selectEnvId={selectEnvId} onCancel={(e) => {
                    setShowAddDb(false);
                    setDbDetail({});

                    if (e) {
                        getDbList();
                    }
                }} />
            }
        </div>
    )
};

export default DbTab;