import React, { useState, useEffect } from 'react';
import './index.less';
import { IconClose } from '@arco-design/web-react/icon';
import { useTranslation } from 'react-i18next';

const FullScreenComp = (props) => {
    const { children, onChange } = props;
    const { t } = useTranslation();

    return (
        <div className='full-screen-component'>
            <div className='header'>
                <div className='header-left' onClick={onChange}>
                    <IconClose />
                    <p>{ t('header.signOut') }</p>
                </div>
                <p className='line'></p>
                <p className='title'>{ t('plan.customDistributed') }</p>
            </div>
            <div className='container'>
                { children }
            </div>
        </div>
    )
};

export default FullScreenComp;
