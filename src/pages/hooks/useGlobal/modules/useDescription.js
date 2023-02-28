import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Bus from '@utils/eventBus';
import { isArray, unionWith, isEqual, isString, trim } from 'lodash';

const useDescription = () => {
    const dispatch = useDispatch();

    const tempParamsDesc = useSelector((d) => d?.projects.tempParamsDesc);

    const addTempParams = (newTempDesc) => {
        if (!isString(newTempDesc?.description) || trim(newTempDesc.description).length <= 0) {
            return;
        }

        if (isArray(tempParamsDesc)) {
            const newTempDescArr = unionWith(
                tempParamsDesc,
                [newTempDesc],
                function (object, other) {
                    return isEqual([object.key, object.description], [other.key, other.description]);
                }
            );
            dispatch({
                type: 'projects/setTempParams',
                payload: newTempDescArr,
            });
        }
    };

    useEffect(() => {
        Bus.$on('addTempParams', addTempParams);

        return () => {
            // 销毁订阅
            Bus.$off('addTempParams');
        };
    }, [tempParamsDesc]);
};

export default useDescription;
