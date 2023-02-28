import styled from '@emotion/styled';

export const MenuWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-shrink: 0;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: var(--module);
  .menus-header {
    // margin: 0 8px 0 8px;
    border-bottom: 1px solid var(--background-color-3);
    height: 92px;
    .apistatus {
      border: 0;
    }
    .apistatus-current {
      background-color: transparent;
    }
    .apipost-input-inner-wrapper-mini {
      height: 30px;
      line-height: 30px;
      :hover {
        background-color: var(--select-hover);
      }
    }
    .apipost-input-inner-wrapper {
      padding-right: 0;
    }
    .apipost-btn:hover,
    .apipost-btn:focus,
    .apipost-btn-default:hover,
    .apipost-btn-default:focus {
      color: var(--content-color-primary);
      border-color: 0;
      background-color: var(--highlight-background-color-tertiary);
      svg {
        background: var(--highlight-background-color-tertiary);
        fill: var(--content-color-primary);
        :hover {
          fill: var(--content-color-primary);
        }
      }
    }
  }
`;
