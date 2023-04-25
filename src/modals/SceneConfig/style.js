import { css } from '@emotion/css';

export const GlobalVarModal = css`
    .apipost-modal-container {
        width: 800px;
        min-height: 730px;

        .apipost-modal-footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: var(--scene-api-line);
            .apipost-btn-default {
              background-color: var(--module);
              border-radius: 5px;
            }

            .apipost-btn {
                height: 34px;
            }
        }
    }
    .apipost-modal-header {
        ${'' /* padding: 32px 32px 24px 32px; */}
    }
    .apipost-table-th {
        background-color: var(--bg-4);
    }
    .apipost-table-td {
        color: var(--font-1);
        height: 36px;
        .apipost-table-cell {
            overflow:hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            height: 36px;
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
    .apipost-upload {
        display: flex;
        justify-content: center;
        align-items: center; 
    }
    .apipost-btn {
        width: 84px;
        height: 25px;
        background: var(--theme-color);
        border-radius: 3px;
        padding: 4px 8px;
        color: var(--common-white);
        margin: 20px auto;
    }
    .apipost-btn > svg {
        fill: var(--common-white);
        margin-right: 6px;
    }
    .delete-svg {
        width: 16px;
        height: 16px;
        fill: #f00;
        cursor: pointer;
    }
    .file-list {
        display: flex;
        align-items: center;
        flex-direction: column;
        width: 100%;
        margin-top: 20px;
    }
    .file-list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 5px;
        height: 30px;
        background-color: var(--bg);
        border-radius: 2px;
    }
    .file-list-item-left {
        padding-right: 3px;
    }
    .file-list-item-middle {
        cursor: pointer;
    }
    .file-list-item-right {
        display: flex;
        align-items: center;

        svg {
            margin: 0 10px;
            cursor: pointer;
            height: 16px;
            width: 16px;
            fill: var(--font-1);
        }
    }
    .file-list-item-right > p {
        margin: 0 8px;
        cursor: pointer;
    }
    .file-list-item-right > .delete {
        fill: var(--run-red);
    }
    .apipost-modal-footer > div > .apipost-btn {
        margin: 0 8px;
        width: 100px;
        height: 40px;
    }
    .apipost-btn-default {
        background-color: var(--bg-4);
        color: var(--content-color-secondary);
    }
    .upload-btn {
        background-color: var(--default-button);
        border: 1px solid var(--theme-color);
        border-radius: 3px;
        color: var(--font-1);

        svg {
            fill: var(--font-1);
        }
    }

    .arco-input {
        border: none;
    }

    .arco-table-container {
        border-color: var(--border-line);
    }

    .arco-table-border .arco-table-container::before {
        border-color: var(--border-line);
        background-color: var(--border-line);
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
                .arco-input {
                    padding-top: 0 !important;
                    padding-bottom: 0 !important;
                    border-radius: 0 !important;
                    background-color: transparent !important;
                }

                .arco-input:hover {
                    background-color: var(--select-hover);
                }
            }
        }
    }

    .apipost-table {
        margin-top: 10px;
    }

    .apipost-table-td {
        border-color: var(--border-line) !important;
      }
      .apipost-table-th {
        .apipost-table-td {
          .apipost-table-cell {
            background-color: var(--bg);
          }
        }
      }
      .apipost-table-tr {
        .apipost-table-td {
          background-color: var(--module) !important;
    
          svg {
            fill: var(--font-1);
          }
    
          .apipost-input-inner-wrapper:hover {
            background-color: var(--select-hover) !important;
          }
        }
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
            display: flex;
            justify-content: center;
            align-items: center;

            .apipost-btn {
                background-color: transparent;

                svg {
                    margin: 0;
                }
            }
    
            .apipost-input-inner-wrapper {
                height: 24px;
            }
            .apipost-select {
              height: 24px;
            }
    
            .apipost-textarea-wrapper, .apipost-textarea {
              width: 100%;
            }
    }

`;

export const HeaderTitleStyle = css`
    p {
        font-size: 16px;
        color: var(--font-1);
    }
`;


export const VarNameStyle = css`
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    svg {
        width: 16px;
        height: 16px;
        fill: var(--font-1);
        cursor: pointer;
    }

    .arco-input {
        border: none;
    }
`