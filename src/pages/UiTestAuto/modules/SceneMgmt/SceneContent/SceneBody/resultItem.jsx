import React, { useEffect, useState } from 'react'
import FullScreenComp from '@components/FullScreenComp'
import cn from 'classnames';
import { RD_BASE_URL } from '@config'
import './result.less';
import { isArray, isNumber, isPlainObject } from 'lodash';
import { copyStringToClipboard, isJSON } from '@utils'
import { Tabs, Tooltip } from '@arco-design/web-react';

const TabPane = Tabs.TabPane;
const ResultItem = (props) => {
  const { value } = props;
  const [fullSceen, setFullSceen] = useState(false);
  const { exec_time, msg, screenshot, screenshot_url, status, assertions, withdraws } = value || {};
  const [asserts, setAsserts] = useState(assertions || []);
  useEffect(() => {
    setAsserts(assertions || []);
  }, [assertions]);

  const getwithdrawsValue= (data)=>{
    try {
      if(isPlainObject(data)){
        return JSON.stringify(data)
      }else if(isArray(data)){
        return JSON.stringify(data)
      }else if(isNumber(data)){
        return String(data)
      }
      return String(data) || ''
    } catch (error) {}
    return ''
  }


  return (
    <>
      <div className="step-result-item">
        <label>耗时：</label>
        <div className="content">{`${exec_time ? parseFloat(exec_time.toFixed(2)) : 0}秒`}</div>
      </div>
      <div className="step-result-item">
        <label>状态：</label>
        <div className="content">{status == 'success' ? '成功' : (status == 'failed' ? '失败' : '未执行')}</div>
      </div>
      {status == 'failed' && <div className="step-result-item">
        <label>失败原因：</label>
        <div className="content">{msg || ''}</div>
      </div>}
      <div className="line"></div>
      <div className="screens-hot">
        <div className="title">截图</div>
        {(screenshot || screenshot_url) && (
          <>
            {fullSceen ? <FullScreenComp hideTitle={true} onChange={() => setFullSceen(false)}>
              <img onClick={() => setFullSceen(!fullSceen)} src={screenshot_url ? `${RD_BASE_URL}${screenshot_url}` : `data:image/png;base64,${screenshot}`} />
            </FullScreenComp> : <img onClick={() => setFullSceen(!fullSceen)} src={screenshot_url ? `${RD_BASE_URL}${screenshot_url}` : `data:image/png;base64,${screenshot}`} />}
          </>
        )}
      </div>

      <Tabs defaultActiveTab={isArray(asserts) && asserts.length > 0 ? '1' : '2'}>
        {isArray(asserts) && asserts.length > 0 && (
          <TabPane key='1' title='断言结果'>
            <div className='assert-list'>
              {asserts.map((item, index) => (<div className='assert-item'>
                <div className='title'>
                  <div className="left">
                    <label>{item?.name}:</label>
                    <div className={cn('status', {
                      success: item?.status,
                      failed: !item?.status
                    })}>{item?.status ? '成功' : '失败'}</div>
                  </div>
                  {item?.msg && (<div className="right" onClick={() => {
                    const newArray = [...asserts];
                    let newItem = newArray[index];
                    newArray[index] = { ...newItem, open: !newItem?.open };
                    setAsserts(newArray)
                  }}>{item?.open ? '收起' : '查看原因'}</div>)}
                </div>
                {item?.msg && item?.open && <div className='failed-reason'>
                  <label>失败原因:</label>
                  <div className='text'>{item?.msg || ''}</div>
                </div>}
              </div>))}
            </div>
          </TabPane>
        )}
        {isArray(withdraws) && withdraws.length > 0 && (
          <TabPane key='2' title='提取结果'>
            <div className='withdraws-list'>
              {withdraws.map(item => (
                <div className='withdraws-item'>
                  <Tooltip position='top' trigger='hover' content={'点击复制文本'}>
                    <div className="key" onClick={()=>copyStringToClipboard(item?.key,true)}>{item?.key || ''}:</div>
                  </Tooltip>
                  <Tooltip position='top' trigger='hover' content={'点击复制文本'}>
                    <div className="value"  onClick={()=>copyStringToClipboard(getwithdrawsValue(item?.value),true)}>{getwithdrawsValue(item?.value)}</div>
                  </Tooltip>
                </div>
              ))}
            </div>
          </TabPane>
        )}

      </Tabs>
    </>
  )
}
export default ResultItem;
