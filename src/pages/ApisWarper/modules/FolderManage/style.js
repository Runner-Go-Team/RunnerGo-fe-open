import { css } from '@emotion/css';

export const FolderWrapper = css`
  width: 100%;
  height: 100%;
  display: flex;
  background: var(--background-color-primary);
  flex-direction: column;

  .apipost-folder-name {
    height: 40px;
    margin: 0 0 16px;
    display: flex;
    .apipost-btn {
      margin: 0 0 0 16px;
    }
  }
  .apipost-folder-desc {
    height: 80px;
    margin: 0 0 16px;
  }
  & > .apipost-tabs {
    height: 0;
    flex: 1;
    display: flex;
  }
`;
