const _ = window._;

import { CompSessionStorage } from './sessionStorageTool_1.js';
import { GlobalData } from './globalData_1.js';


const $CompSession = CompSessionStorage;

////////////////////////////////////////////////////////////////////////////////
//
// switchComponent 用到的 history 功能
//
// 不一定要用，測試功能
//
////////////////////////////////////////////////////////////////////////////////

// let $hasResetHistory = false;


let $comHistory_instance;

class CompHistory {

    static instance() {
        if ($comHistory_instance == null) {
            $comHistory_instance = new CompHistory();
        }
        return $comHistory_instance;
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
        history.pushState({'$$componentHistory': {}}, null);
    }
    //---------------------------------------------------------------
    // 紀錄 container 狀況
    // handle: 一個清除多餘歷史紀錄的機制
    setHistoryData(container, handle, backdata) {
        /*
         {
            id: time,
            containers:{
                container: compName,
                container: compName,
            }
         }
         */
        debugger;
        backdata = !!backdata;
        let containerID = container.uid;

        // 登錄 container
        // 有事件時要檢查 container
        GlobalData.setContainerMap(containerID, container);

        let compName = container.getCompName();
        let compData = null;
        let compOptions = container.getCompOptions();

        if (backdata) {
            compData = container.getCompData();
        }
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

        if (stateData['$$componentHistory']['containers'] == null) {
            stateData['$$componentHistory']['containers'] = {};
        }

        stateData['$$componentHistory'].containers[containerID] = compName;
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

        $CompSession.setHisData_his(timeId, containerID, compName, compData, compOptions);

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
        $(window).on('popstate.$containerSwitchHistory', function (e) {
            debugger;

            e = e.originalEvent;

            let stateData = e.state;

            // 從 history 中取得 data
            //
            // 先找此時的 history 是否有 CompHistory
            // 要運作的訊息
            if (stateData == null || typeof (stateData) != 'object' ||
                    !('$$componentHistory' in stateData)) {
                return;
            }
            //----------------------------
            let history_data = stateData['$$componentHistory'];

            // 時間標記
            let timeId = history_data['id'];
            $this.lastTimeId = timeId;

            if (!$CompSession.hasHisData_his(timeId)) {
                throw new Error(`在 session 沒相關記錄(${timeId})`);
                return;
            }
            //----------------------------
            let $containerMap = history_data['containers'];

            for (let containerID in $containerMap) {
                debugger;

                let container = GlobalData.getContainerMap(containerID);


                // 歷史紀錄中 container 應該掛什麼樣的 compName
                let his_compName = $containerMap[containerID];

                container.mountComponent_callByHis(his_compName, timeId);
            }
        });
    }
    //---------------------------------------------------------------

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
        this._clearHisData();

        this._clearHisCache();
    }
    //---------------------------------------------------------------
    _clearHisData() {
        debugger;

        let s_data = $CompSession.getHisData_his();

        if (s_data == null) {
            return;
        }

        let oldTime = this.time;

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
        $CompSession.setHisData_his(s_data);
    }
    //---------------------------------------------------------------
    _clearHisCache() {

    }
    //---------------------------------------------------------------
    getTime() {
        return this.time;
    }
}


