import { Observable } from 'rxjs';
import { Message } from 'adesign-react';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import Bus from '@utils/eventBus';
import { isLogin } from '@utils/common';
import { RD_BASE_URL, APP_VERSION, REQUEST_TIMEOUT, RD_ADMIN_URL } from '@config/index';
import { getUserConfig$ } from '@rxUtils/user';
import { global$ } from '@hooks/useGlobal/global';
import { getCookie, clearUserData } from '@utils';

export const rxAjax = (
    method = 'GET',
    url,
    contentType,
    loading,
    params,
    query
) => {

    let request = ajax({
        method,
        url: `${RD_BASE_URL}${url}`,
        headers: {
            Authorization: getCookie('token') || "",
            CurrentTeamID: localStorage.getItem('team_id') ? localStorage.getItem('team_id') : "0"
        },
        body: params,
        queryParams: query,
    });

    request = request.pipe(
        map((resp, a) => {
            if (resp?.status === 200) {
                if (resp.response.code === 0) {
                    return resp?.response;
                } else {
                    if (localStorage.getItem('i18nextLng') === 'en') {
                        Message('error', resp.response.em);
                    } else {
                        Message('error', resp.response.et);
                    }
                }

                if (resp.response.code === 20006) {
                    window.location.href = '/#/invitateExpire';
                }
                if (resp.response.code === 20012) {
                    window.location.href = '/#/404';
                }

                if (resp.response.code === 20014) {
                    setTimeout(() => {
                        window.location.href = RD_ADMIN_URL
                    }, 1500);
                    // getUserConfig$().subscribe({
                    //     next: () => {
                    //         global$.next({
                    //             action: 'INIT_APPLICATION',
                    //         });
                    //     }
                    // })

                }

                if(resp.response.code === 20072){
                    setTimeout(()=>{
                        clearUserData();
                         window.location.href = `${RD_ADMIN_URL}/#/login`;
                    },1000)
                }
 
                if (resp.response.code === 20024) {
                    window.location.href = '/#/Treport/list';
                }


                if (resp.response.code === 20029) {
                    window.location.href = '/#/renew';
                }

                if (resp.response.code === 20034) {
                    window.location.href = "/#/linkoverstep";
                }

                if (resp.response.code === 20003 || resp.response.code === 10006) {
                    localStorage.removeItem('runnergo-token');
                    localStorage.removeItem('expire_time_sec');
                    localStorage.removeItem('team_id');
                    localStorage.removeItem('settings');
                    localStorage.removeItem('open_apis');
                    localStorage.removeItem('open_scene');
                    localStorage.removeItem('open_plan');
                    localStorage.removeItem("package_info");
                    window.location.href = `${RD_ADMIN_URL}/#/login`;
                    Bus.$emit('closeWs');
                }

                catchError((error) => {
                    throw error;
                });
                // 接口
            }
            catchError((error) => {
                throw error;
            });
            // 接口状态码不为10000也要返回响应内容（TODO）
            return resp?.response;
        }),
        catchError((error) => {
            throw error;
        })
    );
    return request;
};

export default rxAjax;
