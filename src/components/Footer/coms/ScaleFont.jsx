import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { User } from '@indexedDB/user';
import Bus from '@utils/eventBus';
import ZoomAddSvg from '@assets/system/zoomadd.svg';
import ZoomMinusSvg from '@assets/system/zoomminus.svg';
import { ScaleWrapper } from './style';

const ScaleFont = (props) => {
  const { config } = useSelector((d) => d?.user);
  const dispatch = useDispatch();

  const changeFont = async (calc) => {
    let fontSize = parseInt(config?.SYSSCALE, 10);
    if (calc) {
      if (fontSize < 120) {
        fontSize += 10;
      } else {
        return null;
      }
    } else if (fontSize > 90) {
      fontSize -= 10;
    } else {
      return null;
    }

    await User.update(localStorage.getItem('uuid') || '-1', {
      'config.SYSSCALE': fontSize,
    });
    // 修改redux全局主题
    dispatch({
      type: 'user/updateConfig',
      payload: { ...config, SYSSCALE: fontSize || 100 },
    });

    const url = `/font/font-${fontSize}.css`;
    document.querySelector('link[name="apt-font-link"]').setAttribute('href', url);
    document.querySelector('link[name="apt-font-link"]').setAttribute('font-data', fontSize);
    Bus.$emit('saveUserConfig');
  };

  return (
    <ScaleWrapper>
      <ZoomMinusSvg alt="" onClick={() => changeFont(0)} style={{ cursor: 'pointer' }} />
      <div className="zoom_font">{config?.SYSSCALE || 100}%</div>
      <ZoomAddSvg alt="" onClick={() => changeFont(1)} style={{ cursor: 'pointer' }} />
    </ScaleWrapper>
  );
};

export default ScaleFont;
