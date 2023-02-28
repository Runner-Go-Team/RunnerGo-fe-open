import React, { useState, useEffect } from 'react';
import { Tree, Input, Button } from 'adesign-react';
import { isBoolean, isPlainObject, isString } from 'lodash';
import produce from 'immer';
import ImportProto from './importProto';
import { GrpcTreeWrapper } from './style';

const Menu = (props) => {
  const { data, setPath } = props;
  const [importVisible, setImportVisible] = useState(false);
  const [treeList, setTreeList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState({});

  const onNodeClick = (e) => {
    const nodeKey = e.id;
    if (e?.type === 'method') {
      setPath(`protos.${e.id}`);
      e?.id && setSelectedKeys([e.id]);
    } else {
      setCheckedKeys(
        produce((draft) => {
          const isContains = draft[nodeKey];
          if (isBoolean(isContains)) {
            delete draft[nodeKey];
          } else {
            draft[nodeKey] = true;
          }
        })
      );
    }
  };

  const handleExpandsChange = (keys) => {
    const newCkdKeys = {};
    for (const expandKey of keys) {
      newCkdKeys[expandKey] = true;
    }
    setCheckedKeys(newCkdKeys);
  };
  const initTreeList = (filter) => {
    if (isPlainObject(data?.protos)) {
      const newTreeObj = {};
      let newTreeList = [];
      for (const protoName in data.protos) {
        const proto = data.protos[protoName];
        const protoObj = {
          id: `['${protoName}']`,
          parent: '0',
          title: protoName,
          type: 'proto',
        };
        newTreeList.push(protoObj);
        newTreeObj[protoObj.id] = protoObj;
        if (isPlainObject(proto?.services)) {
          for (const serviceName in proto.services) {
            const service = proto.services[serviceName];
            const serviceObj = {
              id: `['${protoName}'].services.['${serviceName}']`,
              parent: `['${protoName}']`,
              title: serviceName,
              type: 'service',
            };
            newTreeList.push(serviceObj);
            newTreeObj[serviceObj.id] = serviceObj;
            if (isPlainObject(service)) {
              for (const methodName in service) {
                const methodObj = {
                  id: `['${protoName}'].services.['${serviceName}'].['${methodName}']`,
                  parent: `['${protoName}'].services.['${serviceName}']`,
                  title: methodName,
                  type: 'method',
                };
                newTreeList.push(methodObj);
                newTreeObj[methodObj.id] = methodObj;
              }
            }
          }
        }
      }
      // grpc搜索
      if (isString(filter) && filter.length > 0) {
        const newList = {};
        const newSearchKeys = {};
        newTreeList.forEach((item) => {
          const includeTitle = `${item.title}`.toLowerCase().indexOf(filter.toLowerCase()) !== -1;

          if (includeTitle === true) {
            newList[item.id] = item;
            let parent = newTreeObj[item.parent];
            while (parent !== undefined && newList[parent.id] !== parent) {
              newList[parent.id] = parent;
              newSearchKeys[parent.id] = true;
              parent = newTreeObj[parent.parent];
            }
          }
        });
        newTreeList = Object.values(newList);
        setCheckedKeys(newSearchKeys);
      }
      setTreeList(newTreeList);
    }
  };
  useEffect(() => {
    initTreeList();
  }, [data.protos]);
  const handleFilter = (key) => {
    initTreeList(key);
  };

  return (
    <>
      {importVisible && (
        <ImportProto
          data={data}
          onCancel={() => {
            setImportVisible(false);
          }}
        ></ImportProto>
      )}

      <div className={GrpcTreeWrapper}>
        <div className="filter-box">
          <Input size="mini" onChange={handleFilter} />
          <Button
            className="apipost-orange-btn"
            type="primary"
            size="small"
            onClick={() => {
              setImportVisible(true);
            }}
          >
            导入proto
          </Button>
        </div>
        <Tree
          showLine
          showIcon={false}
          defaultExpandKeys={Object.keys(checkedKeys)}
          onExpandKeysChange={handleExpandsChange}
          fieldNames={{
            key: 'id',
            title: 'title',
            parent: 'parent',
          }}
          className="grpc-tree"
          onNodeClick={onNodeClick}
          selectedKeys={selectedKeys}
          dataList={treeList}
        />
      </div>
    </>
  );
};

export default Menu;
