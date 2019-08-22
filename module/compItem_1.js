const _ = window._;

////////////////////////////////////////////////////////////////////////////////
//
// 
//
//
////////////////////////////////////////////////////////////////////////////////
// for test

class CompItem {
    constructor(componentName, htmlContext) {   

        // 使用者设定的模版名称
        this.name;

        this.activity;

        // 最重要處
        // 使用者是定要顯示的模板
        this.htmlContext;
        //-----------------------
        this._init(componentName, htmlContext);
    }
    //-----------------------------------------------------
    _init(componentName, htmlContext) {
        this.name = componentName;
        this.htmlContext = htmlContext;
    }
    //-----------------------------------------------------
    getCompName(){
        return this.name;
    }
}

export { CompItem };
export default CompItem;