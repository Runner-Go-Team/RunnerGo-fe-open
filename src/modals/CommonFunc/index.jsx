import React, { useState, useEffect } from 'react';
import { Modal } from 'adesign-react';
import { Copy as SvgCopy } from 'adesign-react/icons';
import { CommonFunctionModal, HeaderTitleStyle, VarNameStyle } from './style';
import { copyStringToClipboard } from '@utils';
import { useTranslation } from 'react-i18next';
import { Table } from '@arco-design/web-react';

const CommonFunction = (props) => {
    const { onCancel } = props;
    const { t } = useTranslation();
    const columns = [
        {
            title: t('modal.function'),
            dataIndex: 'function',
            width: 138
        },
        {
            title: t('modal.functionName'),
            dataIndex: 'function_name',
            render: (col, item, index) => (
                <div className={VarNameStyle}>
                    <p>{col}</p>
                    <SvgCopy onClick={() => copyStringToClipboard(col)} />
                </div>
            )
        },
        {
            title: t('modal.remark'),
            dataIndex: 'remark'
        }
    ];

    const data = [
        {
            function: 'md5(string)',
            function_name: 'md5加密',
            remark: '{{__MD5(ABC)__}}, 加密字符串'
        },
        {
            function: 'SHA256(string)',
            function_name: 'sha256加密',
            remark: '{{__SHA256(ABC)__}}, 加密字符串'
        },
        {
            function: 'SHA512(string)',
            function_name: 'sha512加密',
            remark: '{{__SHA512(ABC)__}}, 加密字符串'
        },
        {
            function: 'IdCard(isEighteen, address, birthday, sex)',
            function_name: '身份证号生成',
            remark: "{{__IdCard(true, 北京市, 2000, 1)__}}, 北京市男2000年出生18位身份证号。 IdCard 根据参数生成身份证号。 isEighteen 是否生成18位号码。 address 省市县三级地区官方全称: 如'北京市'、'台湾省'、'香港特别行政区'、'深圳市'、'黄浦区'。 birthday 出生日期: 如 '2000'、'199801'、'19990101'。 sex 性别: 1为男性, 0为女性。",
        },
        {
            function: 'RandomIdCard()',
            function_name: '随机生成身份证号',
            remark: '{{__RandomIdCard()__}}, 随机身份证号'
        },
        {
            function: 'VerifyIdCard(cardId, strict)',
            function_name: '身份证号校验',
            remark: '{{__VerifyIdCard(231231, true)}}, 结果: false'
        },
        {
            function: '{{__VerifyIdCard(231231, true)}}, 结果: false',
            function_name: '改变字符串大小写',
            remark: '{{__ToStringLU(abc, L)__}}, 全部小写'
        },
        {
            function: 'RandomInt(start, end)',
            function_name: '随机数生成(整数)',
            remark: '{{__RandomInt(start, end)__}}, 随机生成start-end之间的整数'
        },
        {
            function: 'RandomFloat0()',
            function_name: '随机数生成(小数)',
            remark: '{{__RandomFloat0()__}}, 随机生成0-1之间的小数'
        },
        {
            function: 'RandomString(num int)',
            function_name: '随机数生成(字符串)',
            remark: '{{__RandomString(5)__}}, 随机生成5位由a-z、0-9、A-Z之间英文字组成的字符串'
        },
        {
            function: 'Uuid()',
            function_name: '生成uuid',
            remark: '{{__GetUUid()__}}, 随机生成uuid'
        },
        {
            function: 'ToTimeStamp(option)',
            function_name: '时间戳',
            remark: '{{__ToTimeStamp(s)__}}, 生成秒级时间戳字符串 option: s, ms, ns, ws; 分别是秒; 毫秒; 纳秒; 微秒'
        },
        {
            function: 'ToStandardTime(options int)',
            function_name: '标准时间格式',
            remark: '{{__ToStandardTime(0)__}},0,1,2,3,4,5,6,7,8,9,10, 默认为0'
        }
    ];


    const HeaderTitle = () => {
        return (
            <div className={HeaderTitleStyle}>
                <p className='header-title'>{t('header.commonFunc')}</p>
            </div>
        )
    }

    return (
        <Modal className={CommonFunctionModal} visible={true} title={<HeaderTitle />} footer={null} onCancel={onCancel} >
            <Table borderCell columns={columns} data={data} pagination={false} />
        </Modal>
    )
};

export default CommonFunction;
