import { css } from '@emotion/css';

export const TeamworkLosWrapper = css`
  .apipost-modal-container {
    width: 900px;
    height: 730px;
    max-height: 80%;
  }
  .operator {
    width: 198px;
  }

  .action {
    width: 372px;
  }

  .time {
    width: 130px;
  }

  .teamwork-log {
    display: flex;
    flex-direction: column;
    height: 100%;
    &-content {
      flex: 1;
      height: 0;
      overflow: auto;
      margin-bottom: 60px;
    }
    &-title {
      color: var(--content-color-secondary);
      display: flex;
      align-items: center;
      padding: 0 8px;
    }
  }

  .teamwork-log_collapse {
    display: flex;
    height: 32px;
    padding: 7.5px 8px;
    background-color: var(--bg);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0 0 0;

    & > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .right-select {
      width: 14px;
      height: 14px;
      background-color: rgba(0, 0, 0, 0.06);
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;

      svg {
        fill: var(--content-color-secondary);
      }
    }
  }

  .teamwork-log_collapse_con {
    .teamwork-log_collapse_con_item {
      height: 33px;
      line-height: 33px;
      display: flex;
      align-items: center;
      border-radius: 3px;
      padding: 0 8px;
      margin: 8px 0;
      cursor: pointer;


      .text-ellipsis {
        height: 24px;
        line-height: 24px;
        word-break: break-all;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
      }
      .apt-tooltip-title {
        max-width: 80%;
      }
    }

    .operator {
      display: flex;
      align-items: center;

      .avatar {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin: 0 4px 0 0;
        background-color: var(--background-color-secondary);
      }

      .name {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .action {
      display: flex;
      align-items: center;

      > span {
        max-width: 300px;
      }

      .tag {
        padding: 0 4px;
        height: 17px;
        line-height: 17px;
        border-radius: 3px;
        text-align: center;
        background: #999;
        margin: 0 8px 0 0;
        color: var(--font-1)fff;
        flex-shrink: 0;

        &.update {
          background-color: var(--log-blue);
        }

        &.add {
          background-color: #2ba58f;
        }

        &.add-update {
          background-color: #2ba58f;
        }

        &.delete {
          background-color: #ed6a5f;
        }
      }
    }
  }

  .logOff {
    margin-left: 4px;
    color: var(--content-color-secondary);
    padding: 3px 4px;
    font-size: var(--size-12px);
    background: #e9e9e9;
    border-radius: 3px;
  }

  .teamwork-log-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 5px 5px;

    .footer-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;

      .pagination {
        display: flex;
        align-items: center;

        .apipost-input-inner-wrapper {
          width: 63px;
          height: 32px;
          margin: 0 0 0 8px;

          .apipost-input {
            text-align: center;
          }
        }

        .apipost-select {
          height: 32px;
        }
      }
    }
  }
`;
