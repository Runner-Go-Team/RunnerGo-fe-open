import Bus from './eventBus';

class Timer {
  timerList = {};

  addTimer(name, callback, time) {
    this.timerList[name] = callback;
    this.runTimer(name, time);
  }

  runTimer(name, time) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const task = _this.timerList[name];

    if (!task) return;
    task.t = setTimeout(() => {
      try {
        task.call(this, name);
      } catch (error) {
        // 无需继续循环执行
        _this.clearTimer(name);
      }

      clearTimeout(task.t);
      _this.runTimer(name, time);
    }, time || 3 * 60 * 60 * 1000);
  }

  clearTimer(name) {
    // 由于删除该计时器时可能存在该计时器已经入栈，所以要先清除掉，防止添加的时候重复计时
    clearTimeout(this.timerList[name].t);
    delete this.timerList[name];
  }
}

export default new Timer();
