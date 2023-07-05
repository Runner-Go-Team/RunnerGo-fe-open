import React, { useEffect, useState } from 'react'
import { Menu, Message, Tooltip } from '@arco-design/web-react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import Bus from '@utils/eventBus';
import './index.less';
import { setCookie } from '@utils';
import { useTranslation } from 'react-i18next';
import InfoManage from '@modals/InfoManage';
import { RD_ADMIN_URL } from '@config';

const UserCard = (props) => {
    const {setShowInfo}=props;
    const { nickname, avatar, account, role_name } = useSelector((store) => store.user.userInfo);
    const language = useSelector((store) => store.user.language);
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();


    return (
        <>
            <div className='user-card'>
                <div className="user_info">
                    <div className="l"><img src={avatar || "https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/avatar/default1.png"} alt="" /></div>
                    <div className="r">
                        <div className='name'><span className='name-text text-ellipsis'>{nickname || '-'}</span><span className='role'>{role_name || '-'}</span></div>
                        <div className='email text-ellipsis'>{account || '-'}</div>
                    </div>
                </div>
                <p onClick={() => setShowInfo(true)}>{t('header.homePage')}</p>
                <p onClick={() => {
                    window.open('https://wiki.runnergo.cn/docs/', '_blank');
                }}>{t('header.doc')}</p>
                <Tooltip content={<img style={{ width: '200px', height: '200px' }} src="https://apipost.oss-cn-beijing.aliyuncs.com/kunpeng/qrcode/qiyezhuanshukefu.png" />}>
                    <p>{t('header.customer')}</p>
                </Tooltip>
                <div className="line"></div>
                <p className={cn({
                    languageActive: language == 'cn'
                })} onClick={() => {
                    i18n.changeLanguage('cn');
                    dispatch({
                        type: 'user/updateLanGuaGe',
                        payload: 'cn'
                    })
                    setCookie('i18nextLng', 'cn');
                }}>中文</p>
                <p className={cn({
                    languageActive: language == 'en'
                })} onClick={() => {
                    i18n.changeLanguage('en');
                    dispatch({
                        type: 'user/updateLanGuaGe',
                        payload: 'en'
                    })
                    setCookie('i18nextLng', 'en');
                }}>English</p>
                <div className="line"></div>
                <p onClick={() => {
                    Bus.$emit('closeWs');
                    localStorage.clear();

                    setCookie('token', '');
                    window.location.href = `${RD_ADMIN_URL}/#/login`;
                    Message('success', t('message.quitSuccess'));
                }}>{t('btn.quit')}</p>
            </div>
        </>
    )
}

export default UserCard;
