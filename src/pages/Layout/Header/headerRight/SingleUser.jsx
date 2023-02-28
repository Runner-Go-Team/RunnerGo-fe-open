/* eslint-disable eqeqeq */
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, Message } from 'adesign-react';
import cn from 'classnames';
import { changeUserRole } from '@services/projects';
import UserContext from './userContext';
import avatar from '@assets/logo/avatar.png'

const SingleUser = (props) => {
  const project_id = useSelector((store) => store.workspace.CURRENT_PROJECT_ID);
  const { useMsg, onSecMenuToggle, currentUser } = props;
  const { is_manager: IsManager, is_super_admin: IsAdmin } = currentUser;
  // const { getAllProUser } = useContext(UserContext);


  const roleClass = () => {
    return cn({
      'role-msg': true,
      isRead: useMsg.role == 1,
      isAdmin: useMsg.is_super_admin == 1 && useMsg.is_manager != 1,
      isOwner: useMsg.is_manager == 1,
    });
  };

  const roleMsg = () => {
    if (useMsg.is_super_admin == 1) return '超管';
    if (useMsg.is_manager == 1) return '拥有者';
    if (useMsg.role == 2) return '读写';
    return '只读';
  };

  // const handleChangeUserRole = (role) => {
  //   changeUserRole({
  //     project_id,
  //     uuid: useMsg.uuid,
  //     role,
  //   }).subscribe({
  //     next(resp) {
  //       if (resp?.code === 10000) {
  //         Message('success', '修改权限成功');
  //         getAllProUser();
  //       } else {
  //         Message('error', resp?.msg || '暂无修改权限');
  //       }
  //     },
  //     error(resp) {},
  //   });
  // };

  const renderRole = () => {
    return (
      <>
        {roleMsg() !== '拥有者' && roleMsg() !== '超管' ? (
          <Dropdown
            onVisibleChange={(val) => {
              onSecMenuToggle && onSecMenuToggle(!val);
            }}
            placement="bottom-end"
            content={
              <div className="change-role">
                <div
                  className="role-item"
                  onClick={() => {
                    handleChangeUserRole(2);
                  }}
                >
                  读写权限
                </div>
                <div
                  className="role-item"
                  onClick={() => {
                    handleChangeUserRole(1);
                  }}
                >
                  只读权限
                </div>
              </div>
            }
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={roleClass()}
            >
              {roleMsg()}
            </div>
          </Dropdown>
        ) : (
          <div
            onClick={(e) => {
              Message('error', `${roleMsg()}权限不支持修改`);
              e.stopPropagation();
            }}
            className={roleClass()}
          >
            {roleMsg()}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="single-user">
        <div className="worker-avatar">
          <img className="useritem" src={useMsg.avatar || avatar} />
          <div
            className={cn('isOnline', {
              // notOnline: !useMsg?.isOnline,
              notOnline: false
            })}
          ></div>
        </div>
        <div className="worker-msg">
          <div className="name">{useMsg.nickname}</div>
          <div className="email">{useMsg.email}</div>
        </div>
        <div className="work-role">
          {/* {IsManager == 1 || IsAdmin == 1 ? (
            renderRole()
          ) : (
            <>
              <div
                onClick={(e) => {
                  Message('error', `暂无修改权限`);
                  e.stopPropagation();
                }}
                className={roleClass()}
              >
                {roleMsg()}
              </div>
            </>
          )} */}
        </div>
      </div>
    </>
  );
};

export default SingleUser;
