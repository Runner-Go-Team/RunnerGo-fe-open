import { css } from '@emotion/css';

export const notResponseWrapper = css`
  flex: 1;
  display: flex;
  flex-direction: inherit;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  .panel-header {
    display: flex;
    align-items: center;
    height: 32px;
    cursor: default;
    -webkit-user-select: none;
    user-select: none;
    padding: 0 8px;
    &_text {
      flex: 1;
      font-size: var(--size-14px);
      overflow: hidden;
      text-overflow: clip;
      white-space: nowrap;
    }
  }
  .panel-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    min-height: 0;
    align-items: center;
    justify-content: center;

    &_text {
      font-size: var(--size-12px);
    }
  }
`;
