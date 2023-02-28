import React from 'react';
import './index.less';
import { useTranslation } from 'react-i18next';
/**
 * type:
 * 新建 - #2BA58F - create
 * 修改 - var(--log-blue) - update
 * 删除 - var(--theme-color) - delete
 * 运行 - var(--run-green) - run
 */

const HandleTags = (props) => {
    const { t } = useTranslation();
    const tagList = {
        '1': ['var(--sub-color-1)', t('index.create')],
        '2': ['var(--sub-color-3)', t('index.update')],
        '3': ['var(--run-red)', t('index.delete')],
        '4': ['var(--sub-color-2)', t('index.run')],
        '5': ['var(--sub-color-4)', t('index.debug')],
        '6': ['var(--sub-color-5)', t('index.exec')]
    };
    const { type } = props;
    const [color, text] = tagList[type];

    return (
        <div className='handle-tag' style={{ backgroundColor: color }}>
            {text}
        </div>
    )
};

export default HandleTags;