import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import { Scale } from 'adesign-react';
import GenerateCode from '@components/GenerateCode';
import FooterToolbar from '@components/Footer';
import InfoPanel from './infoPanel';
import UrlPanel from './urlPanel';
import { ApiHeaderWrapper } from '../../style';
import { ApisWrapper } from './style';
import ApisContent from './apisContent';

const { ScaleItem, ScalePanel } = Scale;
const defaultLayouts = {
    0: {
        width: 312,
        height: 200,
    },
    1: {
        flex: 1,
    },
};

const ApiManage = (props) => {
    const { data, tempData, onChange, showInfo = true, apiInfo, from, showAssert } = props;
    // 调整scale
    const [codeVisible, setCodeVisible] = useState(false);
    const [saveId, setSaveId] = useState(null);


    useEffect(() => {
        setSaveId(null);
    }, []);

    return (
        <ApisWrapper>
            <div className={ApiHeaderWrapper}>
                {showInfo && <InfoPanel
                    data={data}
                    onChange={onChange}
                    from={from}
                    onSave={(e) => setSaveId(e)}
                    showGenetateCode={() => {
                        setCodeVisible(true);
                    }}
                />}
                <UrlPanel saveId={saveId} from={from} data={showInfo ? data : apiInfo} tempData={tempData} onChange={onChange} />
            </div>
            <ApisContent style={{ marginTop: '10px' }} from={from} data={showInfo ? data : apiInfo} onChange={onChange} tempData={tempData} showAssert={showAssert} />
            {codeVisible && (
                <GenerateCode
                    data={data}
                    onCancel={() => {
                        setCodeVisible(false);
                    }}
                ></GenerateCode>
            )}
        </ApisWrapper>
    );
};

export default ApiManage;
