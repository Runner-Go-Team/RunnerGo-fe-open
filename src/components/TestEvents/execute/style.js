import { css } from '@emotion/css';

export const SingleApiPanel = css`
  display: flex;

  .single-api-list {
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: auto;
    .single-main {
      display: flex;
      align-items: center;
      height: 42px;
      padding: 0 8px;
      margin: 0 0 10px 0;

      /* 暗黑模式/3 */
      // background: var(--bg-3);

      /* 颜色/橙禁用 */
      // border: 1px solid rgba(58, 134, 255, 0.5);
      /* 常规小阴影 */

      // box-shadow: var(--shadow);
      border-radius: var(--border-radius-default);
      .status-panel {
        width: 22px;
        height: 22px;
        margin: 0 8px 0 0;
      }
      .api-msg {
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        cursor: pointer;
        &:hover {
          background-color: var(--highlight-background-color-primary);
        }
      }
      .api-method {
        margin: 0 8px 0 0;
        width: 48px;
        font-size: 12px;
        text-align: center;
        overflow: hidden;
      }
      .api-name {
        width: 92px;
        margin: 0 8px 0 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .api-url {
        flex: 1;
      }
      .ctrl-panel {
        width: 96px;
        height: 26px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > span {
          border-left: 1px solid #e9e9e9;
          padding: 0 0 0 4px;
        }
      }
    }
    .openDetail {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid var(--border-color-default);
      border-radius: 3px;
      margin: 0 0 0 8px;
      color: var(--content-color-primary);
      svg {
        fill: var(--content-color-primary);
      }
    }
  }
`;
