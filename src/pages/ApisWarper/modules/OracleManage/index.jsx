import React, { useEffect, useState, useRef } from "react";
import './index.less';

import ScalePanelTwoItem from "@components/ScalePanelTwoItem";

import OracleHeader from "./OracleHeader";
import OracleRequest from "./OracleRequest";
import OracleResponse from "./OracleResponse";

const OracleManage = (props) => {
    const { data, onChange } = props;
    const scaleRef = useRef(null);
    const wrapperRef = useRef(null);

    return (
        <div className="sql-manage-detail">
            <OracleHeader data={data} onChange={onChange} />
            <div style={{ flex: 1 }} ref={wrapperRef}>
                <ScalePanelTwoItem
                    ref={scaleRef}
                    direction={-1}
                    refWrapper={wrapperRef}
                    leftMin={<></>}
                    left={
                        <OracleRequest data={data} onChange={onChange} />
                    }
                    rightMin={<></>}
                    right={
                        <OracleResponse />
                    }
                />
            </div>
        </div>
    )
};

export default OracleManage;