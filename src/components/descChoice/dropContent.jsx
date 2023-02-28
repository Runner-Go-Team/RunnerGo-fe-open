import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { UserProjects } from '@indexedDB/project';
import Bus from '@utils/eventBus';
// import { AIDesc } from '@indexedDB/init';
import { isArray, isString, trim } from 'lodash';

const DropContent = (props) => {
  const { onChange, filterKey, handleSelect } = props;
  const [paramList, setParamList] = useState([]);
  const { tempParamsDesc } = useSelector((store) => store?.projects);
  const { CURRENT_PROJECT_ID } = useSelector((store) => store?.workspace);
  const { AI_DESCRIPTIONS_SWITCH } = useSelector((store) => store?.user?.config);

  const init = async () => {
    const currentProjectInfo = await UserProjects.get(
      `${CURRENT_PROJECT_ID}/${localStorage.getItem('uuid')}`
    );
    const ai_desc = await AIDesc.get('ai_desc');

    const { details } = currentProjectInfo;
    let descList = [];
    // 获取当前项目参数描述
    if (isArray(details?.globalDescriptionVars)) {
      descList = descList.concat(details.globalDescriptionVars);
    }
    // 获取当前项目临时参数描述
    if (isArray(tempParamsDesc)) {
      descList = descList.concat(tempParamsDesc);
    }
    if (AI_DESCRIPTIONS_SWITCH > 0) {
      if (isArray(ai_desc)) descList = descList.concat(ai_desc);
    }
    setParamList(descList);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <div
        onClick={() => {
          handleSelect();
          Bus.$emit('openModal', 'ParamsDesc');
        }}
        className="params-desc-item"
      >
        参数描述库
      </div>
      {isArray(paramList) &&
        paramList.length > 0 &&
        paramList.map((item) => {
          if (
            isString(item?.key) &&
            item.key.length > 0 &&
            isString(item?.description) &&
            item.description.length > 0
          ) {
            if (isString(filterKey) && trim(filterKey).length > 0) {
              if (trim(filterKey) === trim(item.key)) {
                return (
                  <div
                    onClick={() => {
                      handleSelect();
                      onChange(item?.description || '');
                    }}
                    className="params-desc-item"
                  >
                    {item?.description || ''}
                  </div>
                );
              }
            } else {
              return (
                <div
                  onClick={() => {
                    handleSelect();
                    onChange(item?.description || '');
                  }}
                  className="params-desc-item"
                >
                  {item?.description || ''}
                </div>
              );
            }
          }
          return null;
        })}
    </>
  );
};

export default DropContent;
