const _ = window._;

// import { CompHistory } from './historyTool_3.js';
import { GlobalData } from './globalData_1.js';

const $module = {
    'CompHistory': null
};


// const $CompHis = CompHistory;
const $GlobalData = GlobalData;
//==============================================================================
/*
記錄 container[timeId] => item.cache
{
    timeId:{
        container: {
            comp: compName,
            item: compItem
        },
        },
        container: {}
    },
    timeId:{}
}

*/
const $hisCache = {};

class CompSessionStorage {

    // 在每次有 container 變動，觸發 his 時
    // 記錄所有 container 的 comp
    // 提供給 setBack 資訊
    static upDateContainerComp_his(timeId) {
        /*
            {
                time:{
                    container: compName,
                    container: compName,
                },
                time:{}
            }
        */
        debugger;

        const containerHisCompMap = $GlobalData.getContainerMap();

        let data = CompSessionStorage.getContainerComp_his();

        if (data == null) {
            data = {};
        }

        if (data[timeId] == null) {
            data[timeId] = {};
        }

        for (let containerId in containerHisCompMap) {
            let container = containerHisCompMap[containerId];
            let compName = container.getCompName();

            data[timeId][containerId] = compName;
        }

        data = JSON.stringify(data);

        sessionStorage.setItem('$$com_comp2Container', data);
    }
    //----------------------------------------------------------
    static replaceContainerComp_his(data) {
        data = JSON.stringify(data);
        sessionStorage.setItem('$$com_comp2Container', data);
    }
    //----------------------------------------------------------
    // 記錄 container => comp
    static getContainerComp_his(timeId, container) {
        /*
            {
                time:{
                    container: compName,
                    container: compName,
                },
                time:{}
            }
        */
        let data = sessionStorage.getItem('$$com_comp2Container');

        if (data == null) {
            return null;
        } else {
            data = JSON.parse(data);
        }

        if (timeId == null && container == null) {
            return data;
        } else if (container == null) {
            return (data[timeId] != null ? data[timeId] : null);
        } else {

            let res = null;
            let containerId = (typeof container == 'string') ? container : container.uid;

            try {
                res = data[timeId][containerId];
            } catch (error) {

            } finally {
                return res;
            }
        }
    }
    //==========================================================================
    // 可以得知 history deqianhouguanxi
    setHistoryPrevLink_his(timeId, prev){
        /*
            id:{
                prev:
                next:
            },
            id:{}
        */

       let data = sessionStorage.getItem('$$com_hisLink(his)');

    }

    setHistoryNextLink_his(timeId, next){

    }

    getHistoryLink_his(timeId){
        /*
            id:{
                prev:
                next:
            },
            id:{}
        */

       sessionStorage.getItem('$$com_hisLink(his)', s_data);
    }
    //==========================================================================
    // histroyData
    // history 用
    //
    // 設定 container.data
    // data, options 設定成覆蓋性
    static setHisData_his(timeId, container) {

        // 資料格式
        /*
        {
            timeId:{
                container_id:{
                    comp: compName
                    data: {}
                    options: {}
                },
                container_id:{}
            },
            timeId:{}
        }
        */
        // debugger;



        let compName = container.getCompName();

        let c_options = container.getCompOptions();
        let c_data = container.getCompData();


        let containerId = container.uid;

        //-----------------------

        let s_data = CompSessionStorage.getHisData_his();

        if (s_data == null) {
            s_data = {};
        }

        if (s_data[timeId] == null) {
            s_data[timeId] = {};
        }

        s_data[timeId][containerId] = {
            comp: compName,
            data: c_data,
            options: c_options,
        };

        s_data = JSON.stringify(s_data);

        sessionStorage.setItem('$$com_hisData(his)', s_data);
    }
    //----------------------------------------------------------
    static replaceHisData_his(data) {
        data = JSON.stringify(data);
        sessionStorage.setItem('$$com_hisData(his)', data);
    }
    //----------------------------------------------------------
    // histroyData
    // history 用
    //
    // 取得指定的資料
    static getHisData_his(timeId, container) {
        /*
         {
            timeId:{
                container_id:{
                    data: {}
                    options: {}
                },
                container_id:{}
            },
            timeId:{}
         }
         */

        let res = null;

        let data = sessionStorage.getItem('$$com_hisData(his)');

        if (data != null) {
            data = JSON.parse(data);
        } else {
            return res;
        }

        if (timeId == null && container == null) {
            res = data;
        } else {

            if (container == null) {
                try {
                    res = data[timeId];
                } catch (error) { }
            } else {

                let containerId = (typeof (container) == 'string' ? container : container.uid);
                try {
                    res = data[timeId][containerId];

                } catch (error) { }
            }

        }
        return res;
    }
    //----------------------------------------------------------
    // histroyData
    static hasHisData_his(timeId, container) {
        /*
         {
            timeId:{
                container_id:{
                    data: {}
                    options: {}
                },
                container_id:{}
            },
            timeId:{}
         }
         */
        // debugger;

        let data = sessionStorage.getItem('$$com_hisData(his)');


        try {
            if (data != null) {
                data = JSON.parse(data);
            } else {
                return false;
            }
            if (container == null) {

                if (data[timeId] != null) {
                    return true;
                }

            } else {
                let container_id = container;

                if (typeof (container_id) != 'string') {
                    container_id = container.uid;
                }

                if (data[timeId][container_id] != null) {
                    return true;
                }
            }
        } catch (error) {

        }

        return false;
    }
    //----------------------------------------------------------
    // histroyData
    // easyhis
    //
    // 使用者可多次設定
    // 資料設定成疊加性
    // fix
    static setHisData_easyHis(container, timeid, keepData) {

        /*
            {
                container:{
                    timeId:{
                        data:{},
                        options: {},
                        comp: ''
                    },
                    timeId:{}
                },
                container:{

                }
            }
        */
        debugger;

        keepData = !!keepData;

        let compName = container.getCompName();
        let c_options = container.getCompOptions();
        let c_data = null;

        if (keepData) {
            c_data = container.getCompData();
        }

        let containerId = container.uid;

        //------------------
        let data = sessionStorage.getItem('$$com_hisData(easyHis)');

        if (data == null) {
            data = {};
        } else {
            data = JSON.parse(data);
        }

        if (data[containerId] == null) {
            data[containerId] = {};
        }

        if (data[containerId][timeid] == null) {
            data[containerId][timeid] = {};
        }
        //------------------
        let compD = data[containerId][timeid];

        compD[compName] = {
            comp: compName,
            data: c_data,
            options: c_options,
        }

        data = JSON.stringify(data);

        sessionStorage.setItem('$$com_hisData(easyHis)', data);
    }

