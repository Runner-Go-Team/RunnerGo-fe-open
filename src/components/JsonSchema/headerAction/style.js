import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const HeaderActionWrap = styled.div`
  width: 100%;
  height: 32px;
  line-height: 32px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: none;
  .action-left{
    .apipost-btn-default {
          border: 1px solid var(--theme-color);
          color: var(--theme-color);
          margin-left: 8px;
          line-height: 24px;
          height: 24px;
        }
  }
  .apipost-light-btn {
    width: auto;
    height: 24px;
    padding: 4 8px;
    background-color: var(--select-hover);
    color: var(--font-3);
    &:hover {
      background-color: var(--select-hover);
      color: var(--content-color-primary);
    }
  }

  .preview-btn {
    margin-left: 10px;
  }

  .apipost-brand-hover {
    background-color: var(--highlight-background-color-tertiary);
    color: var(--base-color-brand);
  }
`;

export const ImportModalWrapper = css`
  .apipost-modal-container {
    width: 800px;
  }
  .hope-import-content {
    height: 100%;
    margin-bottom: 53px;
    .apipost-design-tabs-header {
    display: flex;
    align-items: center;
    padding: 8px;
    padding-bottom: 0;
    color: var(--content-color-fourth);
    margin-bottom: 16px;
    .header-list{
      display: flex;
      background-color: var(--bg);
    }
    .header-item {
    display: flex;
    background-color: var(--bg);
    min-width: 100px;
    padding: 4px 8px;
    border-bottom: none;
    color: var(--font-color);
    position: relative;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    max-width: 220px;
    overflow: hidden;
    word-break: keep-all;
    &:hover,
    &.active{
      background: var(--send-select-10);
      color: var(--font-1);
      border-radius: 3px 3px 0px 0px;
    font-weight: 500;
    }
    &.active::before{
      content: "";
    width: 100%;
    height: 2px;
    background-image: radial-gradient(65.2% 1878.95% at 47.3% 100%, #3C63EC 0%, rgba(58, 113, 255, 0) 100%);
    position: absolute;
    bottom: 0;
    left: 0;
    }
}
}
  }
`;