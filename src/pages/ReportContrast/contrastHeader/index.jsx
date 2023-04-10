import React from "react";
import './index.less';
import { Button } from 'adesign-react';
import { Left as SvgLeft } from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@arco-design/web-react';

const ContrastHeader = (props) => {
    const { name } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="contrast-header">
            <div className="title">
                <Button onClick={() => navigate('/report/list')}>
                    <SvgLeft />
                </Button>
                <p>{t('report.contrastReport')}</p>
            </div>
            <div className="name">
                {
                    name.map((item, index) => <div className="name-item">
                        <Tooltip content={item}>
                            <p className="label">{item}</p>
                        </Tooltip>
                        &nbsp; {index !== name.length - 1 && '|'} &nbsp;</div>)
                }
            </div>
        </div>
    )
};

export default ContrastHeader;