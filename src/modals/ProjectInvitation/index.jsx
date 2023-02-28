/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { cloneDeep, findIndex, uniqBy, remove, filter, isObject } from 'lodash';
import { Modal, Button, Input, Select, CheckBox, Message, Spin } from 'adesign-react';

import ConnectIcon from '@assets/invite/blueconnect.svg';
import UnionIcon from '@assets/invite/union.svg';
import { EamilReg, copyStringToClipboard } from '@utils';
import { InviteModalWrapper } from './style';
import './index.less';
import PaymentModal from './Payment/modal';
import PayAddSuccessModal from './PayAddSuccessModal';

import { fetchInviteMember, fetchGetRole, fetchGetLink, fetchEmailIsExist } from '@services/user';
import { fetchEmailList, fetchDeleteEmail } from '@services/plan';
import { fetchAddEmail, fetchTPlanEmailList, fetchTPlanDeleteEmail } from '@services/auto_plan';
import { fetchEmailTReport } from '@services/auto_report';
import { fetchSendPlanEmail } from '@services/plan';
import { fetchSendReportEmail } from '@services/report';
import Bus from '@utils/eventBus';
import { tap } from 'rxjs';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import qs from 'qs';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@arco-design/web-react';
import SvgClose from '@assets/logo/close';

