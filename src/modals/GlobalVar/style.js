import { css } from '@emotion/css';

export const GlobalVarModal = css`
    .apipost-modal-container {
        width: 800px;
        height: 730px;
        max-height: 80%;
    }
    .apipost-table {
        margin-bottom: 30px;
    }
    .apipost-modal-header {
        ${'' /* padding: 32px 32px 24px 32px; */}
    }
    .apipost-table-th {
        background-color: var(--bg-4);
    }
    .apipost-table-td {
        color: var(--font-1);
        height: 24px;
        .apipost-table-cell {
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 24px;
            font-size: 12px;
    
            .apipost-input-inner-wrapper {
                height: 24px
            }
        }
    }
    .container-title {
        font-size: 12px;
        margin: 24px 0;
    }
    .apipost-table-cell {
        overflow:hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .delete-svg {
        width: 16px;
        height: 16px;
        fill: #f00;
        cursor: pointer;
    }

    .arco-table-container {
        border-color: var(--border-line);
    }


    .arco-table-tr {
        height: 24px;
        .arco-table-th {
            background-color: var(--bg);
            border-color: var(--border-line);

            .arco-table-th-item {
                height: 100%;
                padding: 0 !important;
                padding-left: 8px !important;
                font-size: 12px;
                line-height: 24px;  
            }
        }
        .arco-table-td {
            height: 24px;
            padding: 0 !important;
            font-size: 12px;
            background-color: transparent;
            border-color: var(--border-line);

            .arco-table-cell {
                line-height: 30px;
                .arco-input {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    border-radius: 0 !important;
                    background-color: transparent !important;
                    border: none !important;
                }

                .arco-input:hover {
                    background-color: var(--select-hover);
                }
            }
        }
    }

    .arco-table-border .arco-table-container::before {
        border-color: var(--border-line);
        background-color: var(--border-line);
    }

    .handle {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .copy-svg {
        margin-right: 6px;
        margin-bottom: 6px;
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
    width: 100%;
    height: 100%;

    svg {
        width: 16px;
        height: 16px;
        fill: var(--font-1);
        cursor: pointer;
    }
`