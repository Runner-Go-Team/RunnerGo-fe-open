import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const RequestWrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: var(--module);
  padding-top: 8px;
  .apipost-table {
    margin-top: 8px;
  }
  .apipost-table-td {
    border-color: var(--border-line) !important;
  }
  .apipost-table-th {
    .apipost-table-td {
      .apipost-table-cell {
        background-color: var(--bg);
      }
    }
  }
  .apipost-table-tr {
    .apipost-table-td {
      background-color: var(--module) !important;

      svg {
        fill: var(--font-1);
      }

      .apipost-input-inner-wrapper:hover {
        background-color: var(--select-hover) !important;
      }
    }
  }
  .apipost-table-td {
    color: var(--font-1);
    height: 24px;
    .apipost-table-cell {
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 24px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;

        .apipost-input-inner-wrapper {
            height: 24px;
        }
        .apipost-select {
          height: 24px;
        }

        .apipost-textarea-wrapper, .apipost-textarea {
          width: 100%;
        }
    }
}
  .tabs-item {
    width: auto !important;
  }
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
    padding-bottom: 50px;
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

        .apipost-select {
          background-color: transparent;
          margin-top: 5px;
        }
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
