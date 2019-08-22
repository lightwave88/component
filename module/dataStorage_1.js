
// 抽象類
// 可以根據需要，切換 data 記錄模組
class DataStorage {

    constructor() {

    }
    //==========================================================================
    // 清理垃圾
    clearHisOldData(timeA, timeB) {
        // 必須清理多種資料

        // hisData

        // containerComp

        // cache

        // historyList

    }
    //==========================================================================
    // (time)container: comp
    // 記錄 container 在 his 下裝載的 comp

    setContainerComp_his(timeId, container) {
        /*
            {
                time:{
                    container: compName,
                    container: compName,
                },
                time:{}
            }
        */

    }

    getContainerComp_his(timeId, container) {

    }

    getAllContainerComp_his(){

    }

    updateAllContainerComp_his(){

    }
    //==========================================================================
    // (time)container: comp
    setContainerComp_easyHis(timeId, container) {
        /*
            {
                container:{
                    timeId: comp
                },
                container: {}
            }
        */

    }

    getContainerComp_easyHis(timeId, container, del) {

    }

    getAllContainerComp_easyHis(){

    }

    updateAllContainerComp_easyHis(){

    }
    //==========================================================================
    // historyList
    setPrevHistoryLink(timeId, prev_timeId) {
        /*
            id:{
                prev:
                next:
            },
            id:{}
        */
    }

    setNextHistoryLink(timeId, next_timeId) {

    }

    getNextHistoryLinkData(timeId) {

    }

    getAllNextHistoryLinkData() {

    }

    updateAllNextHistoryLinkData(data) {

    }
    //==========================================================================
    // container.history.data

    setHisData_his(timeId, container) {
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
    }

    getHisData_his(timeId, container) {
    }

    getAllHisData_his() {

    }

    updateAllHisData_his(data) {

    }
    //==========================================================================
    // container.easyHistory.data
    setHisData_easyHis(container, timeid, keepData) {
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
    }

    getHisData_easyHis(container, timeid, del) {

    }
    //==========================================================================
    // container.comp.data
    setHisData_noHis(container, compName, in_data) {
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
    }

    getHisData_noHis(container, compName, del) {

    }

    //==========================================================================
    // container.backData
    setBackData_his(activity, in_data, compName) {
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
    }

    getBackData_his(timeId, container, del) {
    }
    //==========================================================================
    // container.backData
    setBackData_easyHis(container, in_data) {
        /*
            {
                container: {
                    time: time,
                    data: data,
                },
                container: {},
            }
        */
    }

    getBackData_easyHis(container, timeId, del) {
    }
    //==========================================================================
    // container.backData
    setBackData_noHis(container, compName, _data) {
        /*
            {
                container:{
                    comp: data,
                    comp:data
                },
                container:{}
            }
        */
    }

    getBackData_noHis(container, compName, del) {
    }
    //==========================================================================
}


DataStorage.cache_his = {};
DataStorage.cache_easyHis = {};
