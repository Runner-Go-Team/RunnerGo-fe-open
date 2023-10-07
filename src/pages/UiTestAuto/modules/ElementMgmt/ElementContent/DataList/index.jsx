import { Message, Modal, Table, Tooltip } from '@arco-design/web-react';
import { IconDelete, IconEye } from '@arco-design/web-react/icon';
import ElementMgmtContext from '../../context';
import { ELEMENT_ATTR_METHOD } from '@constants/element'
import { FotmatTimeStamp } from '@utils';
import { ServiceGetElementList, ServiceDeleteElement } from '@services/UiTestAuto/element';
import './index.less';
import React, { useContext, useEffect, useState } from 'react'
import { debounce, isArray, isNumber } from 'lodash';
import { lastValueFrom } from 'rxjs';
import Bus, { useEventBus } from '@utils/eventBus';

const DataList = () => {
  const { selectKey, selectElementIds, setSelectElementIds, search } = useContext(ElementMgmtContext)
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    sizeCanChange: true,
    showTotal: true,
    total: 10,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true,
    showJumper: true
  });
  const getElementList = async () => {
    const resp = await lastValueFrom(ServiceGetElementList({
      team_id: sessionStorage.getItem('team_id'),
      parent_id: selectKey,
      page: pagination.current,
      size: pagination.pageSize,
      ...search
    }));
    if (resp?.code == 0) {
      isArray(resp?.data?.elements) && setData(resp.data.elements)
      isNumber(resp?.data?.total) && setPagination({ ...pagination, total: resp.data.total })
    }
  };
  const debounceGetElementList = debounce(() => getElementList(), 200)
  useEventBus('elementList/debounceGetElementList', debounceGetElementList, [selectKey, search, pagination]);
  useEffect(() => {
    getElementList();
  }, [selectKey, pagination.current, pagination.pageSize])
  useEffect(() => {
    if (search != null) {
      if (pagination.current != 1) {
        // 回到第一页
        setPagination({ ...pagination, current: 1 });
      } else {
        debounceGetElementList();
      }
    }
  }, [search]);
  const deleteElement = (element) => {
    Modal.confirm({
      title: '删除',
      content: `确认删除${element?.name || '该'}元素？`,
      icon: null,
      closable: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          lastValueFrom(ServiceDeleteElement({ team_id: sessionStorage.getItem('team_id'), element_ids: [element.element_id] })).then(res => {
            if (res?.code == 0) {
              Message.success('删除元素成功');
              getElementList();
              resolve();
            }
            reject();
          })
        }).catch((e) => {
          throw e;
        })
      }
    });
  }

  const columns = [
    {
      title: '元素名称',
      dataIndex: 'name',
      render: (col, item) => (
        <Tooltip position='top' trigger='hover' content={col}>
          <span>{col}</span>
        </Tooltip>
      )
    },
    {
      title: '定位方式',
      dataIndex: 'locators',
      render: (col, item) => {
        let value = ''
        if (isArray(col) && col.length > 0) {
          const locator = col[0]
          value = ELEMENT_ATTR_METHOD.find(i => i.key == locator.method)?.name || ''
        }
        return (
          <span>
            {value}
          </span>
        )
      }
    },
    {
      title: '定位类型',
      dataIndex: 'locators',
      render: (col, item) => {
        let value = ''
        if (isArray(col) && col.length > 0) {
          const locator = col[0]
          value = locator?.type || ''
        }
        return (
          <span>
            {value}
          </span>
        )
      }
    },
    {
      title: '定位值',
      dataIndex: 'locators',
      render: (col, item) => {
        let value = ''
        if (isArray(col) && col.length > 0) {
          const locator = col[0]
          value = locator?.value || ''
        }
        return (
          <Tooltip position='top' trigger='hover' content={value}>
          <span>{value}</span>
        </Tooltip>
        )
      }
    },
    {
      title: '所属目录',
      dataIndex: 'parent_name',
    },
    {
      title: '关联场景',
      dataIndex: 'relate_scenes',
      render: (col, item) => {
        let showText = isArray(col) && col.length > 0 ? col.map(i => i.name).join(',') : '';
        return <Tooltip position='top' trigger='hover' content={showText}>
        <span>{showText}</span>
      </Tooltip>
      }
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time_sec',
      render: (col, item) => (
        <span>{FotmatTimeStamp(col, 'YYYY-MM-DD HH:mm')}</span>
      )
    },
    {
      title: '操作',
      dataIndex: '',
      width: 65,
      render: (col, item) => (
        <span className='operation'>
          <IconEye onClick={() => Bus.$emit('openModal', 'CreateElement', { element: item })} fontSize={16} />
          <IconDelete onClick={() => deleteElement(item)} style={{ marginLeft: '10px' }} fontSize={16} />
        </span>
      )
    },
  ];
  return (
    <Table
      className='runnerGo-element-table'
      scroll={{
        y: 'calc(100% - 41px)',
      }}
      rowKey='element_id'
      rowHeight={34}
      ellipsis={true}
      borderCell={true}
      columns={columns}
      pagination={{
        ...pagination, onChange: (current, pageSize) => {
          setPagination({ ...pagination, ...{ current, pageSize } })
        },
        // onPageSizeChange: (pageSize, current) => {
        //   setPagination({ ...pagination, ...{ current, pageSize } })
        // }
      }}
      data={data}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectElementIds,
        onChange: (selectedRowKeys, selectedRows) => {
          setSelectElementIds(selectedRowKeys);
        },
        onSelect: (selected, record, selectedRows) => {
          setSelectElementIds(selected);
          console.log('onSelect:', selected, record, selectedRows);
        },
      }}
      onRow={(record, index) => {
        return {
          onDoubleClick: (event) => {
            Bus.$emit('openModal', 'CreateElement', { element: record })
          },
        };
      }}
    />
  )
}
export default DataList;