    // histroyData
    // easyhis
    static getHisData_easyHis(container, timeid, del) {
        /*
            {
                container:{
                    timeId:{
                        data:{},
                        options: {},
                        comp: ''
                    },
                    timeId:{}
                },
                container:{

                }
            }
        */
        let data = sessionStorage.getItem('$$com_hisData(easyHis)');
    }
    //----------------------------------------------------------
    // histroyData
    // no timeId
    static setHisData_noHis(container, compName, in_data) {
        /*
            {
                container:{
                    comp: data,
                    comp: data,
                },
                container:{}
            }
        */

        let data = sessionStorage.getItem('$$com_hisData(noHis)');

    }
    //----------------------------------------------------------
    // histroyData
    static getHisData_noHis(container, compName, del) {
        let data = sessionStorage.getItem('$$com_hisData(noHis)');
    }

    //==========================================================================
    
    static setBackData_his(activity, in_data, compName) {
        /*
            {
                time:{
                    container:{
                        data:
                        comp:
                    },
                    container:{}
                },
                time: {}
            }
        */
        compName = !!compName;

        const his = $module['CompHistory'].instance();
        let current_timeId = his.getCurrentTimeId();



    }


    static getBackData_his(timeId, container, del) {
        /*
            {
                time:{
                    container:{
                        data:
                        comp:
                    },
                    container:{}
                },
                time: {}
            }
        */

        del = !!del;
        let res = null;
        let data = sessionStorage.getItem('$$com_backData(his)');

        if (data == null) {
            return res;
        } else {
            data = JSON.parse(data);
        }

        let containerId = (typeof container == 'string') ? container : container.uid;

        try {
            res = data[timeId][containerId];

            if (del) {
                delete data[timeId][containerId];
            }

        } catch (error) {

        }

        return res;
    }

