import React from "react";
import './index.less';
import { Dropdown, Button } from 'adesign-react';
import { useTranslation } from 'react-i18next';

const ContactBtn = (props) => {
    const { url = "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/images/wx-customer-service.jpg" } = props;
    const { t } = useTranslation();
    return (
        <div className="contact-btn">
            <Dropdown
                trigger='hover'
                placement='bottom-end'
                content={
                    <div>
                        <img style={{ width: '200px', height: '200px' }} src={url} />
                    </div>
                }
            >
                <Button>{ t('btn.contactMe') }</Button>
            </Dropdown>
        </div>
    )
};

export default ContactBtn;