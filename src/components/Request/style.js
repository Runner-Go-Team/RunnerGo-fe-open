import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const RequestWrapper = styled.div`
  height: 100%;
  .apipost-tabs {
    height: 100%;
    &-content {
      height: calc(100% - 30px);
    }
  }
  .apipost-req-wrapper {
    // padding: 0 8px;
    // padding-left: 0;
    height: 100%;
    overflow: auto;
    // overflow-y: hidden;
    .system-header {
      margin: 0 0 8px 0;
      .title {
        margin: 0 0 8px 0;
        cursor: pointer;
        color: var(--content-color-secondary);
        display: flex;
        align-items: center;
        svg {
          width: 14px;
          height: 14px;
          margin: 0 0 0 4px;
          fill: var(--content-color-secondary);
        }
      }
    }
    .request-import {
      display: flex;
      align-items: center;

      .import-btn {
        height: 26px;
        margin-right: 24px;
        display: flex;
        color: var(--content-color-secondary);
        align-items: center;
        cursor: pointer;
        white-space: nowrap;
        svg {
          width: 14px;
          height: 14px;
          fill: var(--content-color-secondary);
        }
      }
    }
    &-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 8px 0;
      .body-type {
        display: flex;
        align-items: center;
        flex: 1;
        padding: 8px 0;
        height: 48px;
      }
    }
    .body-none {
      text-align: center;
      margin: 24px;
    }
    .response-example {
      height: calc(100% - 48px);
    }
  }
`;

export const ImportDropdownWrapper = css`
  > div {
    height: 36px;
    padding: 0px 8px;
    margin-bottom: 4px;
    border-radius: 0;
    display: flex;
    font-size: var(--size-12px);
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    &:hover {
      background-color: var(--highlight-background-color-primary);
    }
  }
`;
