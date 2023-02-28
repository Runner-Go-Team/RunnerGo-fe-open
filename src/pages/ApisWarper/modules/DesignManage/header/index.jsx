import React, { useContext, useState } from 'react';
import { Input, Button, Message, Select } from 'adesign-react';
import { Right as RightSvg, Down as DownSvg } from 'adesign-react/icons';
import ApiStatus from '@components/ApiStatus';
import { API_METHODS } from '@constants/methods';
import Markdown from '@components/MarkDown';
import Bus from '@utils/eventBus';
import { Link } from 'react-router-dom';
import Context from '../designContext';
import Mock from './mock';
import '../index.less';

const Option = Select.Option;

const HeaderPanel = (props) => {
  const { data, onChange } = useContext(Context);
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="design-header-panel">
      <div className="design-header-panel-item design-header-panel-top">
        <div className="api-name-group">
          <ApiStatus value={data?.mark} onChange={onChange.bind(null, 'mark')} />
          <Input
            placeholder="请输入接口名称"
            size="mini"
            value={data?.name}
            onChange={onChange.bind(null, 'name')}
          />
        </div>
        {/* <div className="user-msg">
          更新时间：
          {isString(data?.update_dtime) ||
            (isNumber(data?.update_dtime) &&
              dayjs(data.update_dtime * 1000).format('YYYY-MM-DD HH:mm:ss'))}
        </div> */}
        <Button
          className="apipost-blue-btn"
          size="mini"
          type="primary"
          onClick={() => {
            Bus.$emit('saveTargetById', {
              id: data?.target_id,
              callback: () => {
                Message('success', '保存成功');
              },
            });
          }}
        >
          保存
        </Button>
      </div>
      <div className="design-header-panel-item api-url">
        <div className="api-url-panel-group">
          <Select defaultValue={data?.method || 'GET'} onChange={onChange.bind(null, 'method')}>
            {API_METHODS.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
          <Input
            size="mini"
            placeholder="请输入接口url"
            value={data?.request?.url || ''}
            onChange={onChange.bind(null, 'url')}
          />
        </div>
        <Link className="request-btn" to="/apis/run">
          <Button size="mini">去调试</Button>
        </Link>
      </div>
      <div className="design-header-panel-item">
        <Mock />
      </div>
      <div className="design-header-panel-item editmore-btn">
        <Button
          onClick={setShowMore.bind(null, !showMore)}
          afterFix={
            showMore ? <DownSvg className="title-svg" /> : <RightSvg className="title-svg" />
          }
        >
          更多基本信息
        </Button>
      </div>
      {showMore && (
        <>
          <div>
            <div style={{ height: 300 }}>
              <Markdown
                value={data?.request?.description || ''}
                onChange={onChange.bind(null, 'description')}
              />
            </div>
          </div>
          <div className="panel-line"></div>
        </>
      )}
    </div>
  );
};
export default HeaderPanel;
