import React, { useRef } from 'react';
import { Close as CloseSvg } from 'adesign-react/icons';
import './index.less';
import { useTranslation } from 'react-i18next';

export const InputSelectFile = (props) => {
  const { value, onChange, multiple, style } = props;

  const refInput = useRef(null);
  const { t } = useTranslation();

  const onSelecFile = (e) => {
    const files = e?.target?.files || [];
    onChange(files);
  };
  const cleanFiles = () => {
    onChange([]);
    if (refInput?.current?.value) {
      refInput.current.value = '';
    }
  };
  return (
    <div className="InputSelectFile" style={style}>
      <div className="desc_file">{value || t('apis.selectFile')}</div>
      <input
        ref={refInput}
        className="input_file"
        type="file"
        multiple={multiple}
        onChange={(e) => {
          onSelecFile(e);
        }}
      />
      <CloseSvg
        className="input_close"
        width={16}
        onClick={() => {
          cleanFiles();
        }}
      />
    </div>
  );
};

export default InputSelectFile;
