import React from 'react';
import { Input, Button } from 'adesign-react';
import {
    Search as SvgSearch,
    Location as SvgLocation
} from 'adesign-react/icons';
import ApiStatus from '@components/ApiStatus';
import { useTranslation } from 'react-i18next';

import './index.less';

const FilterBox = (props) => {
    const { filterParams, onChange, treeRef, selectedKeys, type } = props;
    const { t } = useTranslation();

    const handleFilterKey = (key) => {
        onChange({ ...filterParams, key });
        treeRef.current?.handleExpandItem(true);
    };

    const handleFilterStatus = (status) => {
        onChange({ ...filterParams, status });
    };

    // 滚动到指定位置
    const handlToTarget = () => {
        if (Array.isArray(selectedKeys) && selectedKeys?.length === 1) {
            const target_id = selectedKeys[0];
            treeRef?.current?.scrollTo(target_id);
        }
    };



    return (
        <div className='filter-box'>
            <Input
                size="mini"
                className="textBox"
                value={filterParams.key}
                onChange={handleFilterKey}

                beforeFix={<SvgSearch width="20px" height="20px" />}
                // afterFix={
                //     <ApiStatus
                //         // showDefault
                //         // enableAdd={false}
                //         // value={filterParams?.status}
                //         // onChange={handleFilterStatus}
                //     />
                // }
                placeholder={type === 'apis' || type === 'mock' ? t('placeholder.searchApis') : t('placeholder.searchScene')}
            />
            {/* {
                (type === 'apis') &&
                <Button onClick={handlToTarget} size="mini" className="btn-location">
                    <SvgLocation width="20px" height="20px" />
                </Button>
            } */}
        </div>
    )
};

export default FilterBox;