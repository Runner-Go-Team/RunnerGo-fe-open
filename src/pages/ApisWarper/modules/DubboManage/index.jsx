import React, { useState, useEffect, useRef } from "react";
import './index.less';
import DubboHeader from "./DubboHeader";
import DubboRequest from "./DubboRequest";
import DubboResponse from "./DubboResponse";
import ScalePanelTwoItem from "@components/ScalePanelTwoItem";

const DubboManage = (props) => {
    const { data, onChange } = props;
    const scaleRef = useRef(null);
    const wrapperRef = useRef(null);

    return (
        <div className="dubbo-manage">
            <DubboHeader data={data} onChange={onChange} />
            <div style={{ flex: 1 }} ref={wrapperRef}>
                <ScalePanelTwoItem
                    ref={scaleRef}
                    direction={-1}
                    refWrapper={wrapperRef}
                    leftMin={<></>}
                    left={
                        <DubboRequest data={data} onChange={onChange} />
                    }
                    rightMin={<></>}
                    right={
                        <DubboResponse />
                    }
                />
            </div>
        </div>
    )
};

export default DubboManage;