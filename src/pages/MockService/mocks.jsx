import React from 'react';
import cn from 'classnames';
import { getPathExpressionObj } from '@constants/pathExpression';
import Bus from '@utils/eventBus';
import { useSelector, useDispatch } from 'react-redux';
import { isObject } from 'lodash';
import MockManage from './MockManage';

const renderElement = (data, onTargetChange) => {
  const target_type = data?.target_type;
  const target_id = data?.target_id;
  if (target_type === 'api') {
    return <MockManage data={data} onChange={onTargetChange} />;
  }
  return <></>;
};

const Apis = (props) => {
  const { tabsList, activeId } = props;
  const open_api_now = useSelector((store) => store.mock.open_api_now);
  const onTargetChange = (id, type, value, extension) => {
    // 统一修改
    if (open_api_now !== id) {
      Bus.$emit('mock/updateOpenApiNow', id)
    };
    Bus.$emit('mock/updateTarget', {
      target_id: id,
      pathExpression: getPathExpressionObj(type, extension),
      value,
    });
  };

  return (
    <>
      {tabsList.map((item, index) => (
        <div
          key={index}
          className={cn('tab-content-item', {
            active: item?.id === activeId,
          })}
        >
          {renderElement(item?.data, onTargetChange.bind(null, item.id))}
        </div>
      ))}
    </>
  );
};

export default React.memo(Apis);
