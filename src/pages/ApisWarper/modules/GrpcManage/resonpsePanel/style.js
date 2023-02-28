import { css } from '@emotion/css';

export const ResponseStatusRight = css`
  display: flex;
  align-items: center;
  padding: 0 8px 0 0;

  .status-group {
    display: flex;
    align-items: center;
    margin: 0 4px;
    padding: 0 2px;
    align-items: center;
    word-break: keep-all;
    svg {
      width: 16px;
      height: 16px;
      fill: var(--content-color-secondary);
    }
    .success {
      color: var(--run-green);
      fill: var(--run-green);
    }
    .error {
      color: #ed6a5f;
    }
  }
  .cursor {
    cursor: pointer;
  }
`;

export const ResponseErrorWrapper = css`
  width: 100%;
  height: 100%;
  // position: relative;
  position: absolute;
  left: 0;
  top: 0;
  background: var(--background-color-primary);
  z-index: 1;
  .close-error-wrapper {
    position: absolute;
    right: 16px;
    top: 14px;
    cursor: pointer;
  }
  .container {
    text-align: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--size-12px);
    p.error_str {
      width: max-content;
      margin: 10px auto;
      background: rgba(255, 76, 76, 0.2);
      border-radius: var(--border-radius-default);
      height: 25px;
      padding: 6px 8px;
    }
    span {
      cursor: pointer;
      color: var(--main);
    }
    .chioce-btn {
      color: var(--log-blue);
    }
    .proxy-img {
      margin: 0 0 20px 0;
    }
  }
`;

export const ResponseSendWrapper = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-color-primary);
  opacity: 0.9;
  z-index: 1;
  color: var(--content-color-secondary);
  .loading_bar_tram {
    position: absolute;
    left: 0;
    top: 0;
    width: 189px;
    height: 2px;
    background: linear-gradient(90deg, var(--log-blue) 0%, rgba(40, 126, 255, 0) 100%);
    transform: matrix(-1, 0, 0, 1, 0, 0);
    animation: lineLoading 2s linear infinite;
    -webkit-animation: lineLoading 2s linear infinite;
  }
  .apt_sendLoading_con {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .apt_sendLoading_con_text {
      margin-bottom: 22px;
    }
    .apt_sendLoading_con_btn {
      width: 68px;
      height: 37px;
      border-radius: var(--border-radius-default);
      box-sizing: content-box;
      background: var(--background-color-secondary);
    }
  }
  @keyframes lineLoading {
    0% {
      left: 0;
    }
    50% {
      left: 50%;
    }
    100% {
      left: 100%;
    }
  }
`;
