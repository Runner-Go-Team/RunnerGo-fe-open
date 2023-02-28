import styled from '@emotion/styled';

export const ConsoleWrapper = styled.div`
  height: 100%;
  padding: 8px;
  overflow: hidden;

  .console-header {
    height: 32px;
    padding: 0 8px;
    font-size: var(--size-12px);
    color: var(--content-color-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left-area {
      display: flex;
      align-items: center;

      .apipost-select,
      .apipost-input-inner-wrapper {
        height: 28px;
      }
      .header-item {
        margin-right: 16px;

        .clear-msg {
          svg {
            width: 14px;
            height: 14px;
          }
          display: flex;
          align-items: center;
          cursor: pointer;
          white-space: nowrap;
          height: 28px;
          padding: 0 16px;
          border-radius: var(--border-radius-default);
        }
      }

      .split-line {
        width: 1px;
        height: 25px;
        background-color: var(--border-color-default);
        margin-right: 16px;
      }
    }

    .right-area {
      .connect {
        width: 64px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f6fff2;
        border-radius: 3px;
        color: #61c554;
        font-size: var(--size-12px);
        cursor: pointer;
        &error {
          background: var(--font-1)5f7;
          color: var(--delete-red);
        }
      }
    }
  }

  .console-body {
    height: calc(100% - 32px);
    padding: 8px 0 0 0;
    overflow: auto;

    .level-item {
      padding: 0 0 0 16px;
      line-height: 18px;
    }

    .msg-content {
      height: 230px;

      &-header {
        display: flex;
        align-items: center;
        margin: 8px;

        .beautify {
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }

      &-editor {
        height: 175px;
        border: 1px solid var(--border-color-default);
        margin-left: 6px;
        padding-top: 8px;
        margin-bottom: 8px;
      }
    }

    .socket-msg {
      width: 100%;
      display: flex;
      color: var(--content-color-secondary);
      padding: 0 8px;
      min-width: 700px;
      min-height: 36px;
      line-height: 2em;
      border-bottom: 1px solid var(--border-color-default);
      &:hover,
      &.active {
        background: var(--highlight-background-color-primary);
      }
    }

    .msg-title {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 8px;
    }

    .msg-icon {
      width: 28px;
      display: flex;
      align-items: center;
    }

    .msg-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      min-width: 128px;
      width: 128px;
      span {
        display: flex;
        align-items: center;
      }

      svg {
        fill: var(--content-color-secondary);
        margin-right: 8px;
      }
    }
  }
`;
