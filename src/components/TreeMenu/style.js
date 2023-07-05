import styled from '@emotion/styled';

export const MenuWrapper = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-shrink: 0;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: var(--module);

  div {

    &:hover {
        &::-webkit-scrollbar-thumb {
            border-radius: var(--border-radius-default);
            background: var(--bg);
        }
    }
  }

  .menus-header {
    // margin: 0 8px 0 8px;
    border-bottom: 1px solid var(--background-color-3);
    // height: 92px;
    .apistatus {
      border: 0;
    }
    .mock-btns{
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      margin-bottom: 16px;
      .line {
                border: 1px solid var(--border-line);
                height: 18px;
            }
    .button-list {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        &-item {
            display: flex;
            align-items: center;

            svg {
                fill: var(--font-3);
            }
    
            .apipost-btn:hover {
                background-color: var(--select-hover) !important;

                svg {
                    background: var(--select-hover) !important;
                }
            }
        }

    }
      /* .apipost-btn{
        height: 28px;
        line-height: 28px;
        width: 110px;
      } */
      /* .apipost-btn-primary{
        color: var(--common-white);
        background-color: var(--theme-color);
      }
      .apipost-btn-primary:hover{
        background-color: var(--theme-color);
      }
      .apipost-btn-default{
        border: 1px solid var(--theme-color);
        color: var(--theme-color);
      }
      .apipost-btn-default:hover{
        background-color: transparent;
      } */
    }
    .apistatus-current {
      background-color: transparent;
    }
    .apipost-input-inner-wrapper-mini {
      height: 30px;
      line-height: 30px;
      :hover {
        background-color: var(--select-hover);
      }
    }
    .apipost-input-inner-wrapper {
      padding-right: 0;
    }
    .apipost-btn:hover,
    .apipost-btn:focus,
    .apipost-btn-default:hover,
    .apipost-btn-default:focus {
      color: var(--content-color-primary);
      border-color: 0;
      background-color: var(--highlight-background-color-tertiary);
      svg {
        background: var(--highlight-background-color-tertiary);
        fill: var(--content-color-primary);
        :hover {
          fill: var(--content-color-primary);
        }
      }
    }
  }
`;
