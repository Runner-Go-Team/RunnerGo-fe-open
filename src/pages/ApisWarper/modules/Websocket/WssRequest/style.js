import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const WssConfigWrapper = styled.div`
  .wss-config {
    &-list {
      padding: 0 8px;
    }
    &-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    &-desc {
      min-width: 550px;
      .title {
        line-height: 33px;
        font-weight: 600;
        font-size: var(--size-12px);
        margin-bottom: 0;
      }

      .desc {
        font-weight: 400;
        color: var(--font-color);
      }
    }
  }
`;
