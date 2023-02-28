import React, { useState, useRef } from 'react';
import { Input, Select, Button, Message, Tooltip, Dropdown } from 'adesign-react';
import {
  CaretLeft,
  CaretRight,
  Backups,
  Down,
  Lock,
  Unlock,
  Clone,
  Code,
  Share,
  SaveAndfile,
  Save,
} from 'adesign-react/icons';
import Enviroment from '@components/Enviroment';
import Bus from '@utils/eventBus';
import isString from 'lodash/isString';
import useFolders from '@hooks/useFolders';
import isUndefined from 'lodash/isUndefined';
import { setApiLockStatus } from '@services/apis';
// import { Collection } from '@indexedDB/project';
import { isFunction, isNull, isNumber } from 'lodash';
import { isLogin } from '@utils/common';
import './index.less';
import { DropWrapper } from './style';

const Index = (props) => {
  const { target, showGenetateCode } = props;
  const { target_id, target_type, is_locked, project_id } = target || {};
  const [showMenu, setShowMenu] = useState(true);
  const refDropdown = useRef(null);
  const { apiFolders } = useFolders();

  const handleShowShareModal = async () => {
    if (!isString(target_id) || !isString(target_type)) {
      return;
    }
    const apiData = await Collection.get(target_id);
    if (isUndefined(apiData)) {
      Message('error', '接口未保存或已删除！');
      return;
    }
    Bus.$emit('openModal', 'CreateShare', {
      defaultShareName: apiData?.name || '',
      defaultShareMode: apiData?.target_type || 'api',
      project_id: apiData?.project_id,
      target_id: apiData?.target_id,
    });
  };

  const handleArchive = async () => {
    Bus.$emit(
      'saveTargetById',
      {
        id: target_id,
        callback: () => {
          Message('success', '保存并归档成功');
        },
      },
      { is_archive: 1, is_socket: 1 }
    );
  };
  const lockTarget = () => {
    setApiLockStatus({
      project_id,
      target_id,
      check_lock: -1,
    }).subscribe({
      next: (resp) => {
        if (resp?.code === 10000) {
          Message('success', resp.data.is_locked === -1 ? '解锁成功' : '锁定成功');
          // 更新本地数据
          Bus.$emit('updateOpensById', { id: target_id, data: { is_locked: resp.data.is_locked } });

          Bus.$emit('updateCollectionById', {
            id: target_id,
            data: { is_locked: resp.data.is_locked },
          });
        }
      },
    });
  };
  return (
    <div className="api-manage-group">
      <Tooltip content="收起/展开接口菜单" placement="top">
        <div className="manage-item" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? (
            <CaretRight width="14px" height="14px" />
          ) : (
            <CaretLeft width="14px" height="14px" />
          )}
        </div>
      </Tooltip>
      {showMenu && (
        <>
          {(target_type === 'api' || target_type === 'doc') && (
            <div className="bak-item">
              <Tooltip
                content={
                  isLogin() ? (
                    '备份'
                  ) : (
                    <>
                      未登录无法备份
                      <span
                        onClick={() => {
                          Bus.$emit('openModal', 'LoginModal');
                        }}
                        style={{ marginLeft: 6, color: 'var(--log-blue)', textDecoration: 'underline' }}
                      >
                        登录
                      </span>
                    </>
                  )
                }
                placement="top"
              >
                <div
                  className={`manage-item ${isLogin() ? '' : 'no-login'}`}
                  onClick={() => {
                    isLogin() && Bus.$emit('backupTargetById', target_id);
                  }}
                >
                  <Backups width="14px" height="14px" />
                  <span>备份</span>
                </div>
              </Tooltip>
              <Dropdown
                placement="bottom"
                content={
                  <div
                    onClick={() => {
                      Bus.$emit('openModal', 'BackupModal');
                    }}
                  >
                    备份还原
                  </div>
                }
              >
                <div className={`bak-svg ${isLogin() ? '' : 'no-login'}`}>
                  <Down width={16} />
                </div>
              </Dropdown>
            </div>
          )}

          <Tooltip
            content={
              isLogin() ? (
                is_locked > 0 ? (
                  '解锁'
                ) : (
                  '锁定'
                )
              ) : (
                <>
                  未登录无法锁定
                  <span
                    onClick={() => {
                      Bus.$emit('openModal', 'LoginModal');
                    }}
                    style={{ marginLeft: 6, color: 'var(--log-blue)', textDecoration: 'underline' }}
                  >
                    登录
                  </span>
                </>
              )
            }
            placement="top"
          >
            <div
              className={`manage-item ${isLogin() ? '' : 'no-login'}`}
              onClick={() => {
                isLogin() && lockTarget();
              }}
            >
              {is_locked > 0 ? (
                <>
                  <Lock width="14px" height="14px" />
                  <span>解锁</span>
                </>
              ) : (
                <>
                  <Unlock width="14px" height="14px" />
                  <span>锁定</span>
                </>
              )}
            </div>
          </Tooltip>

          <Tooltip content="克隆" placement="top">
            <div className="manage-item" onClick={() => Bus.$emit('cloneTargetById', target_id)}>
              <Clone width="14px" height="14px" />
              <span>克隆</span>
            </div>
          </Tooltip>

          {target_type === 'api' && (
            <Tooltip content="生成代码" placement="top">
              <div
                className="manage-item"
                onClick={() => {
                  showGenetateCode();
                }}
              >
                <Code width="14px" height="14px" />
                <span>生成代码</span>
              </div>
            </Tooltip>
          )}

          <Tooltip content="分享" placement="top">
            <div className="manage-item" onClick={handleShowShareModal}>
              <Share width="14px" height="14px" />
              <span>分享文档</span>
            </div>
          </Tooltip>

          <Tooltip
            content={
              isLogin() ? (
                '保存并归档'
              ) : (
                <>
                  未登录无法归档
                  <span
                    onClick={() => {
                      Bus.$emit('openModal', 'LoginModal');
                    }}
                    style={{ marginLeft: 6, color: 'var(--log-blue)', textDecoration: 'underline' }}
                  >
                    登录
                  </span>
                </>
              )
            }
            placement="top"
          >
            <div
              className={`manage-item ${isLogin() ? '' : 'no-login'}`}
              onClick={() => {
                isLogin() && handleArchive();
              }}
            >
              <SaveAndfile width="14px" height="14px" />
              <span>保存并归档</span>
            </div>
          </Tooltip>
        </>
      )}

      <Tooltip content="保存" placement="top">
        <Button
          onClick={() => {
            Bus.$emit('saveTargetById', {
              id: target_id,
              callback: () => {
                Message('success', '保存成功');
              },
            });
          }}
        >
          <Save width="12px" height="12px" />
          保存
        </Button>
      </Tooltip>

      <Dropdown
        ref={refDropdown}
        placement="bottom-end"
        content={
          <div className={DropWrapper}>
            <div
              className="drop-item"
              onClick={(e) => {
                e.stopPropagation();
                Bus.$emit('saveTargetById', {
                  id: target_id,
                  pid: '0',
                  callback: () => {
                    Message('success', '保存成功');
                    isFunction(refDropdown?.current?.setPopupVisible) &&
                      refDropdown.current.setPopupVisible(false);
                  },
                });
              }}
            >
              根目录
            </div>
            {apiFolders.map((item) => (
              <>
                <div
                  className="drop-item"
                  key={item.target_id}
                  {...item}
                  value={item.target_id}
                  onClick={() => {
                    Bus.$emit('saveTargetById', {
                      id: target_id,
                      pid: item.target_id,
                      callback: () => {
                        Message('success', '保存成功');
                        isFunction(refDropdown?.current?.setPopupVisible) &&
                          refDropdown.current.setPopupVisible(false);
                      },
                    });
                  }}
                >
                  {`|${new Array(item.level).fill('—').join('')}${item.name}`}
                </div>
              </>
            ))}
          </div>
        }
      >
        <Button className="right">
          <div className="split-line" />
          <Down width="12px" height="12px" />
        </Button>
      </Dropdown>

      <Enviroment />
    </div>
  );
};

export default Index;
