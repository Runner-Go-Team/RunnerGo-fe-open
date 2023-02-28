import React from 'react';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Dark as DarkSvg, Light as LightSvg } from 'adesign-react/icons';
// import { User } from '@indexedDB/user';
import Bus from '@utils/eventBus';
import { FooterMenu } from './style';

const Help = () => {
  const { config } = useSelector((d) => d?.user);
  const dispatch = useDispatch();


  const themeList = [
    {
      theme: 'dark',
      text: '深色模式',
      icon: <DarkSvg />,
    },
    {
      theme: 'white',
      text: '浅色模式',
      icon: <LightSvg />,
    },
    // {
    //   theme: 'darkblue',
    //   text: '深蓝模式',
    //   icon: <DarkSvg />,
    // },
    // {
    //   theme: 'darkgray',
    //   text: '深灰模式',
    //   icon: <DarkSvg />,
    // },
  ];

  const handleThemeChange = async (theme) => {
    // await User.update(localStorage.getItem('uuid') || '-1', {
    //   'config.SYSTHEMCOLOR': theme,
    // });
    // 修改redux全局主题
    dispatch({
      type: 'user/updateConfig',
      payload: { ...config, SYSTHEMCOLOR: theme || 'dark' },
    });
    let linkThemeName = theme;
    if (theme === 'white') {
      linkThemeName = 'default';
    }
    const url = `/skins/${linkThemeName}.css`;
    document.querySelector(`link[name="apt-template-link"]`).setAttribute('href', url);
    Bus.$emit('saveUserConfig');
  };

  return (
    <FooterMenu>
      {themeList.map((item) => (
        <div
          className={cn('menu_item', {
            active: item.theme === (config?.SYSTHEMCOLOR || 'white'),
          })}
          key={item.theme}
          onClick={() => {
            handleThemeChange(item.theme);
          }}
        >
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
    </FooterMenu>
  );
};

export default Help;
