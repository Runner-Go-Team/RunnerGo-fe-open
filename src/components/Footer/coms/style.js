import styled from '@emotion/styled';

export const ScaleWrapper = styled.div`
  display: flex;
  width: 97px;
  justify-content: space-between;
  cursor: auto;

  .zoom_font {
    width: 31px;
    height: 17px;
    font-size: var(--size-12px);
    line-height: 17px;
  }
`;

export const FooterMenu = styled.div`
  font-size: var(--size-12px);
  line-height: 17px;
  .menu_item {
    height: 32px;
    border-radius: 0;
    display: flex;
    align-items: center;
    padding: 0 12px;
    cursor: pointer;
    &:not(:last-of-type) {
      margin-bottom: 8px;
    }
    color: var(--content-color-secondary);
    &:hover {
      background-color: var(--highlight-background-color-secondary);
      color: var(--content-color-primary);
      svg {
        fill: var(--content-color-primary);
      }
    }

    &.active {
      background-color: var(--highlight-background-color-secondary);
      color: var(--content-color-primary);
      svg {
        fill: var(--content-color-primary);
      }
    }

    svg {
      fill: var(--content-color-secondary);
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
  }
`;
