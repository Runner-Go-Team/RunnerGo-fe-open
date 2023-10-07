import React from 'react'
import './result.less';
import { isArray } from 'lodash';
import ResultItem from './resultItem';

const StepResult = (props) => {
  const { value } = props;

  return (
    <div className='step-result'>
      {value?.is_multi && isArray(value?.multi_result) && value.multi_result.length > 0 ? (<>
      {value.multi_result.map((item,index)=>(<>
      <div className="title">{`第${index + 1}次循环`}</div>
      <ResultItem value={item}/>
      </>))}
      </>) : <ResultItem value={value}/>}
    </div>
  )
}
export default StepResult;
