/* eslint-disable no-await-in-loop */
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Select, Input, Card, Message, Spin, Upload, Button } from 'adesign-react';
import { Add as SvgAdd } from 'adesign-react/icons';
import postman2apipost from 'postman2apipost';
import Swagger2Apipost from 'swagger2apipost';
import Apifox2Apipost from 'apifox2apipost';
import Apizza2apipost from 'apizza2apipost';
import Eolink2Apipost from 'eolink2apipost';
import Yapi2apipost from 'yapi2apipost';
import dayjs from 'dayjs';
import Module2ApiPostFull from 'module2apipostfull';
import { IMPORT_TYPE_LIST } from '@constants/import';
import { isArray, isObject, isPlainObject, isString, mergeWith } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { global$ } from '@hooks/useGlobal/global';
import AStools from 'apipost-inside-tools';
import Bus from '@utils/eventBus';
import { getBaseProject, getBaseEnv } from '@constants/baseProject';
import { addMultiTargetRequest } from '@services/apis';
import { isJSON, completionTarget, customizer, spliceIntoChunks } from '@utils';
import { fetchImportApi } from '@services/apis';
import { useTranslation } from 'react-i18next';
import SvgTips from '@assets/icons/tips';
import SvgClose from '@assets/apis/close';

const Option = Select.Option;
const ManualImport = (props, ref) => {
  const { loading, setLoading, onCancel, CURRENT_TEAM_ID } = props;

  const [fileType, setFileType] = useState('postman');
  const [swaggerUrl, setSwaggerUrl] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const { t } = useTranslation();

  useImperativeHandle(ref, () => ({
    manualImportSubmit,
  }));

  const handleModuleJson = async (moduleJson) => {
    let _apis = [];

    const formatApi = (item) => {
      const { method, mock, mock_url, name, request, response, target_type, url, children } = item;
      const { auth, body, description, event, header, query, resful } = request;

      return {
        method,
        mock,
        mock_url,
        name,
        target_type,
        url,
        request: {
          auth,
          body: {
            ...body,
            parameter: body.parameter ? body.parameter.map(item => {
              return {
                ...item,
                is_checked: item.is_checked === "1" ? 1 : 2,
                not_null: item.not_null === "1" ? 1 : 2
              }
            }) : [],
          },
          description,
          url,
          event,
          header: {
            parameter: header.map(item => {
              return {
                ...item,
                is_checked: item.is_checked === "1" ? 1 : 2,
                not_null: item.not_null === "1" ? 1 : 2
              }
            }),
          },
          query: {
            parameter: query.map(item => {
              return {
                ...item,
                is_checked: item.is_checked === "1" ? 1 : 2,
                not_null: item.not_null === "1" ? 1 : 2
              }
            }),
          },
          resful: {
            parameter: resful
          },
        },
        children: children ? children.map(item => formatApi(item)) : []
      }
    }

    // moduleJson.apis.forEach(item => {
    //   apis.push(formatApi(item));
    // })

    const fullJson = Module2ApiPostFull(moduleJson);
    const { apis } = fullJson;

    apis.forEach(item => {
      const { request, target_id, parent_id } = item;
      request.body ? request.body.parameter && request.body.parameter.forEach(elem => {
        elem.is_checked = elem.is_checked === "1" ? 1 : 2;
        elem.not_null = elem.not_null === "1" ? 1 : 2;
      }) : request.body = { parameter: [] }
      request.query ? request.query.parameter && request.query.parameter.forEach(elem => {
        elem.is_checked = elem.is_checked === "1" ? 1 : 2;
        elem.not_null = elem.not_null === "1" ? 1 : 2;
      }) : request.query = { parameter: [] }
      request.header ? request.header.parameter && request.header.parameter.forEach(elem => {
        elem.is_checked = elem.is_checked === "1" ? 1 : 2;
        elem.not_null = elem.not_null === "1" ? 1 : 2;
      }) : request.header = { parameter: [] }
      request.resful ? request.resful.parameter && request.resful.parameter.forEach(elem => {
        elem.is_checked = elem.is_checked === "1" ? 1 : 2;
        elem.not_null = elem.not_null === "1" ? 1 : 2;
      }) : request.resful = { parameter: [] }
      request.assert = [];
      request.regex = [];
      if (!request.auth) {
        request.auth = {
          type: 'noauth', // 认证类型  noauth无需认证 kv私密键值对 bearer认证 basic认证
          kv: {
            key: '',
            value: '',
          },
          bearer: {
            key: '',
          },
          basic: {
            username: '',
            password: '',
          },
          digest: {
            username: '',
            password: '',
            realm: '',
            nonce: '',
            algorithm: '',
            qop: '',
            nc: '',
            cnonce: '',
            opaque: '',
          },
          hawk: {
            authId: '',
            authKey: '',
            algorithm: '',
            user: '',
            nonce: '',
            extraData: '',
            app: '',
            delegation: '',
            timestamp: '',
            includePayloadHash: -1,
          },
          awsv4: {
            accessKey: '',
            secretKey: '',
            region: '',
            service: '',
            sessionToken: '',
            addAuthDataToQuery: -1,
          },
          ntlm: {
            username: '',
            password: '',
            domain: '',
            workstation: '',
            disableRetryRequest: 1,
          },
          edgegrid: {
            accessToken: '',
            clientToken: '',
            clientSecret: '',
            nonce: '',
            timestamp: '',
            baseURi: '',
            headersToSign: '',
          },
          oauth1: {
            consumerKey: '',
            consumerSecret: '',
            signatureMethod: '',
            addEmptyParamsToSign: -1,
            includeBodyHash: -1,
            addParamsToHeader: -1,
            realm: '',
            version: '1.0',
            nonce: '',
            timestamp: '',
            verifier: '',
            callback: '',
            tokenSecret: '',
            token: '',
          },
        }
      }

      item["old_target_id"] = target_id;
      item["old_parent_id"] = parent_id;
      if (item.target_type === "folder") {
        delete item["request"];
      }
      item.type_sort = parseInt(item.type_sort);
    })

    const params = {
      team_id: localStorage.getItem('team_id'),
      apis
    };
    fetchImportApi(params).subscribe({
      next: (res) => {
        const { code } = res;
        if (code === 0) {
          global$.next({
            action: 'GET_APILIST',
            params: {
              page: 1,
              size: 100,
              team_id: localStorage.getItem('team_id'),
            }
          });
          onCancel();
          Message("success", t('message.importSuccess'))
        } else {
          setLoading(false);
        }
      }
    })
    return;
    try {
      if (moduleJson && moduleJson !== '') {
        const fullJson = Module2ApiPostFull(moduleJson);

        const { project, apis, env } = fullJson;
        const { project_id } = project;
        project.team_id = CURRENT_TEAM_ID;
        project.create_dtime = dayjs().unix();
        if (project && isObject(project)) {
          //  保存项目
          await Bus.$asyncEmit('saveProject', project);
        }
        if (apis && isArray(apis) && apis.length > 0) {
          const newApis = apis.map((item) => {
            item.project_id = project_id;
            item.sort = 1;
            item.status = 1;
            if (isString(item?.name) && item.name.length > 200) {
              item.name = item.name.substring(0, 200);
            }
            return completionTarget(item);
          });
          if (newApis.length > 50) {
            const chunkArray = spliceIntoChunks(newApis, 50);
            for (const items of chunkArray) {
              await Bus.$asyncEmit('bulkAddCollection', items, project_id, false);
            }
          } else {
            await Bus.$asyncEmit('bulkAddCollection', newApis, project_id, false);
          }
        }
        if (env && isArray(env) && env.length > 0) {
          env.forEach((item) => {
            item.project_id = project_id;
            item.id = `${project_id}/${item.env_id}`;
            //  保存环境
            global$.next({
              action: 'SAVE_ENV',
              payload: item,
            });
          });
        }
        // 初始化项目
        global$.next({
          action: 'INIT_APPLICATION',
        });
        Message('success', '导入成功');
        onCancel();
      }
    } catch (error) {
      throw new Error(`转换出错${error}`);
    }
  };
  const apipostTree2apipostArray = (
    apipostTree,
    apis,
    // project_id,
    parent_id = '0'
  ) => {
    if (apis.length > 0) {
      apis.forEach((item) => {
        let target = {};
        // 目录
        target = completionTarget(item);
        target.parent_id = parent_id;
        // target.project_id = project_id;
        if (!target.hasOwnProperty('sort')) {
          target.sort = 1;
        }
        target.status = 1;
        if (isString(target?.name) && target.name.length > 200) {
          target.name = target.name.substring(0, 200);
        }
        apipostTree.push(target);

        if (item?.target_type === 'folder' && isArray(item?.children) && item.children.length > 0) {
          // 目录
          // target = completionTarget(item);
          target.method = 'POST';
          apipostTree2apipostArray(apipostTree, item.children, target.target_id);
        } else {
          // target = completionTarget(item);
        }
      });
    }
  };
  const handleApipostJson = async (apiPostJson) => {
    try {
      if (isPlainObject(apiPostJson) && apiPostJson.hasOwnProperty('project')) {
        const { apis } = apiPostJson;
        let newApis = [];
        apipostTree2apipostArray(newApis, apis);
        newApis.forEach(item => {
          const { request, target_id, parent_id } = item;

          request.body ? request.body.parameter && request.body.parameter.forEach(elem => {
            elem.is_checked = elem.is_checked === "1" ? 1 : 2;
            elem.not_null = elem.not_null === "1" ? 1 : 2;
          }) : request.body = { parameter: [] }
          request.query ? request.query.parameter && request.query.parameter.forEach(elem => {
            elem.is_checked = elem.is_checked === "1" ? 1 : 2;
            elem.not_null = elem.not_null === "1" ? 1 : 2;
          }) : request.query = { parameter: [] }
          request.header ? request.header.parameter && request.header.parameter.forEach(elem => {
            elem.is_checked = elem.is_checked === "1" ? 1 : 2;
            elem.not_null = elem.not_null === "1" ? 1 : 2;
          }) : request.header = { parameter: [] }
          request.resful ? request.resful.parameter && request.resful.parameter.forEach(elem => {
            elem.is_checked = elem.is_checked === "1" ? 1 : 2;
            elem.not_null = elem.not_null === "1" ? 1 : 2;
          }) : request.resful = { parameter: [] }
          if (!request.auth) {
            request.auth = {
              type: 'noauth', // 认证类型  noauth无需认证 kv私密键值对 bearer认证 basic认证
              kv: {
                key: '',
                value: '',
              },
              bearer: {
                key: '',
              },
              basic: {
                username: '',
                password: '',
              },
              digest: {
                username: '',
                password: '',
                realm: '',
                nonce: '',
                algorithm: '',
                qop: '',
                nc: '',
                cnonce: '',
                opaque: '',
              },
              hawk: {
                authId: '',
                authKey: '',
                algorithm: '',
                user: '',
                nonce: '',
                extraData: '',
                app: '',
                delegation: '',
                timestamp: '',
                includePayloadHash: -1,
              },
              awsv4: {
                accessKey: '',
                secretKey: '',
                region: '',
                service: '',
                sessionToken: '',
                addAuthDataToQuery: -1,
              },
              ntlm: {
                username: '',
                password: '',
                domain: '',
                workstation: '',
                disableRetryRequest: 1,
              },
              edgegrid: {
                accessToken: '',
                clientToken: '',
                clientSecret: '',
                nonce: '',
                timestamp: '',
                baseURi: '',
                headersToSign: '',
              },
              oauth1: {
                consumerKey: '',
                consumerSecret: '',
                signatureMethod: '',
                addEmptyParamsToSign: -1,
                includeBodyHash: -1,
                addParamsToHeader: -1,
                realm: '',
                version: '1.0',
                nonce: '',
                timestamp: '',
                verifier: '',
                callback: '',
                tokenSecret: '',
                token: '',
              },
            }
          }
          request.assert = [];
          request.regex = [];
          item["old_target_id"] = target_id;
          item["old_parent_id"] = parent_id;
          if (item.target_type === "folder") {
            delete item["request"];
          }
          item.type_sort = parseInt(item.type_sort);
        })

        const params = {
          team_id: localStorage.getItem('team_id'),
          apis: newApis
        };
        fetchImportApi(params).subscribe({
          next: (res) => {
            const { code } = res;
            if (code === 0) {
              global$.next({
                action: 'GET_APILIST',
                params: {
                  page: 1,
                  size: 100,
                  team_id: localStorage.getItem('team_id'),
                }
              });
              onCancel();
              Message("success", t('message.importSuccess'))
            } else {
              setLoading(false);
            }
          }
        })
        return;

        if (isPlainObject(project)) {
          const newProject = mergeWith(getBaseProject(), project, customizer);
          newProject.team_id = CURRENT_TEAM_ID;
          if (newProject && isObject(newProject)) {
            //  保存项目
            if (
              isArray(newProject?.details?.markList) &&
              newProject?.details?.markList.length <= 0
            ) {
              delete newProject.details.markList;
            }
            await Bus.$asyncEmit('saveProject', newProject);
          }
          if (apis && isArray(apis) && apis.length > 0) {
            const newApis = [];
            if (apis && apis instanceof Array) {
              apipostTree2apipostArray(newApis, apis, newProject?.project_id);
            }
            if (newApis.length > 50) {
              const chunkArray = spliceIntoChunks(newApis, 50);
              for (const items of chunkArray) {
                await Bus.$asyncEmit('bulkAddCollection', items, newProject?.project_id, false);
              }
            } else {
              await Bus.$asyncEmit('bulkAddCollection', newApis, newProject?.project_id, false);
            }
          }
          if (envs && isArray(envs) && envs.length > 0) {
            envs.forEach((item) => {
              if (!['-1', '-2'].includes(item?.env_id)) {
                item.env_id = uuidv4();
              }
              const newEnv = mergeWith(getBaseEnv(newProject?.project_id), item, customizer);
              newEnv.project_id = newProject?.project_id;
              newEnv.id = `${newProject?.project_id}/${newEnv.env_id}`;
              //  保存环境
              global$.next({
                action: 'SAVE_ENV',
                payload: newEnv,
              });
            });
          }
          // 初始化项目
          setTimeout(() => {
            global$.next({
              action: 'INIT_APPLICATION',
            });
          }, 500);
          Message('success', '导入成功');
          onCancel();
        }
      } else {
        Message('error', '您的文件格式错误，请重新选择');
      }
    } catch (error) {
      throw new Error(`转换出错${error}`);
    }
  };
  const manualImportSubmit = async () => {
    if (loading) {
      return;
    }
    try {
      if (fileType === 'swaggerUrl') {
        if (swaggerUrl === '') {
          setLoading(false);
          throw new Error('请输入您需要导入的地址');
        }
        const converter = new Swagger2Apipost();
        const convertResult = await converter.convert(swaggerUrl);
        if (convertResult?.status === 'error') {
          if (convertResult?.message) throw new Error(convertResult?.message);
        }
        handleModuleJson(convertResult.data);
      } else {
        if (uploadFile === null) {
          setLoading(false);
          throw new Error('请先选择您需要导入的文件');
        }
        const reader = new FileReader();
        reader.onload = async function (e) {
          try {
            const text = String(reader.result) || '';
            if (!isJSON(text)) {
              setLoading(false);
              throw new Error('您的文件格式有误，请重新选择');
            }
            const jsonObj = JSON.parse(text);
            let converter, convertResult, moduleJson;
            switch (fileType) {
              case 'postman':
                const result = postman2apipost(jsonObj);
                if (result?.status === 'error') {
                  if (result?.message) throw new Error(result?.message);
                }
                moduleJson = result.data;
                break;
              case 'swagger':
                converter = new Swagger2Apipost();
                convertResult = await converter.convert(jsonObj);
                if (convertResult?.status === 'error') {
                  if (convertResult?.message) throw new Error(convertResult?.message);
                }
                moduleJson = convertResult.data;
                break;
              case 'apifox':
                converter = new Apifox2Apipost();
                convertResult = converter.convert(jsonObj);
                if (convertResult?.status === 'error') {
                  if (convertResult?.message) throw new Error(convertResult?.message);
                }
                moduleJson = convertResult.data;
                break;
              case 'apizza':
                converter = new Apizza2apipost();
                convertResult = converter.convert(jsonObj);
                if (convertResult?.status === 'error') {
                  if (convertResult?.message) throw new Error(convertResult?.message);
                }
                moduleJson = convertResult.data;
                break;
              case 'eolink':
                converter = new Eolink2Apipost();
                convertResult = converter.convert(jsonObj);
                if (convertResult?.status === 'error') {
                  if (convertResult?.message) throw new Error(convertResult?.message);
                }
                moduleJson = convertResult.data;
                break;
              case 'yapi':
                converter = new Yapi2apipost();
                convertResult = await converter.convert(jsonObj);
                if (convertResult?.status === 'error') {
                  if (convertResult?.message) throw new Error(convertResult?.message);
                }
                moduleJson = convertResult.data;
                break;
              case 'apipost':
                await handleApipostJson(jsonObj);
                return;
                break;
              default:
                break;
            }
            await handleModuleJson(moduleJson);
            // value.target.value = '';
          } catch (error) {
            Message('error', t('message.importFileFormatError'));
            setLoading(false);
          }
        };
        reader.readAsText(uploadFile);
      }
    } catch (error) {
      if (error?.message) {
        Message('error', t('message.importFileFormatError'));
      } else {
        Message('error', t('message.importFileFormatError'));
      }
    } finally {
      // setLoading(false);
    }
  };
  return (
    <Spin loading={loading} tip="正在导入...">
      <div className="apipost-import-modal">
        <div className='import-tips'>
          <SvgTips />
          {IMPORT_TYPE_LIST[fileType].tips}
        </div>
        <div className="import-title">数据来源</div>
        <Select className="import-select" value={fileType} onChange={(value) => setFileType(value)}>
          {isObject(IMPORT_TYPE_LIST) &&
            Object.values(IMPORT_TYPE_LIST).map((item) => (
              <Option value={item.name} key={item.name}>
                {item.name}
              </Option>
            ))}
        </Select>
        <div className="import-title">
          {' '}
          {fileType === 'swaggerUrl' ? '输入swaggerUrl' : '选择json文件'}
        </div>
        {fileType === 'swaggerUrl' ? (
          <Input
            value={swaggerUrl}
            onChange={(val) => {
              setSwaggerUrl(val);
            }}
          />
        ) : (
          <div className="checkFile">
            <div className="file-name">{uploadFile?.name || ''}
              <SvgClose className='close-svg' onClick={() => setUploadFile(null)} />
            </div>
            {
              uploadFile ? '' : <Upload limit={1} showFilesList={false} onChange={(files, fileList) => {
                setUploadFile(files[0].originFile);
              }} >
                <Button className='upload-btn' preFix={<SvgAdd />}>{t('scene.addFile')}</Button>
              </Upload>
            }
            {/* <input
              className="upload"
              type="file"
              title=""
              onChange={(e) => {
                const files = e?.target?.files[0];
                setUploadFile(files);
                if (e) e.target.value = '';
              }}
            /> */}
          </div>
        )}
      </div>
    </Spin>
  );
};

export default forwardRef(ManualImport);
