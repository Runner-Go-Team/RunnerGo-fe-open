import React, { useEffect, useState } from "react";
import './index.less';
import { Select, Button, Input } from '@arco-design/web-react';
import { fetchEnvMysqlInfo } from '@services/apis';
import Bus from '@utils/eventBus';
import { Message } from 'adesign-react';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const OracleDbInfo = (props) => {
    const { data: { oracle_detail: { oracle_database_info }, env_info: { env_id, database_id } }, onChange } = props;

    const { t } = useTranslation();
    const [dbList, setDbList] = useState(null);
    // 数据库id
    const [selectDbId, setSelectDbId] = useState(0);
    // 名称
    const [serverName, setServerName] = useState('');
    // 数据库名称
    const [dbName, setDbName] = useState('');
    // IP地址
    const [ip, setIP] = useState('');
    // 端口号
    const [port, setPort] = useState(null);
    // 用户名
    const [user, setUser] = useState('');
    // 密码
    const [password, setPassword] = useState('');
    // 编码集
    const [charset, setCharset] = useState('utf8mb4');
    // 连接测试数据库的状态
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (oracle_database_info) {
            const { server_name, db_name, host, port, user, password, charset } = oracle_database_info;
            setServerName(server_name);
            if (!database_id) {
                setDbName(db_name);
                setIP(host);
                port && setPort(port);
                setUser(user);
                setPassword(password);
                charset && setCharset(charset);
                setSelectDbId(database_id);
            }
        }
    }, [oracle_database_info, database_id]);


    useEffect(() => {
        if (env_id > 0) {
            const params = {
                team_id: localStorage.getItem('team_id'),
                env_id,
            };

            fetchEnvMysqlInfo(params).subscribe({
                next: (res) => {
                    const { code, data } = res;
                    if (code === 0) {
                        setDbList(data ? data.filter(item => item.type === 'oracle') : []);
                        if (data) {
                            const item = data.find(item => item.server_name === serverName);
                            if (item) {
                                const { server_name, db_name, host, port, user, password, mysql_id, charset } = item;

                                setServerName(server_name);
                                onChange('oracle_server_name', server_name);
                                setDbName(db_name);
                                onChange('oracle_db_name', db_name);
                                setIP(host);
                                onChange('oracle_host', host);
                                if (port) {
                                    setPort(port);
                                    onChange('oracle_port', port);
                                }
                                setUser(user);
                                onChange('oracle_user', user);
                                setPassword(password);
                                onChange('oracle_password', password);
                                charset && setCharset(charset) && onChange('oracle_charset', charset);;
                                setSelectDbId(mysql_id);
                            }
                        }
                    }
                }
            })
        }
    }, [env_id, serverName]);

    const connectTest = () => {
        setLoading(true);
        const params = {
            type: 'oracle',
            host: ip,
            user,
            password,
            port,
            db_name: dbName,
            charset
        }
        Bus.$emit('connectTestDB', params, (code, data) => {
            if (code === 0) {
                Message('success', t('message.connectTestSuccess'));
            }
            setLoading(false);
        });
    }

    return (
        <div className="sql-db-info">
            <div className="sql-db-info-header">
                <div className="sql-db-info-header-left">
                    <p className="title">{t('apis.connectDb')}</p>
                    <div className="select-db">
                        <p className="label">{t('apis.selectDb')}：</p>
                        <Select placeholder={t('placeholder.selectDb')} value={
                            (dbList && dbList.findIndex(item => item.mysql_id === selectDbId) !== -1) ? selectDbId : serverName
                        } onChange={(e) => {
                            setSelectDbId(e);
                            onChange('oracle_database_id', e);
                            const dbInfo = dbList.find(item => item.mysql_id === e);
                            const { server_name, db_name, host, port, user, password, charset } = dbInfo;
                            setServerName(server_name);
                            onChange('oracle_server_name', server_name);
                            setDbName(db_name);
                            onChange('oracle_db_name', db_name);
                            setIP(host);
                            onChange('oracle_host', host);
                            setPort(port);
                            onChange('oracle_port', port);
                            setUser(user);
                            onChange('oracle_user', user);
                            setPassword(password);
                            onChange('oracle_password', password);
                            setCharset(charset);
                            onChange('oracle_charset', charset);
                        }}>
                            {
                                dbList && dbList.map(item => (
                                    <Option key={item.mysql_id} value={item.mysql_id}>
                                        {item.server_name}
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>
                <div className="sql-db-info-header-right">
                    <Button loading={loading} onClick={() => connectTest()}>{t('apis.connectTest')}</Button>
                </div>
            </div>
            <div className="sql-db-info-container">
                <p className="title">{t('apis.databaseConnectInfo')}</p>

                <div className="item">
                    <p className="label">{t('apis.dbDiyName')}：</p>
                    <Input placeholder={t('placeholder.diyName')} disabled={selectDbId} value={serverName} onChange={(e) => {
                        setServerName(e);
                        onChange('oracle_server_name', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.dbName')}：</p>
                    <Input placeholder={t('placeholder.dbName')} disabled={selectDbId} value={dbName} onChange={(e) => {
                        setDbName(e);
                        onChange('oracle_db_name', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.ip')}：</p>
                    <Input placeholder={t('placeholder.dbIP')} disabled={selectDbId} value={ip} onChange={(e) => {
                        setIP(e);
                        onChange('oracle_host', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.port')}：</p>
                    <Input placeholder={t('placeholder.dbPort')} disabled={selectDbId} value={port} onChange={(e) => {
                        setPort(parseInt(e));
                        onChange('oracle_port', parseInt(e));
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.user')}：</p>
                    <Input placeholder={t('placeholder.dbUser')} disabled={selectDbId} value={user} onChange={(e) => {
                        setUser(e);
                        onChange('oracle_user', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.pwd')}：</p>
                    <Input placeholder={t('placeholder.dbPwd')} disabled={selectDbId} value={password} onChange={(e) => {
                        setPassword(e);
                        onChange('oracle_password', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.charset')}：</p>
                    <Input placeholder={t('placeholder.dbCharset')} disabled={selectDbId} value={charset} onChange={(e) => {
                        setCharset(e);
                        onChange('oracle_charset', e);
                    }} />
                </div>

            </div>
        </div>
    )
};

export default OracleDbInfo;