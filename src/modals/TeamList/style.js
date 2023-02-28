import { css } from '@emotion/css';

export const ProjectMemberModal = css`
  .apipost-modal-container {
    width: 948px;
    height: 610px;

    .apipost-modal-header {
        padding: 32px;
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
                padding: 16px;
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
            padding-top: 16px !important;
            padding-bottom: 16px !important;
        }
    }

    .apipost-table-tr, .apipost-table-th {
        border: none;
    }
    
    .member-info {
        display: flex;
        align-item: center;

        .detail {
            display: flex;
            flex-direction: column;
            margin-left: 8px;
        }
    }

    .apipost-table-td {
        color: var(--font-1);
        text-align: left;
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
    .team-name {
        display: flex;

        span {
            max-width: 165px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        svg {
            width: 14px;
            height: 14px;
            fill: var(--font-1);
            margin-left: 8px;
            cursor: pointer;
        }
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

    .create-team {
        min-width: 86px;
        height: 30px;
        background-color: var(--theme-color);
        border-radius: 5px;
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