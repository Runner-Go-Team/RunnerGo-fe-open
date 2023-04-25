import styled from '@emotion/styled';
import { css } from '@emotion/css';

export const AuthWrapper = styled.div`
  &.apipost-auth {
    display: flex;
    flex-direction: row;
    padding: 8px 16px;
    .apipost-select {
      width: 100px;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 0 0 220px;
      font-size: 12px;
      height: 28px;
      line-height: 28px;
    }
    .apipost-auth-type-content {
      flex: 1;
      padding-left: 8px;
      max-width: 500px;
      display: flex;
      align-items: center;
      .apipost-auth-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-left: 8px;
        .auth-item {
          display: flex;
          flex-direction: row;
          padding: 0;
          padding-bottom: 8px;
          .title {
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 0 0 120px;
            display: flex;
            align-items: start;
            justify-content: start;
            margin-right: 8px;
            display: flex;
            align-items: center;
          }
          .apipost-input-inner-wrapper {
            flex: 1;
            height: 28px;
          }
        }
        .auth-item-center {
          cursor: pointer;
          padding: 8px 0;
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .bidirectional-auth {
    .tips {
      color: var(--font-3);
      font-size: 12px;
      margin-top: 6px;
    }
    .upload-btn {
      background-color: var(--default-button);
      border: 1px solid var(--theme-color);
      border-radius: 3px;
      color: var(--font-1);
      margin-top: 22px;
  
      svg {
          fill: var(--font-1);
          width: 16px;
          height: 16px;
          margin-right: 4px;
      }
    }
    .file-item {
      background-color: var(--bg);
      color: var(--font-1);
      min-width: 319px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 12px;
      margin-top: 22px;
      border-radius: 2px;
      font-size: 12px;

      .handle {
        display: flex;
        
        .handle-item {
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
`;
