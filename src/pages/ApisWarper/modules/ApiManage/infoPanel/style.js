import { css } from '@emotion/css';

export const DropWrapper = css`
  background-color: var(--bg);
  max-width: 267px;
  max-height: 260px;
  overflow: hidden;
  overflow-y: auto;
  .drop-item {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;
    svg {
      fill: var(--content-color-secondary);
    }
    &:hover {
      svg {
        fill: var(--content-color-primary);
      }
      background-color: var(--module);
    }
  }
  &.backup {
    width: 100px;
  }
`;
