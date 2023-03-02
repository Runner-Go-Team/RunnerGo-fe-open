import React from "react";
import './index.less';
import { Dropdown, Button } from 'adesign-react';
import { useTranslation } from 'react-i18next';

const ContactBtn = (props) => {
    // 推广二维码
    const { url = "your qrcode" } = props;
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