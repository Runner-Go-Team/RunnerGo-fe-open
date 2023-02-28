import React, { useState, useContext, useMemo, useEffect, useRef, useCallback } from 'react';
import { Right as RightSvg, Down as DownSvg } from 'adesign-react/icons';
import { cloneDeep, isPlainObject, isEmpty, isObject, isUndefined, isString } from 'lodash';
import { Tabs as TabComponent, Message } from 'adesign-react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import produce from 'immer';
import JsonPanel from './panel/jsonPanel';
import './index.less';
import Context from '../designContext';
import { EXPECT_SUCCESS, EXPECT_ERROR } from './constant';
import ExtraList from './extraList';
import { ExpectWrapper } from './style';

const { Tabs, TabPan } = TabComponent;

const Expects = (props) => {
  const { data, onChange } = useContext(Context);

  const [activeId, setActiveId] = useState('success');
  const [showMore, setShowMore] = useState(true);
  const open_apis = useSelector((store) => store.opens?.open_apis);

  const dispatch = useDispatch();

  const expectList = useMemo(() => {
    const list = [];
    if (isPlainObject(data?.response)) {
      Object.keys(data.response).forEach((key) => {
        if (key === 'success') {
          const successExpect = {
            ...cloneDeep(EXPECT_SUCCESS),
            ...(data.response[key]?.expect || {}),
          };
          list.push(successExpect);
        } else if (key === 'error') {
          const errorExpect = {
            ...cloneDeep(EXPECT_ERROR),
            ...(data.response[key]?.expect || {}),
          };
          list.push(errorExpect);
        } else if (isPlainObject(data.response[key]?.expect))
          list.push({ ...data.response[key].expect, expectId: key });
      });
      if (isEmpty(data.response)) {
        list.push(cloneDeep(EXPECT_SUCCESS));
        list.push(cloneDeep(EXPECT_ERROR));
      }
    }
    // if (!isArray(data?.expect)) {
    //   list.push(cloneDeep(EXPECT_SUCCESS));
    //   list.push(cloneDeep(EXPECT_ERROR));
    // }

    // if (isUndefined(list.find((item) => item.expectId === 'success'))) {
    //   list.push(cloneDeep(EXPECT_SUCCESS));
    // }
    // if (isUndefined(list.find((item) => item.expectId === 'error'))) {
    //   list.push(cloneDeep(EXPECT_ERROR));
    // }
    // return list;

    return list;
  }, [data?.response, Object.keys(data?.response).length]);

  const currentExpect = useMemo(() => {
    const dataInfo = expectList.find((item) => item.expectId === activeId);
    return dataInfo;
  }, [expectList, activeId]);

  const handleAddExpect = (info, expectId) => {
    onChange('example', info, expectId);
    Message('success', '新建期望成功。');
  };

  const handleDeleteExpect = () => {
    if (['success', 'error'].includes(activeId)) {
      Message('error', '默认期望不可删除');
      return;
    }
    const newResponse = cloneDeep(data?.response);
    delete newResponse[activeId];
    onChange('response', newResponse);
    setActiveId('success');
    // if (response.hasOwnProperty(diyExampleKey)) {
    //   setDiyExampleKey(Object.keys(newResponse)[0]);
    // }
    // const newList = cloneDeep(expectList);
    // const deleteInfo = newList.find((item) => item.expectId === activeId);
    // if (isUndefined(deleteInfo)) {
    //   Message('error', '参数无效');
    //   return;
    // }
    // // 如果被删除的是默认期望，则将成功期望设置成默认的
    // if (deleteInfo?.isDefault > 0) {
    //   for (let i = 0; i < newList.length; i++) {
    //     if (newList[i].expectId === 'success') {
    //       newList[i].isDefault = 1;
    //     }
    //   }
    // }
    // onChange(
    //   'expect',
    //   newList.filter((item) => item.expectId !== activeId)
    // );
  };

  const refData = useRef();
  useEffect(() => {
    if (isObject(open_apis) && !isUndefined(data)) {
      refData.current = {
        target_id: data.target_id,
        open_apis,
        activeId,
      };
    }
  }, [data.target_id, open_apis, activeId]);

  const handleChangeJson = useCallback((type, value) => {
    const preData = refData.current?.open_apis;
    const currentTargetId = refData.current?.target_id;
    const currentActiveId = refData.current?.activeId;

    if (!isObject(preData) || !isString(currentTargetId)) {
      return;
    }

    const newData = produce(preData, (draft) => {
      draft[currentTargetId].response[currentActiveId].expect.schema = value;
    });

    dispatch({
      type: 'opens/coverOpenApis',
      payload: newData,
    });
  }, []);

  const renderTabPanel = ({ tabsList, handleMouseWeel, headerTabItems }) => {
    return (
      <>
        <div onWheel={handleMouseWeel} className="apipost-design-tabs-header">
          <div className="header-left">
            {tabsList.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setActiveId(item.props.id);
                }}
                className={cn('header-item', { active: activeId === item?.props?.id })}
              >
                {item.props.title}
              </div>
            ))}
          </div>
          <ExtraList {...{ expectList, activeId, handleAddExpect, handleDeleteExpect }} />
        </div>
        {/* <div className="apipost-design-tabs-header" onWheel={handleMouseWeel}>
          <TabList {...{ tabsList, activeId, setActiveId }} />
        </div> */}
      </>
    );
  };

  return (
    <ExpectWrapper>
      <div className="wrapper-title" onClick={setShowMore.bind(null, !showMore)}>
        <span>预定义响应期望（Mock）</span>
        <div className="right-btns">
          {showMore ? <DownSvg className="title-svg" /> : <RightSvg className="title-svg" />}
        </div>
      </div>
      {showMore && (
        <Tabs headerRender={renderTabPanel} activeId={activeId}>
          {expectList.map((item) => (
            <TabPan key={item.expectId} id={item.expectId} title={`${item.name}(${item.code})`}>
              <div className="apipost-design-tabs-content">
                <JsonPanel expectInfo={currentExpect} onChange={handleChangeJson} />
              </div>
            </TabPan>
          ))}
        </Tabs>
      )}
    </ExpectWrapper>
  );
};

export default Expects;