const Option = Select.Option;
const InvitationModal = (props) => {
  const { t } = useTranslation();

  const { projectInfoAll, onCancel, email, from } = props;

  const [projectList, setProjectList] = useState([]);
  const [addList, setAddList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState(2);
  const [needBuyStation, setNeedBuyStation] = useState(0);
  const [groupCode, setGroupCode] = useState(0);
  const [successPer, setSuccessPer] = useState(0);
  const [payAddSuccessVisible, setPayAddSuccessVisible] = useState(false);
  const [noRegisters, setNoRegisters] = useState(0);
  const [payvisible, setPayvisible] = useState(false);

  const [linkPower, setLinkPower] = useState(2);
  const [role, setRole] = useState([]);

  const { search } = useLocation();
  const { id: report_id } = qs.parse(search.slice(1));
  const { id: plan_id } = useParams();


  const [oldList, setOldList] = useState([]);
  const dispatch = useDispatch();


  const changeTeamInvitation = (type, invitationPersonnel) => {
    const inputTempValue = invitationPersonnel?.email || inputValue.trim();
    const selectTempValue = selectValue;
    let teampAddList = cloneDeep(addList);
    const tempProjectList = cloneDeep(projectList);
    const index = findIndex(tempProjectList, { user: { email: inputTempValue } });
    const projectListIndex = projectList.findIndex(
      (i) => i.user.email === invitationPersonnel?.email || i.user.email === inputTempValue
    );
    if (type === 'add') {
      if (!EamilReg(inputTempValue)) {
        Message('error', t('message.plsInputTrueEmail'));
        return;
      }
      if (teampAddList.length >= 50) {
        Message('error', '一次最多邀请50人。');
        return;
      }

      if (!from) {

        const params = {
          team_id: localStorage.getItem('team_id'),
          email: inputTempValue
        };

        fetchEmailIsExist(params).subscribe({
          next: (res) => {
            const { data: { email_is_exist }, code } = res;
            if (code !== 0) {
              return;
            }
            if (email_is_exist) {
              Message('error', t('message.inTeamNow'));
              return;
            } else {
              if (
                tempProjectList.findIndex((ii) => inputTempValue === ii.user.email && ii.in_project) > -1
              ) {
                Message('error', '该邮箱已在项目中');
                return;
              }
              if (selectValue === 'readonly') {
                teampAddList = [
                  {
                    key: uuidv4(),
                    email: inputTempValue,
                    power: selectTempValue,
                    noAdd: projectListIndex > -1,
                  },
                  ...teampAddList,
                ];
              } else {
                teampAddList = [
                  {
                    key: uuidv4(),
                    email: inputTempValue,
                    power: selectValue,
                    noAdd: projectListIndex > -1 && projectList[projectListIndex]?.is_readonly === 1,
                  },
                  ...teampAddList,
                ];
              }
              teampAddList = uniqBy(teampAddList, 'email');
              // 添加后清空输入框内容
              setInputValue('');
              setAddList(teampAddList);

            }
          }
        })
      } else {
        if (
          tempProjectList.findIndex((ii) => inputTempValue === ii.user.email && ii.in_project) > -1
        ) {
          Message('error', '该邮箱已在项目中');
          return;
        }
        if (selectValue === 'readonly') {
          teampAddList = [
            {
              key: uuidv4(),
              email: inputTempValue,
              power: selectTempValue,
              noAdd: projectListIndex > -1,
            },
            ...teampAddList,
          ];
        } else {
          teampAddList = [
            {
              key: uuidv4(),
              email: inputTempValue,
              power: selectValue,
              noAdd: projectListIndex > -1 && projectList[projectListIndex]?.is_readonly === 1,
            },
            ...teampAddList,
          ];
        }
        teampAddList = uniqBy(teampAddList, 'email');
        // 添加后清空输入框内容
        setInputValue('');
      }
    } else if (type === 'delete') {
      if (from === 'plan') {
        const params = {
          plan_id,
          team_id: localStorage.getItem('team_id'),
          email_id: parseInt(invitationPersonnel.id)
        };
        fetchDeleteEmail(params).subscribe({
          next: (res) => {
            const { code } = res;

            if (code === 0) {
              const index = addList.findIndex(item => item.id === invitationPersonnel.id);
              if (index !== -1) {
                const _addList = cloneDeep(addList);
                _addList.splice(index, 1);
                setAddList(_addList);
              }
              dispatch({
                type: 'plan/updateEmailList',
                payload: addList,
              })
            }
          }
        });
      } else if (from === 'auto_plan') {
        const params = {
          plan_id,
          team_id: localStorage.getItem('team_id'),
          id: parseInt(invitationPersonnel.id)
        };
        fetchTPlanDeleteEmail(params).subscribe({
          next: (res) => {
            const { code } = res;

            if (code === 0) {
              const index = addList.findIndex(item => item.id === invitationPersonnel.id);
              if (index !== -1) {
                const _addList = cloneDeep(addList);
                _addList.splice(index, 1);
                setAddList(_addList);
              }
              dispatch({
                type: 'auto_plan/updateEmailList',
                payload: addList,
              })
            }
          }
        });
      } else {
        remove(teampAddList, (n) => invitationPersonnel.key === n.key);
      }
    } else if (type === 'change') {
      filter(teampAddList, (i) => {
        if (i.key === invitationPersonnel.key) {
          i.power = invitationPersonnel.power;
        }
        return i;
      });
    }


    // 更改右边团队人员列表状态
    if (index !== -1) {
      setProjectList(
        (pre) =>
          pre &&
          pre.map((i) => {
            if (
              (i.user.email === invitationPersonnel?.email || i.user.email === inputTempValue) &&
              type !== 'change'
            ) {
              i.checked = type === 'add';
            }
            return i;
          })
      );
    }
    setAddList(teampAddList);
  };

  useEffect(() => {

    const query = {
      team_id: localStorage.getItem('team_id'),
    };
    fetchGetRole(query).subscribe({
      next: (res) => {
        const { data: { role_id } } = res;
        setRole(role_id);
        if (role_id === 2) {
          setSelectValue(2)
        }
      }
    })
    if (plan_id && from === 'plan') {
      const _query = {
        plan_id,
        team_id: localStorage.getItem('team_id'),
      }
      fetchEmailList(_query).subscribe({
        next: (res) => {
          const { data: { emails } } = res;
          const oldList = emails.map(item => {
            return {
              key: uuidv4(),
              email: item.email,
              id: item.id
            }
          })
          setAddList([...addList, ...oldList]);
          setOldList(oldList);
        }
      })
    } else if (plan_id && from === 'auto_plan') {
      const params = {
        plan_id,
        team_id: localStorage.getItem('team_id'),
      }
      fetchTPlanEmailList(params).subscribe({
        next: (res) => {
          const { data: { emails } } = res;
          const oldList = emails.map(item => {
            return {
              key: uuidv4(),
              email: item.email,
              id: item.id
            }
          })
          setAddList([...addList, ...oldList]);
          setOldList(oldList);
        }
      })
    }
  }, [plan_id]);

  const onSubmit = () => {
    if (addList.length < 1) {
      return;
    }
    if (!email && !from) {
      const params = {
        team_id: localStorage.getItem('team_id'),
        members: addList.map(item => {
          return {
            email: item.email,
            role_id: item.power
          }
        })
      }
      fetchInviteMember(params)
        .pipe(
          tap((res) => {
            const { code, data: { register_num, un_register_emails, un_register_num } } = res;

            if (code === 0) {
              Message('success', t('message.invitateSuccess'));
              Bus.$emit('getTeamMemberList');
              setAddList([]);
              onCancel({
                addLength: register_num,
                unRegister: un_register_num,
                unEmail: un_register_emails
              })
            }
          })
        )
        .subscribe();
    } else {
      let params = {};
      if (from === 'auto_plan') {
        params = {
          team_id: localStorage.getItem('team_id'),
          plan_id,
          emails: addList.filter(item => !item.id && (oldList.findIndex(elem => elem.id === item.id) === -1)).map(item => item.email)
        };
        fetchAddEmail(params).subscribe({
          next: (res) => {
            const { code } = res;
            if (code === 0) {
              Message('success', t('message.addSuccess'));
              dispatch({
                type: 'auto_plan/updateEmailList',
                payload: addList,
              })
              onCancel();
            }
          }
        })
      } else if (from === 'plan') {
        console.log(addList, oldList);
        params = {
          team_id: localStorage.getItem('team_id'),
          plan_id,
          emails: addList.filter(item => !item.id && (oldList.findIndex(elem => elem.id === item.id) === -1)).map(item => item.email)
        };
        fetchSendPlanEmail(params).subscribe({
          next: (res) => {
            const { code } = res;
            if (code === 0) {
              Message('success', t('message.addSuccess'));
              dispatch({
                type: 'plan/updateEmailList',
                payload: addList,
              })
              onCancel();
            }
          }
        })
      } else if (from === 'auto_report') {
        console.log('auto_report');
        params = {
          team_id: localStorage.getItem('team_id'),
          report_id: plan_id,
          emails: addList.filter(item => !item.id && (oldList.findIndex(elem => elem.id === item.id) === -1)).map(item => item.email)
        };
        fetchEmailTReport(params).subscribe({
          next: (res) => {
            const { code } = res;
            if (code === 0) {
              Message('success', t('message.sendSuccess'));
              onCancel();
            }
          }
        })
      } else {
        params = {
          team_id: localStorage.getItem('team_id'),
          report_id: report_id,
          emails: addList.map(item => item.email)
        };
        fetchSendReportEmail(params).subscribe({
          next: (res) => {
            const { code } = res;
            if (code === 0) {
              Message('success', t('message.sendSuccess'));
              onCancel();
            } else {
              Message('error', t('message.sendError'));
            }
          }
        })
      }
    }

  
  };
  const PayAddSuccessModalClose = () => {
    projectInfoAll && projectInfoAll(current_project_id);
    onCancel && onCancel();
  };
  return (
    <>
      {
        <Modal
          className={InviteModalWrapper}
          visible
          onCancel={onCancel}
          title={null}
          footer={null}
        >
          <div className="modal-inviation-title">
            <div>{from ? t('btn.notifyEmail') : t('modal.invitation')}</div>
            <Button className="close-btn" onClick={onCancel}>
              <SvgClose />
            </Button>
          </div>
          <div className="team-inviation-content">
            <div className="team-inviation-add">
              <div className="team-inviation-add-operation">
                <Input
                  value={inputValue}
                  placeholder={!email ? t('placeholder.invitedEmail') : t('placeholder.email')}
                  // inputStyle={{ width: '80%' }}
                  onChange={(val) => setInputValue(val)}
                  maxLength={30}
                // onPressEnter={() => changeTeamInvitation('add')}
                />
                {
                  !email ?
                    role !== 2 ?
                      <Select style={{ right: '85px' }} value={selectValue} onChange={(key) => setSelectValue(key)}>
                        <Option value={3}>{t('modal.roleList.1')}</Option>
                        <Option value={2}>{t('modal.roleList.0')}</Option>
                      </Select>
                      : <p className='only-common' style={{ right: '85px' }}>{t('modal.roleList.0')}</p>
                    : ''
                }
                <Button
                  // className="apipost-blue-btn"
                  style={{ color: '#fff' }}
                  onClick={() => changeTeamInvitation('add')}
                >
                  {t('btn.ok')}
                </Button>
              </div>
              <div className="team-invitation-add-list">
                {addList.map((item, index) => (
                  <div className="team-invitation-add-list-item" key={index}>
                    {item.email && item.email.length > 0 ? (
                      <span>
                        <Input
                          value={item.email}
                          readonly
                          placeholder=""
                        // inputStyle={{ width: '90%' }}
                        />
                        <div
                          className="api-close-btn"
                          onClick={() => changeTeamInvitation('delete', item)}
                        >
                          <UnionIcon></UnionIcon>
                        </div>
                      </span>
                    ) : (
                      <span>
                        <img src={item?.portrait} alt="portrait" />
                        {item.nick_name}
                      </span>
                    )}

                    <span style={{ padding: '0 16px' }}>
                      {
                        !email ?
                          role !== 2 ?
                            <Select
                              value={item.power}
                              defaultValue="common"
                              onChange={(key) => {
                                item.power = key;
                                changeTeamInvitation('change', item);
                              }}
                            >
                              {/* {renderOptions()} */}
                              <Option value={3}>{t('modal.roleList.1')}</Option>
                              <Option value={2}>{t('modal.roleList.0')}</Option>
                            </Select>
                            : <p className='only-common'>{t('modal.roleList.0')}</p>
                          : ''
                      }
                    </span>

                    {/* {
                      !from && <span>{exist_user_num + addList.length}/{max_user_num}</span>
                    } */}
                    {/* {computeStation(item)} */}
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="team-inviation-project-list">
              <div className="team-inviation-project-list-header">
                <span>{ t('modal.teamMem') }</span>
                <span onClick={teamPersonnelCheckAll}>{ t('btn.selectAll') }</span>
              </div>
              <div className="team-invitation-project-list-content">
                {projectList &&
                  projectList.map((item, index) => (
                    <div key={index} className="team-invitation-project-list-content-item">
                      <span>
                        <img
                          src={item?.user?.portrait}
                          alt=""
                          style={{ width: '30px', height: '30px' }}
                        />
                      </span>
                      <div>
                        <div>{item.user.nick_name}</div>
                        {item.user.email ? <div>{item.user.email}</div> : ''}
                      </div>
                      <span>{item.is_readonly === 1 ? '读写工位' : '只读工位'}</span>
                      <span>
                        <CheckBox
                          checked={
                            (item.in_project ? item.in_project : item.checked)
                              ? 'checked'
                              : 'uncheck'
                          }
                          disabled={item.in_project}
                          onChange={(checked) => teamPersonnelCheckOne(item, checked)}
                        />
                      </span>
                    </div>
                  ))}
              </div>
            </div> */}
          </div>
          <div className="team-inviation-footer">
            <div className="team-inviation-footer-l">
              {
                !from ? <>
                  <span className="know-link-people">{t('modal.knowUrl')}</span>
                  {
                    role !== 2 ? <Select defaultValue={3} disabled={role === 2} value={linkPower} onChange={(key) => setLinkPower(key)}>
                      <Option value={3}>{t('modal.roleList.1')}</Option>
                      <Option value={2}>{t('modal.roleList.0')}</Option>
                    </Select> : <p className='only-common'>{t('modal.roleList.0')}</p>
                  }
                  <Tooltip content={t('modal.linkTips')}>
                    <div
                      className="team-inviation-link"
                      type="link"
                      onClick={() => {
                        const params = {
                          team_id: localStorage.getItem('team_id'),
                          role_id: linkPower
                        };
                        fetchGetLink(params).subscribe({
                          next: (res) => {
                            const { code, data: { url } } = res;
                            console.log(url);
                            if (code === 0) {
                              copyStringToClipboard(
                                url,
                                true
                              );
                            }
                          }
                        })
                      }}
                    >
                      <ConnectIcon></ConnectIcon>
                      {t('modal.copyUrl')}
                    </div>
                  </Tooltip>
                </> : ''
              }
            </div>
            <div className="team-inviation-footer-r">
              <Button disabled={addList.length === 0} onClick={onSubmit}>
                {(from === 'report' || from === 'auto_report') ? t('btn.send') : t('btn.addMem')}
              </Button>
            </div>
          </div>
        </Modal>
      }
    </>
  );
};
export default InvitationModal;
