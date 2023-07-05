import styled from '@emotion/styled';


export const ApiPickerStyle = `
  width: 300px;
  height: 100vh;
  position: absolute;
  top: 0;
  right: 0;
`;


export const ApiTreePanel = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  @inputbg: #1B1B32;

  .search-box {
    height: 80px;

    .apipost-input-inner-wrapper {
      border: none;
      width: 90%;
      background-color: var(--bg);
      margin-left: 15px;
      height: 30px;
      font-size: 12px;


      svg {
        margin-right: 7px;
      }
    }

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
      align-items: center;
      .apipost-checkbox {
        margin: 0 8px;
        width: 14px;
        height: 14px;
      }
    }
  }

  .apipost-tree-node-title {
    display: block;
    max-width: 150px;
    line-height: 17px;
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
