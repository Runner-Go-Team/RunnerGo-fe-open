import { css } from '@emotion/css';

export const EnvModalWrapper = css`
  .apipost-modal-container {
    width: 800px;
    height: 700px;
  }
  .apipost-modal-body {
    height: 400px;
  }

  .apipost-card {
    margin: 0 0 16px 0;
  }
  .env-table-wrapper {
    margin: 16px 0 0 0;
    .title {
      color: var(--font-2);
      font-size: var(--size-14px);
      font-weight: 600;
      margin: 0 0 8px 0;
      span {
        font-size: var(--size-12px);
        font-weight: 400;
      }
    }
  }
  .env-footer {
    display: flex;
    align-item: center;
  }
  .footer-marks {
    color: var(--base-color-brand);
    cursor: pointer;
    svg {
      width: 16px;
      height: 16px;
      fill: var(--base-color-brand);
    }
  }
`;
