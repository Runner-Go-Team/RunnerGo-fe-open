import { css } from '@emotion/css';

export const itemModelWarper = css`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 202;
  float: left;
  box-sizing: border-box;
  padding-right: 10px;
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;
  .btn-hide {
    width: auto;
    height: 22px;
    padding: 0 10px;
    border-radius: 3px;
    background-color: var(--base-color-brand);
    color: var(--content-color-constant);
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    svg {
      width: 15px;
      height: 15px;
      fill: var(--content-color-constant);
    }
    &:hover {
      background-color: var(--highlight-background-color-brand);
    }

    &:last-child {
      margin-left: 10px;
    }
  }

  .txt-box {
    height: 100%;
    border: none;
    font-size: 12px;
    flex: 1;
  }
  .btn-item {
  }
  .txt-description {
    margin: 0 10px;
    flex: 1;
    width: 0;
    font-size: 12px;
    color: var(--content-color-fourth);
    white-space: nowrap;
    overflow: hidden;
  }
`;
