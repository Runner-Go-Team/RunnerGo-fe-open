import React, { useEffect, useState } from 'react';
import { arrayToTreeObject, flatTreeItems } from '@utils';
import { useSelector } from 'react-redux';
import { cloneDeep, isEmpty } from 'lodash';

export const useFolders = () => {
    const [apiFolders, setApiFolders] = useState([]);

    const apiDatas = useSelector((store) => store?.mock?.mock_apis);

    useEffect(() => {
        if (apiDatas !== null && !isEmpty(apiDatas)) {
            let apiArr = cloneDeep(Object.values(apiDatas)).filter(
                (item) =>
                    item.target_type === 'folder' &&
                    item.status !== -1 &&
                    item.status !== -2 &&
                    item.status !== -99
            );
            apiArr = arrayToTreeObject(apiArr);
            const selectOptions = flatTreeItems(apiArr, (a, b) => a.sort - b.sort);
            setApiFolders(selectOptions);
        }
    }, [apiDatas]);

    return {
        apiFolders,
    };
};

export default useFolders;
