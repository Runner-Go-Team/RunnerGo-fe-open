import React, { useState, useEffect } from "react";
import "./index.less";
import { Button, Modal, Select, Input } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import { fetchCreateService } from '@services/env';
import { useTranslation } from 'react-i18next';
import { Message } from 'adesign-react';

const { Option } = Select;
const AddService = (props) => {
    const { onCancel, selectEnvId, item } = props;
    const { t } = useTranslation();

    // 服务名称
    const [serviceName, setServiceName] = useState('');
    // 服务地址
    const [serviceContent, setServiceContent] = useState('');
    // 服务ID
    const [serviceId, setServiceId] = useState(0);

    useEffect(() => {
        if (Object.entries(item).length > 0) {
            const { service_name, content, service_id } = item;
            setServiceName(service_name);
            setServiceContent(content);
            setServiceId(service_id);
        }
    }, [item]);

    const createService = () => {
        if (!serviceName.trim() || !serviceContent.trim()) {
            Message('error', t('message.emptyData'));
            return;
        }

        let params = {
            service_id: serviceId,
            env_id: selectEnvId,
            team_id: localStorage.getItem('team_id'),
            service_name: serviceName,
            content: serviceContent,
        };

        if (!serviceId) {
            delete params['service_id'];
        }

        fetchCreateService(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {

                    if (serviceId) {
                        Message('success', t('message.updateSuccess'));
                    } else {
                        Message('success', t('message.addSuccess'));
                    }
                    onCancel(true);
                }
            }
        })
    }

    return (
        <Modal
            className='add-service-modal'
            visible
            title={null}
            onCancel={onCancel}
            onOk={() => createService()}
        >
            <div className="header">
                <p className="title">{ serviceId ? t('env.updateService') : t('env.addService') }</p>
                <Button className='close-btn' onClick={onCancel}>
                    <IconClose />
                </Button>
            </div>

            <div className="container">
                <div className="item">
                    <p className="label">{ t('env.serviceName') }：</p>
                    <Input placeholder={ t('placeholder.serviceName') } value={serviceName} onChange={(e) => setServiceName(e)} />
                </div>
                <div className="item">
                    <p className="label">{ t('env.serviceContent') }：</p>
                    <Input placeholder={ t('placeholder.serviceContent') } value={serviceContent} onChange={(e) => setServiceContent(e)} />
                </div>
            </div>
        </Modal>
    )
};

export default AddService;