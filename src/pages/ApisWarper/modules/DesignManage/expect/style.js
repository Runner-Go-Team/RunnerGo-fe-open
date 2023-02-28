import styled from '@emotion/styled';

export const ExpectWrapper = styled.div`
  border: 1px solid var(--border-color-default);
  margin: 8px;
  padding: 8px;
  border-radius: var(--border-radius-default);
  &:hover {
    border-color: var(--border-color-strong);
  }
  .wrapper-title {
    padding: 0 8px;
    height: 30px;
    display: flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    // border-radius: var(--border-radius-default);
    border-bottom: var(--border-color-default) 1px solid;
    span {
      font-weight: 500;
    }
    &:hover {
      color: var(--content-color-primary);
      // background-color: var(--background-color-tertiary);
      svg {
        fill: var(--content-color-primary) !important;
      }
    }
    .right-btns {
      svg {
        width: 16px;
        height: 16px;
        cursor: pointer;
        fill: var(--content-color-secondary);
      }
    }
  }
`;
