import React, { useRef } from 'react';
import { isEmpty, isFunction, isObject, isPlainObject } from 'lodash';
import { useMemoizedFn, useSafeState } from 'apt-hooks';
// import { getModelItem } from '@DAL/dataModel';
import ItemNode from './itemNode';
import './index.less';
import context from './context';
import { DEFAULT_LAYOUTS } from './constant';

// type Props = {
//   value: any;
//   onChange: (newVal: any) => void;
//   onBeforeLink?: (refKeys: string[]) => boolean;
//   model_id?: string;
// };

const Template = (props) => {
  const { value, onChange, onBeforeLink, model_id, isRequired = true } = props;

  const { Provider } = context;

  const refTable = useRef(null);
  const shemaData = isObject(value) ? value : { type: 'object' };

  const [layouts, setLayouts] = useSafeState(DEFAULT_LAYOUTS);

  const handleRowChange = useMemoizedFn((nodeKey, newVal) => {
    onChange(newVal);
  });

  const getModelRefKeys = async (result, schema) => {
    if (isPlainObject(schema?.properties)) {
      for (const key in schema?.properties) {
        const propertiesData = schema?.properties[key];
        // eslint-disable-next-line no-await-in-loop
        await getModelRefKeys(result, propertiesData);
      }
    }
    // 遍历refs
    if (isPlainObject(schema?.APIPOST_REFS)) {
      const refKeysArray = Object.values(schema.APIPOST_REFS)?.map((item) => item?.ref) || [];
      for await (const refKey of refKeysArray) {
        result.push(refKey);
        // const dataModel = await getModelItem(refKey);
        // await getModelRefKeys(result, dataModel.schema);
      }
    }
    return result;
  };

  const handleBeforeLink = useMemoizedFn(async (dataModel) => {
    const refKeys = [dataModel.model_id];
    await getModelRefKeys(refKeys, dataModel.schema);
    if (isFunction(onBeforeLink)) {
      return onBeforeLink(refKeys);
    }
  });

  const parentModels = useRef(isEmpty(model_id) ? [] : [model_id]);

  return (
    <Provider
      value={{
        refTable,
        layouts,
        setLayouts,
      }}
    >
      <div className="json-schema-template">
        <div ref={refTable} className="template-table">
          <ItemNode
            enableDelete={false}
            deepIndex={0}
            readOnly
            value={shemaData}
            nodeKey="rootNode"
            onChange={handleRowChange}
            isRequired={isRequired}
            singleOnly
            parentModels={parentModels}
          />
        </div>
      </div>
    </Provider>
  );
};

export default Template;
