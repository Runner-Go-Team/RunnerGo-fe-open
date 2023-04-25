import React, { useState } from 'react';
import './index.less';
import {
    Desc as SvgDesc,
    Environment as SvgEnv
} from 'adesign-react/icons';
import { Tooltip } from '@arco-design/web-react';
import CommonFunction from '@modals/CommonFunc';
import GlobalVar from '@modals/GlobalVar';
import EnvManage from '@modals/EnvManage';
import SvgGlobalVar from '@assets/icons/GlobalVar';
import { useTranslation } from 'react-i18next';

const GlobalConfig = () => {
    const [showFunc, setShowFunc] = useState(false);
    const [showVar, setShowVar] = useState(false);
    const [showEnv, setShowEnv] = useState(false);
    const { t } = useTranslation();

    return (
        <div className='global-config'>
            <Tooltip content={t('header.globalParam')}>
                <div className='config-item' onClick={() => setShowVar(true)}>
                    <SvgGlobalVar />
                </div>
            </Tooltip>
            <Tooltip content={t('header.commonFunc')}>
                <div className='config-item' onClick={() => setShowFunc(true)}>
                    <SvgDesc />
                </div>
            </Tooltip>
            <Tooltip content={t('header.envManage')}>
                <div className='config-item' onClick={() => setShowEnv(true)}>
                    <SvgEnv />
                </div>
            </Tooltip>
            {showFunc && <CommonFunction onCancel={() => setShowFunc(false)} />}
            {showVar && <GlobalVar onCancel={() => setShowVar(false)} />}
            {showEnv && <EnvManage onCancel={() => setShowEnv(false)} />}
        </div>
    )
};

export default GlobalConfig;