import { css } from '@emotion/css';

export const EmptyWrapper = css`
  position: relative;
  // left: 50%;
  // top: 50%;
  // -webkit-transform: translate(-50%, -50%);
  // transform: translate(-50%, -50%);
  text-align: center;

  .apipost-empty {
    &-imamge {
    }
    &-text {
      color: var(--font-2);
      margin: 22px 0 0;
    }
  }
`;
