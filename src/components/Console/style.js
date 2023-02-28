import { css } from '@emotion/css';

export const ConsoleWrapper = css`
  position: absolute;
  z-index: 100;
  bottom: 37px;
  left: 0;
  height: 600px;

  .level-item {
    padding: 0 0 0 16px;
    line-height: 18px;
    user-select: text !important;
    .apipost-level {
      user-select: text !important;
    }
    > div {
      user-select: text !important;
      &:hover {
        color: var(--content-color-primary);
      }
    }
  }

  .scale-item:first-child {
    // display: none;
  }
  .scale-item-content {
    height: 100%;
    overflow: hidden;
  }
  .apipost-console {
    height: 100%;
    background-color: var(--background-color-secondary);
    svg {
      fill: var(--content-color-secondary);
      width: 12px;
      height: 12px;
    }
    strong {
      font-weight: 600;
      margin-right: 8px;
      color: var(--content-color-primary);
    }
    &-header {
      width: 100%;
      height: 46px;
      padding: 0 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left {
        display: flex;
        align-items: center;
      }
      .header-right {
        display: flex;
        align-items: center;
      }
      .header-right > div {
        margin-left: 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        &:hover {
          color: var(--content-color-primary);
        }
      }
    }
    &-content {
      height: calc(100% - 46px);
      overflow: auto;
      color: var(--content-color-secondary);
      .item {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 0 8px;
        margin: 0 0 8px 0;
        .Request_URL {
          margin-left: 8px;
        }
      }
      .time,
      .code,
      .reqTime {
        flex-grow: 0;
        flex-shrink: 0;
      }
      .time {
        width: 60px;
      }
      .req-body {
        flex: 1;
      }
      .code {
        width: 78px;
        color: var(--content-color-secondary);
      }
      .error {
        color: red;
      }
      .reqTime {
        display: flex;
        width: 85px;
        align-items: center;
        color: var(--content-color-secondary);
      }
    }
  }
`;
