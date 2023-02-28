import React, { useState, useEffect } from 'react';
import { Button, Dropdown } from 'adesign-react';
import {
  HelpDoc,
  Mock,
  Check,
  ThinOff,
  Console as ConsoleSvg,
  ScreenLR,
  ScreenTB,
  Light as LightSvg,
  FontScal,
  Setting1,
  Dark as DarkSvg,
} from 'adesign-react/icons';
import { useDispatch, useSelector } from 'react-redux';
import ProxyChoose from '@components/ProxyChoose';
import MockVars from '@components/MockVars';
// import { User } from '@indexedDB/user';
import { proxyText } from '@constants/desktopProxy';
import Console from '@components/Console';
import Bus from '@utils/eventBus';
import { cloneDeep } from 'lodash';
import { ApisFooterWrapper } from './style';
import ScaleFont from './coms/ScaleFont';
import Help from './coms/Help';
import Theme from './coms/Theme';

const RequestPanel = (props) => {
  const { data } = props;

  const dispatch = useDispatch();
  const config = useSelector((store) => store?.user?.config);
  const { APIS_TAB_DIRECTION, SYSCOMPACTVIEW, SYSTHEMCOLOR } = useSelector(
    (store) => store?.user?.config
  );

  const { consoleList } = useSelector((store) => store.console ? store.console : {});
  const iconStyle = {
    width: '16px',
    height: '16px',
  };

  const [proxyVisible, setProxyVisible] = useState(false);
  const [mockVisible, setMockVisible] = useState(false);
  const [proxy_auto, setProxyAuto] = useState(1); // 自动选择代理开关自动打开
  const [proxy_type, setProxyType] = useState('cloud'); // 代理选择 默认 cloud 云端代理 desktop 桌面代理 browser 浏览器代理
  const [consoleShow, setConsoleShow] = useState(false);
  useEffect(() => {
    Bus.$emit('CONNECT_PROXY', { PROXY_AUTO: proxy_auto, PROXY_TYPE: proxy_type });
  }, [proxy_auto, proxy_type]);

  return (
    <ApisFooterWrapper>
      <div className="footer-left">
        <Dropdown
          placement="top"
          content={
            <>
              <Help></Help>
            </>
          }
        >
          <Button size="mini" preFix={<HelpDoc {...iconStyle} />}>
            帮助
          </Button>
        </Dropdown>

        <Button
          size="mini"
          preFix={<Mock {...iconStyle} />}
          onClick={() => {
            setMockVisible(true);
          }}
        >
          内置Mock字段变量
        </Button>
        <Dropdown
          placement="top"
          content={
            <>
              <ProxyChoose
                PROXY_AUTO={proxy_auto}
                PROXY_TYPE={proxy_type}
                setProxyAuto={setProxyAuto}
                setProxyType={setProxyType}
              ></ProxyChoose>
            </>
          }
        >
          <Button
            size="mini"
            preFix={<Check {...iconStyle} fill="green" />}
            onClick={() => {
              setProxyVisible(!proxyVisible);
            }}
          >
            {proxyText(proxy_auto, proxy_type)}
          </Button>
        </Dropdown>
      </div>
      <div className="footer-right">
        <Button
          size="mini"
          preFix={<ThinOff {...iconStyle} />}
          onClick={() => {
            // const newConfig: any = cloneDeep(system);
            // newConfig.AI_DESCRIPTIONS_SWITCH = val === 'checked' ? 1 : -1;
            // setSystem({ ...newConfig });

            // User.update(uuid, {
            //   config: newConfig,
            // }).then((updated: boolean) => {
            //   if (updated) {
            //     Bus.$emit('saveUserConfig');
            //   }
            // });
            User.update(localStorage.getItem('uuid') || '-1', {
              'config.SYSCOMPACTVIEW': SYSCOMPACTVIEW > 0 ? -1 : 1,
            }).then(() => {
              // 调接口
              Bus.$emit('saveUserConfig');
            });

            const newConfig = cloneDeep(config);
            newConfig.SYSCOMPACTVIEW = SYSCOMPACTVIEW > 0 ? -1 : 1;
            dispatch({
              type: 'user/updateConfig',
              payload: newConfig,
            });
          }}
        >
          精简模式
        </Button>
        <Button
          size="mini"
          preFix={<ConsoleSvg {...iconStyle} />}
          onClick={() => setConsoleShow(!consoleShow)}
        >
          控制台
        </Button>
        <Button
          size="mini"
          preFix={
            APIS_TAB_DIRECTION > 0 ? <ScreenLR {...iconStyle} /> : <ScreenTB {...iconStyle} />
          }
          onClick={() => {
            User.update(localStorage.getItem('uuid') || '-1', {
              'config.APIS_TAB_DIRECTION': APIS_TAB_DIRECTION !== 1 ? 1 : -1,
            }).then(() => {
              // 调接口
              Bus.$emit('saveUserConfig');
            });

            const newConfig = cloneDeep(config);
            newConfig.APIS_TAB_DIRECTION = APIS_TAB_DIRECTION !== 1 ? 1 : -1;
            dispatch({
              type: 'user/updateConfig',
              payload: newConfig,
            });
          }}
        >
          {APIS_TAB_DIRECTION > 0 ? '左右分屏' : '上下分屏'}
        </Button>
        <Dropdown
          placement="top"
          content={
            <>
              <Theme></Theme>
            </>
          }
        >
          <Button
            size="mini"
            preFix={
              SYSTHEMCOLOR === 'white' ? <LightSvg {...iconStyle} /> : <DarkSvg {...iconStyle} />
            }
          >
            {SYSTHEMCOLOR === 'white' ? '浅色模式' : '深色模式'}
          </Button>
        </Dropdown>
        <Dropdown
          placement="top"
          content={
            <>
              <ScaleFont></ScaleFont>
            </>
          }
        >
          <Button size="mini" preFix={<FontScal {...iconStyle} />}>
            缩放
          </Button>
        </Dropdown>
        <Button
          size="mini"
          preFix={<Setting1 {...iconStyle} />}
          onClick={() => {
            Bus.$emit('openModal', 'SystemSetting');
          }}
        >
          设置
        </Button>
      </div>
      {mockVisible && (
        <MockVars
          onCancel={() => {
            setMockVisible(false);
          }}
        />
      )}
      <Console visible={consoleShow} setVisible={setConsoleShow} ConsoleList={consoleList} />
    </ApisFooterWrapper>
  );
};

export default RequestPanel;
