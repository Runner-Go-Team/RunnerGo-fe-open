import React, { useState, useEffect } from "react";
import './index.less';
import { useSelector } from 'react-redux';
import { Button, Dropdown } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import SvgLogo1 from '@assets/logo/runner_dark';
import SvgLogo2 from '@assets/logo/runner_white';
import { useNavigate } from 'react-router-dom';

const LinkMore = () => {
    const theme = useSelector((store) => store.user.theme);
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="link-more">
            {theme === 'dark' ? <SvgLogo1 className="logo" /> : <SvgLogo2 className="logo" />}
            <p className="title">{t('sign.title')}</p>
            <div className="email-body">
                <p className="p1">{ t('invitateLink.title1') }</p>
                <div className="btn-list">
                    <Dropdown
                        trigger="hover"
                        placement='top-end'
                        content={
                            <div>
                                <img style={{ width: '200px', height: '200px' }} src="https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/images/wx-customer-service.jpg" />
                            </div>
                        }
                    >
                        <Button className="help-btn">{ t('invitateLink.needHelp') }</Button>
                    </Dropdown>
                    <Button className="login-btn" onClick={() => navigate('/login')}>{ t('invitateLink.toLogin') }</Button>
                </div>
            </div>

            <div className="bottom-tips">
                <p>{ t('invitateLink.bottomShow') }</p>
                <p>{ t('invitateLink.welcome') } <a href="http://www.runnergo.com" target="_blank" style={{ color: 'var(--theme-color)' }}>http://www.runnergo.com</a> { t('invitateLink.learnMore') }。</p>
            </div>
        </div>
    )
};

export default LinkMore;