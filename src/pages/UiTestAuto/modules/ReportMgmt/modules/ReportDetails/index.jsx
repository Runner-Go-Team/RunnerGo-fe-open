import React, { useEffect, useMemo, useState } from 'react'
import './index.less';
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceGetReportDetail } from '@services/UiTestAuto/report';
import Header from './Header';
import SumCardList from './SumCardList';
import SceneInfo from './SceneInfo';
import { lastValueFrom } from 'rxjs';
import { isArray, isPlainObject } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

const ReportDetails = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const reportDetails = useSelector((store) => store?.uitest_auto?.reportDetails) || {};
  const initReportDetails = async (report_id) => {
    const resp = await lastValueFrom(ServiceGetReportDetail({
      report_id: report_id || id,
      team_id: sessionStorage.getItem('team_id')
    }));
    if (resp?.code == 0 && isPlainObject(resp?.data)) {
      dispatch({
        type: 'uitest_auto/seReportDetails',
        payload: resp.data,
        report_id
      })
    }
  }
  useEffect(()=>{
    if(isPlainObject(reportDetails?.[id])){
      setValue(reportDetails?.[id]);
    }
  },[reportDetails?.[id]])
  useEffect(() => {
    initReportDetails();
  }, [])

  const updateReportData = async (key, val) => {

  }
  const echartsOptions = {
    title: {
      text: <div>
        <div className="number"></div>
        <div className="des"></div>
      </div>,
      x: 'center',
      y: 'center',
      textStyle: {
        fontSize: 14,
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    series: [
      {
        name: '比例',
        type: 'pie',
        radius: ['40%', '60%'], // 控制内外半径，使其成为空心圆形
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1, name: 'a', itemStyle: { color: 'red' } },
          { value: 2, name: 'b', itemStyle: { color: 'green' } },
          { value: 3, name: 'c', itemStyle: { color: 'blue' } },
        ],
      },
    ],
  };
  return (
    <div className='runnergo-ui-test-report-detatils'>
      <Header value={value} setValue={setValue} initReportDetails={initReportDetails}/>
      <SumCardList value={value}/>
      <SceneInfo value={isArray(value?.scenes) ? value.scenes : []}/>
    </div>
  )
}
export default ReportDetails;