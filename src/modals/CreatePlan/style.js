import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const FolderModal = css`
  .apipost-modal-container {
    width: 632px;
    height: 380px;
    max-width: 80%;
    max-height: 80%;

    .apipost-table-td {
        width: auto;
        overflow: hidden;
    }

    .apipost-modal-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: var(--scene-api-line);
      .apipost-btn-default {
        background-color: var(--module);
        border-radius: 5px;
      }
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
    // display: flex;
    // flex-direction: column;
    
    .article-item {
        display: flex;
        flex-direction: column;
        margin-top: 20px;

        .arco-input {
          background-color: var(--scene-api-line);
          border-radius: 5px;
          border: none;
        }

        .arco-textarea {
          background-color: var(--scene-api-line);
          border-radius: 5px;
          border: none;
        }

        p {
            margin-bottom: 4px;
        }
    }

    .task-type {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .apipost-radio-group {
        margin-left: 10px;
      }

      .cron-task-explain {
        display: flex;
        align-items: center;
        margin-left: 15px;
        color: var(--font-3);

        svg {
          width: 15px;
          height: 15px;
          fill: var(--font-3);
        }

        p {
          margin-left: 6px;
        }
      }
    }
  }
  .apipost-select {
    width: 300px;
  }
}
`;
