import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const RequestWrapper = styled.div`
  border: 1px solid var(--border-color-default);
  margin: 0 8px;
  padding: 8px;
  border-radius: var(--border-radius-default);
  &:hover {
    border-color: var(--border-color-strong);
  }

  .request-title {
    padding: 0 8px;
    height: 30px;
    display: flex;
    font-size: var(--size-12px);
    font-weight: 500;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    // border-radius: var(--border-radius-default);
    border-bottom: var(--border-color-default) 1px solid;
    &:hover {
      color: var(--content-color-primary);
      // background-color: var(--background-color-tertiary);
      svg {
        fill: var(--content-color-primary) !important;
      }
    }
    span {
      font-weight: 500;
      // flex: 0 0 60px;
    }
    .right-btns {
      // flex: 1;
      svg {
        width: 16px;
        height: 16px;
        cursor: pointer;
        fill: var(--content-color-secondary);
      }
    }
  }

  .apipost-req-wrapper {
    // padding: 0 8px;
    // padding-left: 0;
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
      .apipost-btn {
        background-color: transparent;
      }
      .apipost-btn {
        background-color: transparent;
      }
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
    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  }
`;
