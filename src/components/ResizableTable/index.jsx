import React, { useState, useEffect, forwardRef } from "react";
import './index.less';
import { Table } from '@arco-design/web-react';
import { Resizable } from 'react-resizable';

// 封装arco table实现列可拖拽

const CustomResizeHandle = forwardRef((props, ref) => {
    const { handleAxis, ...restProps } = props;
    return (
        <span
            ref={ref}
            className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
            {...restProps}
            onClick={(e) => {
                e.stopPropagation();
            }}
        />
    )
});

const ResizableTitle = (props) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th { ...restProps } />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={<CustomResizeHandle />}
            onResize={onResize}
            draggableOpts={{
                enableUserSelectHack: false
            }}
        >
            <th {...restProps} />
        </Resizable>
    )
}

const ResizableTable = (props) => {
    const { columns: _columns, className, ...restProps } = props;

    const [columns, setColumns] = useState(
        _columns.map((column, index) => {
            if (column.width) {
                return {
                    ...column,
                    onHeaderCell: (col) => ({
                        width: col.width,
                        onResize: handleResize(index),
                    }),
                }
            }

            return column;
        })
    );

    function handleResize(index) {
        return (e, { size }) => {
          setColumns((prevColumns) => {
            const nextColumns = [...prevColumns];
            nextColumns[index] = { ...nextColumns[index], width: size.width };
            return nextColumns;
          });
        };
    }

    const components = {
        header: {
          th: ResizableTitle,
        },
    };
    
    return (
        <Table 
            { ...restProps }
            className={`table-demo-resizable-column ${className}`}
            components={components}
            columns={columns}
        />
    )
};

export default ResizableTable;