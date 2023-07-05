import { Button, Tooltip } from 'adesign-react'
import React, { useState } from 'react'
import FolderCreate from '@modals/folder/create';
import { useTranslation } from 'react-i18next';
import Bus from '@utils/eventBus';
import {
  NewApis as SvgNewApis,
  NewFolder as SvgNewFolder,
  Unfold as SvgUnOpen,
  MenuFold as SvgOpen,
} from 'adesign-react/icons';
import { useSelector } from 'react-redux';

export default function mockBtns(props) {
  const { treeRef }=props;
  const { t } = useTranslation();
  const [showFolder, setShowFolder] = useState(false);
  const [isExpandAll, setIsExpandAll] = useState(false);
  const theme = useSelector((store) => store.user.theme);

  const handleExpandAll = () => {
    const newExpandStatus = !isExpandAll;
    setIsExpandAll(newExpandStatus);
    treeRef.current?.handleExpandItem(newExpandStatus);
    // setWorkspaceCurrent(uuid, `${CURRENT_PROJECT_ID}.IS_EXPAND_ALL`, newExpandStatus ? 1 : -1);
};

  return (
    <>
      <div className='mock-btns'>
        <div className="button-list">
          <div className="button-list-item">
            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('mock.createMockApi')} placement="top">
              <div>
                <Button size="mini" onClick={() => Bus.$emit('mock/addOpenItem')}>
                  <SvgNewApis width="18px" height="18px" />
                </Button>
              </div>
            </Tooltip>
          </div>
          <span className="line"></span>
          <div className="button-list-item">
            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.createFolder')} placement="top">
              <Button size="mini" onClick={() => setShowFolder(true)}>
                <SvgNewFolder width="18px" height="18px" />
              </Button>
            </Tooltip>
          </div>
          <span className="line"></span>
          <div className="button-list-item">
            <Tooltip bgColor={theme === 'dark' ? '#39393D' : '#E9E9E9'} content={t('apis.expand')} placement="top">
              <Button size="mini" onClick={handleExpandAll}>
                {isExpandAll ? (
                  <SvgOpen width="18px" height="18px" />
                ) : (
                  <SvgUnOpen width="18px" height="18px" />
                )}
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      {showFolder && <FolderCreate onCancel={() => setShowFolder(false)} type='mock' />}
    </>
  )
}
