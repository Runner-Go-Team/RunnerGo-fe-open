import styled from '@emotion/styled';

export const WebsocketWapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  .wss-content {
    height: calc(100% - 92px);
    background: var(--background-color-primary);
    flex: 1;
    margin: 2px 0 0 0;
    .wss-scale-item {
      background: var(--background-color-primary);
      &.wss-scale-send .scale-item-content {
        height: 100%;
      }
      &.wss-scale-last {
        height: 0;
        .scale-item-content {
          height: 100%;
        }
      }
    }
  }
`;
