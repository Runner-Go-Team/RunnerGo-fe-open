import { css } from '@emotion/css';

export const linkWarper = css`
  width: 100%;

  .tree-panel {
    height: 300px;
    margin-top: 10px;
    overflow: auto;

    .apipost-tree-node {
      color: var(--content-color-fourth);
      &:hover {
        background-color: rgba(0, 0, 0, 0.03);
      }
    }

    .icon-svg {
      width: 15px;
      height: 15px;
      fill: var(--content-color-fourth);
    }
    .apipost-tree-node-line {
      margin-left: 15px;
    }
    .apipost-checkbox {
      margin-right: 5px;
    }
  }
  .empty-list {
    height: 310px;
    box-sizing: border-box;
    padding-top: 120px;
    text-align: center;
  }
`;
