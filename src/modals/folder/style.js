import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const FolderModal = css`
  .apipost-modal-container {
    width: 535px;
    height: 398px;
    max-width: 80%;

    .apipost-modal-header {
      padding-bottom: 16px;
    }

    .apipost-modal-body {
      padding-top: 0;
    }
  }
`;

export const FolderWrapper = styled.div`
  height: 100%;
  .script-box-scriptlist {
    height: 100%;
  }

  display: flex;
  flex-direction: column;
  > .apipost-tabs {
    flex: 1;
    height: 0;
    .apipost-tabs-content {
      height: calc(100% - 30px);
      min-height: 200px;
      overflow: auto;
    }
  }
  .article {
    .items {
      display: flex;
      margin-top: 16px;
      flex-direction: column;
      .name {
        min-width: 60px;
        color: var(--content-color-primary);
        font-size: var(--size-12px);
        white-space: nowrap;
        margin-right: 10px;
      }
      .content {
        margin-top: 4px;
        flex: 1;
        .arco-input {
          background: var(--scene-api-line);
          border-radius: 5px;
        }

        .arco-textarea {
          background: var(--scene-api-line);
          border-radius: 5px;
          height: 59px;
        }

        .arco-textarea:hover {
          background-color: var(--select-hover);
        }
      }
    }
    .arco-select {
      background-color: var(--bg);
      border: none;
      width: 100%;
      .arco-select-view {
        background-color: var(--bg);
      }
    }
  }
  .english-name {
    min-width: 116px !important;
  }
`;
