import React from 'react';
import QRCode from 'qrcode.react';
import { Button } from 'adesign-react';
import './order.less';
import Support from '@assets/invite/support.svg';
import Weixin from '@assets/invite/weixin.svg';
import PrevIcon from '@assets/invite/prev.svg';
import Alipay from '@assets/invite/Alipay.svg';
import logoImg from '@assets/invite/logo.png';
import ResetIcon from '@assets/invite/reset.svg';
import BlueArrowRight from '@assets/invite/blueArrowRight.svg';
import SuccessIcon from '@assets/invite/successOrder.svg';

const Index = (props) => {
  const {
    type,
    setordershow,
    data,
    timeout,
    settimeout,
    orderData,
    setorderData,
    expireCode,
    successOrder,
  } = props;
  return (
    <div
      className="order_create"
      style={type === 'modal' ? { width: 1280, height: 785, position: 'static' } : {}}
    >
      <Button
        type="primary"
        onClick={() => setordershow(false)}
        style={{
          width: 74,
          height: 36,
          borderRadius: '10px',
          lineHeight: '36px',
          fontWeight: '400',
          background: 'var(--bg1)',
          color: 'var(--fn3)',
          position: 'fixed',
          top: '70px',
          left: '100px',
        }}
      >
        <PrevIcon style={{ width: 20, height: 20, marginRight: '4px', marginTop: '-2px' }} />
        返回
      </Button>
      {expireCode ? (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: '50%',
            transform: 'translate(-50%, 0)',
          }}
        >
          订单已过期，请重新选择套餐，
          <Button
            type="link"
            onClick={() => {
              setordershow(false);
            }}
          >
            去选择
            <BlueArrowRight style={{ width: 24, height: 24 }} />
          </Button>
        </div>
      ) : null}
      <div
        className="api_order_pay"
        style={type === 'modal' ? { top: '50%' } : { top: 'calc(50% - 64px)' }}
      >
        <div className="api_order_pay_l">
          {timeout === 0 || expireCode ? (
            <Button
              type="primary"
              style={{
                width: 83,
                height: 34,
                transform: 'translate(-50%, -50%)',
                zIndex: '1',
                position: 'absolute',
                top: '34%',
                left: '50%',
                borderRadius: '4px',
              }}
              onClick={() => {
                if (expireCode) return;
                const obj = { ...orderData };
                obj.QrCode = `${obj.QrCode.split('&')[0]}&timestep=${new Date().getTime()}`;
                settimeout(180);
                setorderData(obj);
              }}
            >
              <ResetIcon
                style={{ width: 20, height: 20, marginRight: '6px', verticalAlign: 'text-top' }}
              />
              刷新
            </Button>
          ) : null}
          {successOrder ? (
            <SuccessIcon
              style={{
                width: 78,
                height: 78,
                position: 'absolute',
                left: 'calc(50% + 5px)',
                top: '40%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
              }}
            />
          ) : null}
          <div
            className="api_order_pay_l_Qrcode"
            style={timeout === 0 || successOrder || expireCode ? { filter: 'blur(5px)' } : null}
          >
            <QRCode
              value={data.QrCode}
              size={200}
              imageSettings={{
                src: logoImg,
                x: null,
                y: null,
                height: 50,
                width: 50,
                excavate: true,
              }}
            />
          </div>
          <div className="api_order_pay_l_icon_group">
            <Support />
            <Alipay />
            <Weixin />
          </div>
        </div>
        <div className="api_order_pay_middle_line"></div>
        <div className="api_order_pay_r">
          <p>支付订单</p>
          <p>
            <span>待支付金额: </span>
            <span>¥</span>
            <span>{data.orderInfo?.total_fee}</span>
          </p>
          <p>
            <span>购买团队: </span>
            {data.orderInfo?.team_name}
          </p>
          <p>
            <span>套餐: </span>
            {data.orderInfo?.subject}
          </p>
          <p>
            <span>订单号: </span>
            {data.orderInfo?.out_trade_no}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Index;
