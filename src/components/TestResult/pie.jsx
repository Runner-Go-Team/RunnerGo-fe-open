import { isNull, isNumber } from 'lodash';
import React, { useEffect, useRef } from 'react';

const PieCharts = (props) => {
  const { http, assert } = props;

  const refCvs1 = useRef(null);
  const refCvs2 = useRef(null);

  const CANVAS_WIDTH = 200;
  const CANVAS_HEIGHT = 200;
  const R_BACKGROUND = 100;
  const R_PIE = 90;
  const R_FILL = 30;
  const scale = window.devicePixelRatio;

  useEffect(() => {
    const canvas = refCvs1.current;
    if (!isNull(canvas)) {
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale); // 再来设置比例
    }

    const canvas2 = refCvs2.current;
    if (!isNull(canvas2)) {
      const ctx2 = canvas2.getContext('2d');
      ctx2.scale(scale, scale); // 再来设置比例
    }
  }, []);

  const drawPie = (ctx, x, y, r, angle1, angle2) => {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, r, (angle1 * Math.PI) / 180, (angle2 * Math.PI) / 180, false);
    ctx.closePath();
    ctx.restore();
  };

  const renderPieDom = (
    ref,
    percent1,
    percent2,
    color
  ) => {
    const canvas = ref.current;
    if (!isNull(canvas)) {
      const ctx = canvas.getContext('2d');
      const pie1 = (percent1 * 360) / 100;
      const pie2 = (percent2 * 360) / 100;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      // 画背景
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      drawPie(ctx, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, R_BACKGROUND, 0, 360);
      ctx.fill();

      // 画第一个百分比
      ctx.fillStyle = color;
      drawPie(ctx, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, R_PIE, 0, pie1);
      ctx.fill();

      // 画第二个百分比
      ctx.fillStyle = '#ED2E7E';
      drawPie(ctx, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, R_PIE, pie1, pie1 + pie2);
      ctx.fill();

      // 抹掉中间小圆部分
      ctx.fillStyle = 'var(--font-1)fff';
      drawPie(ctx, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, R_FILL, 0, 360);
      ctx.fill();
    }
  };

  const getPerHtml = (per) => {
    if (isNumber(per)) {
      return `${(per * 100).toFixed(2)}%`;
    }
    return '-';
  };

  const getNumberPercent = (val) => {
    if (isNumber(val)) {
      return val * 100;
    }
    return 0;
  };

  const http_passed_per = getNumberPercent(http?.passed_per);
  const assert_passed_per = getNumberPercent(assert?.passed_per);

  useEffect(() => {
    renderPieDom(refCvs1, http_passed_per, 100 - http_passed_per, '#3CC069');
    renderPieDom(refCvs2, assert_passed_per, 100 - assert_passed_per, '#4ED4FF');
  }, [http_passed_per, assert_passed_per]);

  return (
    <>
      <div className="chart-text">
        <div>
          <span>
            <strong>接口通过率：</strong>
          </span>
          <span>{getPerHtml(http?.passed_per)}</span>
        </div>
        <div>
          <span>
            <strong>接口失败率：</strong>
          </span>
          <span>{getPerHtml(http?.failure_per)}</span>
        </div>
      </div>
      <canvas width={CANVAS_WIDTH * scale} height={CANVAS_WIDTH * scale} ref={refCvs1}></canvas>
      <canvas width={CANVAS_WIDTH * scale} height={CANVAS_WIDTH * scale} ref={refCvs2}></canvas>
      <div className="chart-text">
        <div>
          <span>
            <strong>断言通过率：</strong>
          </span>
          <span>{getPerHtml(assert?.passed_per)}</span>
        </div>
        <div>
          <span>
            <strong>断言失败率：</strong>
          </span>
          <span>{getPerHtml(assert?.failure_per)}</span>
        </div>
      </div>
    </>
  );
};

export default PieCharts;
