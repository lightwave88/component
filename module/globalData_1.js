// 管理全域資料

const GlobalData = {};

(function(G){
    G.containerMap = {};

    //================================================
    G.setContainerMap = function(k, v){
        G.containerMap[k] = v;
    };

    G.getContainerMap = function(k){

        if(k == null){
            return G.containerMap;
        }else{
            return (G.containerMap[k] || null);            
        }
    };

})(GlobalData);

export { GlobalData };
export default GlobalData;

