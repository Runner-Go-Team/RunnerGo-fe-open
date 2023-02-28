import React from 'react';
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
            title: '函数名称',
            dataIndex: 'name',
            width: 138
        },
        {
            title: '函数',
            dataIndex: 'func'
        },
        {
            title: '备注',
            dataIndex: 'desc'
        }
    ];
    const VarName = (props) => {
        const { name } = props;
        return (
            <div className={VarNameStyle}>
                <p>{name}</p>
                <SvgCopy onClick={() => copyStringToClipboard(name)} />
            </div>
        )
    }
    const data = [
        {
            name: "md5加密",
            func: <VarName name="md5(string)" />,
            desc: '{{__MD5(ABC)__}}, 加密字符串',
        },
        {
            name: "sha256加密",
            func: <VarName name="SHA256(string)" />,
            desc: '{{__SHA256(ABC)__}}, 加密字符串',
        },
        {
            name: "sha512加密",
            func: <VarName name="SHA512(string)" />,
            desc: '{{__SHA512(ABC)__}}, 加密字符串',
        },
        {
            name: "身份证号生成",
            func: <VarName name="IdCard(isEighteen, address, birthday, sex)" />,
            desc: <div>
                <p>{`{{__IdCard(true, 北京市, 2000, 1)__}}, 北京市男2000年出生18位身份证号。`}</p>
                <p>{`// IdCard 根据参数生成身份证号`}</p>
                <p>{`// isEighteen 是否生成18位号码`}</p>
                <p>{`// address 省市县三级地区官方全称: 如'北京市'、'台湾省'、'香港特别行政区'、'深圳市'、'黄浦区' `}</p>
                <p>{`// birthday 出生日期: 如 '2000'、'199801'、'19990101'`}</p>
                <p>{`// sex 性别: 1为男性, 0为女性`}</p>
            </div>,
        },
        {
            name: "随机生成身份证号",
            func: <VarName name="RandomIdCard()" />,
            desc: '{{__RandomIdCard()__}}, 随机身份证号',
        },
        {
            name: "身份证号校验",
            func: <VarName name="VerifyIdCard(cardId, strict)" />,
            desc: '{{__VerifyIdCard(231231, true)}}, 结果: false',
        },
        {
            name: "改变字符串大小写",
            func: <VarName name="ToStringLU(str, option string)" />,
            desc: '{{__ToStringLU(abc, L)__}}, 全部小写',
        },
        {
            name: "随机数生成(整数)",
            func: <VarName name="RandomInt(start,  end)" />,
            desc: '{{__RandomInt(start, end)__}}, 随机生成start-end之间的整数',
        },
        {
            name: "随机数生成(小数)",
            func: <VarName name="RandomFloat0()" />,
            desc: '{{__RandomFloat0()__}}, 随机生成0-1之间的小数',
        },
        {
            name: "随机数生成(字符串)",
            func: <VarName name="RandomString(num int)" />,
            desc: '{{__RandomString(5)__}}, 随机生成5位由a-z、0-9、A-Z之间英文字组成的字符串',
        },
        {
            name: "生成uuid",
            func: <VarName name="Uuid()" />,
            desc: '{{__GetUUid()__}}, 随机生成uuid',
        },
        {
            name: "时间戳",
            func: <VarName name="ToTimeStamp(option)" />,
            desc: 
            <div>
                <p>{`{{__ToTimeStamp(s)__}}, 生成秒级时间戳字符串`}</p>
                <p>{`option: s, ms, ns, ws; 分别是秒; 毫秒; 纳秒; 微秒`}</p>
            </div>,
        },
    ];

    const HeaderTitle = () => {
        return (
            <div className={HeaderTitleStyle}>
                <p className='header-title'>{ t('header.commonFunc')}</p>
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