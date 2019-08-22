
const _ = window._;

import { CompStore } from './compStore_1.js';
import { CompHistory } from './historyTool_3.js';
import { CompSessionStorage } from './sessionStorageTool_2.js';
import { EasyHistory } from './easyHistory_1.js';
import { GlobalData } from './globalData_1.js';

const $CompHistory = CompHistory;
const $CompSession = CompSessionStorage;
const $EasyHis = EasyHistory;
const $GlobalData = GlobalData;

//==============================================================================


let UID = 0;

const DomShadowClass = {};

export { DomShadowClass };
export default DomShadowClass;

// 藏在 dom 後面的影子
class DomShadow {
    constructor(dom) {
        this.uid = UID++;
        this.dom = dom;

        this._init(dom);
    }
    //-----------------------------------------------------
    _init() {
        this.uid = 'domShadow_' + this.uid;

        if ('$$$_domShadow' in this.dom) {
            return;
        }

        let $this = this;

        Object.defineProperty(this.dom, '$$$_domShadow', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: ($this)
        });
    }
    //-----------------------------------------------------
    emit(eventName, data) {

    }
}
DomShadowClass["DomShadow"] = DomShadow;
//==============================================================================

class ContainerDomShadow extends DomShadow {
    constructor(dom) {
        super(dom);
        debugger;

        this.containerDom = dom;

        this.rootDom;

        // component 相關
        // switch component 要保留的 component
        this.cache_components = {};

        // 現在掛上的
        this.mounted_compItemClone = null;

        this.comp_options = {
            iframe: null,
            // switch是否要用 history
            history: null,
            // 採用簡單的 history
            easyhistory: null,
            cache: null,
            keepdata: null,
        };

        // web components
        this.attrDataKeyList = [];
        //-----------------------

        // 是否有設置監聽 attr 的變動
        // this.flag_disableAttrChangeEvent = false;

        this._init_1();

        this._initCheck_1();
    }
    //-----------------------------------------------------
    _init_1() {
        debugger;

        // 登錄
        $GlobalData.setContainerMap(this.uid, this);

        const comp_options = this.comp_options;

        // 是否採用 component
        if (this.dom.shadowRoot) {
            this.rootDom = this.dom.shadowRoot;
        } else {
            // this.rootDom = this.dom;
            throw new Error('must use component');
        }

        // component 是否採用歷史紀錄
        if (this.dom.hasAttribute('history')) {
            comp_options.history = true;
            this.dom.removeAttribute('history');
        } else {
            comp_options.history = false;
        }

        // 是否要緩存 compUnit
        if (this.dom.hasAttribute('cache')) {
            comp_options.cache = true;
            this.dom.removeAttribute('cache');
        } else {
            comp_options.cache = false;
        }

        // use iframe
        if (this.dom.hasAttribute('iframe')) {
            comp_options.iframe = true;
            this.dom.removeAttribute('iframe');
        } else {
            comp_options.iframe = false;
        }

        // 是否使用 easyHis
        if (this.dom.hasAttribute('easyhistory')) {
            comp_options.easyhistory = true;
            // this.historyList = [];
            this.dom.removeAttribute('easyhistory');
        } else {
            comp_options.easyhistory = false;
        }

        if (this.dom.hasAttribute('keepdata')) {
            comp_options.keepdata = true;
            // this.historyList = [];
            this.dom.removeAttribute('keepdata');
        } else {
            comp_options.keepdata = false;
        }

    }
    //-----------------------------------------------------
    _initCheck_1() {
        const comp_options = this.comp_options;

        if (comp_options.easyhistory && comp_options.history) {
            throw new Error('cant use history and easyHistory at the same time');
        }

        if (comp_options.history) {
            comp_options.keepdata = true;
        }

        if (comp_options.easyhistory) {
            comp_options.keepdata = true;
        }
    }
    //-----------------------------------------------------
    // main API
    //
    // 掛上 component
    // 較麻煩
    /*
        options:{
            iframe: 是否要用 iframe,
            keepdata: 是否要在 his 留下 data 記錄
        }

    */
    mountComponent(compName, data, options) {
        debugger;

        options = options || {};

        const comp_options = this.comp_options;

        // 事前檢查

        let old_compItemClone = this.mounted_compItemClone;
        let old_compName;

        if (old_compItemClone != null) {
            old_compName = old_compItemClone.getCompName();

            if (old_compItemClone.isSameName(compName)) {
                // 檢查 compName 是否早已掛上
                throw new Error(`comp(${old_compName} has mounted before)`);
            }
        }

        if (!CompStore.hasComp(compName)) {
            throw new Error(`no this comp(${compName}) exists`);
        }
        //----------------------------

        // 不同策略
        if (comp_options.history) {
            // history

            this._mount_history(compName, data, options);
            return;
        }

        if (comp_options.easyhistory) {
            this._mount_easyhistory(compName, data, options);
            return;
        }

        this._mount(compName, data, options);
    }
    //---------------------------------

