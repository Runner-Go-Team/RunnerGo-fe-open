import { css } from '@emotion/css';

export const GenerateWrapper = css`
  .apipost-drawer-content {
    height: calc(100% - 48px);
  }
  .generate-wrapper {
    display: flex;
    height: 100%;

    &-menu {
      width: 212px;
      height: 100%;
      overflow: auto;
      padding: 8px;
      border-right: 1px solid var(--border-color-default);

      .menu-item {
        width: 100%;
        height: 32px;
        line-height: 16px;
        padding: 8px;
        border-radius: var(--border-radius-default);
        margin: 0 0 4px 0;
        cursor: pointer;

        &:hover,
        &.active {
          color: var(--content-color-primary);
          background: var(--highlight-background-color-tertiary);
        }
      }
    }

    &-editor {
      flex: 1;
      padding: 0 8px;
    }
  }
`;
