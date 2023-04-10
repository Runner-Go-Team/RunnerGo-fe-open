import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const MenuTreeNode = styled.div`
  & .btn-more {
    display: none;
  }
  &:hover {
    // background: var(--highlight-background-color-secondary);
    .btn-more {
      display: flex;
      background-color: var(--select-hover);
    }
  }
  .tree-node-inner {
    flex: 1;
    padding: 0 5px;
    display: flex;
    align-items: center;
    flex-direction: row;
    border-radius: 0;
    color: var(--font-3);

    svg {
      fill: var(--font-3);
    }
  }

  .apipost-tree-node-title {
    flex: 1;
    width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
  }

  .tree-node-inner:hover {
    background-color: var(--border-line);
    color: var(--font-1);

    svg {
      fill: var(--font-1);
    }
  }
  .tree-node-inner-selected {
    background-color: var(--border-line);

    &:hover {
        background-color: var(--border-line);
    }

    color:var(--font-1);

    svg {
        fill: var(--font-1);
    }

    .apipost-btn {
        background-color: var(--border-line);
    }
}
`;

export const TreeIcon = css`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: pointer;
  .icon-status {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
`;

export const TreeMenuItem = css`
  min-width: 88px;
  height: 28px;
  padding: 0 8px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;