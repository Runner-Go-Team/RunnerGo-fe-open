import React from 'react';
import { Modal, Button } from 'adesign-react';
import { Delete as SvgDelete, Recovery as SvgRecovery } from 'adesign-react/icons';
import { useTranslation } from 'react-i18next';

const Folders = (props) => {
  const { data, filter, onRestoreDestory } = props;
  const dataList = data.filter(
    (d) => `${d.name}`.toLowerCase().indexOf(filter.toLowerCase()) !== -1
  );

  const handleDelete = (folder) => {
    Modal.confirm({
      title: t('modal.tips'),
      content: t('modal.DelFolderContent'),
      onOk() {
        onRestoreDestory && onRestoreDestory(folder.target_id, 2);
      },
    });
  };

  const handleRestore = (folder) => {
    Modal.confirm({
      title: t('modal.tips'),
      content: t('modal.restoreFolderContent'),
      onOk() {
        onRestoreDestory(folder.target_id, 1);
      },
    });
  };

  const { t } = useTranslation();

  return (
    <>
      <div className="folder-list">
        {dataList.map((item) => (
          <div className="item-li" key={item.target_id}>
            <div className="item-title">{item.name}</div>
            <div className="btns">
              <Button
                className="btn-delete"
                onClick={() => {
                  handleDelete(item);
                }}
              >
                <SvgDelete width={16} />
                { t('modal.shiftDelFolder') }
              </Button>
              <Button
                className="btn-restore"
                onClick={() => {
                  handleRestore(item);
                }}
              >
                <SvgRecovery width={16} />
                { t('modal.restoreFolder') }
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Folders;
