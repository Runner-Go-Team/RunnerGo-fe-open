import { css } from '@emotion/css';

export const ImportModal = css`
  .apipost-modal-container {
    width: 536px;
    min-height: 350px;
    border-radius: 10px;

    .apipost-modal-header {
      line-height: 22px;
    }

    .apipost-modal-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: var(--scene-api-line);
      color: var(--font-1);
      .apipost-btn-default {
        background-color: var(--module);
        border-radius: 5px;
      }

      .apipost-btn:last-child {
        background-color: var(--theme-color) !important;
      }
    }
  }
  .import-title {
    margin: 4px 0 8px 0;
    font-size: var(--size-12px);
    color: var(--content-color-secondary);
  }
  .import-select {
    width: 100%;
  }
  .checkFile {
    width: 100%;
    height: 32px;
    border: var(--border-color-default) 1px solid;
    background-color: var(--background-color-primary);
    border-radiu: 4px;
    position: relative;

    .file-name {
      line-height: 32px;
      padding: 0 8px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .upload {
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;
    }
  }
  .import-tabs {
    display: flex;
    align-items: center;
    margin: 0 0 16px 0;
    .tab-item {
      display: flex;
      align-items: center;
      width: 96px;
      height: 25px;
      border-radius: 3px;
      cursor: pointer;
      margin: 0 8px 0 0;
      border-bottom: transparent 2px solid;
      &.active {
        border-bottom: var(--base-color-brand) 2px solid;
        border-radius: 3px 3px 0px 0px;
      }
    }
  }
`;

export const AutoImportWrapper = css`
  .import-switch {
    display: flex;
    align-item: center;
    margin: 16px 0 0 0;
    padding: 8px;
    .prompt {
      color: #ed6a5f;
      margin-left: 16px;
    }
  }
  .apipost-switch {
    margin: 0 0 0 16px;
  }
  .import-flex {
    display: flex;
    align-items: center;
    padding: 8px;
    margin: 16px 0 0 0;
    .apipost-radio-wrapper {
      font-size: var(--size-12px);
      color: var(--content-color-secondary);
    }
    .import-label {
      width: 74px;
      margin: 0 16px 0 0;
    }
    .import-mandatory {
      color: red;
    }
    .apipost-input-inner-wrapper {
      flex: 1;
    }
  }
  .import-setting {
    padding: 8px;
    .setting-title {
      font-size: var(--size-14px);
      line-height: 20px;
      margin: 0 0 16px 0;
    }
    .setting-select-wrapper {
      display: flex;
      align-items: center;
      margin: 0 0 16px;
      .select-label {
        margin: 0 10px 0 0;
      }
      .apipost-select {
        width: 278px;
      }
      .settin-basepath {
        display: flex;
        align-items: center;
      }
    }
  }
`;
