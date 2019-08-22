// for test
import { CompSessionStorage } from './sessionStorageTool_2.js';
import { Activity as $Activity, activity_inject } from './activity_1.js';
import { CompHistory } from './historyTool_3.js';

//----------------------------
const $CompHis = CompHistory;
const $CompSession = CompSessionStorage;
const Activity = $Activity;

////////////////////////////////////////////////////////////////////////////////
//
// comp 副本
//
////////////////////////////////////////////////////////////////////////////////
const _ = window._;

class CompItemClone {

    constructor(comp, container, add_options) {
        // 他拷貝的對象
        this.comp;
        this.container;

        this.data = {};

        // 次選項
        this.add_options = {
            // 是否要用 iframe
            iframe: null,
            // 是否要在 his 留下 data 記錄
            keepdata: null,
            // 頁面快取
            cache: null,
        }

        this.rootDom;

        // 要被保存的頁面內容
        this.page_caches = [];

        // 這類別最重要的地方
        this.htmlContext;

        this._init(comp, container, add_options);
    }
    //-----------------------------------------------------
    _init(comp, container, add_options) {
        add_options = add_options || {};

        this.comp = comp;

        this.container = container;

        this.htmlContext = this.comp.htmlContext;

        this.rootDom = this.container.rootDom;

        for (let k in this.add_options) {
            if (k in add_options) {
                this.add_options = add_options[k];
            }
        }
    }
    //-----------------------------------------------------

    // API
    mount(data, backData) {
        debugger;

        this._mountCheck();

        Object.assign(this.data, data);

        this._render();
    }
    //-----------------------------------------------------
    _mountCheck() {
        // 登錄
        this.container.mounted_compItemClone = this;
    }
    //-----------------------------------------------------
    // API
    //
    // 當 comp 被快取
    // 重新掛上
    // 前後的 data 必須不變
    remount() {
        this.container.mounted_compItemClone = this;

        // 把快取的頁面重新掛上
        this.page_caches.forEach(function (dom) {
            this.rootDom.appendChild(dom);
        }, this);

        this.page_caches.length = 0;

    }
    //-----------------------------------------------------
    // API

    /*
        options: {
            keepdata:
        }

    */
    unmount(options_1) {
        options_1 = options_1 || {};

        debugger;

        const add_options = this.add_options;

        this._unmountCheck_1(options_1);

        // this._keepData(options_1);

        if (this._useCahe()) {
            // 需要 cache
            let childNodes = Array.from(this.rootDom.childNodes);

            childNodes.forEach(function (dom) {
                this.rootDom.removeChild(dom);
                this.page_caches.push(dom);
            }, this);

        } else {
            // 不需要 cache
            this.rootDom.innerHTML = '';

            //------------------
            // reset
            this.container = null;
            this.comp = null;
            this.rootDom = null;
            this.htmlContext = null;
        }
    }
    //-----------------------------------------------------
    _unmountCheck_1() {
        const container = this.container;
        const containerOptions = this.container.comp_options;
        this.container.mounted_compItemClone = null;
    }

    _useCahe() {
        debugger;

        const add_options = this.add_options;
        const containerOptions = this.container.comp_options;

        const isUseCache = this.container._useCache(add_options);

        if (!isUseCache) {
            return false;
        }

        const compName = this.comp.getCompName();

        const his = $CompHis.instance();

        if (containerOptions.history) {
            // history

            let timeId = his.getCurrentTimeId();

            if (timeId != null) {
                $CompSession.setHisCache(timeId, this.container, this);
            } else {
                throw new Error(`no timeId`);
            }

        } else if (containerOptions.easyhistory) {
            // easyhistory

            let timeId; // fix..................

            if (timeId != null) {
                $CompSession.setHisCache(timeId, this.container, this);
            } else {
                throw new Error(`no timeId`);
            }

        } else {
            this.container.cache_components[compName] = this;
        }


        return true;
    }

    // item.unmount 是否要保留資料
    // history.back() 將不保留
    // fix
    // 待商榷
    _keepData(options_1) {
        debugger;

        return;

        const container_options = this.container.comp_options;
        const add_options = this.add_options;

        let iskeepData = (add_options.keepdata === true);

        if (!iskeepData) {
            return;
        }
        let compName = this.comp.getCompName();

        if (container_options.easyhistory) {
            // easyhistory
            $CompSession.setHisData_easyHis(this.container, compName, this.data);
        } else if (container_options.history) {

        } else {

        }
    }

    //-----------------------------------------------------
    // test
    _render() {

        let _template = _.$template || _.template;

        let fn = _template(this.htmlContext);
        let htmlContext = fn(this.data);

        this.rootDom.innerHTML = htmlContext;
    }
    //-----------------------------------------------------
    // API
    waitAsync() {

    }

    // API
    setData(data) {
        Object.assign(this.data, data);

        this._render();
    }
    // API
    // 外部取得 comp 內的資料
    getData() {
        return Object.assign({}, this.data);
    }
    //-----------------------------------------------------
    setOptions(key, value) {

        const $options = this.add_options;

        if (value == null) {
            let options = key;
            Object.assign($options, options);
        } else {
            $options[key] = value;
        }
    }

    getOptions() {

        return Object.assign({}, this.add_options);

    }
    //-----------------------------------------------------
    // 確保 backData 送對人
    setPrevCompTimeId() {

    }


    getPrevCompTimeId() {

    }
    //-----------------------------------------------------
    getCompName() {
        return this.comp.name;
    }
    //-----------------------------------------------------
    isSameName(name) {
        let _name = this.getCompName();
        let reg = RegExp(_name);

        return reg.test(name);
    }
}

activity_inject('CompItemClone', CompItemClone);
export { CompItemClone };
export default CompItemClone;
