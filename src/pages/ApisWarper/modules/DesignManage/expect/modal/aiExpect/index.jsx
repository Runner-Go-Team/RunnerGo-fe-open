import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'adesign-react';
import { v4 as uuidV4 } from 'uuid';
import { Add as AddSvg } from 'adesign-react/icons';
import './smart.less';
import { cloneDeep, isArray, isObject, isString, set } from 'lodash';
import { SmartModalWrapper } from '../style';
import SelExpect from './selExpect';
import CaseList from './caseList';
import Context from '../../../designContext';
import { DEFAULT_EXPECT_CASE, DEFAULT_CONDITION } from './constant';

const AiExpect = (props) => {
  const { expectList, onCancel } = props;
  const { data, onChange } = useContext(Context);

  const [ai_expect, setAiExpect] = useState();

  useEffect(() => {
    let expectInfo = data?.ai_expect;
    if (!isObject(data?.ai_expect)) {
      expectInfo = {
        none_math_expect_id: '',
        list: [],
      };
    } else {
      expectInfo = cloneDeep(data.ai_expect);
    }
    if (!isString(expectInfo?.none_math_expect_id)) {
      expectInfo.none_math_expect_id = '';
    }
    if (!isArray(expectInfo?.list) || expectInfo?.list?.length === 0) {
      expectInfo.list = [
        {
          ...cloneDeep(DEFAULT_EXPECT_CASE),
          id: uuidV4(),
          conditions: [
            {
              ...cloneDeep(DEFAULT_CONDITION),
              conditionId: uuidV4(),
            },
          ],
        },
      ];
    }
    setAiExpect(expectInfo);
  }, [data?.ai_expect]);

  // 更新期望条件
  const handleUpdateExpect = (type, value) => {
    const newData = cloneDeep(ai_expect);
    set(newData, type, value);
    setAiExpect(newData);
  };

  // 添加新智能期望
  const handleAddExpect = () => {
    const expectItem = {
      ...cloneDeep(DEFAULT_EXPECT_CASE),
      id: uuidV4(),
      conditions: [
        {
          ...cloneDeep(DEFAULT_CONDITION),
          conditionId: uuidV4(),
        },
      ],
    };
    const newData = cloneDeep(ai_expect);
    set(newData, `list[${ai_expect?.list?.length}]`, expectItem);
    setAiExpect(newData);
  };

  const handleSaveAiExpect = () => {
    onChange('ai_expect', cloneDeep(ai_expect));
    onCancel();
  };

  return (
    <Modal
      className={SmartModalWrapper}
      visible
      onOk={handleSaveAiExpect}
      title={<>智能期望</>}
      onCancel={onCancel}
    >
      <div className="smart-hope">
        <CaseList
          expectList={expectList}
          aiExpectList={ai_expect?.list}
          onChange={handleUpdateExpect}
        />
        <div className="smart-hope-add" onClick={handleAddExpect}>
          <AddSvg />
          添加触发条件
        </div>
        <div className="smart-hope-defaultcase">
          <span className="defaultcase-return">else</span>
          <div className="defaultcase-text">期望（不满足所有触发条件）</div>
          <SelExpect
            dataList={expectList}
            value={ai_expect?.none_math_expect_id}
            onChange={handleUpdateExpect.bind(null, 'none_math_expect_id')}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AiExpect;
