import styled from '@emotion/styled';

export const TeamProjectPanel = styled.div`
  display: flex;
  align-items: center;
  padding-left: 8px;
  .apipost-btn {
    padding: 0 8px;
    border-radius: var(--border-radius-default);
    border: 0;
    line-height: 32px;
    height: 32px;
    transition: none;
    margin-left: 18px;
    :hover,
    :focus {
      color: var(--font-1);
      background-color: var(--select-hover);
    }
    .afterfix {
      margin-left: 4px;
      width: 12px;
      fill: var(--font-1);
    }
  }

`;

export const DropdownContainer = styled.div`
  width: 404px;
  box-sizing: border-box;
  padding: 12px;
  background-color: var(--module) !important;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);

  & .header {
    height: 24px;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .btn-manage {
      padding: 0 4px;
      height: 24px;
    }

    .apipost-btn {
      background-color: var(--theme-color);
      border-radius: 3px;
      color: var(--common-white);
      min-width: 84px;
    }
  }
  .filter-box {
    margin-top: 12px;
    height: 32px;
    padding-left: 8px;
    border-radius: 16px;
    background-color: var(--bg);
    font-size: 12px;
    border: none;

    .apipost-input {
      margin-left: 6px;
    }
  }

  .filter-box:hover {
    background-color: var(--select-hover) !important;
  }

  .datalist {
    margin: 0 10px;
  }
`;

export const TeamHeader = styled.div`
  flex: 1;
  display: flex;
  height: 30px;
  align-items: center;
  cursor: pointer;
  & .t-icon {
    width: 16px;
    height: 16px;
    margin: 0 4px 0 4px;
    fill: var(--content-color-secondary);
  }
  & .t-title {
    flex: 1;
    padding-left: 4px;
  }
  & .counts {
    margin-right: 10px;
    padding: 4px 7px;
    border-radius: 2px;
    background-color: var(--border-line);
    color: var(--sub-color-4);
  }
`;

export const TeamProjectWrapper = styled.div`
  max-height: 400px;
  margin-top: 8px;
  overflow: hidden;
  overflow-y: auto;
`;

export const ProjectItem = styled.div`
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--content-color-secondary);
  border-radius: 3px;
  cursor: pointer;
  .picon {
    width: 16px;
    height: 16px;
    margin-left: 28px;
    fill: var(--content-color-secondary);
  }
  & .ptitle {
    padding-left: 6px;
    flex: 1;
  }
  ${(props) =>
        props?.isActive === true &&
        `
  background-color: var(--highlight-background-color-primary);
  color: var(--content-color-secondary);
  .picon {
    fill: var(--content-color-secondary);
  }
  `}
  &:hover {
    background-color: var(--highlight-background-color-primary);
    color: var(--content-color-primary);
    .picon {
      fill: var(--content-color-primary);
    }
  }
`;
