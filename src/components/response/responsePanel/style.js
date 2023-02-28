import { css } from '@emotion/css';

export const responseTabs = css`
  flex: 1;
  height: 100%;
  background-color: var(--module);
  margin-top: 2px;
  & > .apipost-tabs-content {
    height: calc(100% - 30px);
    padding-bottom: 30px;
    overflow: auto;
    margin-top: -1px;
  }

  .tabs-item.disable {
    color: var(--content-color-secondary);
    background-color: var(--background-color-primary);
    cursor: default;
  }
`;

export const responseTabsContent = css`
  padding: 0 15px;
  .total {
    color: var(--base-color-success);
  }
`;

export const ResponseStatusWrapper = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .status-left {
    display: flex;
    align-items: center;
    padding-right: 8px;
    .create-example {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 8px;
      width: 114px;
      height: 25px;
      border-radius: 3px;
      margin: 0 8px 0 0;
      cursor: pointer;
    }
    .more-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 8px;
      width: 80px;
      height: 25px;
      border-radius: 3px;
      cursor: pointer;
      margin: 0;
    }
  }
`;

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

export const HopeListWrapper = css`
  display: flex;
  max-height: 160px;
  overflow: hidden;
  &:hover {
    color: var(--content-color-primary);
    background: var(--highlight-background-color-tertiary);
  }
  .hope-item {
    display: flex;
    align-items: center;
    padding: 0 8px;
    border-radius: var(--border-radius-default);
    cursor: pointer;
    margin-right: 15px;
    flex: 1;
    &:hover {
      background-color: var(--highlight-background-color-tertiary);
    }
  }
`;

export const CreateExampleModal = css`
  .apipost-modal-container {
    width: 800px;
    height: 730px;
    max-height: 80%;
  }
  .apipost-select {
    width: 100%;
  }
  .example-top {
    display: flex;
    justify-content: space-between;
    height: 62px;
    margin: 16px 0 0 0;
    .example-item {
      position: relative;
      width: 360px;
      .title {
        height: 17px;
        margin: 0 0 4px 0;
      }
    }
  }
  .example-editor {
    flex: 1;
    heihgt: 0;
    margin: 24px 0 0 0;
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
  background-color: var(--bg);
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

    svg {
      width: 124px;
      height: 124px;
      fill: var(--font-1) !important;

    }

    &_text {
      margin-top: 20px;
      font-size: var(--size-12px);
    }
  }
`;

export const TimingPhasesModal = css`
  padding: 8px;
  .timingPhases_modal_title,
  .timingPhases_modal_item,
  .timingPhases_modal_total {
    display: flex;
    justify-content: space-between;
  }
  .timingPhases_modal_item {
    height: 21px;
    line-height: 21px;
  }
`;

export const NetworkPanel = css`
  padding: 8px;
  line-height: 2em;
  &.internet_modal {
    padding: 8px;
    line-height: 2em;
  }
`;
