import { css } from '@emotion/css';

export const modelWarper = css`
  position: relative;
  .outer-box {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    border: 1px solid transparent;
    z-index: 201;
    .edit-form {
      width: 200px;
      height: 26px;
      position: absolute;
      top: -26px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--base-color-brand);
      // display: flex;
      align-items: center;
      justify-content: space-around;
      border-radius: 4px 4px 0px 0px;
      display: none;

      .btn-item {
        width: auto;
        height: 18px;
        padding: 0 4px;
        border-radius: 3px;
        display: flex;
        align-items: center;
        color: var(--content-color-constant);
        white-space: nowrap;
        cursor: pointer;
        svg {
          width: 15px;
          height: 15px;
          fill: var(--content-color-constant);
          margin-right: 3px;
        }

        &:hover {
          background-color: var(--highlight-background-color-brand);
        }
      }
    }
  }

  &:hover {
    .outer-box {
      border-color: var(--base-color-brand);
      cursor: not-allowed;
      .edit-form {
        display: flex;
      }
    }
    .data-item {
      cursor: not-allowed;

      .apipost-input {
        cursor: not-allowed;
      }
    }
    .is-model-item {
      z-index: 202;
    }
  }
  .expand-btn {
    z-index: 202;
    position: relative;
  }
  .loop-link-item {
    height: 28px;
    padding: 5px 0 5px 20px;
  }
`;
