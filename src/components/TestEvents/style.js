import styled from '@emotion/styled';

export const EventsPanel = styled.div`
  padding: 0 16px;
`;

export const RootEventItem = styled.div`
  display: flex;
  width: 100%;
  margin: 0 0 8px 0;
  padding: 8px;

  .expand-panel {
    width: 24px;
    height: 24px;
    margin: 8px 8px 0 0;
    svg {
      cursor: pointer;
      fill: var(--content-color-secondary);
    }
  }

  .btn-right {
    margin: 10px 0 0 8px;
    width: 24px;
    height: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: row-resize;

    svg {
      fill: var(--content-color-secondary);
      width: 16px;
      height: 16px;
    }

    &.btn-view-more {
      cursor: pointer;
    }

    &.opened {
      svg {
        transform: rotate(90deg);
      }
    }
  }

  .btn-go-edit {
    width: 62px !important;
    background-color: rgba(0, 0, 0, 0.05);
    font-size: var(--size-12px);
    &:hover {
      color: var(--content-color-secondary);
      background-color: rgba(0, 0, 0, 0.08);
    }
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const EventListWrapper = styled.div`
  padding: 8px 0;
`;
