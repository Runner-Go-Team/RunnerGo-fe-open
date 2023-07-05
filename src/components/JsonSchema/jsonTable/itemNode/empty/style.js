import { css } from '@emotion/css';

export const emptyWarper = css`
  padding-left: 5px;
  position: relative;
  .indent-panel {
    height: 100%;
  }
  .schema-text-box {
    border: none;
    width: 200px;
    input {
      min-width: 0;
    }
  }
  .text-panel {
    flex: 1;
    .spn-import-model {
      margin-left: 5px;
      color: var(--base-color-brand);
      cursor: pointer;
      &:hover {
        color: var(--highlight-background-color-brand);
      }
    }
  }
  .btn-list {
    padding-right: 10px;
    .btn-item {
      margin-left: 10px;
    }
  }
`;
