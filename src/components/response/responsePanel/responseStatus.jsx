import React, { useRef, useState } from 'react';
import { Dropdown, Message, Button, Modal } from 'adesign-react';
import {
  Setting as SettingSvg,
  InterNet as InterNetSvg,
  Duration as DurationSvg,
  Down as DownSvg,
  Add as AddSvg,
  Setting1 as Setting1Svg,
  Delete as DeleteSvg,
} from 'adesign-react/icons';
import { v4 as uuidv4 } from 'uuid';
import DownloadSvg from '@assets/apis/download.svg';
import { download, timeStatus } from '@utils';
import isString from 'lodash/isString';
import { cloneDeep, floor, isNumber, isPlainObject } from 'lodash';
import {
  ResponseStatusWrapper,
  ResponseStatusRight,
  HopeListWrapper,
  TimingPhasesModal,
  NetworkPanel,
} from './style';
import CreateExample from './coms/createExample';
import { useTranslation } from 'react-i18next';

const ResponseStatus = (props) => {
  const { data, tempData, onChange, response, diyExampleKey, setDiyExampleKey } = props;
  const { t } = useTranslation();

  const [exampleVisible, setExamepleVisible] = useState(false);
  const [example, setExample] = useState(null);
  const [exampleKey, setExampleKey] = useState(null);

  const refDropdown = useRef(null);
  const handleDownload = () => {
    const { resMime, fitForShow, rawBody, stream, filename } = data;
    const name = `接口响应数据.${resMime?.ext}`;
    download(
      isString(fitForShow) && fitForShow === 'Monaco' ? rawBody : stream,
      filename || name,
      resMime?.mime
    );
  };

  const textObj = {
    success: '成功',
    error: '失败',
  };

  const sizeStatus = (size) => {
    size = +size;
    let str = '';
    if (size < 1024) {
      str = `${size.toFixed(2)}kb`;
    } else if (size < 1024 * 1024) {
      str = `${(size / 1024).toFixed(2)}mb`;
    }
    return str;
  };

  const dropdownClick = (key) => {
    setDiyExampleKey(key);
    refDropdown.current?.setPopupVisible(false);
  };

  return (
    <>
      <div className={ResponseStatusWrapper}>
        <div className="status-left">

        </div>
        {Object.entries(response).length > 0 && (
          <div className={ResponseStatusRight}>
            {/* <div className="status-group">
              <SettingSvg className="success" />
              <span className="success">{data?.resposneAt}</span>
            </div> */}
            <div className="status-group">
              <div>{ t('apis.assertSelect.resCode') }：</div>
              <span className={response?.request_code === 200 ? 'success' : 'error'}>{response?.request_code}</span>
            </div>


            <div className="status-group cursor">
                <DurationSvg className="success" />
                <span className="success">{timeStatus(response?.request_time)}</span>
            </div>

            <div className="status-group">
              <span>{sizeStatus(response?.response_bytes)}</span>
            </div>
            {/* <Dropdown
              style={{ width: 291, maxHeight: 160 }}
              placement="top-end"
              content={
                <div className={NetworkPanel}>
                  <div className="internet_modal_title">网络</div>
                  <div className="internet_modal_local">
                    <div>Agent</div>
                    <div>{data?.netWork?.agent}</div>
                  </div>
                  {data?.netWork?.address?.local?.address ? (
                    <div className="internet_modal_local">
                      <div>本地网络</div>
                      <div>{data?.netWork?.address?.local?.address}</div>
                    </div>
                  ) : null}
                  {data?.netWork?.address?.remote?.address ? (
                    <div className="internet_modal_remote">
                      <div>远端网络</div>
                      <div>{data?.netWork?.address?.remote?.address}</div>
                    </div>
                  ) : null}
                </div>
              }
            >
              <div className="status-group">
                <InterNetSvg className="cursor" />
              </div>
            </Dropdown>
            <div className="status-group">
              <DownloadSvg className="cursor" onClick={handleDownload} />
            </div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default ResponseStatus;
