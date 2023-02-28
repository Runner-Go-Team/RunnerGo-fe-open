import styled from '@emotion/styled';

export const WssSendWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 8px 0;
  .send-header {
    display: flex;
    align-items: center;
    padding: 0 8px;
    .header-item {
      font-size: var(--size-12px);
      color: var(--content-color-secondary);
      margin: 0 8px 0 0;
      .apipost-select {
        height: 28px;
      }
    }
  }
  .editor-box {
    flex: 1;
    margin: 8px 0;
    height: 0;
    padding: 0 8px;
  }
  .send-footer {
    display: flex;
    padding: 8px;
    padding-bottom: 0px;
    justify-content: flex-end;
    border-top: var(--border-color-default) 1px solid;
    .apipost-btn {
      margin: 0 0 0 8px;
      width: 80px;
    }
  }
`;
