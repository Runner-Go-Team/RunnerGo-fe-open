import React from 'react';
import './index.less';
import { useTranslation } from 'react-i18next';
import NotResponse from '../notResponse';

const ResAssert = (props) => {
    const { data } = props;

    const assert = data && data.assert && data.assert.assertion_msgs ? data.assert.assertion_msgs : [];
    const { t } = useTranslation();
    return (
        <div className='res-assert can-copy'>
            {
                assert.length ? assert.map(item => (
                    <div className='assert-item can-copy'
                        style={{
                            backgroundColor: item.is_succeed ? 'rgba(60, 192, 113, 0.1)' : 'rgba(255, 76, 76, 0.1)',
                            color: item.is_succeed ? 'var(--run-green)' : 'var(--delete-red)'
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