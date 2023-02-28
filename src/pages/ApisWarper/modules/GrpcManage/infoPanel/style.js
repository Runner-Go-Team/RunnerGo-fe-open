import { css } from '@emotion/css';

export const InfoPanelWrapper = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  // margin-top: 8px;
  border-bottom: var(--border-color-default) 1px solid;
  .btn-group {
    display: flex;
    & > div {
      margin: 0 2px;
    }
  }

  .api-name-group {
    flex: 1;
    display: flex;
    align-items: center;
    border-radius: var(--border-radius-default);
    background-color: var(--background-color-tertiary);
    overflow: hidden;
    border: 1px solid var(--border-color-strong);
    margin-right: 8px;

    .apistatus {
      .apistatus-current {
        width: 100px;
        height: 28px;
        text-align: center;
        color: var(--content-color-primary);
      }
    }

    .apipost-input-inner-wrapper {
      flex: 1;
      margin: 0;
      padding: 0;
      border: 0;
      height: 28px;
      background-color: var(--background-color-primary);
      border-radius: 0;

      input {
        padding: 0 8px;
        color: var(--content-color-primary);
      }
    }
  }

  .grpc-desc-btn {
    height: 28px;
    margin-right: 8px;
  }
  .btn-mini-save {
    .arrow-icon {
      margin-left: 5px;
      padding-left: 5px;
      border-left: 1px solid var(--border-color-default);
    }
  }
`;

export const SaveDropWrapper = css`
  background-color: var(--background-color-primary);
  max-width: 267px;
  max-height: 260px;
  overflow: hidden;
  overflow-y: auto;
  .drop-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    &:hover {
      background-color: var(--highlight-background-color-primary);
    }
  }
  &.backup {
    width: 100px;
  }
`;
