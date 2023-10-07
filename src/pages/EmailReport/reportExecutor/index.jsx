import React, { useRef, useState, useEffect } from 'react';
import './index.less';
import avatar from '@assets/logo/avatar.png';
import { Button, Dropdown, Message } from 'adesign-react';
import { Down as SvgDown } from 'adesign-react/icons';
import dayjs from 'dayjs';
import { fetchSetDebug, fetchEmailGetDebug } from '@services/report';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import qs from 'qs';
import { useSelector } from 'react-redux';


const ReportExecutor = (props) => {
    const { data: { user_avatar, user_name, created_time_sec }, onStop, status, runTime } = props;
    const { t } = useTranslation(); 
    const DropRef = useRef(null);
    const [debugName, setDebugName] = useState(t('report.debugList.0'));
    const [stop, setStop] = useState(false);
    // const { id: report_id } = useParams();
    const { search } = useLocation();
    const { report_id, contrast } = qs.parse(search.slice(1));
    
    const select_plan = useSelector((store) =>(store.plan.select_plan));

    useEffect(() => {
        const query = {
            report_id: report_id ? report_id : JSON.parse(contrast)[select_plan].report_id,
            team_id: sessionStorage.getItem('team_id')
        };
        fetchEmailGetDebug(query).subscribe({
            next: (res) => {
                const { data } = res;

                const itemList = {
                    'stop': [t('report.debugList.0')],
                    'all': [t('report.debugList.1')],
                    'only_error': [t('report.debugList.2')],
                    'only_success': [t('report.debugList.3')]
                }

                setDebugName(itemList[data])
            }
        })
    }, [select_plan]);
    
    
    const DropContent = () => {
        const list = [t('report.debugList.0'), t('report.debugList.1'), t('report.debugList.2'), t('report.debugList.3')];
        return (
            <div className='drop-debug'>
                { list.map(item => <p onClick={() => {
                    setDebugName(item);
                    const itemList = {
                        [t('report.debugList.0')]: 'stop',
                        [t('report.debugList.1')]: 'all',
                        [t('report.debugList.2')]: 'only_error',
                        [t('report.debugList.3')]: 'only_success',
                    };
                    DropRef.current.setPopupVisible(false);
                    const params = {
                        team_id: sessionStorage.getItem('team_id'),
                        report_id: parseInt(report_id ? report_id : JSON.parse(contrast)[select_plan].report_id),
                        setting: itemList[item]
                    };
                    fetchSetDebug(params).subscribe({
                        next: (res) => {
                            const { code } = res;
                            if (code === 0) {
                                Message('success', t('message.setSuccess'));
                                onStop(itemList[item]);
                            } else {
                                Message('error', t('message.setError'));
                            }
                        }
                    })
                }}>{ item }</p>) }
            </div>
        )
    }

    return (
        <div className='email-report-executor'>
            <p>{ t('report.performer') }:</p>
            <div className='executor-info'>
                <img className='avatar' src={user_avatar || avatar} />
                <p>{ user_name }</p>
            </div>
            <p className='create-time'>{ t('report.createTime') }: { dayjs(created_time_sec * 1000).format('YYYY-MM-DD HH:mm:ss') }</p>
            {/* <p className='last-time'>最后修改时间: 2022-12-22 03:22</p> */}
            <p className='run-time'>{ t('report.runTime') }: {runTime}s</p>
            {/* <Dropdown
                ref={DropRef}
                content={
                    <div>
                        <DropContent />
                    </div>
                }
            >
                <Button className='close-debug' afterFix={<SvgDown />} type='primary' disabled={status === 2}>{ debugName }</Button>
            </Dropdown> */}
        </div>
    )
};

export default ReportExecutor;