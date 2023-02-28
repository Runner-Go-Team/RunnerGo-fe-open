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
        data: { from },
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

    // const scene_edges = useSelector((store) => store.scene.edges);
    // const plan_edges = useSelector((store) => store.plan.edges);

    // useEffect(() => {
    //     document.addEventListener('click', (e) => clickOutSide(e));

    //     return () => {
    //         document.removeEventListener('click', (e) => clickOutSide(e));
    //     }
    // }, []);

    // const clickOutSide = (e) => {
    //     let _path = document.querySelector('.click');

    //     if (_path && !_path.contains(e.target)) {
    //         setClick(false);
    //     }
    // }

    const clickOutSide = () => {
        const rightMenu = document.getElementsByClassName('scene-right-menu')[0];
        rightMenu.style.display = 'none';
        setClick(false);

        if (from === 'scene') {
            dispatch({
                type: 'scene/updateEdgeRight',
                payload: ''
            })
        } else if (from === 'plan') {
            dispatch({
                type: 'plan/updateEdgeRight',
                payload: ''
            })
        } else if (from === 'auto_plan') {
            dispatch({
                type: 'auto_plan/updateEdgeRight',
                payload: ''
            })
        } else if (from === 'case') {
            dispatch({
                type: 'case/updateEdgeRight',
                payload: ''
            })
        }
    }

    const handleContextMenu = (e) => {
        e.preventDefault();
        // 450 100 scene
        // 500 200 plan auto_plan
        // 670 200 case
        
        let ix, iy;

        if (from === 'scene') {
            ix = 450;
            iy = 100;
        } else if (from === 'plan' || from === 'auto_plan') {
            ix = 500;
            iy = 200;
        } else if (from === 'case') {
            ix = 670;
            iy = 200;
        }

        const x = e.clientX;
        const y = e.clientY;
        const rightMenu = document.getElementsByClassName('scene-right-menu')[0];
        rightMenu.style.display = 'block';
        rightMenu.style.left = x - ix + 'px'; // 设置弹窗位置
        rightMenu.style.top = y - iy + 'px';
        if (e.target.classList[0] === id) {

            if (from === 'scene') {
                dispatch({
                    type: 'scene/updateEdgeRight',
                    payload: id
                })
            } else if (from === 'plan') {
                dispatch({
                    type: 'plan/updateEdgeRight',
                    payload: id
                })
            } else if (from === 'auto_plan') {
                dispatch({
                    type: 'auto_plan/updateEdgeRight',
                    payload: id
                })
            } else if (from === 'case') {
                dispatch({
                    type: 'case/updateEdgeRight',
                    payload: id
                })
            }


            setClick(true);
        }

        document.addEventListener('click', clickOutSide);
        
        // document.onclick = function () {
        //     rightMenu.style.display = 'none';
        //     setClick(false);

        //     if (from === 'scene') {
        //         dispatch({
        //             type: 'scene/updateEdgeRight',
        //             payload: ''
        //         })
        //     } else if (from === 'plan') {
        //         dispatch({
        //             type: 'plan/updateEdgeRight',
        //             payload: ''
        //         })
        //     } else if (from === 'auto_plan') {
        //         dispatch({
        //             type: 'auto_plan/updateEdgeRight',
        //             payload: ''
        //         })
        //     } else if (from === 'case') {
        //         dispatch({
        //             type: 'case/updateEdgeRight',
        //             payload: ''
        //         })
        //     }
        // }
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

    useEffect(() => {
        
        return () => {
            document.removeEventListener('click', clickOutSide);
        }
    }, [])

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