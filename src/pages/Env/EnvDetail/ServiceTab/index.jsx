import React, { useState, useEffect } from "react";
import './index.less';
import { Button, Table, Pagination } from '@arco-design/web-react';
import AddService from "@modals/AddService";
import { fetchServiceList, fetchDeleteService } from '@services/env';
import { useTranslation } from 'react-i18next';
import { IconEye, IconDelete } from '@arco-design/web-react/icon';
import { Message, Modal } from 'adesign-react';

const ServiceTab = (props) => {
    const { selectEnvId } = props;

    // 是否显示创建服务的弹窗
    const [showAddService, setShowAddService] = useState(false);
    // 表格数据
    const [list, setList] = useState([]);
    // 服务详情
    const [serviceDetail, setServiceDetail] = useState({});
    // 当前页
    const [page, setPage] = useState(1);
    // 当前页数据量大小
    const [size, setSize] = useState(10);
    // 总数据量
    const [total, setTotal] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        if (selectEnvId) {
            getServiceList();
        }
    }, [selectEnvId, page, size]);

    const getServiceList = () => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            env_id: selectEnvId,
            page,
            size
        };

        fetchServiceList(params).subscribe({
            next: (res) => {
                const { code, data: { total, service_list } } = res;

                if (code === 0) {
                    setList(service_list);
                    setTotal(total);
                }
            }
        })
    }

    const deleteService = (service_id) => {
        Modal.confirm({
            title: t('modal.look'),
            content: t('modal.deleteService'),
            okText: t('btn.ok'),
            cancelText: t('btn.cancel'),
            onOk: () => {
                const params = {
                    service_id,
                    env_id: selectEnvId,
                    team_id: localStorage.getItem('team_id')
                };
        
                fetchDeleteService(params).subscribe({
                    next: (res) => {
                        const { code } = res;
        
                        if (code === 0) {
                            Message('success', t('message.deleteSuccess'));
                            getServiceList();
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
            title: t('env.serviceName'),
            dataIndex: 'service_name'
        },
        {
            title: t('env.serviceContent'),
            dataIndex: 'content'
        },
        {
            title: t('env.handle'),
            width: 73,
            render: (col, item, index) => {
                return (
                    <div className="handle-list">
                        <IconEye onClick={() => {
                            setServiceDetail(item);
                            setShowAddService(true);
                        }} />
                        <IconDelete onClick={() => deleteService(item.service_id)} />
                    </div>
                )
            }
        }
    ];

    return (
        <div className="env-service-tab">
            <Button className='add-btn' onClick={() => setShowAddService(true)}>添加服务</Button>
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
                showAddService && <AddService item={serviceDetail} selectEnvId={selectEnvId} onCancel={(e) => {
                    setShowAddService(false);
                    setServiceDetail({});
                    if (e) {
                        getServiceList();
                    }
                }} />
            }
        </div>
    )
};

export default ServiceTab;