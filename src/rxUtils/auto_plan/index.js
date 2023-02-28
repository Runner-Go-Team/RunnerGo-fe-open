import { fetchSceneList } from '@services/scene';
import { from, tap } from 'rxjs';

export const getAutoPlanList$ = (plan_id) => {
    let params = {
        page: 1,
        size: 100,
        team_id: localStorage.getItem('team_id'),
        source: 3,
        plan_id,
    };
    return from(fetchSceneList(params).pipe(
        tap((res) => {
            // return res;
        })
    ))
}