import { CompItem } from './compItem_1.js';
import { CompItemClone } from './compItemClone_1.js';
//==========================================================
const _ = window._;

let $CompStore;

// 收集 componentItem
class CompStore {

    static instance() {
        // 返回一個單例
        if ($CompStore == null) {
            $CompStore = new CompStore();
        }
        return $CompStore;
    }

    constructor() {
        // 最重要的地方
        this.compItemList = new Map();
    }
    //-----------------------------------------------------
    static addComponent(compName, htmlContent) {
        let o = CompStore.instance();
        o.addComponent(compName, htmlContent);
    }
    // API
    //
    // 新增 compItem
    addComponent(compName, htmlContent) {
        debugger;

        if (this.compItemList.has(compName)) {
            throw new Error(`comp(${compName}) has exists`);
        }

        let compItem = new CompItem(compName, htmlContent);
        this.compItemList.set(compName, compItem);
    }
    //-----------------------------------------------------
    static getComp(compName) {
        let o = CompStore.instance();
        return o.getComp(compName);
    }

    // API
    //
    // 取得 compItem
    getComp(compName) {
        if (compName == null) {
            let res = null;

            this.compItemList.forEach(function (comp, compName) {
                res = res || {};

                res[compName] = comp;

            }, this);

            return res;
        }

        let compItem = this.compItemList.get(compName);

        return compItem;
    }
    //-----------------------------------------------------
    static getCompClone(compName, options) {
        let o = CompStore.instance();
        return o.getCompClone(compName, options);
    }


    // API
    //
    // 取得 compItem 副本
    // keep: 是否要緩存
    getCompClone(compName, container, options) {
        debugger;

        if (!this.compItemList.has(compName)) {
            throw new Error(`no this component(${compName})`);
        }

        let compItem = this.compItemList.get(compName);

        let compItemClone = new CompItemClone(compItem, container, options);

        return compItemClone;
    }
    //-----------------------------------------------------
    static hasComp(compName) {
        let o = CompStore.instance();
        return o.hasComp(compName);
    }

    hasComp(compName) {
        return this.compItemList.has(compName);
    }
}

export { CompStore };
export default CompStore;
