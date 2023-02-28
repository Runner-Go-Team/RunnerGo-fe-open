import styled from '@emotion/styled';

export const ApisFooterWrapper = styled.div`
  height: 36px;
  margin-top: 3px;
  padding: 0 10px;
  background-color: var(--background-color-primary);
  // border-bottom-left-radius: 5px;
  // border-bottom-right-radius: 5px;
  border-top: var(--border-color-default) 1px solid;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-width: 858px;
  .apipost-btn {
    height: 30px;
    &:hover {
      background-color: transparent;
      color: var(--content-color-primary);
      svg: {
        fill: var(--content-color-primary);
      }
    }
  }
  .footer-left {
    position: relative;
  }
  .footer-left,
  .footer-right {
    & > div {
      margin: 0 4px;
    }
  }
`;
