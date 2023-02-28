import React, { useState, ReactNode } from 'react';
import { CaretRight as CaretRightSvg, CaretDown as CaretDownSvg } from 'adesign-react/icons';
import cn from 'classnames';
import './index.less';

const MultiLevel = (props) => {
    const { title, children, className, preFix, showDefaultIcon = true } = props;

    const [showContent, setShowContent] = useState(false);

    return (
        <div className={cn('apipost-level', className)}>
            <div
                className="apipost-level-title"
                onClick={() => {
                    setShowContent(!showContent);
                }}
            >
                {showDefaultIcon && (
                    <>
                        {showContent ? (
                            <CaretDownSvg calssname="title-svg" wdith="14px" height="16px" />
                        ) : (
                            <CaretRightSvg calssname="title-svg" wdith="14px" height="16px" />
                        )}
                    </>
                )}
                {preFix && <span>{preFix}</span>}
                {title}
            </div>
            {showContent && <div>{children}</div>}
        </div>
    );
};

export default MultiLevel;
