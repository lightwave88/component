const _ = window._;

////////////////////////////////////////////////////////////////////////////////
//
// switchComponent 用到的 history 功能
//
// 不一定要用，測試功能
//
////////////////////////////////////////////////////////////////////////////////

// 紀錄網頁中有那些 container
const $containerMap = {};



class ComHistory {

    // 紀錄 container 狀況
    // handle: 一個機制
    static recordContainerStatus(container, handle) {
        debugger;

        if (!ComHistory.flag_hasBindPopstateEvent) {
            // history 事件監聽是否已經綁定

            ComHistory._init();
        }

        const containerID = container.uid;
        // 登錄 container
        // 有事件時要檢查 container
        $containerMap[containerID] = container;
        //-----------------------

        let compName = container.getCompName();
        let compData = container.getCompData();

        // history 中是否有需要的 data
        let haveStateData = true;

        let stateData = history.state;

        if (stateData == null || typeof (stateData) != 'object' || !('$$componentHistory' in stateData)) {
            haveStateData = false;

            const t = (new Date()).getTime();

            stateData = {};
            stateData['$$componentHistory'] = {
                id: t,
                containers: {},
            };
        }
        stateData['$$componentHistory'].containers[containerID] = compName;

        //-----------------------
        if (haveStateData) {
            history.replaceState(stateData, null);
        } else {
            history.pushState(stateData, null);
        }

        let timeId = stateData['$$componentHistory'].id;

        
        if(handle == null){
            handle;
        }else{
            handle.check();

        }
    }
    //==========================================================================
    // API
    //
    // change comp 會用到
    //
    // container 本體
    // componentName: [一般 compName, url=()]
    // 有可能會是開啟 iframe
    // data: 要記錄於 history 中的 data
    static mountCompItem(container, old_compName, new_compName, data, url) {
        debugger;


        // 檢查 window 是否曾對 popstate 設置監聽
        if (!ComHistory.flag_hasBindPopstateEvent) {
            ComHistory._init();
        }

        data = data || {};


        let containerID = container.uid;
        //-----------------------
        // 登錄 container
        // 有事件時要檢查 container
        $containerMap[containerID] = container;
        //-----------------------

        let new_stateData;

        let stateData = history.state;

        debugger;
        // 處理現有的 history
        const t = (new Date()).getTime();
        if (stateData == null || typeof (stateData) != 'object' || !('$$componentHistory' in stateData)) {

            stateData = {};

            stateData['$$componentHistory'] = {
                id: (t - 1),
                containers: {},
            };
        }
        stateData['$$componentHistory'].containers[containerID] = old_compName || null;

        // 處理未來的 history
        t = (new Date()).getTime();
        new_stateData = {};
        new_stateData['$$componentHistory'] = {
            id: t,
            containers: {},
        };

        new_stateData['$$componentHistory'].containers[containerID] = new_compName;

        //-----------------------
        // 把資料記錄在 sessionStorage

        ComHistory._addState2Session(t, containerID, data);
        //-----------------------
        // 修改當前的 history

        history.replaceState(stateData);
        //-----------------------
        // 改變 history
        ComHistory._mountCompItem(stateData, new_stateData);
    }
    //==========================================================================

