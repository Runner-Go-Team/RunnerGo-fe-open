import { useMemoizedFn, useSafeState } from 'apt-hooks';
import React, { useEffect, useMemo, useRef } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import cn from 'classnames';
import { isArray, isEmpty, isPlainObject, isString } from 'lodash';
import { Edit as SvgEdit } from 'adesign-react/icons';
import { useSelector } from 'react-redux';
import produce from 'immer';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getModelItem } from '@DAL/dataModel';
// import { globalEmit } from '@subjects/global';
import { modelWarper } from './style';
import ItemNode from '../../itemNode';
import LinkModal from '../../modals/link';
import ObjectList from '../../nodeList/object';

// type Props = {
//   deepIndex: number;
//   nodeKey;
//   nodeValue: any;
//   onLinkSchema: (schema: IDataModel) => void;
//   onDeleteModel: () => void;
//   onCancelLinkSchema: () => void;
//   onChangeRefs: (nodeKey: string, newVal: any) => void;
//   parentModels: React.MutableRefObject<string[]>;
// };

const DataModel = (props) => {
  const {
    deepIndex,
    nodeValue,
    onDeleteModel,
    onLinkSchema,
    onCancelLinkSchema,
    onChangeRefs,
    linkSchema,
    parentModels,
  } = props;
  const refTable = useRef(null);
  const [warpHeight, setWarpHeight] = useSafeState(0);
  const [showModal, setShowModal] = useSafeState(false);
  const schemaData = useSelector((store) => store?.dataModel?.simpleModels);

  const location = useLocation();
  const navigate = useNavigate();

  const parentNodeRef = useRef(parentModels.current.concat(nodeValue?.APIPOST_MODEL_ID));

  const requiredKeys = isArray(nodeValue?.required) ? nodeValue.required : [];

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        const { height } = entry.contentRect;
        if (warpHeight !== height) {
          setWarpHeight(height);
        }
      }
    });
    if (refTable.current) {
      resizeObserver.observe(refTable.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleLinkSchema = (schema) => {
    setShowModal(false);
    onLinkSchema(schema);
  };

  // const handleChangeRefs = (rowKey: string, newVal: any) => {
  //   const preRefs = isPlainObject(nodeValue?.APIPOST_REFS) ? nodeValue.APIPOST_REFS : {};
  //   const newData = produce(preRefs, (draft) => {
  //     if (!isPlainObject(draft[modelKey])) {
  //       draft[modelKey] = {};
  //     }

  //     if (!isPlainObject(draft[modelKey].APIPOST_OVERRIDES)) {
  //       draft[modelKey].APIPOST_OVERRIDES = {};
  //     }
  //     draft[modelKey].APIPOST_OVERRIDES[rowKey] = newVal;
  //   });
  //   console.log(newData, '=========newData==========');
  // };

  // const modelProperties = isPlainObject(nodeValue?.properties) ? nodeValue?.properties : {};

  // 处理修改key之后排序错乱问题
  const orderKeys = nodeValue?.APIPOST_ORDERS ?? [];
  const listData = useMemo(() => {
    if (!isArray(orderKeys) || !isPlainObject(nodeValue?.properties)) {
      if (!(isArray(nodeValue?.properties) && isEmpty(nodeValue?.properties))) {
        return [];
      }
    }
    const resultList = [];
    orderKeys.forEach((key) => {
      if (isPlainObject(nodeValue?.properties[key])) {
        resultList.push([key, nodeValue?.properties[key]]);
        return;
      }
      const refData = nodeValue?.APIPOST_REFS?.[key];
      const schemaKey = nodeValue?.APIPOST_REFS?.[key]?.ref;

      const modelData = schemaData?.[schemaKey];
      if (isPlainObject(modelData) && isPlainObject(modelData?.schema)) {
        const modelSchema = produce(modelData?.schema, (draft) => {
          draft.type = 'dataModel';
          draft.APIPOST_MODEL_ID = schemaKey;
          draft.APIPOST_MODEL_KEY = key;
          draft.refData = refData;
        });
        resultList.push([key, modelSchema]);
      }
    });

    return resultList;
  }, [orderKeys, nodeValue, schemaData]);

  const handleEditModel = useMemoizedFn(async () => {
    if (location?.pathname === '/data-model') {
      setShowModal(true);
      return;
    }

    if (!isString(nodeValue?.APIPOST_MODEL_ID)) {
      return;
    }

    // const localData = await getModelItem(nodeValue?.APIPOST_MODEL_ID);
    const localData = null;
    if (!isPlainObject(localData)) {
      return;
    }
    // globalEmit('dataModel/addOpensItem', localData, { newTab: true });
    navigate('/data-model');
  });

  const isLoopLink = parentModels.current.some((item) => item === nodeValue?.APIPOST_MODEL_ID);

  if (linkSchema === 'disable') {
    if (isLoopLink) {
      return null;
    }
    return <ObjectList {...{ ...props, deepIndex: deepIndex - 1, parentModels: parentNodeRef }} />;
  }
  return (
    <>
      {showModal && (
        <LinkModal default_model_id={nodeValue?.APIPOST_MODEL_ID} onLinkSchema={handleLinkSchema} />
      )}
      <div ref={refTable} className={cn(modelWarper, 'model-tbody', 'table-tbody')}>
        <div className="outer-box" style={{ height: warpHeight }}>
          <div className="edit-form ">
            <div className="btn-item" onClick={handleEditModel}>
              <SvgEdit />
              <span>编辑</span>
            </div>
            <div className="btn-item" onClick={onCancelLinkSchema}>
              {/* <SvgUnLink /> */}
              <span>解除关联</span>
            </div>
            <div className="btn-item" onClick={onDeleteModel}>
              删除
            </div>
          </div>
        </div>

        {isLoopLink ? (
          <div className="loop-link-item">此处循环引用了数据模型，已默认忽略</div>
        ) : (
          listData.map(([key, value], index) => (
            <ItemNode
              key={index}
              {...{
                value,
                nodeKey: key,
                readOnly: true,
                deepIndex,
                onNodeKeyChange: () => void 0,
                onChange: () => void 0,
                onDeleteNode: () => void 0,
                onAddSiblingNode: () => void 0,
                isRequired: requiredKeys.includes(key),
                onSetRequired: () => void 0,
                singleOnly: true,
                isModelItem: true,
                onChangeRefs,
                overrideData: nodeValue.refData?.APIPOST_OVERRIDES?.[key],
                linkSchema: 'disable',
                parentModels: parentNodeRef,
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default React.memo(DataModel);
