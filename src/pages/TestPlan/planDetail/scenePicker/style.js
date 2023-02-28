import styled from '@emotion/styled';

export const ApiPickerStyle = `
  width: 300px;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
`

export const ApiTreePanel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .search-box {
    height: 80px;
    .apistatus {
      border-right: 0;
    }
    .apistatus-current {
      background-color: transparent;
    }
    .check-all-panel {
      padding-top: 10px;
      display: flex;
      justify-content: flex-end;
      .apipost-checkbox {
        margin: 0 8px;
      }
    }

    .apipost-tree-node-title {
      display: block;
      max-width: 200px;
      line-height: 17px;
    }
  }

  .apipost-tree {
    flex: 1;
  }
`;

export const BtnAddApiItem = styled.div`
  width: 100%;

  .apipost-btn {
    width: 100%;
    background-color: var(--theme-color) !important;
  }
`;
