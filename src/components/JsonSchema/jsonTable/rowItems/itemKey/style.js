import { css } from '@emotion/css';

export const keyWarper = css`
  padding-left: 5px;
  position: relative;
  .indent-panel {
    height: 100%;
  }

  .expand-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;

    svg {
      width: 12px;
      height: 12px;
      fill: #666666;
    }
  }

  .empty-btn {
    width: 20px;
    height: 20px;
  }

  .schema-text-box {
    border: none;
    margin-left: 8px;
    min-width: 0;
    height: 100%;
    width: 0;
    flex: 1;
    min-width: 0;
    background-color: transparent;
    color: var(--content-color-fourth);
  }
  .item-type {
    border-color: transparent;
    background-color: transparent;
    display: flex;
    .sel-title {
      width: 45px;
      margin-right: 10px;
    }
    .spn-require {
      width: 16px;
      height: 16px;
      line-height: 20px;
      text-align: center;
      background-color: var(--scene-border);
      /* display: flex; */
      /* justify-content: center;
      align-items: center; */
      border-radius: 2px;
      &.checked {
        color: var(--sub-color-5);
      }
    }
    &:hover {
      border-color: var(--sub-color-5) !important;
    }
  }
`;