    static unmountCompItem(container) {

    }
    //==========================================================================
    // API
    //
    // comp.updateData
    //
    // 把現有 container 的資訊記錄在現有的 history
    static compItemSetData(container, data) {
        debugger;

        let containerID = container.uid;

        // 登錄 container
        // 有事件時要檢查 container
        $containerMap[containerID] = container;

        // 當前 container 掛上的 comp
        let currentComp = container.getMountedComponent();

        if (currentComp == null) {
            return;
        }

        let currentCompName = currentComp.getComponentName();

        //-----------------------
        // 覆寫現有的 history.state
        let stateData = ComHistory.getStateData();
        stateData = stateData['$$componentHistory'];

        if (stateData['url'] == null) {
            stateData['url'] == location.href;
        }


        // important step
        // 
        // 在當前的 history.state 加入現有 conatiner.comp.name
        // stateData['containers'][containerID] = currentCompName;
        //-----------------------

        // 現在 container 掛的 comp.data
        let data = currentComp.getComponentData();

        // 把資料記錄在 sessionStorage
        ComHistory._addState2Session(stateData.id, containerID, data);
        //-----------------------

        // 更新當前 history.state
        history.replaceState(stateData, null, stateData['url']);
    }
    //==========================================================================
    // 比較麻煩的地方
    //
    // 在 sessionStorage 可能會出現遺留未清的記憶體
    // 必須把 history 無用分支所攜帶的 data 移除
    // 避免佔去記憶體
    static _mountCompItem(currentState, new_stateData) {

        let oldTime = currentState['id'];

        let newTime = new_stateData['$$componentHistory']['id'];
        //-----------------------

        let s_data = sessionStorage.getItem('$$componentHistory');
        s_data = JSON.parse(s_data);


        // 刪除不用的紀錄
        // 最重要之處
        for (let k in s_data) {
            let t = parseInt(k, 10);
            if (t > oldTime && t < newTime) {
                delete s_data[k];
            }
        }

        s_data = JSON.stringify(s_data);

        // 更新 sessionStorage
        sessionStorage.setItem('$$componentHistory', s_data);
        //-----------------------
        let url = new_stateData['$$componentHistory']['url'];
        history.pushState(new_stateData, url);
    }
    //==========================================================================
    static _init() {
        ComHistory._addEventListener();

        // 是否在 window 上綁定一個 popstate 的監聽
        ComHistory.flag_hasBindPopstateEvent = false;
    }
    //==========================================================================
    // 取得或設置 history.data
    static getStateData() {
        let stateData = history.state;

        // 歷史紀錄中是否已有紀錄
        // 有則拿其來修改
        // 沒有澤新創一個然後塞回去
        if (stateData == null || typeof (stateData) != 'object') {
            stateData = {};
        }

        if (!('$$componentHistory' in stateData)) {

            // 用時間做為 state.id
            let state_id = (new Date()).getTime();

            stateData['$$componentHistory'] = {
                id: state_id,
                url: null,
                containers: {},
            };
        }
        return stateData;
    }
    //---------------------------------------------------------------

    // 新增資訊到 sessionStorage
    // key: state_id
    static _addState2Session(state_id, container_id, data) {
        let s_data;
        let i = 0;

        // sessionData 結構
        // sessionStorage['$$componentHistory'][state_id][container_id] = data;
        while ((s_data = sessionStorage.getItem('$$componentHistory')) == null) {
            if (i > 0) {
                throw new Error('sessionStorage init error');
            }
            sessionStorage.setItem('$$componentHistory', JSON.stringify({}));
            i++;
        }

        s_data = JSON.parse(s_data);

        // 這個粉重要，千萬不要改
        s_data[state_id] = s_data[state_id] || {};

        s_data[state_id][container_id] = data;

        s_data = JSON.stringify(s_data);

        sessionStorage.setItem('$$componentHistory', s_data);
    }
    //---------------------------------------------------------------
    // 只要綁定一個事件監聽
    static _addEventListener(container) {
        if (ComHistory.flag_hasBindPopstateEvent) {
            return;
        }

        $(window).on('popstate.$containerSwitchHistory', function (e) {
            debugger;

            e = e.originalEvent;

            let stateData = e.state;

            // 先找此時的 history 是否有 ComHistory
            // 要運作的訊息
            if (stateData == null || typeof (stateData) != 'object' ||
                !('$$componentHistory' in stateData)) {
                return;
            }
            //----------------------------
            let main_data = stateData['$$componentHistory'];

            // 時間標記
            let historyID = main_data['id'];

            let containerMap = main_data['containers'];

            for (let containerID in containerMap) {

                let container = $containerMap[containerID];
                let compName = main_data[containerID];

                ComHistory._checkContainer(historyID, container, compName);
            }
        });

        ComHistory.flag_hasBindPopstateEvent = true;
    }
    //---------------------------------------------------------------
    static _checkContainer(historyID, container, his_compName) {
        debugger;

        let currentCompName = container.getCompName();


        if (his_compName == null) {
            // unmount
            if (currentCompName == his_compName) {
                return;
            }

            container.unmountComponent();

        } else {
            // mount

            if (currentCompName == his_compName) {
                return;
            }
            let compData = sessionStorage.getItem('$$componentHistory');

            compData = (compData == null ? {} : JSON.parse(compData));

            container.mountComponent(his_compName, compData);
        }


    }
    //---------------------------------------------------------------
    static removeEventListener(container) {
        let containerID = container.uid;
        delete ComHistory[containerID];
    }
}

(function ($c) {
    // 是否在 window 上綁定一個 popstate 的監聽
    $c.flag_hasBindPopstateEvent = false;


})(ComHistory);


export { ComHistory };


class ComHistoryHandle{
    
}
