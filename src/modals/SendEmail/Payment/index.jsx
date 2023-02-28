import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { Button, InputNumber, Message } from 'adesign-react';
import { isEmpty } from 'lodash';
import { getPaymentList, createPay, getPayStatus } from '@services/payment';
import { GetUrlQuery, openUrl } from '@utils';
import Subtract from '@assets/invite/subtract.svg';
import PrevIcon from '@assets/invite/prev.svg';
import './payment.less';
import OrderPay from './order';

const Payment = (props) => {
  const team_id = useSelector((store) => store?.workspace?.CURRENT_TEAM_ID);

  const {
    type,
    match,
    needBuyStation,
    setvisible,
    setSuccessPer,
    setNoRegisters,
    groupCode,
    spaceUsage,
    spaceIdArr,
    setspaceIdArr,
    teamInfoAll,
    ugListHandle,
  } = props;
  const [paymentList, setpaymentList] = useState({});
  const [product_idone, setproduct_idone] = useState(undefined);
  const [product_idtwo, setproduct_idtwo] = useState(undefined);
  const [productUsageId, setproductUsageId] = useState(undefined);
  const [ordershow, setordershow] = useState(false);
  const [orderData, setorderData] = useState({});
  const [timeout, settimeout] = useState(undefined);
  const [expireCode, setexpireCode] = useState(false);
  const [successOrder, setSuccessOrder] = useState(false);
  const [UsageList, setUsageList] = useState({});
  let timerout = null;
  useEffect(() => {
    getPaymentList({ type: spaceUsage ? 3 : 2 }).subscribe({
      next(res) {
        if (res?.code === 10000) {
          if (spaceUsage) {
            res.data.list[0].product?.forEach((it) => {
              it.place = spaceIdArr.length;
            });
            setUsageList(res.data);
            setproductUsageId(res.data.list[0].product[0].product_id);
          } else {
            setpaymentList(res.data);
            setproduct_idone(res.data.list[2].product[0].product_id);
            setproduct_idtwo(res.data.list[3].product[0].product_id);
          }
        }
      },
    });
  }, []);
  const onChangeplaceHandle = (a) => {
    const temp = { ...paymentList };
    temp.list[3].product.forEach((item) => {
      item.place = a;
    });
    setpaymentList(temp);
  };
  const onChangemonthHandle = (a) => {
    const temp = { ...paymentList };
    temp.list[1].product.forEach((item) => {
      item.month = a;
    });
    setpaymentList(temp);
  };
  const handleSubmit = (item, Usage) => {
    const bb = item.product.find((it) => it.product_id === productUsageId);
    let obj = {};
    if (!Usage) {
      let aa = null;
      const productId = item.id === 4 ? product_idtwo : product_idone;
      if (item.id === 2) {
        aa = item.product[0];
      } else {
        aa = paymentList.list[item.id - 1].product.find((item1) => productId === item1.product_id);
      }
      obj = {
        type: 'place_add',
        team_id: match?.params?.id || team_id,
        product_id: aa.product_id,
        place: aa.place,
        month: aa.month,
      };
      if (groupCode) {
        obj.group_code = groupCode;
      }
      if (needBuyStation && needBuyStation > 0) {
        if (obj.place < needBuyStation) {
          Message('error', `需购买${needBuyStation}个工位`);
          return;
        }
      }
    } else {
      obj = {
        type: 'team_expire',
        team_id: match?.params?.id || team_id,
        product_id: bb.product_id,
        place_ids: spaceIdArr,
        place: bb.place,
        month: bb.month,
      };
    }
    // if (item) return;
    createPay(obj).subscribe({
      next(res) {
        if (res?.code === 10000) {
          res.data.QrCode = `${res.data.QrCode}&timestep=${new Date().getTime()}`;
          setorderData(res.data);
          setordershow(true);
          settimeout(180);
        }
      },
    });
  };
  // 续费支付
  // const
  useEffect(() => {
    let timer = null;
    const { order_id } = GetUrlQuery(orderData.QrCode);
    if (ordershow) {
      timer = setInterval(() => {
        getPayStatus({ order_id }).subscribe({
          next(res) {
            if (res?.code === 10000) {
              switch (res.data.status) {
                case 1:
                  clearInterval(timer);
                  if (res.data.invite && !isEmpty(res.data.invite)) {
                    setSuccessPer(res.data.invite.success);
                    setNoRegisters(res.data.invite.not_registers);
                    setvisible(false);
                  } else {
                    Message('success', '订单支付成功');
                    setSuccessOrder(true);
                    setTimeout(() => {
                      if (type === 'modal') {
                        ugListHandle && ugListHandle(false, 1);
                        teamInfoAll && teamInfoAll(false, 1);
                        setspaceIdArr && setspaceIdArr([]);
                        setvisible(false);
                      } else {
                        props.history.goBack();
                      }
                    }, 2000);
                  }
                  break;
                case -99:
                  clearInterval(timer);
                  setexpireCode(true);
                  break;
                default:
                  break;
              }
            }
          },
        });
      }, 3000);
    } else {
      setexpireCode(false);
      setSuccessOrder(false);
    }
    return () => clearInterval(timer);
  }, [ordershow]);
  useEffect(() => {
    if (timeout === 0) return;
    if (ordershow) {
      if (!timerout) {
        timerout = setInterval(() => {
          settimeout(timeout - 1);
        }, 1000);
      }
    }
    return () => clearInterval(timerout);
  }, [timeout]);
  const stylePay = () => {
    if (type !== 'modal') {
      return {};
    }
    if (!spaceUsage) {
      return { width: 1280, height: 700 };
    }
    return { padding: 10, width: 267, height: 270 };
  };
  return (
    <>
      {!ordershow ? (
        <div className="payment payment_page" style={stylePay()}>
          {spaceUsage ? (
            <div className="UsageList">
              {UsageList?.list?.map((item) => (
                <>
                  {item.product.map((item1, index1) => (
                    <div
                      key={index1}
                      style={
                        productUsageId === item1.product_id
                          ? { display: 'block' }
                          : { display: 'none' }
                      }
                    >
                      <div className="price">
                        ¥<span>{item1.price}</span>
                        /工位/月
                      </div>
                      <div className="timeCountchoose">
                        工位数：
                        {item1.place}
                      </div>
                      <div className="chosseyear">
                        {item.product?.map((item2, index2) => (
                          <div
                            key={index2}
                            onClick={() => setproductUsageId(item2.product_id)}
                            className={classNames({
                              year: true,
                              active: productUsageId === item2.product_id,
                            })}
                          >
                            {item2.monthText}
                          </div>
                        ))}
                      </div>
                      <div className="order_price">
                        订单金额：
                        <span className="total_price">
                          {item1.month === 36
                            ? item1.place * item1.price * 24
                            : item1.place * item1.price * item1.month}
                          元
                        </span>
                      </div>
                      <Button
                        onClick={() => handleSubmit(item, true)}
                        type="primary"
                        style={{
                          width: 247,
                          height: 41,
                          borderRadius: '5px',
                          marginTop: 20,
                          color: 'var(--font-1)',
                        }}
                      >
                        {UsageList.buttons.buy}
                      </Button>
                    </div>
                  ))}
                </>
              ))}
            </div>
          ) : (
            <>
              <div className="payment_header">
                <div className="payment_title">
                  <div className="payment_title-back">
                    {type !== 'modal' ? (
                      <Button
                        type="primary"
                        onClick={() => {
                          props.history.goBack();
                        }}
                      >
                        <PrevIcon
                          style={{ width: 20, height: 20, marginRight: '4px', marginTop: '-2px' }}
                        />
                        返回
                      </Button>
                    ) : null}
                    套餐选择
                  </div>
                  <div className="payment_desc">可以根据您团队规模与业务需求，选择相应套餐</div>
                </div>
                {needBuyStation && needBuyStation > 0 ? (
                  <div className="payment_need_buy_desc">
                    <Subtract />
                    还有
                    {needBuyStation.toString()}
                    人待添加，需购买
                    {needBuyStation.toString()}
                    个读写工位
                  </div>
                ) : null}
              </div>
              <div className="payment_content">
                <ul>
                  {paymentList.list?.map((item, index) => (
                    <li key={index}>
                      <div className="panel_header">
                        <div className="panel_img">
                          <img src={item.image} alt="" />
                        </div>
                        <div className="panel_title">
                          <span>{item.name}</span>
                        </div>
                      </div>
                      <div className="divider" />
                      <div className="poweruser">
                        <ul>
                          <li>
                            <div className="key">读写工位</div>
                            <div className="value">{item.read_write_num}</div>
                          </li>
                          {type === 'modal' ? (
                            <li>
                              <div className="key">项目数/接口数/接口调用次数</div>
                              <div className="value free">{item.project_num}</div>
                            </li>
                          ) : (
                            <>
                              <li>
                                <div className="key">项目数</div>
                                <div className="value free">{item.project_num}</div>
                              </li>
                              <li>
                                <div className="key">接口数</div>
                                <div className="value free">{item.project_num}</div>
                              </li>
                              <li>
                                <div className="key">接口调用次数</div>
                                <div className="value free">{item.project_num}</div>
                              </li>
                            </>
                          )}
                          <li>
                            <div className="key">恢复已删除项目</div>
                            <div className="value">{item.restore_num}</div>
                          </li>
                        </ul>
                      </div>
                      <div className="divider" />
                      <div className="choose_foot">
                        {item.product?.map((item1, index1) => (
                          <div
                            key={index1}
                            className="choose_foot_div"
                            style={
                              product_idone === item1.product_id ||
                              product_idtwo === item1.product_id ||
                              item.id === 1 ||
                              item.id === 2
                                ? { display: 'flex' }
                                : { display: 'none' }
                            }
                          >
                            <div className="price">
                              ¥<span>{item1.price}</span>
                              /工位/月
                            </div>
                            {item.id === 2 ? (
                              <div className="timeCountchoose">
                                月数：
                                <InputNumber
                                  min={1}
                                  max={999}
                                  modetype="input"
                                  value={item1.month}
                                  onChange={onChangemonthHandle}
                                />
                              </div>
                            ) : null}
                            {item.id === 4 ? (
                              <div className="timeCountchoose">
                                工位数：
                                <InputNumber
                                  min={15}
                                  max={999}
                                  modetype="input"
                                  value={item1.place}
                                  onChange={onChangeplaceHandle}
                                />
                              </div>
                            ) : null}
                            {item.id === 3 ? (
                              <>
                                <div className="timeCountchoose"></div>
                                <div className="chosseyear">
                                  {item.product?.map((item2, index2) => (
                                    <div
                                      key={index2}
                                      className={classNames({
                                        year: true,
                                        active: product_idone === item2.product_id,
                                      })}
                                      onClick={() => setproduct_idone(item2.product_id)}
                                    >
                                      {item2.monthText}
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : null}
                            {item.id === 4 ? (
                              <div className="chosseyear">
                                {item.product?.map((item2, index2) => (
                                  <div
                                    key={index2}
                                    className={classNames({
                                      year: true,
                                      active: product_idtwo === item2.product_id,
                                    })}
                                    onClick={() => setproduct_idtwo(item2.product_id)}
                                  >
                                    {item2.monthText}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {item.id !== 1 ? (
                              <div className="order_price">
                                订单金额：
                                <span className="total_price">
                                  {(item.id === 3 || item.id === 4) && item1.month === 36
                                    ? item1.place * item1.price * 24
                                    : item1.place * item1.price * item1.month}
                                  元
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ))}
                        {item.id === 1 ? (
                          <Button
                            type="primary"
                            style={{ width: 256, height: 44, borderRadius: '5px', color: 'var(--font-1)' }}
                            onClick={() => {
                              // props.history.push('/apis/project/');
                              setvisible(false);
                            }}
                          >
                            {paymentList.buttons.free}
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            style={{ width: 256, height: 44, borderRadius: '5px', color: 'var(--font-1)' }}
                            onClick={() => {
                              handleSubmit(item);
                            }}
                          >
                            {needBuyStation && needBuyStation > 0
                              ? paymentList.buttons.renew
                              : paymentList.buttons.buy}
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="payment_foot">
                <span
                  className="cur_pointer"
                  onClick={() =>
                    openUrl('http://wpa.qq.com/msgrd?v=3&uin=2184785786&site=qq&menu=yes')
                  }
                >
                  联系客服&gt;
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <OrderPay
            expireCode={expireCode}
            successOrder={successOrder}
            setorderData={setorderData}
            orderData={orderData}
            setordershow={setordershow}
            settimeout={settimeout}
            timeout={timeout}
            data={orderData}
            type={type}
          />
        </>
      )}
    </>
  );
};
export default Payment;
