import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button, Tabs as TabComponent, Message, Input } from 'adesign-react';
import { Refresh2 as RefreshSvg, Search } from 'adesign-react/icons';
import { isLogin } from '@utils/common';
import { restoreApiRequest, fetchRecycleList, fetchStrongDeleteApi, fetchRecallApi } from '@services/apis';
// import { pushTask } from '@asyncTasks/index';
import { global$ } from '@hooks/useGlobal/global';
import Api from './api';
import Folder from './folder';
import { RecycleModalWrapper } from './style';
import { tap } from 'rxjs';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

const { Tabs, TabPan } = TabComponent;

const Recycle = (props) => {
  const { onCancel } = props;
  const dispatch = useDispatch();
  const project_id = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);

  const [dataList, setDataList] = useState([]);
  const [filter, setFilter] = useState('');
  const { t } = useTranslation();
 
  const getDeleteFolder = async (page, size, dataList = []) => {
    const query = {
      page,
      size,
      team_id: localStorage.getItem('team_id'),
    };
    fetchRecycleList(query)
      .pipe(
        tap((res) => {
          const { code, data: { targets, total } } = res;
          if (code === 0) {
            if (targets.length > 0) {
              const _dataList = dataList.concat(targets);
              setDataList(_dataList);
              getDeleteFolder(page + 1, size, _dataList);
            }
          }
        })
      )
      .subscribe();
    // const allData = await Collection.where('project_id').anyOf(project_id).toArray();
    // let delData = allData.filter((item) => item.status === -1);
    // delData = delData.sort((a, b) => Number(b.update_dtime) - Number(a.update_dtime));
    // setDataList(delData);
  };

  useEffect(() => {
    getDeleteFolder(1, 100);
  }, []);

  const handleRestoreDestory = async (target_id, type) => {
    if (type === 1) {
      // const recycleData = await Collection.get(target_id);
      // if (recycleData === undefined) {
      //   return;
      // }
      // await Collection.update(target_id, {
      //   status: 1,
      // });




      if (isLogin()) {
        fetchRecallApi({
          target_id,
        }).subscribe({
          next (resp) {
            if (resp?.code === 0) {
              Message('success', '恢复成功');
              global$.next({
                action: 'GET_APILIST',
              });
              const _dataList = cloneDeep(dataList);
              const _index = _dataList.findIndex(item => item.target_id === target_id);
              _dataList.splice(_index, 1);
              setDataList(_dataList);
            }
          },
          error () {
            // pushTask({
            //   task_id: `${project_id}/${target_id}`,
            //   action: 'FOREVER',
            //   model: 'API',
            //   payload: {
            //     project_id,
            //     target_id,
            //     type: 1,
            //   },
            //   project_id,
            // });
          },
        });
      }
    } else if (type === 2) {
      // await Collection.update(target_id, {
      //   status: -99,
      // });

      if (isLogin()) {
        fetchStrongDeleteApi({
          target_id
        }).subscribe({
          next (resp) {
            if (resp?.code === 0) {
              Message('success', t('message.deleteSuccess'));
              const _dataList = cloneDeep(dataList);
              const _index = _dataList.findIndex(item => item.target_id === target_id);
              _dataList.splice(_index, 1);
              setDataList(_dataList);
              // getDeleteFolder(1, 100);
            }
          },
          error () {
            // pushTask({
            //   task_id: `${project_id}/${target_id}`,
            //   action: 'FOREVER',
            //   model: 'API',
            //   payload: {
            //     project_id,
            //     target_id,
            //     type: 2,
            //   },
            //   project_id,
            // });
          },
        });
      }
    }
  };

  const renderTabPanel = ({ headerTabItems }) => {
    return (
      <div className="apipost-tabs-header">
        {headerTabItems}
        <div>
          <Input
            value={filter}
            placeholder={t('placeholder.searchApis')}
            size="mini"
            beforeFix={<Search width={16} />}
            onChange={(val) => {
              setFilter(val);
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Modal
        visible
        onCancel={onCancel}
        title={ t('modal.trash') }
        footer={
          <>
            <div className="recycle-modal-footer">
              <Button className='cancel-btn' onClick={onCancel}>{ t('btn.cancel') }</Button>
              <Button className='refresh-btn' onClick={() => getDeleteFolder(1, 100)}>{ t('modal.refresh') }</Button>
            </div>
          </>
        }
        className={RecycleModalWrapper}
      >
        <div>
          <Tabs defaultActiveId="0" headerRender={renderTabPanel}>
            <TabPan id="0" title={ t('modal.delFolder') }>
              <Folder
                data={dataList.filter((item) => item.target_type === 'folder')}
                filter={filter}
                onRestoreDestory={handleRestoreDestory}
              />
            </TabPan>
            <TabPan id="1" title={ t('modal.delApi') }>
              <Api
                data={dataList.filter((item) => item.target_type !== 'folder')}
                filter={filter}
                onRestoreDestory={handleRestoreDestory}
              />
            </TabPan>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default Recycle;
