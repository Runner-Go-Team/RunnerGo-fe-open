import React from "react";
import './index.less';
import SvgLogo from './logo';
import SvgLogoRight from './logo-right';
import { useTranslation } from 'react-i18next';

const LeftBar = () => {
    const { t } = useTranslation();

    return (
        <div className="login-left-bar">
            <SvgLogoRight className='logo-right-top' />

            <div className="top">
                <SvgLogo />
                <p className="line">/</p>
                <p className="slogan">{ t('sign.slogn')}</p>
            </div>

            <div className="container">
                <p className="title">{ t('sign.title') }</p>
                <p className="tips-show">{ t('sign.newUserReward') }</p>
                <p className="to-website">
                    <span>{ t('sign.toWebSite1') }</span>
                    <a href=" https://www.runnergo.com/enterprise/" target="_blank"> { t('sign.runnergoWebSite') } </a>
                    <span>{ t('sign.toWebSite2') }</span>
                </p>
            </div>

            <div className="right-bottom-container">
                <img src="./right-bottom.png" alt="" />
            </div>
        </div>
    )
};

export default LeftBar;