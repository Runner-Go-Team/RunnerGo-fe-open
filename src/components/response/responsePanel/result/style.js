import { css } from '@emotion/css';

export const ResultTabs = css`
  height: 100%;
  .rawhtml {
    line-height: 18px;
    padding: 0 8px;
    user-select: text !important;
  }
  > .apipost-response-tabs-content {
    height: calc(100% - 36px);
    overflow: auto;
    margin: 8px 0 0 0;
    .total {
      color: var(--base-color-success);
    }
  }

  .apipost-response-tabs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;

    &.fit-for-response-body {
      .tabs-item {
        position: relative;
        span.error,
        span.success {
          position: absolute;
          width: 6px;
          height: 6px;
          display: inline-block;
          border-radius: 50%;
        }
        span.success {
          background: var(--base-color-success);
        }
        span.error {
          background: var(--base-color-error);
        }
      }
    }
    .header-left {
      flex: none;
      display: flex;
      height: 28px;
      padding: 1px;
      border-radius: var(--border-radius-default);
      border: 1px solid var(--border-line);
      align-items: center;

      .tabs-item {
        width: auto !important;
        height: 24px;
        line-height: 24px;
        padding: 0 8px;
        color: var(--content-color-secondary);
        border-radius: 3px;
        cursor: pointer;
        background-color: transparent;
        &:not(:last-of-type) {
          margin: 0 8px 0 0;
        }
        &.active {
          color: var(--content-color-primary);
          background-color: var(--border-line);
        }
      }
    }

    .tabs-item.active::before {
      width: 0;
      height: 0;
    }

    .head-extra {
      flex: 1;
      display: flex;
      justify-content: space-between;
      width: 0;
      &-left {
        display: flex;
        align-items: center;
        .icon-box {
          width: 16px;
          height: 24px;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          cursor: pointer;

          svg {
            fill: var(--font-3);
          }

          svg:hover {
            fill: var(--font-1);
          }
        }
      }
      svg {
        fill: var(--content-color-secondary);
      }
      &-right {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: var(--content-color-secondary);
        svg {
          fill: var(--font-3);
        }

        svg:hover {
          fill: var(--font-1);
        }
      }
    }
  }
`;

export const CheckAndAssertWrapper = css`
  padding: 8px;
  .assert-title {
    padding: 8px 0;
  }
  .apipost-switch {
    margin-right: 8px;
  }
  .check-result {
    .check-top {
      display: flex;
      align-items: center;
      padding: 0 4px;
      .apipost-select {
        height: 28px;
        margin-left: 8px;
      }
    }
    .check-result-group {
      padding: 8px 4px;
      .check-result-item {
        display: flex;
        align-items: center;
        &:not(:last-of-type) {
          margin: 0 0 8px 0;
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }
      .check-true {
        color: var(--run-green);
        svg {
          fill: var(--run-green);
        }
      }
      .check-false {
        color: var(--delete-red);
        svg {
          fill: var(--delete-red);
        }
      }
    }
  }
  .assert {
    padding: 0 4px;
    .assert-item {
      border-radius: 3px;
      background-color: transparent;
      color: var(--content-color-secondary);
      min-height: 24px;
      line-height: 2em;
      margin-bottom: 4px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      svg {
        margin: 0 4px 0 0;
      }
      &.faild {
        background: rgba(255, 76, 76, 0.1);
      }
      &.success {
        background: rgba(60, 192, 113, 0.08);
      }
    }
  }
`;

export const VisualWrapper = css`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 123px;
    height: 25px;
    margin: 10px auto 0;
    border-radius: var(--border-radius-default);
    color: var(--content-color-secondary);
    background: var(--background-color-secondary);
    cursor: pointer;
    svg {
      width: 14px;
      height: 14px;
      fill: var(--content-color-secondary);
    }
  }
`;