    _mount_history(compName, data, options) {
        debugger;

        const comp_options = this.comp_options;

        let old_compItem = this.mounted_compItemClone;
        // this.mounted_compItemClone = null;

        const his = $CompHistory.instance();

        // 記錄 container 現況
        // data, options
        let handle = his.setHistoryData(this, null);

        if (old_compItem) {

            // 關於舊的 comp
            old_compItem.unmount();
        }
        //----------------------------
        // 取出要掛上的 comp
        let compItem;

        if (compName == null) {
            // 沒指定要掛社麽
        } else if (this._useCache(options)) {
            // 若要採用快取

            compItem; // 從 his_data 中取出

            if (compItem != null) {
                compItem.remount();
            } else {
                compItem = CompStore.getCompClone(compName, this, options);

                // dom.render()
                compIteme.mount(data);
            }
        } else {
            // 不用快取

            compItem = CompStore.getCompClone(compName, this, options);

            // dom.render()
            compItem.mount(data, null);
        }
        //----------------------------
        his.putNullState();

        debugger;

        his.setHistoryData(this, handle);

        debugger;
    }
    //---------------------------------
    _mount_easyhistory(compName, data, options) {


        // 在 history 模式下，預設使用 keepdata
        const keepData = !!options.keepdata;

        // historyList 的操作

        _mount(compName, data, options);

    }
    //---------------------------------
    // 最基本
    _mount(compName, data, options) {

        // 在不用 history 狀態下，預設是不用 keepdata
        const keepData = this._useKeepData(options);

        const comp_options = this.comp_options;

        let old_compItem = this.mounted_compItemClone;
        // this.mounted_compItemClone = null;

        if (old_compItem) {
            // 關於舊的 comp

            old_compItem.unmount();
        }
        //----------------------------
        // 取出要掛上的 comp
        let compItem;

        if (compName == null) {
            // 沒指定要掛社麽
        } else if (this._useCache(options)) {
            // 若要採用快取

            compItem = this.cache_components[compName];
            delete this.cache_components[compName];

            if (compItem != null) {
                // 快取存在
                compItem.remount();
            } else {
                // 快取不存在
                compItem = main.call(this, compName, data, null, options);
            }
        } else {
            let backdata = $CompSession.getBackData_noHis(this, compName, true);


            if (keepData) {
                data = $CompSession.getHisData_noHis(this, compName, true);
            }

            // 不用快取
            compItem = main.call(this, compName, data, backdata, options);
        }
        //==================
        function main(compName, data, backdata, options) {

            compItem = CompStore.getCompClone(compName, this, options);

            // dom.render()
            compIteme.mount(data, backData);

            return compIteme;
        }
    }
    //-----------------------------------------------------
    // 不用 his 記錄
    // 由 hisotry 監聽事件呼叫

