import React from 'react';
import cn from 'classnames';
import { Input, Button } from 'adesign-react';
import { Delete as SvgDelete } from 'adesign-react/icons';
import { useSafeState } from 'apt-hooks';
import { emptyWarper } from './style';
import LinkModal from '../../modals/link';

// type Props = {
//   deepIndex: number;
//   nodeKey: string;
//   onNodeKeyChange: (preKey: string, newKey: string) => void;
//   onDeleteNode: () => void;
//   onLinkSchema: (schema: IDataModel) => void;
// };

const EmptyItem = (props) => {
  const { deepIndex, nodeKey, onNodeKeyChange, onDeleteNode, onLinkSchema } = props;
  const [showModal, setShowModal] = useSafeState(false);

  const handleLinkSchema = (schema) => {
    setShowModal(false);
    onLinkSchema(schema);
  };

  return (
    <>
      {showModal && <LinkModal onLinkSchema={handleLinkSchema} />}
      <div className={cn('data-item', 'table-tr')}>
        <div className={cn('schema-td', 'table-td')}>
          <div className={cn('schema-td-warper', emptyWarper)}>
            <div className="indent-panel" style={{ width: 10 * deepIndex + 20 }}></div>
            <Input
              size="mini"
              spellCheck={false}
              readonly={false}
              className="schema-text-box"
              placeholder="字段名"
              value={`${nodeKey}`}
              onChange={onNodeKeyChange.bind(null, nodeKey)}
            />
            {/* <div className="text-panel">
              或
              <span className="spn-import-model" onClick={setShowModal.bind(null, true)}>
                引用数据模型
              </span>
            </div> */}
            <div className="btn-list ">
              <Button className="btn-item" size="mini" onClick={onDeleteNode}>
                <SvgDelete width="16px" height="16px" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmptyItem;
