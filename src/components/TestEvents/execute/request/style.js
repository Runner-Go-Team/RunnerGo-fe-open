import styled from '@emotion/styled';

export const RequestPanel = styled.div`
  width: 40%;
  padding-left: 10px;
  border-left: 1px solid var(--border-color-default);

  .request-title {
    font-weight: 600;
    font-size: var(--size-14px);
    padding: 5px 0;
  }

  .request-logs {
    padding: 3px 0;

    .log-item {
      padding: 7px;
      border-radius: 3px;
      &.error {
        background-color: rgba(255, 76, 76, 0.1);
        color: var(--delete-red);
      }

      &.success {
        background-color: rgba(60, 192, 113, 0.1);
        color: var(--run-green);
      }
    }
  }
`;
