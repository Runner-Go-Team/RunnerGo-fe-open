import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { Scale } from 'adesign-react';
import GenerateCode from '@components/GenerateCode';
import FooterToolbar from '@components/Footer';
import InfoPanel from './infoPanel';
import UrlPanel from './urlPanel';
import { ApisWrapper, ApiHeaderWrapper } from './style';
import ApisContent from './apisContent';

const MockManage = (props) => {
    const { data, tempData, onChange, showInfo = true, apiInfo, from, showAssert } = props;
    
    return (
        <ApisWrapper>
            <div className={ApiHeaderWrapper}>
                {showInfo && <InfoPanel
                    data={data}
                    onChange={onChange}
                    from={from}
                />}
                <UrlPanel from={from} data={showInfo ? data : apiInfo} tempData={tempData} onChange={onChange} />
            </div>
            <ApisContent style={{ marginTop: '10px' }} from={from} data={showInfo ? data : apiInfo} onChange={onChange} tempData={tempData} showAssert={showAssert} />
        </ApisWrapper>
    );
};

export default MockManage;
