import React from 'react';
import { isNumber, isUndefined } from 'lodash';
import SuccessPanel from './success';
import ErrorPanel from './error';

const TestResult = (props) => {
  const isAllPassed =
    isNumber(props?.assert?.failure) &&
    props.assert.failure === 0 &&
    isNumber(props?.http?.failure) &&
    props.http.failure === 0;
  return (
    <div className="test-result">
      <div className="result-title">执行结果</div>
      {!isUndefined(props?.http) && !isUndefined(props?.assert) && (
        <>{isAllPassed ? <SuccessPanel {...props} /> : <ErrorPanel {...props} />}</>
      )}
    </div>
  );
};

export default TestResult;
