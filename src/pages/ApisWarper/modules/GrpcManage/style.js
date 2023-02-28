import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const GrpcWrapepr = styled.div`
  height: 100%;
  background: var(--background-color-primary);
  .grpc-content {
    flex: 1;
    height: 100%;
    &-scale {
      height: calc(100% - 62px);
    }
  }
  .apipost-tabs {
    height: 100%;
    .apipost-tabs-content {
      height: calc(100% - 30px);
    }
  }
  .grpc-body {
    display: flex;
    height: calc(100% - 40px);
    .grpc-folder {
      border-right: var(--border-color-default) 1px solid;
      .apipost-tree {
        padding: 8px 0;
      }
    }
  }
  .scale-item-content {
    height: 100%;
  }
  .response-scale {
    height: 0;
  }
  .grpc-url-panel {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 8px;
    .grpc-url-panel-item {
      height: 28px;
      overflow: hidden;
      margin-left: 8px;
      display: flex;
      align-items: center;
      &.apipost-blue-btn {
        width: 60px;
      }
    }
    > .apipost-input-inner-wrapper {
      flex: 1;
      margin: 0 8px;
      max-width: 500px;
    }
    .grpc-certificate {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      border-radius: 3px;
      margin: 0 8px 0 0;
      cursor: pointer;
      .apipost-btn {
        height: 28px;
      }
    }
  }
`;

export const GrpcTreeWrapper = css`
  width: 286px;
  height: 100%;
  padding: 8px;

  .filter-box {
    display: flex;
    align-items: center;
    .apipost-input-inner-wrapper {
      flex: 1;
      width: 0;
      margin: 0 8px 0 0;
      height: 28px;
    }
    .apipost-orange-btn {
      height: 28px;
    }
  }

  .apipost-tree {
    height: calc(100% - 40px);
  }

  .grpc-tree {
    . {
      background-color: var(--highlight-background-color-tertiary);
      color: var(--content-color-primary);
    }
  }
`;

export const ImportModalWrapper = css`
  .apipost-modal-container {
    width: 508px;
  }
  .import-tabs {
    display: flex;
    .tab-item {
      display: flex;
      align-items: center;
      padding: 0 14px;
      width: 76px;
      height: 25px;
      border-bottom: 2px solid transparent;
      cursor: pointer;

      &.active {
        border-bottom: var(--base-color-brand) 2px solid;
        border-radius: 3px 3px 0px 0px;
      }
    }
  }
  .tab-content {
    width: 100%;
    height: 208px;
  }
  .proto-upload {
    width: 120px;
    margin: 68px auto 0;
    position: relative;
    .upload {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      cursor: pointer;
      z-index: 1;
    }
    .file-name {
      margin: 8px 0 0 0;
    }
    .apipost-blue-btn {
      background-color: var(--base-color-info);
      color: var(--content-color-constant);
      font-weight: 500;
      &:focus,
      &:hover {
        background-color: var(--highlight-background-color-info);
        color: var(--content-color-constant);

        svg {
          fill: var(--content-color-constant);
        }
      }
    }
  }
  .online-url {
    margin: 16px 0 4px 0;
  }
  .import-interval {
    margin: 16px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--size-12px);
    .apipost-blue-btn {
      width: 160px;
    }
    .apipost-radio-wrapper {
      font-size: var(--size-12px);
      color: var(--content-color-secondary);
    }
    .interval-name {
      margin: 0 8px 0 0;
    }

    .apipost-blue-btn {
      background-color: var(--base-color-info);
      color: var(--content-color-constant);
      font-weight: 500;
      &:focus,
      &:hover {
        background-color: var(--highlight-background-color-info);
        color: var(--content-color-constant);

        svg {
          fill: var(--content-color-constant);
        }
      }
    }
  }
`;

export const GenerateWrapper = css`
  .apipost-drawer-content {
    height: calc(100% - 48px);
  }
  .generate-wrapper {
    display: flex;
    height: 100%;

    &-editor {
      flex: 1;
      padding: 0 8px;
    }
  }
`;
