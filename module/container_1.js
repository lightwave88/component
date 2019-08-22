
import { DomShadowClass } from './domShadow_1.js';
const ContainerDomShadow = DomShadowClass.ContainerDomShadow;

const _ = window._;
////////////////////////////////////////////////////////////////////////////////
//
// 若要採用 web Components 模式 class 必須繼承這
// 只是初始化一個 container
//
// 內容建構由 掛上的 component 決定
//
////////////////////////////////////////////////////////////////////////////////
// 藍本
class Container extends HTMLElement {

    constructor() {
        super();
        debugger;

        this.shadow;;

        // important
        this.fn = this.constructor;

        this.attachShadow({ mode: 'open' });

        this._check_1();

        this._init();
    }
    //-----------------------------------------------------
    _check_1() {
        debugger;
        // 防止 component 套嵌
        // 增加無味麻煩

        if (window.parent !== window) {
            // 採用 iframe
            throw new Error('iframe cant use component');
        } else {
            // 採用 component
            parent = this;

            while (parent) {
                debugger;
                if (/^#document-fragment/.test(parent.nodeName)) {
                    throw new Error('component cant use component');
                }
                parent = parent.parentNode;
            }

        }
    }
    //-----------------------------------------------------

    _init() {
        debugger;

        // 在 container 裡面埋下 ContainerDataNode
        this.shadow = new ContainerDomShadow(this);

        // 取得要監視的 attr_key list
        let attrKeyList = this.fn.observedAttributes;
        this.shadow.setAttrDataKeyList(attrKeyList);
    }
    //-----------------------------------------------------
    // container 的建構
    connectedCallback() {
        // 可以決定先掛上哪個 component
    }
    //-----------------------------------------------------
    // 當 container 被移除
    disconnectedCallback() {
        // 應該很少用到
    }
    //-----------------------------------------------------
    adoptedCallback() {
        // 應該很少用到
    }
    //-----------------------------------------------------
    // 監視 attr 的變動
    attributeChangedCallback() {
        // 紀錄有那些 key 變動
        // this.shadow.updateComponentData(data, options, true);
    }
    //-----------------------------------------------------
    // 返回要監視的 attr
    // 需 override
    static get observedAttributes() {
        debugger;
        return [];
    }
}

export { Container };
export default Container;
