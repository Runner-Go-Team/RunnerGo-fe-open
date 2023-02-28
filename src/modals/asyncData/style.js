import { css } from '@emotion/css';

export const GlobalModal = css`
    .apipost-modal-container {
        position: relative;
        height: 387px;
        width: 635px;

        .apipost-modal-close {
            display: none;
        }

        .title {
            margin-top: 30px;
            font-size: 16px;
        }

        .desc {
            font-size: 14px;
            margin-top: 32px;
        }

        .radio-list {
            display: flex;
            flex-direction: column;
            margin-top: 42px;

            .apipost-radio-wrapper {
                margin-bottom: 24px;

                .apipost-radio-children {
                    font-size: 14px;
                    color: var(--font-1);
                }
            }
        }
        
        .pass {
            position: absolute;
            bottom: 20px;
            left: 30px;
            color: var(--font-1);
            cursor: pointer;
        }
    }
`;
