import React, { useEffect, useState } from 'react';
import './index.less';
import { useTranslation } from 'react-i18next';
import NotResponse from '../notResponse';

const ResRegex = (props) => {
    const { data } = props;
    const regex = data.regex || [];
    const [regexList, setRegexList] = useState([]);
    const _regexList = [];
    const { t } = useTranslation();
    if (regex) {

        regex.forEach(item => {
            for (let i in item) {
                _regexList.push(`${i}=${item[i]}`)
            }
        })
    }


    // useEffect(() => {

    // }, [regex]);

    return (
        <div className='res-regex can-copy'>
            {
                _regexList.length > 0 ? (
                    _regexList.map(item => (
                        <p className='res-regex-item can-copy'>{item}</p>
                    ))
                ) : <NotResponse text={ t('apis.noData') } />
            }
        </div>
    )
};

export default ResRegex;