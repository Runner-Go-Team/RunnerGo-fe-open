import { css } from '@emotion/css';
import styled from '@emotion/styled';

export const EventType = styled.div`
  width: auto;
  height: 28px;
  line-height: 28px;
  padding: 0 8px;
  font-size: var(--size-12px);
  border-radius: 3px;
  margin: 0 8px 0 0;
  white-space: nowrap;
  overflow: hidden;
  &.wait-item {
    background: #fafff9;
    border: 1px solid #068d3c;
    color: #068d3c;
  }
  &.if-item {
    background: #ffe9dc;
    border: 1px solid #d75207;
    color: #d75207;
  }
  &.work-item {
    background: var(--font-1)2fe;
    border: 1px solid #a91260;
    color: #a91260;
  }
  &.assert-item {
    background: #ffefef;
    border: 1px solid #ac0000;
    color: #ac0000;
  }
  &.script-item {
    background: #d6fffd;
    border: 1px solid #06758d;
    color: #06758d;
  }
  &.loop-item {
    background: #f1f5ff;
    border: 1px solid #0e4398;
    color: #0e4398;
  }
`;

export const EventsPanel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  .apipost-select {
    border-radius: 2px;
    height: 28px;
  }
  .apipost-input-inner-wrapper {
    height: 28px;
    border-radius: 4px;
    margin: 0 3px;
    max-width: 280px;
  }
  .apipost-btn {
    height: 28px;
  }

  .apipost-input-number {
    width: 80px;
    height: 28px;
    border-radius: 2px;
    margin: 0 3px;
    background: #e9e9e9;
    padding: 0 4px;
    background-color: var(--background-color-tertiary);
    color: var(--content-color-secondary);
    svg {
      fill: var(--content-color-secondary);
    }
    .apipost-input-number-step {
      width: 16px;
      height: 16px;
      line-height: 16px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }
    .apipost-input-inner-wrapper {
      border-width: 0;
      text-align: center;
    }
  }

  .api {
    &-method {
      margin: 0 8px 0 0;
      width: 48px;
      font-size: 12px;
      text-align: center;
      overflow: hidden;
    }
    &-name {
      height: 26px;
      line-height: 26px;
      width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 8px 0 0;
    }
    &-url {
      flex: 1;
      width: 0;
      margin: 0 8px 0 0;
    }
    &-detail {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radiu: 3px;
      cursor: pointer;
      background: var(--select);
      svg {
        fill: var(--font-1)fff;
      }
    }
  }
`;

export const ControllerWrapper = styled.div`
  .test-controller {
    display: flex;
    align-items: center;
    width: 100%;
    height: 42px;
    // background: var(--bg-3);
    // color: var(--font-1)fff;
    border-radius: var(--border-radius-default);
    margin: 0 0 8px 0;
    padding: 8px;
    border: 1px solid #e9e9e9;
  }

  .apipost-input-inner-wrapper {
    height: 28px;
    margin: 0 8px 0 0;
    .apipost-input {
      height: 100%;
    }
  }

  .ctrl-flex1 {
    flex: 1;
    width: 0;
    display: flex;
    align-items: center;
  }
  .ctrl-status {
    width: 20px;
    height: 20px;
    margin: 0 8px 0 0;
    visibility: hidden;
    &.show {
      visibility: visible;
    }
  }
  .ctrl-category {
    height: 28px;
    line-height: 28px;
    padding: 0 8px;
    font-size: var(--size-12px);
    border-radius: 3px;
    margin: 0 8px 0 0;

    &.wait-item {
      background: #fafff9;
      border: 1px solid #068d3c;
      color: #068d3c;
    }
    &.if-item {
      background: #ffe9dc;
      border: 1px solid #d75207;
      color: #d75207;
    }
    &.work-item {
      background: var(--font-1)2fe;
      border: 1px solid #a91260;
      color: #a91260;
    }
    &.assert-item {
      background: #ffefef;
      border: 1px solid #ac0000;
      color: #ac0000;
    }
    &.script-item {
      background: #d6fffd;
      border: 1px solid #06758d;
      color: #06758d;
    }
    &.loop-item {
      background: #f1f5ff;
      border: 1px solid #0e4398;
      color: #0e4398;
    }
  }
  .ctrl-index {
    margin: 0 8px 0 0;
    &.first {
      width: 28px;
      height: 28px;
      line-height: 28px;
      border-radius: 50%;
      text-align: center;
      color: var(--font-1)fff;
      background: rgba(0, 0, 0, 0.08);
    }
    &.second {
      padding: 0 8px;
      height: 28px;
      line-height: 28px;
      border-radius: 50%;
      color: var(--font-1)fff;
      background: var(--select);
    }
  }
  .ctrl-news {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 200px;
    > div {
      padding: 0 0 0 8px;
      border-left: 1px solid var(--bg-4);
      // color: var(--font-1)fff;
      &.success {
        color: var(--run-green);
      }
      &.error {
        color: var(--delete-red);
      }
    }
    > div:nth-last-of-type(1) {
      width: 56px;
    }
    > div:nth-last-of-type(2) {
      width: 76px;
    }
    > div:nth-last-of-type(3) {
      width: 66px;
    }
  }
  .ctrl-handle {
    width: 28px;
  }

  .api {
    &-method {
      margin: 0 8px 0 0;
    }
    &-name {
      width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0 8px 0 0;
    }
    &-url {
      flex: 1;
      width: 0;
      margin: 0 8px 0 0;
    }
    &-detail {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radiu: 3px;
      cursor: pointer;
      background: var(--select);
      svg {
        fill: var(--font-1)fff;
      }
    }
  }
  .apipost-input-number {
    width: 80px;
    height: 28px;
    background: #e9e9e9;
    padding: 0 4px;
    background-color: var(--background-color-tertiary);
    color: var(--content-color-secondary);
    svg {
      fill: var(--content-color-secondary);
    }
    .apipost-input-number-step {
      width: 16px;
      height: 16px;
      line-height: 16px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 3px;
    }
    .apipost-input-inner-wrapper {
      border-width: 0;
      text-align: center;
    }
  }
  .loop {
    &-for {
      .for-left {
        display: flex;
        align-items: center;
        margin: 0 8px 0 0;
        .apipost-input-inner-wrapper {
          margin: 0 8xp;
        }
      }
    }
    &-foreach {
      .foreach-left {
        display: flex;
        align-items: center;
      }
      .in {
        margin: 0 8px 0 0;
      }
    }
    &-while {
      while-left {
        display: flex;
        align-items: center;
      }
    }
    &-box {
      padding: 0 0 0 120px;
      display: flex;
      align-items: center;
      .apipost-input-inner-wrapper {
        height: 28px;
      }
      .apipost-select {
        width: 90px;
        height: 28px;
        margin: 0 8px 0 0;
      }
    }
    &-interval {
      display: flex;
      align-items: center;
      .apipost-input-number {
        margin: 0 8px;
        background-color: var(--background-color-tertiary);
        color: var(--content-color-secondary);
        svg {
          fill: var(--content-color-secondary);
        }
      }
    }
  }
  .working-box {
    display: flex;
    align-items: center;
    .item {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 8px 0 0;
      cursor: pointer;
    }
    .run-item {
      background: var(--log-blue);
      border-radius: var(--border-radius-default);
      svg {
        fill: var(--font-1)fff;
      }
    }
  }
  .ctrl-check-box {
    display: flex;
    align-items: center;
    margin-right: 8px;
  }

  .condition-wrapper {
  }
`;
