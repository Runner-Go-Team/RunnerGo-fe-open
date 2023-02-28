import React, { useState, useEffect } from 'react';
import { Apis as SvgApis, Add as SvgAdd, Download as SvgDownload } from 'adesign-react/icons';
import './index.less';
import Bus from '@utils/eventBus';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const CaseFooterConfig = (props) => {
    const { onChange, from = 'scene' } = props;
    const { t } = useTranslation();
    const [showControl, setShowControl] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        document.addEventListener('click', (e) => clickOutSide(e))

        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
        }
    }, []);

    const clickOutSide = (e) => {
        let _box = document.querySelector('.case-footer-config');

        if (_box && !_box.contains(e.target)) {
            setShowControl(false);
        }
    }

    return (
        <div className='case-footer-config'>
            {showControl && <div className='add-controller'>
                <div className='wait' onClick={() => {
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: 'wait_controller'
                    })
                }}>
                    <SvgAdd />
                    <span>{t('scene.waitControl')}</span>
                </div>
                <div className='condition' onClick={() => {
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: 'condition_controller'
                    })
                }}>
                    <SvgAdd />
                    <span>{t('scene.conditionControl')}</span>
                </div>
            </div>
            }
            <div className='common-config' style={{ 'min-width': from === 'plan' ? '360px' : '288px' }}>
                <div className='config-item' onClick={() => {
                    dispatch({
                        type: 'case/updateAddNew',
                        payload: 'api'
                    })
                }}>
                    <SvgApis />
                    <span>{t('scene.createApi')}</span>
                </div>
                <span className='line'></span>
                <div className='config-item' onClick={() => setShowControl(!showControl)}>
                    <SvgAdd />
                    <span>{t('scene.createControl')}</span>
                </div>
                <span className='line'></span>
                <div className='config-item' onClick={() => onChange(true)}>
                    <SvgDownload />
                    <span>{t('scene.importApi')}</span>
                </div>
            </div>
        </div>
    )
};

export default CaseFooterConfig;