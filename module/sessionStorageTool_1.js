const _ = window._;

import { CompHistory } from './historyTool_2.js';

const $CompHis = CompHistory;

/*
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

    
    //==========================================================================
    // histroyData
    // history 用
    //
    // 設定 container.data
    // data, options 設定成覆蓋性
    static setHisData_his(timeId, container, compName, data, options) {
        debugger;

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
        data = data || null;
        options = options || null;


        let containerId = (typeof (container) == 'object' ? container.uid : container);

        let s_data = CompSessionStorage.getHisData_his();

        if (s_data == null) {
            s_data = {};
        }

        if (s_data[timeId] == null) {
            s_data[timeId] = {};
        }
        //-----------------------
        let setData;
        let setOptions;


        if (options == null) {
            setOptions = s_data[timeId]['options'];
        } else {
            setOptions = options;
        }

        if (data == null) {
            setData = s_data[timeId]['data'];
        } else {
            setData = data;
        }

        s_data[timeId][containerId] = {
            comp: compName,
            data: setData,
            options: setOptions,
        };

        sessionStorage.setItem('$$com_hisData(his)', JSON.stringify(s_data));
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

        let s_data = null;

        let d = sessionStorage.getItem('$$com_hisData(his)');

        if (d != null) {
            s_data = JSON.parse(d);
        }

        if (timeId == null && container == null) {
            return s_data;
        }

        s_data = (s_data[timeId] == null ? null : s_data[timeId]);


        if (container == null) {

        } else {

            if (s_data != null) {
                let containerId = (typeof (container) == 'string' ? container : container.uid);
                s_data = (s_data[containerId] == null ? null : s_data[containerId]);
            }
        }

        return s_data;
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
        debugger;

        let data = sessionStorage.getItem('$$com_hisData(his)');

        try {

            if (data != null) {
                data = JSON.parse(d);
            }

            if (timeId == null && container == null) {
                return (data != null);
            } else if (container == null) {

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
    static setHisData_easyHis(container, timeid, compName, data, options) {

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

        data = data || null;
        options = options || null;

        let data = sessionStorage.getItem('$$com_hisData(easyHis)');
        let containerId = (typeof (container) == 'string' ? container : container.uid);

        //------------------
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

        let setData = compD[compName]['data'];
        let setOptions = compD[compName]['options'];
        let hisCompName = compD[compName]['comp'];

        if (hisCompName != null && hisCompName != compName) {
            throw new Error(`his compName(${hisCompName}) != (${compName})`);
        }

        setData = (setData == null ? data : (Object.assign(setData, data)));
        setOptions = (setOptions == null ? options : (Object.assign(setOptions, options)));

        compD[compName] = {
            comp: compName,
            data: setData,
            options: setOptions,
        }

        data = JSON.stringify(data);

        sessionStorage.setItem('$$com_hisData(easyHis)', data);
    }
    //----------------------------------------------------------
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
    static setHisData_noHis(container, compName, data) {
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
        compName = !!compName;

        const his = $CompHis.instance();

        let current_timeId = his.getCurrentTimeId();


        let prev_compName;
        if (current_timeId != null) {

            let hisData = CompSessionStorage.getHisData_his();

            let histList = Object.keys(hisData).map(function (v) {
                return (parseInt(v, 10));
            });

            histList.sort(function (a, b) {
                return (a - b);
            });

            let prev_his;

            for (let i = 0; i < histList.length; i++) {

                if (histList[i] >= current_timeId) {
                    break;
                } else {
                    prev_his = histList[i];
                }
            }

            if(prev_his == null || prev_his[containerId] == null){
                throw new Error('no prev page');
            }

            prev_compName = prev_his[containerId][comp];
        }


        if (compName && compName != prev_compName) {
            //  將不依尋 historyList


        } else {
            //  將依尋 historyList


        }
    }


    static getBackData_his() {
        let current_timeId = his.getCurrentTimeId();
    }

    // backData    
    static setBackData_easyHis(container, in_data) {

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
    //----------------------------------------------------------
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
                },
                container: {},
            }
        */

        let containerId = (typeof (container) == 'string' ? container : container.uid);
        let compName;


        if ($hisCache[containerId] == null) {
            $hisCache[containerId] = {};
        }

        $hisCache[containerId][timeId] = item;
    }
    //----------------------------------------------------------
    static getHisCache(timeId, container, compName, del) {
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

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        if ($hisCache[containerId] == null) {
            return null;
        }


        if ($hisCache[containerId][timeId] == null) {
            return nulll;
        }


        let res = $hisCache[containerId][timeId];

        if (del) {
            delete $hisCache[containerId][timeId];

            if (Object.keys($hisCache[containerId]).length < 1) {
                delete $hisCache[containerId];
            }
        }

        return res;
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
    }

    static resetCache() {
    }
    //------------------------------------------------
    static initReset() {
        CompSessionStorage.resetContainerData();
        CompSessionStorage.resetHistoryData();
        // CompSessionStorage.resetEasyhistoryData();
        CompSessionStorage.resetTempData();
    }
}

export { CompSessionStorage };
export default CompSessionStorage;
