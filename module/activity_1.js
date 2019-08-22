import { CompSessionStorage } from './sessionStorageTool_2.js';
import { CompHistory } from './historyTool_3.js';
import { EasyHistory } from './easyHistory_1.js';

const $CompSession = CompSessionStorage;
const $ComHis = CompHistory;
const $EasyHis = EasyHistory;
//---------------------------------

const M = {};

// 解  a 引用 b，b 引用 a 的問題
function activity_inject(key, value) {
    M[key] = value;
};
export { activity_inject };
//---------------------------------

const _ = window._;

// 類似 android Activity
class Activity {
    constructor(parent) {

        this.$parent;
        this.$data;
        this.$rootDom;

        this.$options = {
            react: false,
        };
    }

    _$init(parent) {
        const CompItemClone = M['CompItemClone'];

        if (!(parent instanceof CompItemClone)) {
            throw new TypeError('Activity parent must instanceof CompItemClone');
        }

        this.$parent = parent;
        this.$rootDom = this.$parent.rootDom;

        this.$data = this.parent.data;
    }
    //------------------------------------------------
    // 若要從內部設置讀取 data
    // 或引入 module
    // 若返回 data 就直接 render
    // 若返回 promise 就呼叫 this.waitData
    // 等 promise.resolve() 再 render
    onInit(d, bundle) {
        if (bundle != null) {
            // 不是第一次建立
            // 有資料回傳
        }

        // d: {data: {}, options: {}}

        return (d || promise);
    }
    //------------------------------------------------
    oncreate() {

    }
    //------------------------------------------------
    // 內部命令
    // back 用
    //
    // 功能如跨頁回傳資料
    // important
    setBackData_his(key, value, compName) {
        debugger;

        compName = compName || null;

        let setData;

        if (typeof (key) == 'string') {
            setData = {
                key: value
            };
        } else {
            setData = key;
        }

        const container = this.$parent.container;
        const c_options = container.comp_options;
        const current_compName = this.$parent.getCompName();

        if (current_compName == compName) {
            throw new Error(`cant set self backBata`);
        }

        //------------------

        let timeId;

        if (c_options.history) {
            // history
            debugger;

            const his = $ComHis.instance();

            // 從歷史找出修改點
            let timeId = his.getCurrentTimeId();

            if (timeId == null) {
                throw new Error(`no history data`);
            }

            // 修改此歷史點的資料
            $CompSession.setBackData_his(container, timeId, setData);
        } else if(c_options.easyhistory){
            // easyhistory
            debugger;

            // 從歷史找出修改點
            let tempData = $EasyHis.getHistory(container, compName);

            if (tempData == null) {
                throw new Error(`no history data`);
            }

            compName = tempData.comp;
            timeId = tempData.id;

            // 修改此歷史點的資料
            $CompSession.setBackData_his(container, timeId, setData);
        }else {
            debugger;

            if(compName == null){
                throw new Error(`setBackData_his need compName`);
            }

            $CompSession.$setBackData(container, compName, data);
        }
    }
    //------------------------------------------------
    //
    waitAsync() {
        this.$parent.waitAsync();
    }

    // 更新視圖
    upDateData() {
        this.$parent.setComponentData(this.$data);
    }

    // 內部命令
    setOptions(key, value) {

    }

    // 內部命令
    getOptions() {

    }

    //
    goBack(compName) {
        this.$parent.goBack(compName);
    }
    //------------------------------------------------
    // 若要在下次重建
    // 回復上次結束前的資料
    // 或回復上次設定
    onSaveInstanceState(d) {
        // 為了 back 而設

        // 若 comp.options.back

        // d: {data: {}, options: {}}
        // return d;
    }
}


export { Activity };
export default Activity;
