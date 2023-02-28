import { css } from '@emotion/css';

export const RecycleModalWrapper = css`
  .apipost-modal-container {
    width: 800px;
    height: 614px;
    max-height: 80%;

    .apipost-modal-body {
      padding-bottom: 90px;
    }

    .apipost-modal-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: var(--scene-api-line);
    }
  }

  .apipost-input-inner-wrapper {
    background-color: var(--bg);
    border-radius: 5px;
    border: 1px solid var(--module);
  }

  .btn-restore {
    color: var(--font-3);
    svg {
      fill: var(--font-3);
    }
  }

  .btn-restore: hover {
    background-color: var(--select-hover);
    color: var(--font-1);
    svg {
      fill: var(--font-1);
    }
  }

  .folder-list {
    margin-top: 24px;
    height: 470px;
    overflow: hidden;
    overflow-y: auto;
    .item-li {
      height: 49px;
      display: flex;
      align-items: center;
      flex-direction: row;
      border-radius: var(--border-radius-default);
      &:hover {
        background-color: var(--bgr1);
      }
      & .item-title {
        width: 0;
        flex: 1;
        flex-shrink: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-left: 16px;
      }
    }
  }

  .folder-list {
    .item-li {
      min-height: 91px;
    }
  }

  .apis-list {
    margin-top: 24px;
    height: 470px;
    overflow: hidden;
    overflow-y: auto;
    .item-li {
      min-height: 91px;
      display: flex;
      align-items: center;
      flex-direction: row;
      border-radius: var(--border-radius-default);
      &:hover {
        background-color: var(--bgr1);
      }
      & .item-titles {
        padding-left: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
        .titles {
          display: flex;
          dd {
            max-width: 80%;
            overflow: hidden;
            padding-left: 4px;
          }
        }
        .urls {
          padding-top: 5px;
          color: var(--fn3);
          word-break: break-all;
        }
      }
    }
  }

  .btns {
    min-width: 190px;
    display: flex;
    justify-content: space-around;
    .btn-delete {
      color: var(--delete-red);
      svg {
        fill: var(--delete-red);
      }
    }

    .btn-delete: hover {
      background-color: var(--select-hover);
    }
  }

  .recycle-modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .cancel-btn {
      background-color: var(--module);
      color: var(--font-1);
      margin-right: 16px;
      border-radius: 5px;
    }

    .refresh-btn {
      background-color: var(--theme-color);
      color: var(--common-white);
      border-radius: 5px;
    }
  }
`;
