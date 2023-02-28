import { css } from '@emotion/css';

export const ApisWrapper = css`
  .left-menus {
    background-color: #222226;
  }
  .left-menus > .scale-item-content {
    height: 100%;
    display: flex;
    background-color: var(--bg-2);
  }
  .right-apis {
    margin: 0 2px;
  }
  .right-apis > .scale-item-content {
    background-color: var(--bg-2);
    display: flex;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    flex-direction: column;
    position: relative;
  }
  .right-apis > .scale-item-content > .empty {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .create-btn {
      min-width: 159px;
      height: 45px;
      background-color: var(--theme-color);
      color: #fff;
      font-size: 24px;
      box-shadow: var(--shadow);
      border-radius: 8px;

      svg {
        width: 23px;
        height: 23px;
        fill: #fff;
        margin-right: 10px;
      }
  }
`;

export const ApiManageWrapper = css`
  height: 0;
  flex: 1;
`;

export const ApiHeaderWrapper = css`
  .api-manage-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 1px;
    border-radius: var(--border-radius-default);
    border: 1px solid var(--border-color-strong);
    .enviroment-panel {
      border-left: 1px solid var(--border-color-strong);
      height: 100%;
    }
    .manage-item {
      display: flex;
      white-space: nowrap;
      padding: 0 6px;
      margin-left: 6px;
      height: 24px;
      line-height: 24px;
      border-radius: 3px;
      align-items: center;
      color: var(--content-color-secondary);
      cursor: pointer;
      svg {
        fill: var(--content-color-secondary);
      }
      &:hover {
        color: var(--content-color-primary);
        border-color: 0;
        background-color: var(--highlight-background-color-tertiary);
        svg {
          background-color: var(--highlight-background-color-tertiary);
          fill: var(--content-color-primary);
        }
      }
    }
    .bak-item,
    .bak-svg {
      display: flex;
      align-self: center;
      cursor: pointer;
      svg {
        background-color: var(--highlight-background-color-tertiary);
        fill: var(--content-color-primary);
      }
    }

    .apipost-btn {
      height: 24px;
    }
  }

  .btn-save {
    width: 84px;
    height: 24px;
    background: var(--log-blue);
    color: var(--font-1)fff;
    border-radius: 3px;
    display: flex;
    align-items: center;
    .left {
      height: 100%;
      padding: 0 8px;
      border-radius: 3px 0 0 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      cursor: pointer;
    }
    .right {
      width: 24px;
      height: 24px;
      border-radius: 0 3px 3px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border-left: 1px solid rgba(0, 0, 0, 0.06);
    }
    svg {
      fill: var(--font-1)fff;
    }
  }
  @media screen and (max-width: 1400px) {
    .manage-item {
      & > span,
      .only-large {
        display: none;
      }
    }
  }
`;

// 自定义tabs header样式
export const CustomTabHeader = css``;
