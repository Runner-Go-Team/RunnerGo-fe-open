import React, { useRef, useImperativeHandle, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Scale, Message } from 'adesign-react';
import cn from 'classnames';
import MonacoEditor from '@components/MonacoEditor';
// import { UserProjects } from '@indexedDB/project';
import { EditFormat, isJSON, multiObj2simpleObj, JsonXml2Obj } from '@utils';
import { isArray, isEqual, unionWith } from 'lodash';
import MarkList from './markList';
import useLayouts from './hooks/useLayouts';
import './index.less';
import { debounce } from 'lodash';

const { ScaleItem, ScalePanel } = Scale;

const Example = (props, forwardsRef) => {
  const { data, onChange } = props;
  const { CURRENT_PROJECT_ID } = useSelector((store) => store?.workspace);
  const { tempParamsDesc } = useSelector((store) => store?.projects);
  const { APIS_TAB_DIRECTION } = useSelector((store) => store?.user?.config);
  const dispatch = useDispatch();
  const refPanel = useRef(null);
  const { raw, parameter } = data || {};
  const [direction, setDirection] = useState(APIS_TAB_DIRECTION > 0 ? 'vertical' : 'horizontal');
  useEffect(() => {
    setDirection(APIS_TAB_DIRECTION > 0 ? 'vertical' : 'horizontal');
  }, [APIS_TAB_DIRECTION]);

  const { contentLayouts, handleResetLayouts, handleLayoutsChange, leftMiniMode, rightMiniMode } =
    useLayouts({ direction, refContainerWarper: refPanel });

  // 从现有响应导入
  const importFromData = (val) => {
    onChange(`Raw`, val);
  };

  // 提取字段和描述
  const extractData = async () => {
    const val = raw || '';

    // const currentProjectInfo = await UserProjects.get(
    //   `${CURRENT_PROJECT_ID}/${localStorage.getItem('uuid')}`
    // );

    // const { details } = currentProjectInfo;
    let descList = [];
    // 获取当前项目参数描述
    if (isArray(details?.globalDescriptionVars)) {
      descList = descList.concat(details.globalDescriptionVars);
    }
    // 获取当前项目临时参数描述
    if (isArray(tempParamsDesc)) {
      descList = descList.concat(tempParamsDesc);
    }
    // 是否开启智能描述库
    // if (AI_DESCRITIONS_SWITCH) descList = [...descList, ...project?.aiDesc];

    // 清空生成的临时参数描述
    window.JC_COMMENTS_DB = [];
    const list = JsonXml2Obj(val, descList, parameter || []);
    // 重置拖动区域
    handleResetLayouts();
    if (list.length > 0) {
      // 设置临时描述
      if (isArray(window.JC_COMMENTS_DB) && window.JC_COMMENTS_DB.length > 0) {
        const newTempDesc = unionWith(
          window.JC_COMMENTS_DB,
          isArray(tempParamsDesc) ? tempParamsDesc : [],
          function (object, other) {
            return isEqual([object.key, object.description], [other.key, other.description]);
          }
        );
        dispatch({
          type: 'projects/setTempParams',
          payload: newTempDesc,
        });
      }

      onChange(`Parameter`, list);
      Message('success', '提取成功');
    } else {
      Message('error', '未提取出任何字段和描述');
    }
  };

  // 美化
  const butifyFormatJson = () => {
    const newRaw = EditFormat(raw).value;
    onChange(`Raw`, newRaw);
  };

  // 简化
  const simplifyJson = () => {
    if (isJSON(raw)) {
      const str = JSON.stringify(multiObj2simpleObj(JSON.parse(raw)), null, '\t');
      onChange(`Raw`, str);
    } else {
      Message('error', '目前仅支持JSON格式的简化操作');
    }
  };

  // 修改编辑器值
  const handleRawChange = (val) => {
    onChange(`Raw`, val);
  };


  const _handleRawChange = debounce(handleRawChange, 300);
  useImperativeHandle(forwardsRef, () => {
    return {
      importFromData,
      extractData,
      butifyFormatJson,
      simplifyJson,
    };
  });

  return (
    <>
      <div ref={refPanel} className="response-example-scale">
      {leftMiniMode ? (
              <div
                className={cn('scale-toggle-box', { vertical: direction !== 'horizontal' })}
                onClick={handleResetLayouts}
              >
                示例编辑器
              </div>
            ) : (
              <MonacoEditor
                value={raw || ''}
                style={{ minHeight: '100%' }}
                Height="100%"
                language="json"
                onChange={_handleRawChange}
              />
            )}
      </div>
    </>
  );
};
export default React.forwardRef(Example);
