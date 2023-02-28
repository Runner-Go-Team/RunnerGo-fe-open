import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { MOCK_VARS } from './mock_vars';
import './index.less';
import { cloneDeep, isNumber, isObject } from 'lodash';
// import { ReactComponent as ReturnSvg } from '../../../../assets/icons/returnSvg.svg';

let envVarActiveIndex = 0;
let envVarMarkVarsList = [];
let envVarDescObj = {
  key: '',
  value: '',
};
let UpClickNum = 0;

const EnvVar = (props) => {
  const { envVisible, envObj, onCancel, onChange } = props;
  // 当前环境环境内容
  const currentEnvId = useSelector((store) => store?.envs?.currentEnv?.env_id || '-1');
  const currentEnv = useSelector((store) => store?.envs?.envDatas?.[currentEnvId]);

  // 脚本生成的全局变量
  const global_vars = useSelector((store) => store?.projects?.globalVars);

  const { positionObj, secondLastChar, text } = envObj;
  const handleClickOutside = (e) => {
    onCancel && onCancel();
  };
  useEffect(() => {
    document.getElementById('root').addEventListener(
      'click',
      (e) => {
        handleClickOutside(e);
      },
      false
    );
    return () => {
      envVarActiveIndex = 0;
      document
        .getElementById('root')
        .removeEventListener('click', (e) => handleClickOutside(e), false);
    };
  }, []);

  const [descObj, setDescObj] = useState({
    key: '',
    value: '',
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [markVarsList, setMarkVarsList] = useState([]);
  useEffect(() => {
    let mock_vars = [];
    Object.keys(MOCK_VARS).forEach((k) => {
      mock_vars = mock_vars.concat(MOCK_VARS[k].list);
    });

    const template_mock_vars = {};
    mock_vars.forEach((item) => {
      const k = `$${item.var.split('(')[0].substring(1)}`;
      template_mock_vars[k] = {
        key: k,
        velue: k,
        description: item.description,
      };
    });
    const data = {
      envList: cloneDeep(currentEnv?.list) || {},
      gloList: cloneDeep(global_vars),
      mockVarsList: template_mock_vars,
    };
    const varsList = [];
    Object.values(data).forEach((obj, index) => {
      Object.keys(obj).forEach((k) => {
        try {
          if (index === 1) {
            varsList.push({
              key: k,
              value: obj[k],
              envType: 'global',
              description: obj[k],
            });
          } else if (isObject(obj[k])) {
            if (!obj.hasOwnProperty('key')) {
              obj[k].key = k;
            }
            obj[k].envType = index === 0 ? 'env' : 'global';
            varsList.push(obj[k]);
          }
        } catch (error) {

        }
      });
    });
    setMarkVarsList(varsList);
    envVarMarkVarsList = varsList;
    if (varsList.length > 0) {
      setDescObj(varsList[0]);
      envVarDescObj = varsList[0];
    }
  }, [currentEnv, global_vars]);

  const typeClass = (i) =>
    classNames({
      'default-type': true,
      e: i === 'env',
    });
  const defaultClass = (k) =>
    classNames({
      'env_vars-default': true,
      active: k === descObj?.key,
    });

  const handleMouseEnter = (obj, index) => {
    setDescObj(obj);
    envVarDescObj = obj;
    setActiveIndex(index);
    envVarActiveIndex = index;
  };
  const handleCheck = async () => {
    let str = text;
    const len = str.length;
    const i = positionObj.inputIndex;
    const leftStr = secondLastChar === '{' ? '' : '{';
    str = `${str.slice(0, i)}${leftStr}${envVarDescObj.key}}}${str.slice(i, len)}`;
    // str = `{{${envVarDescObj.key}}}`;
    onChange && onChange(str);
    onCancel && onCancel();
  };

  const changeActive = (i) => {
    let x = 0;
    if (envVarActiveIndex !== null) {
      x = envVarActiveIndex + i;
    }
    envVarActiveIndex = x;
    const varDom = document.getElementById('scroll-env_vars');
    if (i === 1) {
      const isScroll = varDom && varDom.scrollTop + 8 * 28 < (x + 1) * 28;
      if (isScroll) varDom.scrollTop = (x - 7) * 28;
      if (UpClickNum >= 0) {
        UpClickNum -= 1;
      }
    }
    if (i === -1) {
      if (UpClickNum < 7) {
        UpClickNum += 1;
      }
      const isScroll =
        (varDom && varDom.scrollTop === (x - 1) * 28) || x === envVarMarkVarsList.length - 8;
      if (isScroll) {
        varDom.scrollTop = (x - 2) * 28 >= 0 ? (x - 2) * 28 : 0;
      }
    }

    handleMouseEnter(envVarMarkVarsList[x], x);
  };
  const listener = (e) => {
    if (e.code === 'ArrowDown') {
      if (envVarActiveIndex < envVarMarkVarsList?.length - 1) changeActive(1);
    }
    if (e.code === 'ArrowUp') {
      if (envVarActiveIndex > 0) changeActive(-1);
    }
    if (e.code === 'Enter') {
      handleCheck();
    }
  };
  useEffect(() => {
    document.addEventListener('keydown', listener, true);
    return () => {
      document.removeEventListener('keydown', listener, true);
    };
  }, []);

  return (
    <>
      {/* {envVisible && (
        <div
          className="related_env_vars"
          style={{
            left: positionObj.left,
            top: isNumber(positionObj.top) ? positionObj.top + 30 : positionObj.top,
          }}
        >
          <div className="env_vars-list" id="scroll-env_vars">
            {markVarsList.map((item, index) => (
              <div
                key={`${item.key} + ${index}`}
                className={defaultClass(item.key)}
                onMouseEnter={(e) => {
                  handleMouseEnter(item, index);
                }}
                onClick={() => {
                  handleCheck();
                }}
              >
                <div className={typeClass(item?.envType ? item?.envType : 'env')}>
                  {item?.envType === 'env' ? 'E' : 'G'}
                </div>
                <div className="default-name text-ellips2">{item.key}</div>
                <div className="default-icon"></div>
              </div>
            ))}
          </div>
          <div className="env_vars-desc">
            <div className="desc-title">变量名</div>
            <div>{descObj.key}</div>
            <div className="desc-title" style={{ margin: '16px 0 0 0' }}>
              变量值
            </div>
            <div>{descObj?.envType === 'env' ? descObj.value : descObj.description}</div>
            <div className="desc-title" style={{ margin: '16px 0 0 0' }}>
              所属：
            </div>
            <div>{descObj?.envType === 'env' ? '环境变量' : '全局变量'}</div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default EnvVar;