    // backData
    // fix
    static setBackData_easyHis(container, in_data) {

        /*
            {
                container: {
                    time: {
                        data: 
                        comp:
                    }
                },
                container: {},
            }
        */
        debugger;

        in_data = in_data || null;

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        let data = sessionStorage.getItem('$$compBundleData');

        if (data == null) {
            data = {};
        } else {
            data = JSON.parse(d);
        }

        if (data[containerId] == null) {
            data[containerId] = {};
        }

        if (data[containerId][timeId] == null) {
            data[containerId][timeId] = {};
        }
        //------------------
        let containerHisData = data[containerId][timeId];

        let setData = containerHisData.data;
        setData = (setData == null ? in_data : (Object.assign(setData, in_data)));

        let set_compName = (containerHisData.comp != null ? containerHisData.comp : compName);

        containerHisData = {
            comp: set_compName,
            data: setData
        };
        //------------------
        data = JSON.stringify(data);

        sessionStorage.setItem('$$componentBundleData', data);
    }
    //----------------------------------------------------------
    // backData
    // 處理 container.keepData 選項
    static getBackData_easyHis(container, timeId, del) {
        /*
            {
                container: {
                    time: time,
                    data: data,
                },
                container: {},
            }
        */
        debugger;

        let res = null;
        del = !!del;

        let tempData;

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        let data = sessionStorage.getItem('$$compBundleData');

        if (data == null) {
            return res;
        } else {
            data = JSON.parse(data);
        }

        if (data[containerId] == null) {
            return res;
        } else {
            tempData = data[containerId];
        }

        if (tempData != null) {
            res = tempData[timeId];
        } else {
            return res;
        }
        //--------------------

        if (del) {
            delete data[containerId];
            data = JSON.stringify(data);
            sessionStorage.setItem('$$compBundleData', data);
        }

        return res;
    }

    
    //----------------------------------------------------------
    // backData
    // no timeId
    static setBackData_noHis(container, compName, _data) {
        /*
            {
                container:{
                    comp: data,
                    comp:data
                },
                container:{}
            }
        */
        let containerId = (typeof (container) == 'string' ? container : container.uid);
        let compData;

        let data = sessionStorage.getItem('$$compBackData_1');

        if (data == null) {
            data = {};
        } else {
            data = JSON.parse(data);
        }

        if (data[containerId] == null) {
            data[containerId] = {};
        }

        data[containerId][compName] = _data;

        data = JSON.stringify(data);
        sessionStorage.setItem('$$compBackData_1', data);
    }

    // backData
    // no timeId
    static getBackData_noHis(container, compName, del) {
        /*
            {
                container:{
                    comp: data,
                    comp:data
                },
                container:{}
            }
        */

        del = !!del;

        let data = sessionStorage.getItem('$$compBackData_1');

        if (data == null) {
            return null;
        } else {
            data = JSON.parse(data);
        }

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        if (data[containerId] == null) {
            return null;
        }

        let res;

        if (data[containerId][compName] == null) {
            return null;
        } else {
            res = data[containerId][compName];

            if (del) {
                delete data[containerId][compName];

                data = JSON.stringify(data);
                sessionStorage.setItem('$$compBackData_1', data);
            }
        }

        return res;
    }

    //==========================================================================
    // history, easyhistory
    static setHisCache(timeId, container, item) {
        /*
            {
                container:{
                    timeId: item
                    timeId: item
                },
                container: {},
            }
        */

        let containerId = (typeof (container) == 'string' ? container : container.uid);


        if ($hisCache[containerId] == null) {
            $hisCache[containerId] = {};
        }

        $hisCache[containerId][timeId] = item;
    }
    //----------------------------------------------------------
    static getHisCache(container, timeId, del) {
        /*
            {
                container:{
                    timeId: item
                },
                container: {},
            }
        */
        debugger;

        del = !!del;

        let res = null;
        let containerId = (typeof (container) == 'string' ? container : container.uid);

        try {
            res = $hisCache[containerId][timeId];

            if (del) {

                delete $hisCache[containerId][timeId];

                if (Object.keys($hisCache[containerId]).length < 1) {
                    delete $hisCache[containerId];
                }
            }
        } catch (error) { }


        return res;
    }

    static replaceHisCache(data) {

        Object.assign($hisCache, data);

        for (let k in $hisCache) {
            if (!(k in data)) {
                delete $hisCache[k];
            }
        }
    }

    static getAllHisCache() {
        return $hisCache;
    }
    //==========================================================================

    // 處理同一頁面重 load
    // sessionStorage 不會被清除


    // 清除舊 history 資料
    static resetHisData() {
        let data = JSON.stringify({});

        sessionStorage.setItem('$$com_hisData(his)', data);
        sessionStorage.setItem('$$com_hisData(easyHis)', data);
        sessionStorage.setItem('$$com_hisData(noHis)', data);
    }

    static resetBackData() {
        let data = JSON.stringify({});
        sessionStorage.setItem('$$com_backData(his)', data);
        sessionStorage.setItem('$$com_backData(easyHis)', data);
    }

    static resetContainerComp() {
        let data = JSON.stringify({});
        sessionStorage.setItem('$$com_comp2Container', data);
    }
    //------------------------------------------------
    static initReset() {
        CompSessionStorage.resetHisData();
        CompSessionStorage.resetBackData();
        CompSessionStorage.resetContainerComp();
    }
}

CompSessionStorage.inject = function (name, m) {
    $module[name] = m;

}

export { CompSessionStorage };
export default CompSessionStorage;
