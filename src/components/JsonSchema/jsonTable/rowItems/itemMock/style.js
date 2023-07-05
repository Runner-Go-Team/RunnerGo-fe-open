import { css } from '@emotion/css';

export const keyWarper = css`
  /* padding-left: 5px; */
  position: relative;

  .item-mock {
    width: 100%;
    float: left;
    .apipost-input-inner-wrapper {
      /* width: calc(100% - 10px); */
      float: left;
      border-color: transparent;
      display: flex;
      input {
        flex: 1;
        margin-right: 10px;
      }
      .spn-require {
        width: 16px;
        cursor: pointer;
        height: 16px;
        text-align: center;
        line-height: 20px;
        background-color: var(--scene-border);
        /* display: flex;
        justify-content: center;
        align-items: center; */
        border-radius: 2px;
        &.checked {
          color: var(--sub-color-5);
        }
      }
    }
  }
`;
