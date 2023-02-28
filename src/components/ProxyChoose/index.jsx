import React, { useState } from 'react';
import cn from 'classnames';
import { Radio, Button, Switch } from 'adesign-react';
import { useSelector } from 'react-redux';
import { openUrl } from '@utils';
import Bus from '@utils/eventBus';
import './index.less';

const RadioGroup = Radio.Group;
const ProxyChoose = (props) => {
    const { PROXY_AUTO, PROXY_TYPE, setProxyType, setProxyAuto } = props;

    const { desktop_proxy } = useSelector((d) => d?.desktopProxy);
    return (
        <div className="api_foot_proxy" onClick={(e) => e.stopPropagation()}>
            <div className="foot_proxy-title">
                <div>选择&thinsp;ApiPost&thinsp;代理</div>
                <div
                    className="use_doc"
                    onClick={() => {
                        openUrl('https://mp.apipost.cn/a/8a356419ec2088e4');
                    }}
                >
                    为什么选择代理？
                </div>
            </div>
            <div className="proxy-type-box">
                <div className="proxy-type-box-label auto-check">
                    <div>自动选择</div>
                    <Switch
                        checked={PROXY_AUTO > 0}
                        onChange={(value) => {
                            setProxyAuto(value ? 1 : -1);
                        }}
                    ></Switch>
                </div>
                <div>ApiPost&thinsp;将自动为您选择最佳代理</div>
            </div>
            <ul
                className={cn({
                    'proxy-type-ul': true,
                    'proxy-type-ul-auto': PROXY_AUTO > 0,
                })}
            >
                <RadioGroup value={PROXY_TYPE}>
                    <li
                        onClick={() => {
                            setProxyType('desktop');
                        }}
                    >
                        <Radio value="desktop" disabled={PROXY_AUTO > 0}></Radio>
                        <div className="proxy-type-box">
                            <div className="proxy-type-box-label">
                                桌面代理
                                <span>（推荐）</span>
                            </div>
                            <div>通过本地运行的ApiPost桌面代理发送请求</div>
                        </div>
                    </li>
                    {desktop_proxy && desktop_proxy.connected ? null : (
                        <li>
                            <Button
                                type="primary"
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    borderRadius: '5px',
                                    fontSize: '12px',
                                    color: 'var(--font-1)',
                                }}
                                onClick={() => {
                                    // window.location.href = proxyDownloadUrl;
                                    // if (systemPlatfrom.includes('Mac')) {
                                    //   window.location.href = 'https://img.cdn.apipost.cn/dl/DesktopAgent/mac/ApiPost_Mac_Proxy_1.0.12.dmg?version=1.0.12';
                                    // } else if (systemPlatfrom.includes('Win')) {
                                    //   window.location.href = 'https://apipost.oss-cn-beijing.aliyuncs.com/dl/DesktopAgent/windows/ApiPost_Proxy_1.0.12.exe';
                                    // }
                                }}
                            >
                                下载桌面代理
                            </Button>
                        </li>
                    )}
                    <li
                        onClick={() => {
                            setProxyType('chrome proxy');
                        }}
                    >
                        <Radio value="chrome proxy" disabled={PROXY_AUTO > 0}></Radio>
                        <div className="proxy-type-box">
                            <div className="proxy-type-box-label">
                                浏览器插件代理
                                <span>（推荐）</span>
                                <span
                                    style={{ color: 'var(--log-blue)' }}
                                    onClick={() =>
                                        openUrl('https://rhl469webu.feishu.cn/docs/doccnUb1AAvX1lqT0jLKcfCjegg')
                                    }
                                >
                                    安装教程
                                </span>
                            </div>
                            <div>通过浏览器插件代理解决跨域问题 </div>
                            <div>
                                <a
                                    style={{ color: 'var(--log-blue)' }}
                                    href="https://img.cdn.apipost.cn/dl/chrome_agent.zip"
                                    download="chrome proxy"
                                >
                                    下载链接
                                </a>
                            </div>
                        </div>
                    </li>
                    <li
                        onClick={() => {
                            setProxyType('cloud');
                        }}
                    >
                        <Radio value="cloud" disabled={PROXY_AUTO > 0}></Radio>
                        <div className="proxy-type-box">
                            <div className="proxy-type-box-label">
                                云代理
                                <span>（不支持本地接口）</span>
                            </div>
                            <div>通过ApiPost的安全云服务发送请求</div>
                        </div>
                    </li>
                    <li
                        onClick={() => {
                            setProxyType('browser');
                        }}
                    >
                        <Radio value="browser" disabled={PROXY_AUTO > 0}></Radio>
                        <div className="proxy-type-box">
                            <div className="proxy-type-box-label">
                                浏览器代理
                                <span>（存在跨域问题）</span>
                            </div>
                            <div>通过浏览器发送请求有一些限制</div>
                        </div>
                    </li>
                </RadioGroup>
            </ul>
        </div>
    );
};

export default ProxyChoose;
