import React, { useState, useEffect } from "react";
import './index.less';
import { getBezierPath, getSmoothStepPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import cn from 'classnames';
import { useDispatch } from 'react-redux';

const CustomEdge = (props) => {
    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        borderRadius = 3,
        style = {},
        data,
        arrowHeadType,
        markerEndId,
    } = props;

    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius
    });

    const [click, setClick] = useState(false);
    const dispatch = useDispatch();


    useEffect(() => {
        document.addEventListener('click', (e) => clickOutSide(e));

        return () => {
            document.removeEventListener('click', (e) => clickOutSide(e));
        }
    }, []);

    const clickOutSide = (e) => {
        let _path = document.querySelector('.click');

        if (_path && !_path.contains(e.target)) {
            setClick(false);
        }
    }


    const handleContextMenu = (e) => {
        e.preventDefault();

        const x = e.clientX;
        const y = e.clientY;
        const rightMenu = document.getElementsByClassName('scene-right-menu')[0];
        rightMenu.style.display = 'block';
        rightMenu.style.left = x - 350 + 'px'; // 设置弹窗位置
        rightMenu.style.top = y - 100 + 'px';
        if (e.target.classList[0] === id) {

            dispatch({
                type: 'case/updateEdgeRight',
                payload: id
            })
            setClick(true);
        }
        document.onclick = function () {
            rightMenu.style.display = 'none';
            setClick(false);

            dispatch({
                type: 'case/updateEdgeRight',
                payload: ''
            })
        }
    }

    useEffect(() => {
        const pathDoms = document.getElementsByClassName('react-flow__edge-path');
        pathDoms.forEach(item => {
            item.addEventListener('contextmenu', handleContextMenu);
        });
        return () => {
            pathDoms.forEach(item => {
                item.removeEventListener('contextmenu', handleContextMenu);
            })
        }
    }, [id]);

    return (
        <>
            <path
                id={id}
                style={style}
                className={cn(`${id}`, 'react-flow__edge-path', {
                    click: click
                })}
                d={edgePath}
                onClick={(e) => setClick(true)}
                markerEnd={markerEnd}
            />
        </>
    );
};

export default CustomEdge;