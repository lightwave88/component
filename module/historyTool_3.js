const _ = window._;

import { CompSessionStorage } from './sessionStorageTool_2.js';
import { GlobalData } from './globalData_1.js';
import { CompSetting } from './settings_1.js';

const $CompSession = CompSessionStorage;
const $GlobalData = GlobalData;
const $CompSetting = CompSetting;
////////////////////////////////////////////////////////////////////////////////
//
// switchComponent 用到的 history 功能
//
// 不一定要用，測試功能
//
////////////////////////////////////////////////////////////////////////////////

// let $hasResetHistory = false;

// his 單一模式
let $comHistory_instance;


class CompHistory {

    static instance() {
        if ($comHistory_instance == null) {
            $comHistory_instance = new CompHistory();
        }
        return $comHistory_instance;
    }

    //---------------------------------------------------------------
    // 應該用不到
    static beforeHisChange() {
        let state = hisotry.state;
        let timeId;

        if (state == nll || typeof (state) != 'object') {
            state = {};
        }

        if (state['$$componentHistory'] == null) {
            state['$$componentHistory'] = {};
            state['$$componentHistory']['id'] = (new Date()).getTime();
            history.replaceState(state, null);
        }

        timeId = state['$$componentHistory']['id'];

        handle = new ComHistoryHandle(timeId);
        return handle;
    }
    //---------------------------------------------------------------
    // 應該用不到
    static afterHisChange(handle) {
        let state = hisotry.state;

        if (state == nll || typeof (state) != 'object') {
            state = {};
        }

        let oldTime = handle.getTime();

        if (state['$$componentHistory'] == null) {
            let time = (new Date()).getTime();

            if (time == oldTime) {
                time = oldTime + 1;
            }

            state['$$componentHistory'] = time;
            history.replaceState(state, null);
        } else {
            let time = state['$$componentHistory'];
            if (time == oldTime) {
                time = oldTime + 1;
            }
            state['$$componentHistory'] = time;
            history.replaceState(state, null);
        }

        let timeId = state['$$componentHistory'];


        handle.check(timeId);
    }

    //---------------------------------------------------------------
    // 清理垃圾
    // fix
    // 應實作在 dataStorage
    static clearHisOldData(timeId) {
        // debugger;

        // hisData
        const hisData = $CompSession.getHisData_his();

        if (hisData != null) {

            for (let k in hisData) {
                // debugger;

                let time = parseInt(k, 10);
                if (time > timeId) {
                    console.log('del old hisData(%s)(%s)', k, JSON.stringify(hisData[k]));
                    delete hisData[k];
                }
            }

            $CompSession.replaceHisData_his(hisData);
        }
        //----------------------------
        // hisData

        const containerComps = $CompSession.getContainerComp_his();

        if (containerComps != null) {

            for (let k in containerComps) {
                // debugger;

                let time = parseInt(k, 10);
                if (time > timeId) {
                    console.log('del old containerComps(%s)(%s)', k, JSON.stringify(containerComps[k]));
                    delete containerComps[k];
                }
            }

            $CompSession.replaceContainerComp_his(containerComps);
        }
        //----------------------------
        // cache

    }
    //---------------------------------------------------------------
    // 同一頁面重 load
    // 可能殘留下之前的 history.state
    static initReset() {

        let s_data = history.state;
        s_data = Object.assign({}, s_data);

        s_data['$$componentHistory'] = {};

        history.replaceState(s_data, null);
    }
    //---------------------------------------------------------------
    constructor() {
        this.lastTimeId = null;

        this._addEventListener();
    }
    //---------------------------------------------------------------
    // 暫時製造一個歷史紀錄
    //
    putNullState() {
        history.pushState({ '$$componentHistory': {} }, null);
    }
    //---------------------------------------------------------------
    // 修補 historyChain 斷掉不連續的做法
    updateHistoryId() {
        let stateData = history.state;

        if (stateData == null || typeof (stateData) != 'object') {
            stateData = {};
        }

        if (stateData['$$componentHistory'] == null) {
            stateData['$$componentHistory'] = {};
        }

        if (stateData['$$componentHistory']['id'] == null) {
            stateData['$$componentHistory']['id'] = (new Date()).getTime();
        }

        let timeId = stateData['$$componentHistory'].id;
        this.lastTimeId = timeId;

        history.replace(stateData, null);
    }
    //---------------------------------------------------------------
    // 紀錄 container 狀況
    // handle: 一個清除多餘歷史紀錄的機制
    setHistoryData(container, handle, keepData) {
        /*
        資料格式
         {
            id: time
         }
         */
        // debugger;
        keepData = true;
        //-----------------------
        let stateData = history.state;

        if (stateData == null || typeof (stateData) != 'object') {
            stateData = {};
        }

        if (stateData['$$componentHistory'] == null) {
            stateData['$$componentHistory'] = {};
        }

        if (stateData['$$componentHistory']['id'] == null) {
            stateData['$$componentHistory']['id'] = (new Date()).getTime();
        }
        //-----------------------
        // 檢查時間
        if (handle != null) {
            let oldTime = handle.getTime();
            if (stateData['$$componentHistory'].id == oldTime) {
                console.log('history 發生時間 id 重疊');
                stateData['$$componentHistory'].id = (oldTime + 1);
            }
        }
        //-----------------------
        // 更新 sessionStorage 資料

        let timeId = stateData['$$componentHistory'].id;
        this.lastTimeId = timeId;

        $CompSession.setHisData_his(timeId, container);

        $CompSession.upDateContainerComp_his(timeId);

        //-----------------------
        history.replaceState(stateData, null);

        if (handle == null) {
            handle = new ComHistoryHandle(timeId);
            return handle;
        } else {
            handle.check(timeId);
        }
    }
    //---------------------------------------------------------------
    removeEventListener() {

    }
    //---------------------------------------------------------------
    // 取得 timeId
    // history 模式下
    getCurrentTimeId() {
        let stateData = history.state;

        if (stateData['$$componentHistory'] == null) {
            return null;
        }

        let res = stateData['$$componentHistory']['id'];

        return (res == null ? null : res);
    }

