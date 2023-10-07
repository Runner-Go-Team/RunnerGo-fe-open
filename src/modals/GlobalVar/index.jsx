import React, { useState, useEffect } from 'react';
import { Modal, Message, Tabs as TabComponent, Switch, Button, Select, Input, Table } from 'adesign-react';
import { Copy as SvgCopy, Delete as DeleteSvg } from 'adesign-react/icons';
import { GlobalVarModal, HeaderTitleStyle, VarNameStyle } from './style';
import { copyStringToClipboard } from '@utils';
import { fetchGlobalVar, fetchCreateVar, fetchSaveVar } from '@services/dashboard';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import { useSelector } from 'react-redux';

const { Tabs, TabPan } = TabComponent;
const { Option } = Select;

const GlobalVar = (props) => {
    const { onCancel } = props;
    const { t } = useTranslation();

    const [cookieList, setCookieList] = useState([]);
    const [headerList, setHeaderList] = useState([]);
    const [varList, setVarList] = useState([]);
    const [assertList, setAssertList] = useState([]);

    const [_var, setVar] = useState('');
    const [val, setVal] = useState('');
    const [description, setDescription] = useState('');
    const [checkName, setCheckName] = useState([]);
    const [selectId, setSelectId] = useState('0');
    const [tip, setTip] = useState('');
    const globalParam = useSelector((store) => store.dashboard.globalParam);

    const tipList = [
        t('modal.globalCookieTip'),
        t('modal.globalHeaderTip'),
        t('modal.globalVarTip'),
        t('modal.globalAssertTip')
    ];

    const COMPARE_IF_TYPE = [
        { type: 'eq', title: t('apis.compareSelect.eq') },
        { type: 'uneq', title: t('apis.compareSelect.uneq') },
        { type: 'gt', title: t('apis.compareSelect.gt') },
        { type: 'gte', title: t('apis.compareSelect.gte') },
        { type: 'lt', title: t('apis.compareSelect.lt') },
        { type: 'lte', title: t('apis.compareSelect.lte') },
        { type: 'includes', title: t('apis.compareSelect.includes') },
        { type: 'unincludes', title: t('apis.compareSelect.unincludes') },
        { type: 'null', title: t('apis.compareSelect.null') },
        { type: 'notnull', title: t('apis.compareSelect.notnull') },
    ];

    const res_type = {
        1: cloneDeep(COMPARE_IF_TYPE).splice(6, 10),
        2: COMPARE_IF_TYPE,
        3: cloneDeep(COMPARE_IF_TYPE).slice(0, 2)
    }

    const checkKeyRepeat = (list, key) => {
        let usedKeys = list.map(obj => obj.key); // 获取所有已经被使用的key
        let newKey = key;


        // 如果传入的key已经被使用了，就按照规则处理
        while (usedKeys.includes(newKey)) {

            if (newKey.length === 0) {
                return '';
            }

            newKey = newKey.slice(0, -1);
        }

        return newKey;
    }



    const cookieColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveCookie(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('apis.cookieName'),
            dataIndex: 'key',
            enableResize: true,
            width: 220,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('apis.key')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                        onBlur={(e) => {
                            const { value } = e.target;
                            if (value.trim().length === 0) {
                                return;
                            }
                            const _list = cloneDeep(cookieList);
                            const keys = _list.filter(item => item.key === value);
                            if (keys.length > 1) {
                                _list[rowIndex].key = checkKeyRepeat(_list, _list[rowIndex].key);
                                if (_list[rowIndex].key.trim().length === 0 && _list[rowIndex].value.trim().length === 0) {
                                    _list.splice(rowIndex, 1);
                                }
                                setCookieList(_list);
                                saveCookie(_list);
                                Message('error', t('message.cookieNameRepeat'));
                            } else {
                                saveCookie();
                            }
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.cookieValue'),
            dataIndex: 'value',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('placeholder.bodyValue')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                        onBlur={(e) => {
                            saveCookie();
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                rowIndex !== cookieList.length ?
                    <Button
                        onClick={() => {
                            deleteItem(rowIndex);
                        }}
                    >
                        <DeleteSvg className='delete-svg' style={{ width: 16, height: 16 }} />
                    </Button> : <></>
            ),
        },
    ];

    const headerColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveHeader(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('apis.key'),
            dataIndex: 'key',
            width: 230,
            enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('apis.key')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { key: newVal });
                        }}
                        onBlur={(e) => {
                            const { value } = e.target;
                            if (value.trim().length === 0) {
                                return;
                            }
                            const _list = cloneDeep(headerList);
                            const keys = _list.filter(item => item.key === value);
                            if (keys.length > 1) {
                                _list[rowIndex].key = checkKeyRepeat(_list, _list[rowIndex].key);
                                if (_list[rowIndex].key.trim().length === 0 && _list[rowIndex].value.trim().length === 0) {
                                    _list.splice(rowIndex, 1);
                                }
                                setHeaderList(_list);
                                saveHeader(_list);
                                Message('error', t('message.keyRepeat'));
                            } else {
                                saveHeader();
                            }
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.value'),
            dataIndex: 'value',
            width: 120,
            enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('placeholder.bodyValue')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                        onBlur={() => {
                            saveHeader();
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.desc'),
            dataIndex: 'description',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        placeholder={t('placeholder.bodyDesc')}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                        onBlur={() => {
                            saveHeader();
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                rowIndex !== headerList.length ?
                    <Button
                        onClick={() => {
                            deleteItem(rowIndex);
                        }}
                    >
                        <DeleteSvg className='delete-svg' style={{ width: 16, height: 16 }} />
                    </Button> : <></>
            ),
        },
    ];

    const varColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveVar(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('column.globalVar.varName'),
            dataIndex: 'key',
            width: 211,
            enableResize: true,
            render: (text, rowData, rowIndex) => {
                return (
                    <div className={VarNameStyle}>
                        <Input
                            value={text}
                            onBlur={(e) => {
                                const { value } = e.target;
                                if (value.trim().length === 0) {
                                    return;
                                }
                                const _list = cloneDeep(varList);
                                const keys = _list.filter(item => item.key === value);
                                if (keys.length > 1) {
                                    _list[rowIndex].key = checkKeyRepeat(_list, _list[rowIndex].key);
                                    if (_list[rowIndex].key.trim().length === 0 && _list[rowIndex].value.trim().length === 0) {
                                        _list.splice(rowIndex, 1);
                                    }
                                    setVarList(_list);
                                    saveVar(_list);
                                    Message('error', t('message.varRepeat'));
                                } else {
                                    saveVar();
                                }
                            }}
                            onChange={(newVal) => {
                                handleChange(rowData, rowIndex, { key: newVal });
                            }}
                        />
                        {rowIndex !== varList.length && <SvgCopy className='copy-svg' onClick={() => copyStringToClipboard(varList[rowIndex].key)} />}
                    </div>
                )
            }
        },
        {
            title: t('column.globalVar.varVal'),
            dataIndex: 'value',
            enableResize: true,
            width: 220,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { value: newVal });
                        }}
                        onBlur={() => {
                            saveVar();
                        }}
                    />
                )
            }
        },
        {
            title: t('column.globalVar.varDesc'),
            dataIndex: 'description',

            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { description: newVal });
                        }}
                        onBlur={() => {
                            saveVar();
                        }}
                    />
                )
            }
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => {
                return rowIndex !== varList.length ? <div className='handle'>
                    <DeleteSvg onClick={() => deleteItem(rowIndex)} className='delete-svg' />
                </div> : <></>
            }
        }
    ];

    const assertColumns = [
        {
            title: '',
            width: 40,
            dataIndex: 'is_checked',
            render: (text, rowData, rowIndex) => (
                <Switch
                    size="small"
                    checked={text === '1' || text === 1}
                    onChange={(e) => {
                        handleChange(rowData, rowIndex, { is_checked: e ? 1 : 2 }, (data) => {
                            saveAssert(data);
                        });
                    }}
                />
            ),
        },
        {
            title: t('apis.assertBody'),
            width: 150,
            enableResize: true,
            dataIndex: 'response_type',
            render: (text, rowData, rowIndex) => (
                <Select
                    value={rowData.response_type || null}
                    placeholder={t('placeholder.plsSelect')}
                    onChange={(e) => {
                        const callback = (data) => {
                            saveAssert(data);
                        }
                        if (assertList[rowIndex] ? (e === 3 || e === 1) : false) {
                            handleChange(rowData, rowIndex, { var: '', response_type: e }, callback);
                        } else {
                            handleChange(rowData, rowIndex, { response_type: e }, callback);
                        }
                    }}
                >
                    <Option value={1}>{t('apis.assertSelect.resHeader')}</Option>
                    <Option value={2}>{t('apis.assertSelect.resBody')}</Option>
                    <Option value={3}>{t('apis.assertSelect.resCode')}</Option>
                </Select>
            ),
        },
        // 包含 不包含 等于空 不等于空
        {
            title: t('apis.field'),
            dataIndex: 'var',
            enableResize: true,
            width: 200,
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        disabled={assertList[rowIndex] ? (
                            assertList[rowIndex].response_type === 3 || assertList[rowIndex].response_type === 1 ||
                            assertList[rowIndex].compare === 'includes' || assertList[rowIndex.compare === 'unincludes' ||
                            assertList[rowIndex].compare === 'null' || assertList[rowIndex].compare === 'notnull'
                            ]
                        ) : false}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { var: newVal }, (data) => {
                                saveAssert(data);
                            });
                        }}
                    />
                );
            },
        },
        {
            title: t('apis.condition'),
            width: 150,
            enableResize: true,
            dataIndex: 'compare',
            render: (text, rowData, rowIndex) => {
                let compare = cloneDeep(COMPARE_IF_TYPE);

                return (
                    <Select
                        value={rowData.compare || null}
                        placeholder={t('placeholder.plsSelect')}
                        onChange={(e) => {
                            const callback = (data) => {
                                saveAssert(data);
                            }
                            if (assertList[rowIndex] ? (e === 'notnull' || e === 'null') : false) {
                                handleChange(rowData, rowIndex, { val: '', compare: e }, callback);
                            } else {
                                handleChange(rowData, rowIndex, { compare: e }, callback);
                            }
                        }}
                    >
                        {
                            assertList[rowIndex]
                                && res_type[assertList[rowIndex].response_type]
                                ? res_type[assertList[rowIndex].response_type].map(item => <Option value={item.type}>{item.title}</Option>)
                                : COMPARE_IF_TYPE.map(item => <Option value={item.type}>{item.title}</Option>)
                        }
                    </Select>
                );
            },
        },
        {
            title: t('apis.val'),
            dataIndex: 'val',
            render: (text, rowData, rowIndex) => {
                return (
                    <Input
                        value={text}
                        disabled={assertList[rowIndex] ? (assertList[rowIndex].compare === 'notnull' || assertList[rowIndex].compare === 'null') : false}
                        onChange={(newVal) => {
                            handleChange(rowData, rowIndex, { val: newVal }, (data) => {
                                saveAssert(data);
                            });
                        }}
                    />
                );
            },
        },
        {
            title: '',
            width: 30,
            render: (text, rowData, rowIndex) => (
                rowIndex !== assertList.length ?
                    <Button
                        onClick={() => {
                            deleteItem(rowIndex);
                        }}
                    >
                        <DeleteSvg className='delete-svg' style={{ width: 16, height: 16 }} />
                    </Button> : <></>
            ),
        },
    ];

    useEffect(() => {
        setTip(tipList[selectId]);
    }, [selectId]);

    useEffect(() => {
        const params = {
            team_id: sessionStorage.getItem('team_id')
        };

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "get_global_param",
            param: JSON.stringify(params)
        }))
    }, []);

    useEffect(() => {
        if (globalParam) {
            const { cookies, headers, variables, asserts } = globalParam;
            setCookieList([...cookies]);
            setHeaderList([...headers]);
            setVarList([...variables]);
            setAssertList([...asserts])
        }
    }, [globalParam]);

    const handleChange = (rowData, rowIndex, newVal, callback) => {
        let list = [];
        if (selectId === '0') {
            list = cookieList;
        } else if (selectId === '1') {
            list = headerList;
        } else if (selectId === '2') {
            list = varList;
        } else if (selectId === '3') {
            list = assertList;
        }
        let newList = [...list];
        newList[rowIndex] = {
            ...rowData,
            ...newVal,
        };

        if (selectId !== "3") {
            newList = newList.filter(item => item.key.trim().length > 0 || item.value.trim().length > 0);
        }

        if (selectId === '0') {
            setCookieList([...newList]);
        } else if (selectId === '1') {
            setHeaderList([...newList]);
        } else if (selectId === '2') {
            setVarList([...newList]);
        } else if (selectId === '3') {
            setAssertList([...newList]);
        }
        callback && callback([...newList]);
    };

    const deleteItem = (index) => {
        let list = [];
        if (selectId === '0') {
            list = cookieList;
        } else if (selectId === '1') {
            list = headerList;
        } else if (selectId === '2') {
            list = varList;
        } else if (selectId === '3') {
            list = assertList;
        }
        const _list = [...list];
        _list.splice(index, 1);
        if (selectId === '0') {
            setCookieList(_list);
            saveCookie(_list);
        } else if (selectId === '1') {
            setHeaderList(_list);
            saveHeader(_list);
        } else if (selectId === '2') {
            setVarList(_list);
            saveVar(_list);
        } else if (selectId === '3') {
            setAssertList(_list);
            saveAssert(_list);
        }
    }

    const saveCookie = (data) => {
        const _list = cloneDeep(data ? data : cookieList);
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            param_type: 1,
            cookies: _list
        };

        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_global_param",
            param: JSON.stringify(params)
        }))
    }

    const saveHeader = (data) => {
        const _list = cloneDeep(data ? data : headerList);
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            param_type: 2,
            headers: _list
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_global_param",
            param: JSON.stringify(params)
        }))
    }

    const saveVar = (data) => {
        const _list = cloneDeep(data ? data : varList);
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            param_type: 3,
            variables: _list
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_global_param",
            param: JSON.stringify(params)
        }))
    }

    const saveAssert = (data) => {
        const _list = cloneDeep(data ? data : assertList);
        const params = {
            team_id: sessionStorage.getItem('team_id'),
            param_type: 4,
            asserts: _list
        };
        Bus.$emit('sendWsMessage', JSON.stringify({
            route_url: "save_global_param",
            param: JSON.stringify(params)
        }))
    }

    const getTableData = (tab) => {
        let lastDataList = [
            { is_checked: 1, key: '', value: '' },
            { is_checked: 1, key: '', value: '', description: '' },
            { is_checked: 1, key: '', value: '', description: '' },
            { is_checked: 1, response_type: '', var: '', compare: '', val: '' },
        ];
        let lastData = lastDataList[tab];
        let dataList = [
            cookieList,
            headerList,
            varList,
            assertList
        ];
        let dataItem = dataList[tab];
        return [...dataItem, lastData];
    }

    const defaultList = [
        {
            id: '0',
            title: t('modal.globalCookie'),
            content: <Table showBorder hasPadding={false} columns={cookieColumns} data={getTableData("0")} />
        },
        {
            id: '1',
            title: t('modal.globalHeader'),
            content: <Table showBorder hasPadding={false} columns={headerColumns} data={getTableData("1")} />
        },
        {
            id: '2',
            title: t('modal.globalVar'),
            content: <Table showBorder hasPadding={false} columns={varColumns} data={getTableData("2")} />
        },
        {
            id: '3',
            title: t('modal.globalAssert'),
            content: <Table showBorder hasPadding={false} columns={assertColumns} data={getTableData("3")} />
        }
    ];


    return (
        <Modal
            className={GlobalVarModal}
            okText={t('btn.save')}
            visible={true}
            title={t('column.globalVar.title')}
            footer={null}
            cancelText={t('btn.cancel')}
            onCancel={onCancel}
        >
            <Tabs
                defaultActiveId='0'
                itemWidth={80}
                onChange={(e) => setSelectId(e)}
            >
                {
                    defaultList.map((d) => (
                        <TabPan
                            style={{ padding: '0 15px', width: 'auto !impoertant' }}
                            key={d.id}
                            id={d.id}
                            title={d.title}
                        >
                            <p className='tip'>{tip}</p>
                            {d.content}
                        </TabPan>
                    ))
                }
            </Tabs>
        </Modal>
    )
};

export default GlobalVar;