/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { cloneDeep, isArray, isString } from 'lodash';
import cn from 'classnames';
import { Modal, Button, Select, CheckBox } from 'adesign-react';
import { InviteModalWrapper } from './style';
import { ServiceGetNoticeGroupList, ServiceGetNoticeSaveEvent, ServiceGetNoticeSend, ServiceGetNoticeGetGroupEvent } from '@services/notif';
import { lastValueFrom } from 'rxjs';
import { useTranslation } from 'react-i18next';
import { Input, Message } from '@arco-design/web-react';
import { debounce } from 'lodash';
import { IconSearch } from '@arco-design/web-react/icon';
import { FotmatTimeStamp } from '@utils';
import Empty from '@components/Empty';
import { RD_ADMIN_URL } from '@config';

const Option = Select.Option;
const NoticeModal = (props) => {
  const { t } = useTranslation();

  const { onCancel, event_id, options, plan_id, batch } = props;

  const [groupList, setGroupList] = useState([]);
  const [checkIds, setCheckIds] = useState([]);

  const [searchValue, setSearchValue] = useState('');
  const team_id = localStorage.getItem('team_id')
  const initGroupList = async () => {
    const resp = await lastValueFrom(ServiceGetNoticeGroupList({ keyword: searchValue || '', }))
    if (resp?.code == 0 && isArray(resp?.data?.list)) {
      setGroupList(resp?.data?.list);
    }
  }

  const initCheckIds = async () => {
    if (plan_id && [101, 103].includes(event_id)) {
      const resp = await lastValueFrom(ServiceGetNoticeGetGroupEvent({ event_id, plan_id, team_id }))
      if (resp?.code == 0 && isArray(resp?.data?.notice_group_ids)) {
        setCheckIds(resp?.data?.notice_group_ids);
      }
    }
  }

  useEffect(() => {
    initCheckIds();
  }, []);

  useEffect(() => {
    initGroupList();
  }, [searchValue]);
  console.log(groupList, "groupList", checkIds);
  const onSubmit = () => {
    if (checkIds.length < 1) {
      return;
    }
    if (batch && checkIds.length >= 10) {
      Message.error('批量操作最多支持选择10条数据');
      return
    }
    // 保存通知
    if ([101, 103].includes(event_id)) {
      lastValueFrom(ServiceGetNoticeSaveEvent({
        event_id,
        notice_group_ids: checkIds,
        team_id,
        ...options
      })).then(res => {
        if (res?.code == 0) {
          Message.success('保存成功')
          onCancel();
        }
      })
      return
    }
    // 发送通知
    lastValueFrom(ServiceGetNoticeSend({
      event_id,
      notice_group_ids: checkIds,
      team_id,
      ...options
    })).then(res => {
      if (res?.code == 0) {
        Message.success('发送通知成功')
        onCancel();
      }
    })

  };

  const debounceSubmit = debounce(onSubmit, 200);

  const checkAll = (value) => {
    const arrIds = [];
    if (value == 'checked') {
      if (isArray(groupList)) {
        groupList.forEach(item => {
          if (item?.group_id) {
            arrIds.push(item?.group_id);
          }
        })
      }
    }

    setCheckIds(arrIds);
  }

  const isCheckAll = checkIds.length >= groupList.length;
  const onCheckItem = (val, group_id) => {
    let newIds = cloneDeep(checkIds);
    if (val == 'checked') {
      if (batch && checkIds.length >= 10) {
        Message.error('批量操作最多支持选择10条数据');
        return
      }
      setCheckIds([...newIds, group_id]);
    } else {
      setCheckIds(newIds.filter(i => i != group_id));
    }
  }
  return (
    <>
      {
        <Modal
          className={InviteModalWrapper}
          visible
          onCancel={onCancel}
          title={'通知'}
          footer={<>
            <Button onClick={onCancel}>
              {'关闭'}
            </Button>
            <Button type="primary" disabled={checkIds.length === 0} onClick={debounceSubmit}>
              {[101, 103].includes(event_id) ? '保存' : '发送通知'}
            </Button>
          </>}
        >
          <div className="notice-content">
            <div className="group-list-search">
              <Input value={searchValue || ''} onChange={setSearchValue} style={{ width: 238, height: 30 }} prefix={<IconSearch />} placeholder={'搜索通知组'} />
            </div>
            <div className={cn('notice-group-list', {
              "notice-group-list-empty": !isArray(groupList) || groupList.length <= 0
            })}>
              {isArray(groupList) && groupList.length > 0 ? (
                <>
                  <div className='notice-group-list-header'>
                    <div className="name">
                      <CheckBox checked={isCheckAll ? 'checked' : 'uncheck'} onChange={checkAll} />
                      通知组名称
                    </div>
                    <div className="type">通知类型</div>
                    <div className="creat_time">创建时间</div>
                  </div>
                  {groupList.map((item) => {
                    let typeStr = '-';
                    if (isArray(item?.notice)) {
                      typeStr = item.notice.reduce(function (acc, obj) {
                        if (isString(obj?.channel_name) && !acc.includes(obj.channel_name)) {
                          if (acc !== '') {
                            acc += ',' + obj.channel_name;
                          } else {
                            acc = obj.channel_name;
                          }
                        }
                        return acc;
                      }, '');
                    }
                    return (
                      <div className="notice-group-list-item" key={item?.group_id}>
                        <div className="name">
                          <CheckBox checked={checkIds.includes(item?.group_id) ? 'checked' : 'uncheck'} onChange={(val) => onCheckItem(val, item?.group_id)} />
                          {item?.name || '-'}
                        </div>
                        <div className="type">{typeStr || '-'}</div>
                        <div className="creat_time">{item?.created_time_sec ? (FotmatTimeStamp(item?.created_time_sec, 'YYYY-MM-DD HH:mm') || '-') : "-"}</div>
                      </div>
                    )
                  })}
                </>
              ) : <Empty text={<div className='empty-text'>暂无通知组，<span onClick={() => window.open(`${RD_ADMIN_URL}/#/settings/notifgroup`)}>去添加</span></div>} />}
            </div>
          </div>
        </Modal>
      }
    </>
  );
};
export default NoticeModal;
