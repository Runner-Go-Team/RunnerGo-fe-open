import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Select, Input } from 'adesign-react';
import { Down as DownSvg } from 'adesign-react/icons';
import cn from 'classnames';
import dayjs from 'dayjs';
import { getSynergykLogs } from '@services/projects';
import Collapse from '@components/Collapse';
import HandleTags from '../../components/HandleTags';
import { useSelector } from 'react-redux';
import { actioinType } from './constant';
import { TeamworkLosWrapper } from './style';
import { fetchOperationLog } from '@services/dashboard';
import { tap } from 'rxjs';
import avatar from '@assets/logo/avatar.png';
import { useTranslation } from 'react-i18next';
import { Tooltip, Pagination } from '@arco-design/web-react';

const Option = Select.Option;

const pageSizeList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const TeamworkLogs = (props) => {
  const { onCancel } = props;
  const { t } = useTranslation();
  const project_id = useSelector((store) => store?.workspace?.CURRENT_PROJECT_ID);

  const [init, setInit] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempPage, setTempPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [maxPage, setMaxPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [list, setList] = useState([]);

  const logType = {
    "1": t('index.logType.1'),
    "2": t('index.logType.2'),
    "3": t('index.logType.3'),
    "4": t('index.logType.4'),
    "5": t('index.logType.5'),
    "6": t('index.logType.6'),
    "7": t('index.logType.7'),
    "8": t('index.logType.8'),
    "9": t('index.logType.9'),
    "10": t('index.logType.10'),
    "11": t('index.logType.11'),
    "12": t('index.logType.12'),
    "13": t('index.logType.13'),
    "14": t('index.logType.14'),
    "15": t('index.logType.15'),
    "16": t('index.logType.16'),
    "17": t('index.logType.17'),
    "18": t('index.logType.18'),
    "19": t('index.logType.19'),
    "20": t('index.logType.20'),
    "21": t('index.logType.21'),
    "22": t('index.logType.22'),
    "23": t('index.logType.23'),
    "24": t('index.logType.24'),
    "25": t('index.logType.25'),
    "26": t('index.logType.26'),
    "27": t('index.logType.27'),
    "28": t('index.logType.28'),
    "29": t('index.logType.29'),
    "30": t('index.logType.30'),
    "31": t('index.logType.31'),
    "32": t('index.logType.32'),
    "33": t('index.logType.33'),
    "34": t('index.logType.34'),
    "35": t('index.logType.35'),
    "36": t('index.logType.36'),
    "37": t('index.logType.37'),
    "38": t('index.logType.38'),
    "39": t('index.logType.39'),
    "40": t('index.logType.40'),
    "41": t('index.logType.41'),
    "42": t('index.logType.42'),
    "43" : t('index.logType.43'),
    "44" : t('index.logType.44'),
    "45" : t('index.logType.45'),
    "46" : t('index.logType.46'),
    "47" : t('index.logType.47'),
    "48" : t('index.logType.48'),
    "49" : t('index.logType.49'),
    "50" : t('index.logType.50'),
    "51" : t('index.logType.51'),
    "52" : t('index.logType.52'),
    "53" : t('index.logType.53'),
    "54" : t('index.logType.54'),
    "101": t('index.logType.101'),
    "102": t('index.logType.102'),
    "103": t('index.logType.103'),
    "104": t('index.logType.104'),
    "105": t('index.logType.105'),
    "106": t('index.logType.106'),
    "107": t('index.logType.107'),
    "108": t('index.logType.108'),
    "109": t('index.logType.109'),
  }
 
  const refTooltip = useRef(null);

  // 按日期对数据进行处理
  const sortArrByDate = function (arr) {
    const newArr = [];
    arr.forEach((it) => {
      let index = -1;
      // eslint-disable-next-line array-callback-return
      const isHas = newArr.some((logItem, j) => {
        if (it.time === logItem.time) {
          index = j;
          return true;
        }
      });
      if (!isHas) {
        newArr.push({
          time: it.time,
          data: [it],
        });
      } else {
        newArr[index].data.push(it);
      }
    });
    return newArr;
  };

  const getLogList = () => {
    // const listener1 = () => {
    //   refTooltip?.current?.setPopupVisible(false);
    // };

    const query = {
      team_id: localStorage.getItem('team_id'),
      page: currentPage,
      size: pageSize
    }

    fetchOperationLog(query)
      .pipe(
        tap((res) => {
          const { code, data } = res;

          if (code === 0) {
            const { operations, total } = data;
            setTotal(total);
            let list = [];
            let max = Math.ceil(total / pageSize);
            if (max === 0) max = 1;
            setMaxPage(max);
            operations.forEach(item => {
              const itemData = {
                ...item,
                time: dayjs(item.created_time_sec * 1000).format('YYYY-MM-DD'),
                created_time_sec: dayjs(item.created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss'),
              };


              if (list.length === 0) {
                list.push({
                  time: itemData.time,
                  created_time_sec: itemData.created_time_sec,
                  data: [itemData]
                });
              } else {
                for (let i = 0; i < list.length; i++) {
                  if (list[i].time === itemData.time) {
                    list[i].data.push(itemData);
                  } else if (i === list.length - 1) {
                    list.push({
                      time: itemData.time,
                      created_time_sec: itemData.created_time_sec,
                      data: [itemData]
                    });
                  }
                }
              }
            });
            setList(list);
          }
        })
      )
      .subscribe();

    // document.body.addEventListener('wheel', listener1);
    // return () => {
    //   document.body.removeEventListener('wheel', listener1);
    // };
  };

  useEffect(() => {
    setTempPage(currentPage);
    getLogList();
  }, [currentPage]);

  useEffect(() => {
    if (init) {
      setInit(false);
      return;
    }
    if (currentPage === 1) {
      getLogList();
    } else {
      setCurrentPage(1);
    }
  }, [pageSize]);
  const Intercept = (str) => {
    // if (str[0] === '(') {
    //   return str.slice(str.indexOf(')') + 1);
    // }
    return str;
  };

  const pageChange = (page, size) => {
    page !== currentPage && setCurrentPage(page);
    size !== pageSize && setPageSize(size);
}

  const LogsFooter = () => (
    <div className="teamwork-log-footer">
      <div className="footer-left">
        {list.length > 0 &&

          <Pagination
            showTotal
            total={total}
            showJumper
            sizeCanChange
            pageSize={pageSize}
            current={currentPage}
            sizeOptions={[10, 20, 30, 40]}
            onChange={(page, pageSize) => pageChange(page, pageSize)}
          />
        }

      </div>
      <Button onClick={onCancel} style={{ backgroundColor: 'var(--theme-color)' }}>{t('btn.close')}</Button>
    </div>
  );

  const TitleTime = (time) => {
    const dayIndex = dayjs().diff(dayjs(time), 'day');
    const currentTime = dayIndex === 0 ? t('modal.today') : dayIndex === 1 ? t('modal.yesterday') : time;
    return (
      <div>
        <span>{currentTime}</span>
        <span className="right-select">
          <DownSvg />
        </span>
      </div>
    );
  };

  const actionType = (logItem) => {
    if (logItem?.message?.tag === 'archive') return '归档';
    if (
      logItem?.message?.primary_type === 'project-description' &&
      logItem?.message?.action === 'update'
    )
      return '变更';
    const typeStr = actioinType[logItem?.message?.action] || ' 未知';
    return typeStr;
  };

  return (
    <Modal
      className={TeamworkLosWrapper}
      visible
      title={t('modal.logTitle')}
      onCancel={onCancel}
      footer={<>{LogsFooter()}</>}
    >
      <div className="teamwork-log">
        <div className="teamwork-log-title">
          <div className="operator">{t('modal.operator')}</div>
          <div className="action">{t('modal.operateTarget')}</div>
          <div className="time">{t('modal.operateDate')}</div>
        </div>
        <div className="teamwork-log-content">
          {list?.map((it, index) => (
            <Collapse
              key={index}
              defaultValue={list?.map((logItem) => logItem.time)}
              className="teamwork-log_collapse"
              contentClassName="teamwork-log_collapse_con"
              options={[
                {
                  title: <>{TitleTime(it?.time)}</>,
                  keys: it.time,
                  render: () =>
                    it?.data?.map((logItem, logIndex) => (
                      <div key={logIndex} className="teamwork-log_collapse_con_item">
                        <div className="operator">
                          <img className="avatar" src={logItem.user_avatar || avatar} alt="" />
                          <Tooltip content={logItem.user_name}>
                            <div className='name'>
                              {logItem.user_name}
                            </div>
                          </Tooltip>
                          {logItem.user_status === -1 && <span className="logOff">已注销</span>}
                        </div>
                        <div className="action">
                          <HandleTags type={logItem.category} />
                          {/* <Tooltip
                            ref={refTooltip}
                            placement="bottom"
                            offset={[6, 15]}
                            showArrow
                            content={
                              <div className="tiptitle">
                                {logItem?.message?.action === 'lock' ||
                                  logItem?.message?.action === 'unlock'
                                  ? logItem?.message?.subject?.modify_subject.slice(
                                    0,
                                    logItem?.message?.subject?.modify_subject.length - 3
                                  )
                                  : Intercept(logItem?.message?.subject?.modify_subject)}
                              </div>
                            }
                          > */}
                          <div className="text-ellipsis" style={{ marginLeft: '6px' }}>
                            {/* {logItem?.message?.action === 'lock' ||
                                logItem?.message?.action === 'unlock'
                                ? logItem?.message?.subject?.modify_subject.slice(
                                  0,
                                  logItem?.message?.subject?.modify_subject.length - 3
                                )
                                : Intercept(logItem?.message?.subject?.modify_subject)} */}
                            {logType[logItem.operate]} - {logItem.name}
                          </div>
                          {/* </Tooltip> */}
                        </div>
                        <div className="time">
                          {logItem.created_time_sec}
                        </div>
                      </div>
                    )),
                },
              ]}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default TeamworkLogs;
