import React from 'react';
import cn from 'classnames';
import { Button } from 'adesign-react';
import { useNavigate } from 'react-router-dom';
import DesignManage from './modules/DesignManage';

const DesignPanel = (props) => {
    const { tabsList, activeId } = props;

    const navigate = useNavigate();

    const handleGoRun = () => {
        navigate('/apis/run');
    };

    const renderElement = (data) => {
        const target_type = data?.target_type;
        if (target_type === 'api') {
            return <DesignManage data={data} />;
        }
        return (
            <div className="api-design-empty">
                <em>" API设计 " 功能当前仅支持 HTTP 类型接口，您可以直接去调试</em>
                <Button className="apipost-blue-btn" onClick={handleGoRun}>
                    点此去调试
                </Button>
            </div>
        );
    };

    return (
        <>
            {tabsList.map((item, index) => (
                <div
                    key={index}
                    className={cn('tab-content-item', {
                        active: item?.id === activeId,
                    })}
                >
                    {renderElement(item?.data)}
                </div>
            ))}
        </>
    );
};

export default React.memo(DesignPanel);
