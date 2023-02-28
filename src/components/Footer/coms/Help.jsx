import React from 'react';
import {
  Apipost as ApipostSvg,
  Feedback as FeedbackSvg,
  HelpDoc as HelpDocSvg,
} from 'adesign-react/icons';
import { openUrl } from '@utils';
import { FooterMenu } from './style';

const Help = () => {
  return (
    <FooterMenu>
      <div className="menu_item" onClick={() => openUrl('https://www.apipost.cn')}>
        <ApipostSvg />
        <span>ApiPost&thinsp;官网</span>
      </div>
      <div
        className="menu_item"
        onClick={() => {
          openUrl(`https://console.apipost.cn/bugFeedback`);
        }}
      >
        <FeedbackSvg />
        <span>问题反馈</span>
      </div>
      <div
        className="menu_item"
        onClick={() =>
          openUrl('https://wiki.apipost.cn/document/00091641-1e36-490d-9caf-3e47cd38bcde')
        }
      >
        <HelpDocSvg />
        <span>帮助文档</span>
      </div>
    </FooterMenu>
  );
};

export default Help;
