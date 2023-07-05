import { css } from '@emotion/css';

export const itemWrapper = css`
  display: flex;
  flex-direction: row;
  align-items: center;

  .txt-description {
    flex: 1;
    border-color: transparent;
  }
  .item-manage {
    width: 120px;
    padding-right: 10px;
    display: flex;
    justify-content: flex-end;

    .btn-item {
      margin-left: 10px;
      width: 20px;
      height: 20px;
      padding: 0;
    }
  }
`;

export const itemModel = css`
  display: none;
`;