    //---------------------------------------------------------------
    // 只要綁定一次事件監聽
    _addEventListener() {
        const $this = this;

        $(window).off('popstate.$containerSwitchHistory');


        // 這個非常重要
        $(window).on('popstate.$$comp', function (e) {
            debugger;
            e = e.originalEvent;

            if (!$CompSetting.noHistoryNextAction) {
                $this._popstateEvent(e);
            } else {
                $this._popstateEvent_noHistoryNextAction(e);
            }
        });
    }
    //---------------------------------------------------------------
    // 瀏覽器 history 模式
    _popstateEvent(e) {
        // 更新各 container 狀態
        for (let containerID in $containerMap) {
            debugger;

            let container = $GlobalData.getContainerMap(containerID);

            // 歷史紀錄中 container 應該掛什麼樣的 compName
            let his_compName = $containerMap[containerID];

            container.mountComponent_callByHis(his_compName, timeId, false);
        }
    }

    // 手機 hisotry 模式
    _popstateEvent_noHistoryNextAction(e) {
        let direction = null;

        let stateData = e.state;

        // 從 history 中取得 data
        //
        // 先找此時的 history 是否有 CompHistory
        // 要運作的訊息
        if (stateData == null || typeof (stateData) != 'object' ||
            !('$$componentHistory' in stateData)) {

            this.lastTimeId = null;
            return;
        }
        //-----------------------
        let history_data = stateData['$$componentHistory'];

        // 時間標記
        let timeId = history_data['id'];

        if (this.lastTimeId != null) {
            // 確定 history 方向，是往前還是往後
            direction = timeId - this.lastTimeId;
        }
        this.lastTimeId = timeId;

        //-----------------------
        if (direction != null && direction >= 0) {
            // 只處理 history 往後
            // 不管 history 往前
            CompHistory.clearHisOldData(timeId);
            return;
        } else {
            // 刪除大於 timeId 的歷史記錄
            CompHistory.clearHisOldData(timeId);
        }
        debugger;
        //----------------------------
        // 取出此時各 container 對應的 comp 資料
        const $containerMap = $CompSession.getContainerComp_his(timeId);

        if ($containerMap == null) {
            return;
        }

        // 更新各 container 狀態
        for (let containerID in $containerMap) {
            debugger;

            let container = $GlobalData.getContainerMap(containerID);

            // 歷史紀錄中 container 應該掛什麼樣的 compName
            let his_compName = $containerMap[containerID];

            container.mountComponent_callByHis(his_compName, timeId, true);
        }
    }

}

export { CompHistory };
export default CompHistory;

////////////////////////////////////////////////////////////////////////////////
// 紀錄時間
class ComHistoryHandle {
    constructor(time) {
        this.time = time;
    }
    //---------------------------------------------------------------
    check(new_time) {

        // hisData
        this._clearHisData(new_time);

        // cache
        this._clearHisCache(new_time);

        // containerComp
        this._clearHisContainerComp(new_time);
    }
    //---------------------------------------------------------------
    _clearHisData(new_time) {
        // debugger;

        const s_data = $CompSession.getHisData_his();

        if (s_data == null) {
            return;
        }

        const oldTime = this.time;

        // 刪除不用的紀錄
        // 最重要之處
        for (let k in s_data) {
            let t = parseInt(k, 10);
            if (t > oldTime && t < new_time) {
                console.log('刪除無用 his(%s)', t);
                delete s_data[k];
            }
        }

        // 更新 sessionStorage
        $CompSession.replaceHisData_his(s_data);
    }
    //---------------------------------------------------------------
    _clearHisCache(new_time) {

    }
    //---------------------------------------------------------------
    _clearHisContainerComp(new_time) {
        // debugger;

        const data = $CompSession.getContainerComp_his();

        if (data == null) {
            return;
        }

        const oldTime = this.time;

        for (let k in data) {
            let t = parseInt(k, 10);
            if (t > oldTime && t < new_time) {
                console.log('刪除無用 his(%s)', t);
                delete data[k];
            }
        }

        $CompSession.replaceContainerComp_his(data);
    }
    //---------------------------------------------------------------
    getTime() {
        return this.time;
    }
}


CompSessionStorage.inject('CompHistory', CompHistory);
