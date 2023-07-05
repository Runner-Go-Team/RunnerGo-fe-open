import React, { useState, useEffect } from "react";
import './index.less';
import { Button, Modal, Select, Input } from '@arco-design/web-react';
import { IconClose } from '@arco-design/web-react/icon';
import { fetchCreateDb } from '@services/env';
import { useTranslation } from 'react-i18next';
import { Message } from 'adesign-react';

const { Option } = Select;
const AddDb = (props) => {
    const { onCancel, selectEnvId, item } = props;
    const { t } = useTranslation();

    // 数据库类型
    const [type, setType] = useState(null);
    // 自定义名称
    const [serverName, setServerName] = useState('');
    // 数据库名
    const [dbName, setDbName] = useState('');
    // IP地址
    const [host, setHost] = useState('');
    // 端口号
    const [port, setPort] = useState('');
    // 用户名
    const [user, setUser] = useState('');
    // 密码
    const [password, setPassword] = useState('');
    // 编码集
    const [charset, setCharset] = useState('utf8mb4');
    // 数据库ID
    const [databaseId, setDatabaseId] = useState(0);

    useEffect(() => {
        if (Object.entries(item).length > 0) {
            const { type, server_name, db_name, host, port, user, password, charset, database_id } = item;
            setType(type);
            setServerName(server_name);
            setDbName(db_name);
            setHost(host);
            setPort(port);
            setUser(user);
            setPassword(password);
            setCharset(charset);
            setDatabaseId(database_id);
        }
    }, [item]);

    const createDatabase = () => {
        if (!type || !serverName || !host || !user || !password || !port || !dbName || !charset) {
            Message('error', 'message.emptyData');
            return;
        }

        let params = {
            database_id: databaseId,
            env_id: selectEnvId,
            team_id: localStorage.getItem('team_id'),
            type,
            server_name: serverName,
            host,
            user,
            password,
            port,
            db_name: dbName,
            charset
        };

        if (!databaseId) {
            delete params['database_id'];
        }

        fetchCreateDb(params).subscribe({
            next: (res) => {
                const { code } = res;

                if (code === 0) {

                    if (databaseId) {
                        Message('success', t('message.updateSuccess'));
                    } else {
                        Message('success', t('message.addSuccess'));
                    }
                    onCancel(true);
                }
            }
        })
    }

    return (
        <Modal
            className='add-db-modal'
            visible
            title={null}
            onCancel={onCancel}
            onOk={() => createDatabase()}
        >
            <div className="header">
                <p className="title">{ databaseId ? t('env.updateDb') : t('env.addDb')}</p>
                <Button className='close-btn' onClick={onCancel}>
                    <IconClose />
                </Button>
            </div>
            <div className="container">
                <div className="tip">{t('env.dbType')}</div>
                <Select defaultValue={type} onChange={(e) => setType(e)}>
                    <Option value='mysql'>MySQL</Option>
                    <Option value='oracle'>ORACLE</Option>
                    <Option value='postgresql'>PgSQL</Option>
                </Select>
                <div className="tip">{t('env.dbConnectInfo')}</div>
                <div className="item">
                    <p className="label">{t('env.name')}：</p>
                    <Input placeholder={t('placeholder.diyName')} value={serverName} onChange={(e) => setServerName(e)} />
                </div>
                <div className="item">
                    <p className="label">{t('env.dbName')}：</p>
                    <Input placeholder={t('placeholder.dbName')} value={dbName} onChange={(e) => setDbName(e)} />
                </div>
                <div className="item">
                    <p className="label">{t('env.ip')}：</p>
                    <Input placeholder={t('placeholder.dbIP')} value={host} onChange={(e) => setHost(e)} />
                </div>
                <div className="item">
                    <p className="label">{t('env.port')}：</p>
                    <Input placeholder={t('placeholder.dbPort')} value={port} onChange={(e) => {
                        setPort(parseInt(e));
                    }} />
                </div>
                <div className="item">
                    <p className="label">{t('env.user')}：</p>
                    <Input placeholder={t('placeholder.dbUser')} value={user} onChange={(e) => setUser(e)} />
                </div>
                <div className="item">
                    <p className="label">{t('env.pwd')}：</p>
                    <Input placeholder={t('placeholder.dbPwd')} value={password} onChange={(e) => setPassword(e)} />
                </div>
                <div className="item">
                    <p className="label">{t('env.charset')}：</p>
                    <Input placeholder={t('placeholder.dbCharset')} value={charset} onChange={(e) => setCharset(e)} />
                </div>
            </div>
        </Modal>
    )
};

export default AddDb;