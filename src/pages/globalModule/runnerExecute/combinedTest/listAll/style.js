import styled from '@emotion/styled';

export const ListAllWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

export const LeftListPanel = styled.div`
  width: 450px;
  height: 100%;
  overflow: auto;
  padding: 0 10px;
  border-right: 1px solid #e9e9e9;
`;

export const LeftListItem = styled.div`
  width: 100%;
  display: flex;
  margin: 5px 0;
  flex-direction: row;
  height: 42px;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.05);
  align-items: center;
  border-radius: var(--border-radius-default);
  padding: 12px 8px;

  &.active {
    background: #e8e8e8;
  }

  .root-index {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.08);
    border-radius: 23px;
    margin: 0 8px 0 0;
  }

  .node-name {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
  }

  .combination-bar-wrapper {
    margin: 0 20px 0 30px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .combination-bar {
      flex: 1;
      height: 14px;
      border-radius: 7px;
      background: linear-gradient(249.37deg, #ff5487 13.67%, #ed2e7e 86.33%);
      overflow: hidden;
      margin: 0 8px 0 0;

      .bar {
        height: 100%;
        background: linear-gradient(90deg, #3dc16a 0%, #26d5ab 99.77%);
      }
    }

    .pass-number {
      color: var(--run-green);

      .error {
        color: var(--delete-red);
      }
    }
  }

  .svg-box {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 1px solid var(--border-color-default);
    border-radius: 3px;
  }
`;

export const TestEventsPanel = styled.div`
  flex: 1;
  overflow: auto;
`;
