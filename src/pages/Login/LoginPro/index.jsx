import React, { useEffect, useState } from "react";
import './index.less';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchOpenRegister,
    fetchOpenLogin
} from '@services/user';
import { EamilReg } from '@utils';
import { Message } from 'adesign-react';
import { isNumber } from 'lodash';
import cn from 'classnames';
import { global$ } from '@hooks/useGlobal/global';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';

import { Select, Input, Checkbox, Button } from '@arco-design/web-react';

const { Option } = Select;


const LoginPro = () => {
    const { t, i18n } = useTranslation();
    // 手机号
    const [email, setEmail] = useState('');
    // 0: 登录, 1: 注册
    const [type, setType] = useState(0);
    // 密码
    const [password, setPassword] = useState('');
    // 30天免登录
    const [checked, setChecked] = useState(true);
    // 密码错误
    const [passwordError, setPasswordError] = useState(false);
    // 密码异常提示的文案
    const [passwordErrorText, setPasswordErrorText] = useState('');
    // 邮箱错误
    const [emailError, setEmailError] = useState(false);
    // 邮箱异常提示的文案
    const [emailErrorText, setEmailErrorText] = useState(false);

    const { search } = useLocation();
    const { utm_source, mobile: params_mobile, invite_verify_code } = qs.parse(search.slice(1));
    const language = useSelector((store) => store.user.language);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        dispatch({
            type: 'user/updateLanGuaGe',
            payload: language
        })
    }, []);

    useEffect(() => {
        if (params_mobile && params_mobile.trim().length > 0) {
            setPhone(params_mobile);
        }
    }, [params_mobile]);

    const submit = () => {
        checkEmail();
        checkPassword();

        if (emailError || passwordError) {
            return;
        }

        if (type === 0) {
            const params = {
                email,
                password,
                is_auto_login: checked,
                invite_verify_code
            };

            fetchOpenLogin(params).subscribe({
                next: (res) => {
                    const { data, code } = res;
                    if (code === 0) {
                        const { expire_time_sec, team_id, token } = data;
                        localStorage.setItem('expire_time_sec', expire_time_sec * 1000);
                        localStorage.setItem('runnergo-token', token);
                        localStorage.setItem('team_id', team_id);
                        dispatch({
                            type: 'user/updateTeamId',
                            payload: team_id
                        });

                        Message('success', t('message.loginSuccess'));
                        navigate('/index');
                        global$.next({
                            action: 'INIT_APPLICATION',
                        });
                    }

                }
            })
        } else if (type === 1) {
            if (passwordError) {
                return;
            }

            const params = {
                email,
                password
            };

            fetchOpenRegister(params).subscribe({
                next: (res) => {
                    const { code } = res;

                    if (code === 0) {
                        setType(0);
                        Message('success', t('message.registerSuccess'));
                    }
                }
            })
        }
    }

    const checkPassword = () => {
        if (password.trim().length === 0) {
            Message('error', t('modal.currentPwdEmpty'));
            setPasswordError(true);
            setPasswordErrorText(t('modal.currentPwdEmpty'));
        } else if ((password.length < 6 || password.length > 20) || /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(password)) {
            Message('error', t('sign.passwordError'));
            setPasswordError(true);
            setPasswordErrorText(t('sign.passwordError'));
        } else {
            setPasswordError(false);
        }
    };

    const checkEmail = () => {
        if (email.trim().length === 0) {
            Message('error', t('message.emailEmpty'));
            setEmailError(true);
            setEmailErrorText(t('message.emailEmpty'));
            // 常规限制邮箱长度小于100位
        } else if (!EamilReg(email) || email.trim().length > 100) {
            Message('error', t('message.emailFormatError'));
            setEmailError(true);
            setEmailErrorText(t('message.emailFormatError'));
        } else {
            setEmailError(false);
        }
    }

    return (
        <div className="login-pro">
            <p className="title">{t('sign.welcomeTitle')}</p>
            <div className="config">
                <div className="login-type">
                    <p className={cn('label', {
                        'label-select': type === 0
                    })} onClick={() => {
                        type !== 0 && setType(0);

                    }}>{t('sign.type.0')}</p>
                    <p className="line"></p>
                    <p className={cn('label', {
                        'label-select': type === 1
                    })} onClick={() => {
                        type !== 1 && setType(1);
                    }}>{t('sign.type.1')}</p>

                </div>

                <Select
                    placeholder={t('sign.language')}
                    defaultValue="语言"
                    value={language}
                    onChange={(e) => {
                        i18n.changeLanguage(e);
                        dispatch({
                            type: 'user/updateLanGuaGe',
                            payload: e
                        })
                    }}
                >
                    <Option value="cn">中文</Option>
                    <Option value="en">EngLish</Option>
                </Select>
            </div>
            <div className="item">
                <div className="input-item">
                    <Input
                        className={cn({
                            'input-error': emailError
                        })}
                        placeholder={t('placeholder.email')}
                        value={email}
                        onChange={(e) => setEmail(e)}
                        onBlur={() => checkEmail()}
                    />
                    {emailError && <p className="text-error">{emailErrorText}</p>}
                </div>
            </div>
            <div className="item">
                <div className="input-item">
                    <Input.Password
                        className={cn({
                            'input-error': passwordError
                        })}
                        placeholder={t('placeholder.password')}
                        value={password}
                        onChange={(e) => setPassword(e)}
                        onBlur={() => checkPassword()}
                    />
                    {passwordError && <p className="text-error">{passwordErrorText}</p>}
                </div>
            </div>
            <div className="item">
                <Button onClick={() => submit()}>{type === 0 ? t('btn.loginNow') : t('btn.registerNow')}</Button>
            </div>
            <div className="item">

                <div className="item-checkbox">
                    <Checkbox
                        checked={checked}
                        onChange={(check) => {
                            setChecked(check);
                        }}
                    />{' '}
                    <p className="auto_login">{t('sign.nologin')}</p>
                </div>
            </div>
        </div>
    )
};

export default LoginPro;