import { css } from '@emotion/css';

export const ImportModalWrapper = css`
  .apipost-modal-container {
    width: 800px;
  }
  .hope-import-content {
    height: 100%;
  }
`;

export const CreateModalWrapper = css`
  .apipost-modal-container {
    width: 525px;
    height: 366px;
  }

  .create-hope {
    height: 190px;
    display: flex;
    color: var(--font-3);
    flex-direction: column;
    justify-content: space-between;
    &-code {
      display: flex;
      align-items: center;
      justify-content: space-between;
      > div {
        width: 222px;
      }
    }
    &-default {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 16px 0 0 0;
    }
    .panel-item {
      margin: 16px 0 0 0;
      .apipost-select {
        width: 100%;
      }
    }
  }
`;

export const SmartModalWrapper = css`
  .apipost-modal-container {
    width: 800px;
  }
`;
