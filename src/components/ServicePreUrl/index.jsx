import React, { useState, useEffect } from "react";
import './index.less';
import { Select, Tooltip } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { fetchServiceList } from '@services/env';

const { Option } = Select;

const ServicePreUrl = (props) => {
    const { onChange, env_info = {}, from = 'apis', scene_env_id } = props;
    const [serviceList, setServiceList] = useState([]);
    const [tooltipText, setTooltipText] = useState('');

    const { t } = useTranslation();
    const { env_id, service_name, service_id } = env_info;

    useEffect(() => {
        // 测试对象中以env_info的env_id为准, 其它如场景计划中以scene_env_id为准
        const id = (from === "apis" || from === 'auto_report') ? env_id : scene_env_id;
        if (id) {
            getServiceList(id);
        }
    }, [env_id, from, scene_env_id]);

    useEffect(() => {
        if (service_name) {
            let item = serviceList.find(item => item.service_name === service_name);
            if (item) {
                setTooltipText(`${item.service_name}: ${item.content}`);
            }
        }
    }, [service_name, serviceList]);

    const getServiceList = (env_id) => {
        const params = {
            team_id: localStorage.getItem('team_id'),
            env_id,
            page: 1,
            size: 10000
        };
        fetchServiceList(params).subscribe({
            next: (res) => {
                const { data: { service_list }, code } = res;
                if (code === 0) {
                    setServiceList(service_list);


                    if (service_list) {
                        const item = service_list.find(item => item.service_name === service_name);
                        if (item) {
                            const { service_id, service_name, content, env_id } = item;
                            onChange('service_id', service_id, undefined, true);
                            onChange('pre_url', content, undefined, true);
                            onChange('service_name', service_name, undefined, true);
                            if (from !== 'apis') {
                                onChange('env_id', env_id, undefined, true);
                            }
                        } else {
                            onChange('service_id', 0, undefined, true);
                            onChange('pre_url', '', undefined, true);
                            onChange('service_name', '', undefined, true);
                            if (from !== 'apis') {
                                onChange('env_id', 0, undefined, true);
                            }
                        }
                    }
                }
            }
        })
    }


    return (
        <div className="service-pre-url">
            {
                serviceList.find(item => item.service_name === service_name) ?
                    <Tooltip content={tooltipText}>
                        <Select disabled={from === 'auto_report'} value={service_name ? service_name : ''} onChange={(e) => {
                            let item = serviceList.find(item => item.service_name === e);
                            if (item) {
                                const { content, service_name, env_id, service_id } = item;
                                onChange('service_id', service_id);
                                onChange('pre_url', content)
                                onChange('service_name', service_name);
                                if (from !== 'apis') {
                                    onChange('env_id', env_id);
                                }
                            }
                        }}>
                            {
                                serviceList && serviceList.map((item, index) => (
                                    <Option value={item.service_name} key={index}>
                                        {`${item.service_name}: ${item.content}`}
                                    </Option>
                                ))
                            }
                        </Select>
                    </Tooltip>
                    :
                    <Select disabled={from === 'auto_report'} placeholder={t('placeholder.selectService')} onChange={(e) => {
                        let item = serviceList.find(item => item.service_name === e);
                        if (item) {
                            const { content, service_name, env_id, service_id } = item;
                            onChange('service_id', service_id);
                            onChange('pre_url', content)
                            onChange('service_name', service_name);
                            if (from !== 'apis') {
                                onChange('env_id', env_id);
                            }
                        }
                    }}>
                        {
                            serviceList && serviceList.map((item, index) => (
                                <Option value={item.service_name} key={index}>
                                    {`${item.service_name}: ${item.content}`}
                                </Option>
                            ))
                        }
                    </Select>
            }
        </div>
    )
};

export default ServicePreUrl;