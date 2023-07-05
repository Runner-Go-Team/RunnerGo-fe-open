import { IDataModel } from '@models/dataModel';
import React from 'react';

export interface ItemNodeProps {
  value: any;
  nodeKey: string;
  onChange: (attrKey: string, val: any) => void;
  onNodeKeyChange?: (oldKey: string, newKey: string) => void;
  deepIndex: number;
  readOnly: boolean;
  isRequired: boolean;
  onSetRequired: (nodeKey: string, val: boolean) => void;
  onDeleteNode: (key: string | number, is_model: boolean) => void;
  enableDelete?: boolean; // 是否允许删除
  onAddNode?: (key: string) => void;
  onAddSiblingNode?: (nodeKey: string) => void;
  onLinkSchema?: (nodeKey: string, data: IDataModel) => void;
  onCancelLinkSchema?: (nodeKey: string) => void;
  singleOnly: boolean; // 当前层级只允许出现一级同级节点
  isModelItem?: boolean; // 是否模型内项目
  onChangeRefs: (nodeKey: string, newVal: any) => void;
  overrideData: any;
  linkSchema: 'enable' | 'disable';
  parentModels: React.MutableRefObject<string[]>;
}
