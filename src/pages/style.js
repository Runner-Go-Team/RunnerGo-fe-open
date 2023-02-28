import styled from '@emotion/styled';

export const TeamProjectPanel = styled.div`
  padding-left: 8px;
  .apipost-btn {
    padding: 0 8px;
    border-radius: var(--border-radius-default);
    border: 0;
    line-height: 32px;
    height: 32px;
    transition: none;
    :hover,
    :focus {
      color: var(--content-color-primary);
      background-color: var(--background-color-tertiary);
    }
    .afterfix {
      margin-left: 4px;
      width: 12px;
    }
  }
`;

export const DropdownContainer = styled.div`
  width: 354px;
  box-sizing: border-box;
  padding: 12px;

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
  }
  .filter-box {
    margin-top: 12px;
    height: 32px;
    padding-left: 8px;
    border-radius: 16px;
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
  & .--content-color-secondary {
    margin-right: 20px;
    height: 16px;
    line-height: 16px;
    padding: 0 8px;
    border-radius: var(--border-radius-default);
    background-color: var(--background-color-tertiary);
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
  color: var(--fn3);
  border-radius: 3px;
  cursor: pointer;
  .picon {
    width: 16px;
    height: 16px;
    margin-left: 28px;
    fill: var(--fn3);
  }
  & .ptitle {
    padding-left: 6px;
    flex: 1;
  }
  ${(props) =>
        props?.isActive === true &&
        `
  background-color: var(--content-color-primary);
  color: var(--font-1)fff;
  .picon {
    fill: var(--font-1)fff;
  }
  `}
  &:hover {
    background-color: var(--highlight-background-color-primary);
    color: var(--content-color-secondary);
    .picon {
      fill: var(--content-color-secondary);
    }
  }
`;
