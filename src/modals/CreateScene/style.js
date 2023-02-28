import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const FolderModal = css`
  .apipost-modal-container {
    width: 536px;
    height: 340px;
    max-width: 80%;
    max-height: 80%;
    position: relative;

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
  }
  .apipost-select {
    width: 300px;
  }
}
`;
