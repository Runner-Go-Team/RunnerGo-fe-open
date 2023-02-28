import { css } from '@emotion/css';

export const ProjectMemberModal = css`
  .apipost-modal-container {
    width: 948px;
    height: 680px;
    .apipost-modal-header {
        padding: 30px;
    }

    .apipost-table-tr, .apipost-table-th {
        border: none;
    }

    .arco-table-container {
        border: none;
    }

    .arco-table-th, .arco-table-tr, .arco-table-td {
        border: none;
    }

    .arco-table-border .arco-table-container::before {
        height: 0;
    }


    .arco-table-tr {

        .arco-table-th {
            background-color: var(--bg);

            .arco-table-th-item {
                text-align: center;
            }
        }

        .arco-table-checkbox {
            .arco-table-th-item {
                margin-left: 0;
                padding-left: 0 !important;
            }
        }

        .arco-checkbox-indeterminate {
            .arco-checkbox-mask {
                background-color: var(--sub-color-1);
            }
        }

        .arco-checkbox-checked {
            .arco-checkbox-mask {
                background-color: var(--sub-color-1);
            }
        }

        .arco-table-td {
            background-color: var(--module);

            .arco-table-cell {
                text-align: center;
            }
        }
    }
    
    .member-info {
        display: flex;
        align-item: center;

        .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-top: 10px;
        }

        .detail {
            display: flex;
            flex-direction: column;
            margin-left: 8px;

            .email {
                max-width: 175px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .name {
                display: flex;
                .common {
                    max-width: 110px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }

    .apipost-table-td {
        color: var(--font-1);
        // text-align: left;
        padding: 19px 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .title {
        display: flex;

        p {
            width: 25%;
        }
    }
    .member-list {
        display: flex;
        flex-direction: column;
        .member-item {
            display: flex;
            align-items: center;
            margin-top: 41px;

            .member-info, .join-time, .invited-by, .station-type, .handle-member {
                width: 25%;
                overflow: hidden;
            }
        }
    }
    .member-info {
        .detail {
            p {
                text-align: left !important;
            }
        }
    }
    .default-power {
        // width: 90px;
        // padding: 0 8px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        border: 1px solid var(--select);
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    }

    .apipost-select {
        // width: 78px;
        width: 100%;
        border: 1px solid var(--select);
        border-radius: 5px;

        .apipost-select-view-text {
            display: flex;
            justify-content: center;
        }
    }
    .apipost-table-th {
    }
    .apipost-table-td {
        text-align: center;
    }
    .apipost-select-popup {
        width: 133px;
    }
  }
`;

export const HeaderLeftModal = css`
  .member-header-left {
    display: flex;
    align-items: center;
    color: var(--font-1);

    .title {
        font-size: 16px;
    }

    .invite-btn {
        min-width: 86px;
        height: 30px;
        background-color: var(--theme-color);
        border-radius: 5px;
        color: var(--common-white);
        margin-left: 32px;

        svg {
            fill: var(--common-white);
            margin-right: 6px;
            width: 16px;
            height: 16px;
        }
    }
  }
`