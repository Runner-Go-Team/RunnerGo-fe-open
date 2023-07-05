import React, { useEffect, useState, useRef } from "react";
import './index.less';

import ScalePanelTwoItem from "@components/ScalePanelTwoItem";
import SqlHeader from "./SqlHeader";
import SqlRequest from "./SqlRequest";
import SqlResponse from "./SqlResponse";



const SqlManage = (props) => {
    const { data, onChange, apiInfo, showInfo = true, from = 'apis' } = props;
    const scaleRef = useRef(null);
    const wrapperRef = useRef(null);

    return (
        <div className="sql-manage-detail">
            {
                showInfo ? <SqlHeader data={showInfo ? data : apiInfo} onChange={onChange} /> : <></>
            }
            <div style={{ flex: 1 }} ref={wrapperRef}>
                <ScalePanelTwoItem
                    ref={scaleRef}
                    direction={-1}
                    refWrapper={wrapperRef}
                    leftMin={<></>}
                    left={
                        <SqlRequest data={showInfo ? data : apiInfo} onChange={onChange} from={from} />
                    }
                    rightMin={<></>}
                    right={
                        <SqlResponse from={from} data={showInfo ? data : apiInfo} />
                    }
                />
            </div>
        </div>
    )
};

export default SqlManage;