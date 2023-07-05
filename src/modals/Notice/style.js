import { css } from '@emotion/css';

export const InviteModalWrapper = css`
  .apipost-modal-container {
    width: 948px;
    height: 624px;
    .apipost-modal-body{
      overflow: hidden;
    }
    .notice-title{
    
    }
    .group-list-search {
        .arco-input-inner-wrapper {
            background-color: var(--bg) !important;
        }
    }
    .notice-content{
      display: flex;
    flex-direction: column;
      height: 100%;
      .notice-group-list-empty{
        display: flex;
    justify-content: center;
    align-items: center;
      }
      .notice-group-list{
    flex: 1;
        max-height: 83%;
        overflow: auto;
        margin-top: 8px;
        .empty-text{
          span{
            cursor: pointer;
            color: var(--theme-color);
          }
        }
        .notice-group-list-header,
        .notice-group-list-item{
          display: flex;
          align-items: center;
          margin-top: 8px;
          .name{
            width: 36%;
            display: flex;
    align-items: center;
    padding-left: 20px;
    .apipost-checkbox{
      margin-right: 10px;
      border: 1px solid var(--font-1);
      background-color: transparent;
    }
          }
          .type{
            width: 36%;
            padding-right: 20px;
          }
          .create_time{
            width: 27%;
          }
        }
        .notice-group-list-header{
          height: 38px;
          border-radius: 2px;
          background: var(--bg);
        }
        .notice-group-list-item{
          height: 40px;
          border-radius: 5px;
        }
        .notice-group-list-item:hover{
          background: var(--bg);
        }
      }
    }
  }
`;
