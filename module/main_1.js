// 把所有模組統整

import { CompStore } from './compStore_1.js';
import { Container } from './container_1.js'
import { CompSessionStorage } from './sessionStorageTool_2.js';
import { CompHistory } from './historyTool_3.js';
import { EasyHistory } from './easyHistory_1.js';

const $CompSession = CompSessionStorage;
const $CompHistory = CompHistory;
const $ComEasyHis = EasyHistory;
//--------------------------------------
// API 新增一個 compItem
const component = {};

export { component };
//--------------------------------------

(function () {
    component.mount = function (dom, compName, data, options) {
        debugger;

        // 取得 shadow
        if (!('$$$_domShadow' in dom)) {
            throw new Error('dom no set container');
        }

        let shadow = dom['$$$_domShadow'];
        shadow.mountComponent(compName, data, options);

    };
    //---------------------------------
    component.setData = function (dom, data) {
        debugger;

        // 取得 shadow
        if (!('$$$_domShadow' in dom)) {
            throw new Error('dom no set container');
        }

        let shadow = dom['$$$_domShadow'];

        shadow.setComponentData(data);
    };
    //---------------------------------
    component.unmount = function (dom) {
        debugger;

        // 取得 shadow
        if (!('$$$_domShadow' in dom)) {
            throw new Error('dom no set container');
        }

        let shadow = dom['$$$_domShadow'];

        shadow.unmountComponent();
    };
    //---------------------------------
    // test
    component.store = (function () {
        // debugger;
        return CompStore.instance();
    })();
    //---------------------------------
    // API 新增一個 compItem
    component.addComponent = function (compName, htmlContext) {
        debugger;
        CompStore.addComponent(compName, htmlContext);
    };
    //---------------------------------
    component.Container = Container;
})();


//==========================================================
(function () {
    // 網頁一開始的初始化

    // reset html.onload 遺留下無用的資料
    $CompSession.initReset();
    $CompHistory.initReset();
    $ComEasyHis.initReset();
})();
