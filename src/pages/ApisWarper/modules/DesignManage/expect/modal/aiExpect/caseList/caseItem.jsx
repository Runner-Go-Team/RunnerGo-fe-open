import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { Switch } from 'adesign-react';
import { Menu1 as Menu1Svg, Delete as DeleteSvg } from 'adesign-react/icons';
import HopeTable from '../conditions';
import SelExpect from '../selExpect';
import './index.less';

const CaseItem = (props) => {
  const { item, index, expectList, onChange, handleDeleteExpect } = props;

  const DragHandle = SortableHandle(() => (
    <div className="btn-sort">
      <Menu1Svg />
    </div>
  ));

  return (
    <div className="smart-hope-case">
      <div className="smart-hope-case-condition">{index === 0 ? 'if' : 'else if'}</div>
      <div className="smart-hope-case-top">
        <div className="top-left">
          <div>触发条件</div>
          <Switch
            size="mini"
            checked={item?.enable > 0}
            onChange={() => {
              onChange(`list[${index}].enable`, item?.enable > 0 ? -1 : 1);
            }}
          />
        </div>
        <div className="top-right">
          <div className="del-case" onClick={handleDeleteExpect.bind(null, index)}>
            <DeleteSvg />
            <span>删除</span>
          </div>
          <DragHandle />
        </div>
      </div>
      <HopeTable
        onChange={onChange.bind(null, `list[${index}].conditions`)}
        expectList={expectList}
        conditionList={item.conditions}
      />
      <div className="smart-hope-case-bottom">
        <span className="bottom-return">return</span>
        <div className="bottom-text">期望（满足条件）：</div>
        <SelExpect
          dataList={expectList}
          value={item.expectId}
          onChange={onChange.bind(null, `list[${index}].expectId`)}
        />
      </div>
    </div>
  );
};

export default CaseItem;
