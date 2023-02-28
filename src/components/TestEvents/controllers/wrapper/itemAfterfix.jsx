import React, { useContext } from 'react';
import { Switch, Button } from 'adesign-react';
import { More as SvgMore, Iconeye as SvgEye, Right as SvgRight } from 'adesign-react/icons';
import CloseSvg from '@assets/test/close.svg';
import { useNavigate } from 'react-router-dom';
import { handleShowContextMenu } from '../../contextMenu';
import Context from '../../context';

const AfterFix = (props) => {
  const {
    isRoot = false,
    eventItemMode,
    item,
    handleChange,
    onClickMore = (eventItem, status) => void 0,
  } = props;

  const {
    handleDeleteItem = (val) => undefined,
    onContextMenuClick = () => void 0,
  } = useContext(Context);

  const navigate = useNavigate();

  const handleGoEditSingleTest = () => {
    const test_id = item.test_id;
    navigate('/test/single', { state: { test_id } });
  };

  const singleTestRender = () => {
    return (
      <>
        <Switch
          size="small"
          checked={item?.enabled > 0}
          onChange={(ckd) => {
            handleChange('enabled', ckd === true ? 1 : -1);
          }}
        />
        <Button
          className="btn-more"
          onClick={handleShowContextMenu.bind(null, item, onContextMenuClick)}
        >
          <SvgMore />
        </Button>
        <Button onClick={handleDeleteItem.bind(null, item.event_id)}>
          <CloseSvg />
        </Button>
      </>
    );
  };

  const combinedTestRender = () => {
    if (!isRoot) {
      return <></>;
    }
    return (
      <>
        <Button onClick={handleGoEditSingleTest} className="btn-go-edit" preFix={<SvgEye />}>
          <span>编辑</span>
        </Button>
        <Button onClick={handleDeleteItem.bind(null, item?.test_id)}>
          <CloseSvg />
        </Button>
      </>
    );
  };

  const executeTestRender = () => {
    return (
      item.type === 'api' && (
        <div style={{ flex: 1 }}>
          <Button style={{ float: 'right' }} onClick={onClickMore}>
            <SvgRight />
          </Button>
        </div>
      )
    );
  };

  const prefixRender = {
    singleTest: singleTestRender,
    combinedTest: combinedTestRender,
    executeTest: executeTestRender,
  };

  return <>{prefixRender[eventItemMode]()}</>;
};

export default AfterFix;
