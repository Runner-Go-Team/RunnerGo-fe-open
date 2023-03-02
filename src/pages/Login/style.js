import styled from '@emotion/styled';

export const LoginWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #fff;
  .left {
    width: 830px;
    min-width: 830px;
    height: 100%;
    min-height: 100vh;

    background-image: url("your qrcode oss url");
    background-repeat: no-repeat;
    background-size: 100%;

    &-bar {
      height: 800px;
      width: 100%;
    }
    // background: linear-gradient(140.02deg, #f9f9fa, #f7f8ff);
    .title {
      margin-top: 8px;
      font-weight: 600;
      font-size: var(--size-30px);
      line-height: 80px;
      color: var(--font-1);
    }
    .desc {
      line-height: 34px;
      margin: 4px 0 100px 0;
      font-size: var(--size-18px);
      color: #666;
    }
    .logo-box {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .app-version {
      padding: 4px;
      height: 25px;
      width: 78px;
      line-height: 17px;
      background: var(--font-1);
      color: var(--text-lightmode-color);
      font-size: var(--size-12px);
      text-align: center;
      margin: 0 0 0 10px;
      border-radius: 3px;
    }
  }
  .right {
    flex: 1;
    position: relative;
    // background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // &-wrapper {
    //   width: 348px;
    //   height: auto;
    //   position: absolute;
    //   left: 50%;
    //   top: 50%;
    //   transform: translate(-50%, -50%);

    //   .arco-select-view {
    //     background-color: #FBFBFB !important;
    //     border: 1px solid #E1E1E1 !important;
    //   }

    //   .apipost-input-inner-wrapper {
    //     background-color: transparent;
    //     border: 1px solid #ECECEC;
    //   }
    // }
    // .title {
    //   height: 34px;
    //   font-size: var(--size-24px);
    //   line-height: 34px;
    //   color: var(--content-color-secondary);
    //   display: flex;
    //   justify-content: space-between;
    //   flex-direction: row !important;

    //   .register-title {
    //     font-size: 16px;
    //     color: var(--font-1);
    //   }

    //   &.active {
    //     color: var(--content-color-primary);
    //   }
    // }

    // .login-type {
    //   display: flex;
    //   color: #000;
    //   font-size: 14px;

    //   p {
    //     cursor: pointer;
    //   }

    //   .select {
    //     font-weight:600;
    //   }
    // }

    // .tabs {
    //   display: flex;
    //   justify-content: space-between;
    //   position: relative;
    //   padding: 0 30px;
    //   &::before {
    //     content: '';
    //     height: 34px;
    //     width: 2px;
    //     position: absolute;
    //     left: calc(50% - 1px);
    //     top: 0;
    //     background: var(--background-color-secondary);
    //   }
    //   .tabs-item {
    //     cursor: pointer;
    //     &.active {
    //       color: var(--content-color-primary);
    //     }
    //   }
    // }
    // .remeber {
    //   display: flex;
    //   align-items: center;
    //   justify-content: space-between;
    //   margin: 0 0 28px 0;
  
    //   &-left {
    //     display: flex;
    //     align-items: center;
    //     cursor: pointer;
    //   }
    // }

    // .login-have {
    //   color: var(--theme-color);
    //   text-align: center;
    //   font-size: 14px;
    //   cursor: pointer;
    // }
  
    // .forget {
    //   color: var(--content-color-secondary);
    //   cursor: pointer;
    // }
  
    // .resign {
    //   color: var(--theme-color);
    //   text-align: center;
  
    //   span {
    //     cursor: pointer;
    //   }
    // }

    // .item {
    //   height: 76px;
    //   display: flex;
    //   flex-direction: column;

    //   .agreement {
    //     font-size: 14px;
    //     span {
    //       color: var(--theme-color);
    //       cursor: pointer;
    //     }
    //   }

    //   .apipost-btn {
    //     height: 41px;
    //     background-color: var(--theme-color);
    //   }

    //   .error-tips {
    //     color: rgb(255, 77, 79);
    //     font-size: 14px;
    //     margin-top: 6px;
    //     margin-left: 4px;
    //   }
    // }
    // .phone-code {
    //   display: flex;
    //   flex-direction: row;

    //   .apipost-input-inner-wrapper {
    //     min-width: 240px;
    //     width: 100%;
    //   }

    //   .apipost-btn {
    //     min-width: 95px;
    //     color: var(--common-white);
    //     margin-top: 0;
    //   }
    // }

    // .loading-btn {
    //   width: 95px;
    //   color: #666 !important;
    //   margin-top: 0;
    //   background-color: #ECECEC !important;
    //   border: 1px solid #ECECEC;
    // }
    
    // .input-error > .apipost-input-inner-wrapper {
    //   background: rgba(255, 76, 76, 0.1);
    //   border: 1px solid var(--bg-4);
    // }
    // .qr-code {
    //   .login_wx {
    //     position: relative;
    //     margin-top: 34px;
    //     margin-bottom: 23px;
    //     padding: 12px;
    //     .login_round {
    //       display: flex;
    //       align-items: center;
    //       height: 197px;
    //       canvas {
    //         // border: 1px solid var(--border-color-default);
    //       }
    //     }
    //   }
    //   .wx-tips {
    //     text-align: center;
    //     font-size: var(--size-14px);
    //     color: var(--base-color-info);;
    //   }
      
    //   .tips {
    //     text-align: center;
    //     font-size: var(--size-14px);
    //     color: var(--content-color-secondary);
    //   }
    // }
  }
`;
