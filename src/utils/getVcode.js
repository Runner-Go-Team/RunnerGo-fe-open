export const getVcodefun = () =>
  new Promise((reslove) => {
    window.initGeetest4(
      {
        captchaId: '',
        nativeButton: {
          height: '60px',
          width: '100%',
        },
        protocol: 'https://',
        rem: 1,
        // buttonHeight: 60
      },
      function (captcha) {
        // captcha为验证码实例
        // document.querySelector('#captcha .geetest_logo').setAttribute('href', 'https://www.apipost.cn');
        captcha.appendTo('#captcha').onSuccess(function (e) {
          const result = captcha.getValidate();
          // result.dom = captcha;
          reslove({ result, captcha });
        });
      }
    );
  });

export default getVcodefun;
