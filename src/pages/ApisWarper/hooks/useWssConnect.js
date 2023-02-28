/* eslint-disable react-hooks/rules-of-hooks */
import { useDispatch, useSelector } from 'react-redux';
import scoketClient from 'socket-client-apipost';

// 用于socket
const useWssConnect = () => {
    const dispatch = useDispatch();
    // 连接
    const socketConnect = async (socket) => {
        const client = new scoketClient('ws', socket); // 建立连接
        client.onconnect(() => {
            dispatch({
                type: 'opens/updateWebsocket',
                id: socket.target_id,
                payload: { status: 'connect' },
            });
        });
        client.onclose(() => {
            dispatch({
                type: 'opens/updateWebsocket',
                id: socket.target_id,
                payload: { status: 'close' },
            });
        });
        client.onerror(() => {
            dispatch({
                type: 'opens/updateWebsocket',
                id: socket.target_id,
                payload: { status: 'close' },
            });
        });
        dispatch({
            type: 'opens/updateWebsocket',
            id: socket.target_id,
            payload: { client },
        });
        // scoket.send('hello'); // 发现消息
    };
    return {
        socketConnect,
    };
};

export default useWssConnect;
