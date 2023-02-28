import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { Scale } from 'adesign-react';
import MethodsPanel from './methodsPanel';
import ResPonsePanel from './resonpsePanel';
import useApisLayouts from '../../hooks/useApisLayouts';

const { ScaleItem, ScalePanel } = Scale;

const Workspace = (props) => {
  const { data, onChange, path, methodBody, temp_data } = props;

  // 展示方向 1.水平 -1 上下
  const { APIS_TAB_DIRECTION } = useSelector((store) => store?.user?.config);

  const refWrapper = useRef(null);
  const { contentLayouts, handleResetLayouts, leftMiniMode, rightMiniMode, handleLayoutsChange } =
    useApisLayouts({
      refWrapper,
      direction: APIS_TAB_DIRECTION,
    });

  return (
    <div className="grpc-content-scale" ref={refWrapper}>
      <ScalePanel
        onLayoutsChange={handleLayoutsChange}
        layouts={contentLayouts}
        direction={APIS_TAB_DIRECTION > 0 ? 'horizontal' : 'vertical'}
      >
        <ScaleItem minWidth={40} minHeight={40}>
          {leftMiniMode ? (
            <div
              className={cn('scale-toggle-box', { vertical: !(APIS_TAB_DIRECTION > 0) })}
              onClick={handleResetLayouts}
            >
              请求区
            </div>
          ) : (
            <MethodsPanel
              target_id={data?.target_id}
              path={path}
              data={methodBody || {}}
              onChange={onChange}
            ></MethodsPanel>
          )}
        </ScaleItem>
        <ScaleItem
          // className={cn({ 'response-scale': APIS_TAB_DIRECTION === 0 })}
          enableScale={false}
        >
          {rightMiniMode ? (
            <div
              className={cn('scale-toggle-box', { vertical: !(APIS_TAB_DIRECTION > 0) })}
              onClick={handleResetLayouts}
            >
              响应区
            </div>
          ) : (
            <ResPonsePanel
              path={path}
              data={methodBody?.response || {}}
              tempData={temp_data}
              onChange={onChange}
            ></ResPonsePanel>
          )}
        </ScaleItem>
      </ScalePanel>
    </div>
  );
};

export default Workspace;
