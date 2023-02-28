import { css } from '@emotion/css';

export const HeaderWrapper = css`
  width: 100%;
  height: 92px;
  background: var(--background-color-primary);

  .header-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: content-box;
    padding: 8px 8px 0;
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
    &-right {
      display: flex;
    }
  }
  .header-url {
    display: flex;
    padding: 8px;
    align-items: center;
    .apipost-blue-btn {
      height: 40px;
      width: 100px;
    }
    .api-url-panel-group {
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: row;
      margin-right: 8px;
      border-radius: var(--border-radius-default);
      border: 1px solid var(--border-color-strong);
      background-color: var(--background-color-tertiary);

      .apipost-select {
        border: 0;
        border-radius: 0;
        border-right: 1px solid var(--border-color-strong);
        width: 100px;
        overflow: hidden;
        padding: 0 8px;
        border-bottom-left-radius: var(--border-radius-default);
        border-top-left-radius: var(--border-radius-default);
        background-color: var(--background-color-primary);

        .apipost-select-view-text {
          justify-content: center;
          font-size: var(--size-12px);
          color: var(--content-color-primary);
        }
      }

      .apipost-input-inner-wrapper {
        height: 36px;
        padding: 0;
        border: 0;
        border-radius: 0;
        border-bottom-right-radius: var(--border-radius-default);
        border-top-right-radius: var(--border-radius-default);
        background-color: var(--background-color-primary);

        input {
          padding: 0 8px;
          color: var(--content-color-primary);
        }
      }
    }
  }
`;
export const DropWrapper = css`
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
