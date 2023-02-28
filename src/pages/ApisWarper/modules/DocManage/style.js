import { css } from '@emotion/css';

export const DocWrapper = css`
  height: 100%;
  .doc-header {
    overflow: hidden;

    &-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 28px;
      box-sizing: content-box;
      padding: 8px 8px 0;
      .apistatus {
        border: 0;
      }
    }

    &-input {
      height: 40px;
      margin: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .apipost-btn {
        margin: 0 0 0 16px;
      }
    }
  }
  .markdown-box {
    margin: 1px 0 0 0;
    height: calc(100% - 129px);
    padding: 8px;
    background: var(--background-color-primary);
  }
`;
