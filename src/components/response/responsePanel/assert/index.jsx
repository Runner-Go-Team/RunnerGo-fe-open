import React from 'react';
import './index.less';
import { useTranslation } from 'react-i18next';
import NotResponse from '../notResponse';

const ResAssert = (props) => {
    const { data } = props;

    const assertion = data.assertion || [];
    const { t } = useTranslation();
    return (
        <div className='res-assert can-copy'>
            {
                assertion.length ? assertion.map(item => (
                    <div className='assert-item can-copy'
                        style={{
                            backgroundColor: item.isSucceed ? 'rgba(60, 192, 113, 0.1)' : 'rgba(255, 76, 76, 0.1)',
                            color: item.isSucceed ? 'var(--run-green)' : 'var(--delete-red)'
                        }}
                    >
                        {item.msg}
                    </div>
                )) : <NotResponse text={ t('apis.noData') } />
            }
        </div>
    )
};

export default ResAssert;