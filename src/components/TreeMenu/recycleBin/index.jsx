import React, { useState } from 'react';
import './index.less';
import { Delete as SvgDelete } from 'adesign-react/icons';
import Recycle from '@modals/recycle';
import { useTranslation } from 'react-i18next';

const RecycleBin = () => {
    const { t } = useTranslation();
    const [showRecycle, setShowRecycle] = useState(false);
    return (
        <div className='recycle-bin' onClick={() => setShowRecycle(true)}>
            <SvgDelete />
            <span>{ t('apis.recycle') }</span>
            { showRecycle && <Recycle onCancel={() => setShowRecycle(false)} /> }
        </div>
    )
};

export default RecycleBin;