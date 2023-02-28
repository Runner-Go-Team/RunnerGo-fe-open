import React, { useState, useEffect } from 'react';
import { Message } from 'adesign-react';
import { Select, Input, Button, Checkbox } from '@arco-design/web-react';
import { useDispatch, useSelector } from 'react-redux';
import './index.less';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getVcodefun from '@utils/getVcode';
import { EamilReg, PhoneReg } from '@utils';
import cn from 'classnames';
import { fetchFindPassword, fetchSMSCode, fetchCheckSMSCode, fetchResetPassword } from '@services/user';
import { isNumber } from 'lodash';
import qs from 'qs';

let find_t = null;

const { Option } = Select;

const FindPassword = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { search } = useLocation();
    const { mobile: params_mobile, invite_verify_code } = qs.parse(search.slice(1));
    const [value, setValue] = useState('');
    // 极验验证码
    const [vcodeObj, setVcodeObj] = useState({});
    const [captchaObj, setCaptchaObj] = useState(null);
    const [emailError, setEmailError] = useState(false);
    const [send, setSend] = useState(false);
    const [type, setType] = useState('');

    // 步骤
    const [step, setStep] = useState(1);
    // 手机号验证码
    const [phoneCode, setPhoneCode] = useState('');
    // 验证码按钮文案
    const [phoneCodeBtn, setPhoneCodeBtn] = useState(t('btn.getCode'));
    // 获取验证码之前校验极验
    const [showPhoneCode, setShowPhoneCode] = useState(false);

    // 手机号
    const [phone, setPhone] = useState('');
    // 同意服务协议
    const [readChecked, setReadChecked] = useState(true);
    // 新密码
    const [newPwd, setNewPwd] = useState('');
    // 确定密码
    const [confirmPwd, setConfirmPwd] = useState('');

    // 手机号错误
    const [phoneError, setPhoneError] = useState(false);
    // 手机号异常提示的文案
    const [phoneErrorText, setPhoneErrorText] = useState(false);
    // 密码错误
    const [passwordError, setPasswordError] = useState(false);
    // 密码异常提示的文案
    const [passwordErrorText, setPasswordErrorText] = useState('');
    // 确认密码错误
    const [confirmPwdError, setConfirmPwdError] = useState(false);

    const language = useSelector((store) => store.user.language);


    const dispatch = useDispatch();

    const getVcodeUrl = async () => {
        const { result, captcha } = await getVcodefun();
        setVcodeObj(result);
    };

    useEffect(() => {
        getVcodeUrl();
    }, []);

    useEffect(() => {
        if (params_mobile && params_mobile.trim().length > 0) {
            setPhone(params_mobile);
        }
    }, [params_mobile]);

    useEffect(() => {
        console.log(vcodeObj, captchaObj);
        if (Object.entries(vcodeObj).length > 0) {
            if (phone.trim().length > 0 && !phoneError) {
                setShowPhoneCode(true);
            } else {
                if (captchaObj) {
                    captchaObj.destroy();
                }
                getVcodeUrl();
                Message('error', t('message.inputPhoneBefore'));
            }
        } else {
            setShowPhoneCode(false);
        }
    }, [vcodeObj, captchaObj]);


    const resetPwd = () => {
        checkPhone();
        checkPassword();

        if (phoneError && passwordError) {
            return;
        }

        if (newPwd.trim() !== confirmPwd.trim()) {
            Message('error', t('message.confirmError'));
            return;
        }


        const params = {
            mobile: phone,
            verify_code: phoneCode,
            new_password: newPwd,
            repeat_password: confirmPwd
        };

        fetchResetPassword(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    Message('success', t('message.resetSuccess'));
                    navigate(`/login?mobile=${phone}&invite_verify_code=${invite_verify_code ? invite_verify_code : ''}`);
                }
            }
        })
    }

    let login_code_t = null;

    // 获取手机号验证码
    const getPhoneCode = () => {
        if (Object.keys(vcodeObj).length === 0) {
            setShowPhoneCode(false);
            getVcodeUrl();
            Message('error', t('message.check'));
            return;
        }

        checkPhone();

        if (!readChecked) {
            Message('error', t('message.selectAgreement'));
            return;
        }

        if (phoneError) {
            return;
        }

        const params = {
            mobile: phone,
            captcha: vcodeObj
        };

        fetchFindPassword(params).subscribe({
            next: (res) => {
                const { code } = res;
                if (code === 0) {
                    let date = 60;
                    setPhoneCodeBtn(date);
                    login_code_t = setInterval(() => {
                        date--;
                        setPhoneCodeBtn(date);

                        if (date === 0) {
                            clearInterval(login_code_t);
                            setPhoneCodeBtn(t('btn.getCode'));
                            login_code_t = null;
                        }
                    }, 1000);
                } else if (code === 20051) {
                    setShowPhoneCode(false);
                    getVcodeUrl();
                }
            }
        })
    }

    const checkPhone = () => {
        if (phone.trim().length === 0) {
            Message('error', t('message.phoneEmpty'));
            setPhoneError(true);
            setPhoneErrorText(t('message.phoneEmpty'));
        } else if (!PhoneReg(phone)) {
            Message('error', t('message.phoneFormatError'));
            setPhoneError(true);
            setPhoneErrorText(t('message.phoneFormatError'));
        } else {
            setPhoneError(false);
        }
    }

    const checkPassword = () => {
        console.log(newPwd);
        if (newPwd.trim().length === 0) {
            Message('error', t('modal.currentPwdEmpty'));
            setPasswordError(true);
            setPasswordErrorText(t('modal.currentPwdEmpty'));
        } else if ((newPwd.length < 6 || newPwd.length > 20) || /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(newPwd)) {
            Message('error', t('sign.passwordError'));
            setPasswordError(true);
            setPasswordErrorText(t('sign.passwordError'));
        } else {
            setPasswordError(false);
        }
    };

    const checkConfirmPwd = () => {
        if (newPwd.trim() !== confirmPwd.trim()) {
            Message('error', t('sign.confirmError'));
            setConfirmPwdError(true);
        } else {
            setConfirmPwdError(false);
        }
    }

    const openHtml = (name) => {
        const hrefStr = window.location.href;
        const urlParams = new URL(hrefStr);
        const rootPath = urlParams.origin;
        window.open(`${rootPath}/${name}.html`, '_blank');
    }


    return (
        <div className='retrieve-password'>
            <p className='title'>{t('sign.findPwd')}</p>
            <div className="config">

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

            <div className='item'>
                <div className='input-item'>
                    <Input
                        className={cn({
                            'input-error': phoneError
                        })}
                        placeholder={t('placeholder.phone')}
                        value={phone}
                        onChange={(e) => setPhone(e)}
                        onBlur={() => checkPhone()}
                    />
                    {phoneError && <p className="text-error">{phoneErrorText}</p>}
                </div>
            </div>

            <div className='item'>
                {
                    showPhoneCode ? <>
                        <Input
                            className='phone-code-input'
                            placeholder={t('placeholder.phoneCode')}
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e)}
                        />
                        <Button className="phone-code" disabled={!phone.length || isNumber(phoneCodeBtn)} onClick={() => getPhoneCode()}>{phoneCodeBtn}</Button>
                    </> : <div id='captcha'></div>

                }
            </div>
            {
                showPhoneCode ? <>
                    <div className='item'>
                        <div className='input-item'>
                            <Input.Password
                                className={cn({
                                    'input-error': passwordError
                                })}
                                placeholder={t('placeholder.newPwd')}
                                value={newPwd}
                                onChange={(e) => setNewPwd(e)}
                                onBlur={() => checkPassword()}
                            />
                            {passwordError && <p className="text-error">{passwordErrorText}</p>}
                        </div>
                    </div>
                    <div className='item'>
                        <div className='input-item'>
                            <Input.Password
                                className={cn({
                                    'input-error': confirmPwdError
                                })}
                                placeholder={t('placeholder.confirmPwd')}
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e)}
                                onBlur={() => checkConfirmPwd()}
                            />
                            {confirmPwdError && <p className="text-error">{t('sign.confirmError')}</p>}
                        </div>
                    </div>
                </> : <></>
            }
            <div className='item item-checkbox'>
                <Checkbox
                    checked={readChecked}
                    onChange={(check) => {
                        setReadChecked(check);
                    }}
                />

                <p className='agreement'>
                    {t('sign.read')}
                    <span onClick={() => openHtml('ServiceAgreement')}> {t('sign.service')} </span>
                    {t('sign.and')}
                    <span onClick={() => openHtml('PrivacyAgreement')}> {t('sign.privacy')} </span>
                </p>
            </div>
            <div className='item'>
                <Button onClick={() => resetPwd()}>{t('sign.reset')}</Button>
            </div>
            <div className='item'>
                <p className='to-login-text' onClick={() => navigate(`/login?mobile=${phone}&invite_verify_code=${invite_verify_code ? invite_verify_code : ''}`)}>{t('invitateLink.toLogin')}</p>
            </div>
        </div>
    )
};

export default FindPassword;