    // noNext: history 的模式
    mountComponent_callByHis(compName, historyID, noNext) {
        // history.back()

        debugger;

        const comp_options = this.comp_options;

        let temp;

        //---------------------------------
        // old_comp

        let old_compItem = this.mounted_compItemClone;
        let old_compName;

        if (old_compItem != null) {
            old_compName = old_compItem.getCompName();

            if (old_compItem.isSameName(compName)) {
                // 檢查 compName 是否早已掛上
                throw new Error(`comp(${old_compName} has mounted before)`);
            }
        }

        if(!noNext){
            // 記錄 container 狀態
            his.setHistoryData(this, null);
        }

        if (old_compItem) {

            // 關於舊的 comp
            //
            old_compItem.unmount();
        }
        //---------------------------------
        // new_comp

        if (compName == null) {
            return;
        }

        if (!CompStore.hasComp(compName)) {
            throw new Error(`no this comp(${compName}) exists`);
        }
        //------------------
        // history.data

        // 取得 compUnit.data
        temp = $CompSession.getHisData_his(historyID, this);

        let his_data;
        let his_options = temp.options;

        // keepData
        if (!this._useKeepData(his_options)) {
            his_data = null;
        } else {
            his_data = temp.data;
        }
        //------------------
        // 取出要掛上的 comp
        let compItem;

        if (comp_options.cache || his_options.cache) {
            // 若要採用快取
            // 且快取存在

            // 取得 cache compItem
            compItem = $CompSession.getHisCache(this, historyID, true);

            if (compItem == null) {
                throw new Error(`hisData no comp(${compName}) cache data`);
            } else {
                compItem.remount();
            }
        } else {

            // 是否有 user 回傳的資料
            // 取得 backData

            let backData = null;

            temp = $CompSession.getBackData_his(this, historyID, true);

            if (temp != null) {
                backData = temp.data;
                if (temp.comp != compName) {
                    throw new Error(`hisData comp(${temp.comp}) name not the same(${compName})`);
                }
            }
            //------------------
            debugger;
            compItem = CompStore.getCompClone(compName, this, his_options);

            debugger;
            // dom.render()
            compItem.mount(his_data, backData);
        }

    }
    //-----------------------------------------------------
    // API
    // 使用者命令，回上頁
    goBack() {
        const comp_options = this.comp_options

        if (comp_options.history) {
            if (compName != null) {
                throw new Error('if use history mode cant assign back page');
            }

            history.back();
            return;
        }
        //============================
        if (!comp_options.easyhistory) {
            throw new Error('you must use history, easyhistory mode');
        }

        // easyhistory 模式
        let timeId;

        // 從歷史資料中取得需要的資訊
        // 再用這資訊取得要的資料

        // 清除歷史記錄，並取得 compName
        let tempData = $EasyHis.back(this);

        compName = tempData.comp;
        timeId = tempData.id;

        //------------------

        let old_compItem = this.mounted_compItemClone;
        // this.mounted_compItemClone = null;

        if (old_compItem) {
            // 關於舊的 comp

            old_compItem.unmount();
        }

        //----------------------------
        // 取出要掛上的 comp
        let compItem;

        const hisData = $CompSession.getHisData_easyHis(this, timeId, true);
        let his_options = hisData.options;
        let his_data = hisData.data;

        if (comp_options.cache || his_options.cache) {
            // 若要採用快取
            // 且快取存在

            // 從 his_data 中取出
            compItem = $CompSession.getHisCache(this, historyID, true);

            if (compItem == null) {
                throw new Error(`hisData no comp(${compName}) cache data`);
            } else {
                compItem.remount();
            }

        } else {
            // 不用快取

            //-----------------------
            // 取得相關資料

            // 是否有回傳資料
            let backData = $CompSession.getBackData_his(this, timeId, true);

            // 取回歷史資料
            //-----------------------
            compItem = CompStore.getCompClone(compName, this, his_options);

            // dom.render()
            compIteme.mount(his_data, backData);
        }
    }
    //-----------------------------------------------------
    // main API
    waitData() {
        // 呼叫 ui 啟動 waiting 動作
    }
    //-----------------------------------------------------
    // main API
    //
    setComponentData(data) {
        const comp_options = this.comp_options;

        const his = $CompHistory.instance();

        let compItemClone = this.mounted_compItemClone;

        if (compItemClone == null) {
            throw new Error('no comp exists');
        }

        this._updateAttrData();

        // dom.render()
        compItemClone.setData(data);

        //------------------
        if (comp_options.history) {
            // history

        } else if (comp_options.easyhistory) {
            // easyhistory

        } else {

        }
    }
    //-----------------------------------------------------
    // API
    //
    // 移除已掛上的 compItem
    unmountComponent(options) {

        if (mounted_compItemClone == null) {
            throw new Error('container is empty');
        }
        //----------------------------

        // 不同策略
        if (comp_options.history) {
            // history

            this._mount_history(null, null, options);
            return;
        }

        if (comp_options.easyhistory) {
            this._mount_easyhistory(null, null, options);
            return;
        }

        this._mount(null, null, options);
    }

    //-----------------------------------------------------
    // 設置有哪些 attr 會被監聽
    setAttrDataKeyList(list) {
        this.attrDataKeyList = list.slice();
    }
    //-----------------------------------------------------
    // API
    //
    // 取得所掛的 compItem.name
    getCompName() {
        let name = null;

        let compItemClone = this.mounted_compItemClone;
        if (compItemClone != null) {
            name = compItemClone.getCompName();
        }
        return name;
    }
    //-----------------------------------------------------
    // API
    //
    // 取得 comp 內的 data
    getCompData() {
        let d = null;
        if (this.mounted_compItemClone != null) {
            d = this.mounted_compItemClone.getData();
        }
        return d;
    }
    //-----------------------------------------------------
    getCompOptions() {
        let d = null;
        if (this.mounted_compItemClone != null) {
            d = this.mounted_compItemClone.getOptions();
        }
        return d;
    }
    //-----------------------------------------------------

    // API
    //
    // 為 container 提供方法
    // 更新 container.attrData comp.data
    _updateAttrData(data) {
        for (let k in data) {
            if (this.attrDataKeyList.includes(k)) {

                // 會激發 web components 監聽
                this.dom.setAttribute(k, data[k]);
            }
        }
    }
    //-----------------------------------------------------
    _useCache(add_options) {
        const o = {};

        for (let k in this.comp_options) {
            if (add_options[k] != null) {
                o[k] = add_options[k];
                continue;
            }
            o[k] = this.comp_options[k];
        }


        let res = o.cache;
        return (res == null ? false : res);

    }

    _useIframe(add_options) {
        const o = {};

        for (let k in this.comp_options) {
            if (add_options[k] != null) {
                o[k] = add_options[k];
                continue;
            }
            o[k] = this.comp_options[k];
        }

        let res = o.iframe;
        return (res == null ? false : res);

    }

    _useKeepData(add_options) {
        const o = {};

        for (let k in this.comp_options) {
            if (add_options[k] != null) {
                o[k] = add_options[k];
                continue;
            }
            o[k] = this.comp_options[k];
        }

        if (o.cache == true) {
            return false;
        }

        let res = o.keepdata;
        return (res == null ? false : res);
    }
    //-----------------------------------------------------
}

DomShadowClass["ContainerDomShadow"] = ContainerDomShadow;
