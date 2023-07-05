import React, { useEffect, useState } from "react";
import './index.less';
import { Select, Button, Input } from '@arco-design/web-react';
import { fetchEnvMysqlInfo } from '@services/apis';
import Bus from '@utils/eventBus';
import { Message } from 'adesign-react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const { Option } = Select;

const SqlDbInfo = (props) => {
    const { data: { method, sql_detail = {}, env_info = {} }, onChange, from } = props;

    console.log(props);

    const { sql_database_info = {} } = sql_detail;
    const { env_id, server_name } = env_info;

    const { t } = useTranslation();
    const [dbList, setDbList] = useState([]);
    // 连接测试数据库的状态
    const [loading, setLoading] = useState(false);

    const scene_env_id = useSelector((store) => store.env.scene_env_id);

    const sqlToMethod = {
        'MySQL': 'mysql',
        'ORACLE': 'oracle',
        'PgSQL': 'postgresql'
    }


    useEffect(() => {
        if (from === 'apis' ? (env_id > 0) : (scene_env_id > 0)) {
            const params = {
                team_id: localStorage.getItem('team_id'),
                env_id: from === 'apis' ? env_id : scene_env_id,
            };

            fetchEnvMysqlInfo(params).subscribe({
                next: (res) => {
                    const { code, data } = res;
                    if (code === 0) {
                        setDbList(data ? data.filter(item => item.type === sqlToMethod[method]) : []);
                        if (data) {
                            const item = data.find(item => item.server_name === server_name);
                            if (item) {
                                onChange('sql_database_info', item, undefined, true);
                            } else {
                                onChange('sql_database_info', {}, undefined, true);
                                onChange('env_server_name', '', undefined, true);
                            }
                        }
                    }
                }
            })
        } else {
            onChange('sql_database_info', {}, undefined, true);
            onChange('env_server_name', '', undefined, true);
        }
    }, [env_id, scene_env_id, method, server_name]);

    const connectTest = () => {
        setLoading(true);
        const { host, user, password, port, db_name, charset } = sql_database_info;
        const params = {
            type: sqlToMethod[method],
            host,
            user,
            password,
            port,
            db_name,
            charset,
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
                        <Select placeholder={t('placeholder.selectDb')} value={dbList.find(item => item.server_name === server_name) ? server_name : ''} onChange={(e) => {
                            const dbInfo = dbList.find(item => item.server_name === e);
                            const { server_name, db_name, host, port, user, password, charset } = dbInfo;
                            console.log(dbList, dbInfo)
                            onChange('server_name', server_name);
                            onChange('db_name', db_name);
                            onChange('host', host);
                            onChange('port', port);
                            onChange('user', user);
                            onChange('password', password);
                            onChange('charset', charset);
                            onChange('env_server_name', server_name);
                        }}>
                            {
                                dbList && dbList.map(item => (
                                    <Option key={item.server_name} value={item.server_name}>
                                        {item.server_name}
                                    </Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>
                <div className="sql-db-info-header-right">
                    <Button loading={loading} onClick={connectTest}>{t('apis.connectTest')}</Button>
                </div>
            </div>
            <div className="sql-db-info-container">
                <p className="title">{t('apis.databaseConnectInfo')}</p>

                <div className="item">
                    <p className="label">{t('apis.dbDiyName')}：</p>
                    <Input placeholder={t('placeholder.diyName')} disabled={server_name} value={sql_database_info.server_name} onChange={(e) => {
                        onChange('server_name', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.dbName')}：</p>
                    <Input placeholder={t('placeholder.dbName')} disabled={server_name} value={sql_database_info.db_name} onChange={(e) => {
                        onChange('db_name', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.ip')}：</p>
                    <Input placeholder={t('placeholder.dbIP')} disabled={server_name} value={sql_database_info.host} onChange={(e) => {
                        onChange('host', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.port')}：</p>
                    <Input placeholder={t('placeholder.dbPort')} disabled={server_name} value={sql_database_info.port} onChange={(e) => {
                        onChange('port', parseInt(e));
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.user')}：</p>
                    <Input placeholder={t('placeholder.dbUser')} disabled={server_name} value={sql_database_info.user} onChange={(e) => {
                        onChange('user', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.pwd')}：</p>
                    <Input placeholder={t('placeholder.dbPwd')} disabled={server_name} value={sql_database_info.password} onChange={(e) => {
                        onChange('password', e);
                    }} />
                </div>

                <div className="item">
                    <p className="label">{t('apis.charset')}：</p>
                    <Input placeholder={t('placeholder.dbCharset')} disabled={server_name} value={sql_database_info.charset ? sql_database_info.charset : 'utf8mb4'} onChange={(e) => {
                        onChange('charset', e);
                    }} />
                </div>

            </div>
        </div>
    )
};

export default SqlDbInfo;