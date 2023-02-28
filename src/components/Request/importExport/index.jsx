import React, { useState } from 'react';
import { Dropdown, Button } from 'adesign-react';
import ASideTools from 'apipost-inside-tools';
import { Import as ImportSvg, Export as ExportSvg } from 'adesign-react/icons';
import OperationModal from '@components/OperationModal';
import { ImportDropdownWrapper } from '../style';

const ImportExport = (props) => {
  const { type, data, onChange } = props;

  const [modalVisible, setModalvisible] = useState(false);
  const [handleType, setHandleType] = useState('import');
  const [exportValue, setExportValue] = useState('');
  const handleImport = () => {
    setHandleType('import');
    setExportValue('');
    setModalvisible(true);
  };
  const handleExport = (exportType) => {
    const exprotVal = ASideTools.export2str(data || [], exportType) || '';
    setHandleType('export');
    setExportValue(exprotVal);
    setModalvisible(true);
  };

  return (
    <>
      <div className="request-import">
        <Button
          onClick={() => {
            handleImport();
          }}
        >
          <ImportSvg /> 导入参数
        </Button>
        <Dropdown
          placement="bottom-end"
          content={
            <div className={ImportDropdownWrapper}>
              <div
                onClick={() => {
                  handleExport('json-desc');
                }}
              >
                导出带描述的参数
              </div>
              <div
                onClick={() => {
                  handleExport('key-value');
                }}
              >
                导出Key-Value参数
              </div>
              <div
                onClick={() => {
                  handleExport('json');
                }}
              >
                导出Raw-Json参数
              </div>
            </div>
          }
        >
          <Button>
            <ExportSvg /> 导出参数
          </Button>
        </Dropdown>
      </div>
      {modalVisible && (
        <OperationModal
          handleType={handleType}
          paramsType={type}
          value={exportValue}
          onCancel={() => {
            setModalvisible(false);
          }}
          onChange={onChange}
        ></OperationModal>
      )}
    </>
  );
};

export default ImportExport;
