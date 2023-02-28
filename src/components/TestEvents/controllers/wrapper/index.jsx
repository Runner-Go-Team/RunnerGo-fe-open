import React, { useContext, useMemo } from 'react';
import cn from 'classnames';
import { isNumber, isString, isUndefined } from 'lodash';
import ScriptBox from '@components/ScriptBox';
import { useNavigate } from 'react-router-dom';
import SuccessSvg from '@assets/test/success.svg';
import FaildSvg from '@assets/test/faild.svg';
import IgnoreSvg from '@assets/test/ignore.svg';
import Context from '../../context';
import ItemPrefix from './itemPrefix';
import ItemAfterfix from './itemAfterfix';

const Wrapper = (props) => {
  const { rootIndex = 0, item, handleChange, className, path = [], isRoot = false } = props;

  const {
    eventItemMode = 'singleTest',
    currentEventInfo,
    statusList,
    onClickMore,
  } = useContext(Context);

  const prefixIcon = useMemo(() => {
    if (isString(statusList?.[item?.event_id]) && statusList?.[item?.event_id] === 'passed') {
      return <SuccessSvg className="icon-22x22" />;
    }
    if (isString(statusList?.[item?.event_id]) && statusList?.[item?.event_id] === 'failure') {
      return <FaildSvg className="icon-22x22" />;
    }
    if (isString(statusList?.[item?.event_id]) && statusList?.[item?.event_id] === 'ignore') {
      return <IgnoreSvg className="icon-22x22" />;
    }

    return <></>;
  }, [statusList, currentEventInfo]);

  const navigate = useNavigate();

  const indentCount = isNumber(path?.length) && path?.length > 0 ? path?.length - 1 : 0;

  const handleChangeData = (newVal) => {
    handleChange('data', { content: newVal });
  };

  const isRunActive =
    !isUndefined(currentEventInfo) &&
    currentEventInfo?.test_id === item.test_id &&
    currentEventInfo?.current_event_id === item.event_id;

  const handleClickMore = () => {
    onClickMore(item);
    // if (isString(statusList?.[item?.event_id])) {
    //   onClickMore(item, statusList?.[item?.event_id]);
    // }
  };

  return (
    <>
      <div className={className}>
        {!isRoot && <div className="indent-panel" style={{ width: indentCount * 24 }}></div>}
        <div className="events-main-wrapper">
          <div className={cn('event-main', { isRunActive })}>
            <ItemPrefix
              isRoot={isRoot}
              rootIndex={rootIndex}
              eventItemMode={eventItemMode}
              path={path}
              prefixIcon={prefixIcon}
              // handleGoEditSingleTest={handleGoEditSingleTest}
            />
            <div className="main-panels">{props.children}</div>
            <div className="ctrl-panel">
              <ItemAfterfix
                isRoot={isRoot}
                rootIndex={rootIndex}
                eventItemMode={eventItemMode}
                item={item}
                handleChange={handleChange}
                onClickMore={handleClickMore}
              />
            </div>
          </div>
          {['script', 'assert'].includes(item?.type) && item?.enabled > 0 && (
            <div className="script-panel">
              <ScriptBox value={item?.data?.content} onChange={handleChangeData} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wrapper;
