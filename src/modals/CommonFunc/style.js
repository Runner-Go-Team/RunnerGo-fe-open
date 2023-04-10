import { css } from '@emotion/css';

export const CommonFunctionModal = css`
    .apipost-modal-container {
        width: 800px;
        height: 730px;
    }
    .apipost-modal-header {
        padding: 32px 32px 24px 32px;
    }
    .apipost-table-th {
        background-color: var(--bg-4);
    }
    .apipost-table-td {
        color: var(--font-1);
        height: 30px;
        text-align: left !important;
        padding-left: 8px !important;
    }
    .apipost-table-td .apipost-table-cell {
        white-space: normal !important;
    }

    .arco-table-container {
        border-color: var(--border-line);
    }

    .arco-table-tr {
        .arco-table-th {
            background-color: var(--bg);
            border-color: var(--border-line);
            
            .arco-table-th-item {
                height: 24px;
                padding: 3.5px 8px !important;
                font-size: 12px;
            }
        }

        .arco-table-td {
            height: 30px;
            padding: 3.5px 8px !important;
            font-size: 12px;
            background-color: transparent;
            border-color: var(--border-line);
        }
    }


    .arco-table-border .arco-table-container::before {
        border-color: var(--border-line);
        background-color: var(--border-line);
    }
`;

export const HeaderTitleStyle = css`
    p {
        font-size: 16px;
        color: var(--font-1);
    }
`;

export const VarNameStyle = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;

    svg {
        width: 16px;
        height: 16px;
        min-width: 16px;
        min-height: 16px;
        fill: var(--font-1);
        cursor: pointer;
    }
`