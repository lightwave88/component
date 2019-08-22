const _ = window._;


class EasyHistory {

    static next(container, compName) {

        /*
            {
                conatiner: [
                    {
                        comp: compName,
                        id: timeId
                    },
                    {}
                ],
                container:[],
            }

        */
        debugger;

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        let d = sessionStorage.getItem('$$compHistoryList');
        if (d == null) {
            d = {};
        } else {
            d = JSON.parse(d);
        }
        //------------------
        d[containerId] = d[containerId] || [];

        let containerHisList = d[containerId];

        let timeId = (new Date()).getTime();

        let setData = {
            comp: compName,
            id: timeId,
        };

        containerHisList.push(setData);

        d = JSON.stringify(d);
        sessionStorage.setItem('$$compHistoryList', d);

        return setData;
    }
    
    //-----------------------------------------------------
    // 需返回被移除的 timeId, compName
    static back(container) {
        /*
            {
                conatiner: [
                    {
                        comp: compName,
                        id: timeId
                    },
                    {}
                ],
                container:[],
            }

        */
        let data = sessionStorage.getItem('$$compHistoryList');
        if (data == null) {
            throw new Error(`no historyList data`);
        }
        data = JSON.parse(d);

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        let list = data[containerId];

        if (list == null) {
            throw new Error(`no historyList data`);
        }

        if (list.length < 1) {
            throw new Error(`historyList no comp`);
        }

        let res = list.pop();

        data = JSON.stringify(data);
        data = sessionStorage.getItem('$$compHistoryList');

        return res;
    }
    //-----------------------------------------------------
    static replace(container, compName) {
        /*
            {
                conatiner: [
                    {
                        comp: compName,
                        id: timeId
                    },
                    {}
                ],
                container:[],
            }

        */
        debugger;
    }

    //-----------------------------------------------------
    //
    static getHistory(conatiner, compName) {
        /*
            {
                conatiner: [
                    {
                        comp: compName,
                        id: timeId
                    },
                    {}
                ],
                container:[],
            }

        */
        debugger;
        compName = compName || null;

        let containerId = (typeof (container) == 'object' ? container.uid : container);

        let data = sessionStorage.getItem('$$compHistoryList');
        if (data == null) {
            data = {};
        } else {
            data = JSON.parse(data);
        }

        if (data[containerId] == null) {
            return null;
        }

        let hisList = data[containerId];


        if (compName == null) {
            return (hisList[hisList.length - 1] || null);
        } else {

            for (let i = hisList.length; i > 0; i--) {
                let j = i - 1;
                let o = hisList[j];
                if (o.comp == compName) {
                    return (Object.assign({}, o));
                }
            }
        }
        return null;
    }
    //-----------------------------------------------------
    static getCurrentTimeId(conatiner) {
        return EasyHistory.getHistory(conatiner, null);
    }
    //-----------------------------------------------------
    // 需返回被移除的 timeId
    static delHistory(container, compName) {

        /*
            {
                conatiner: [
                    {
                        comp: compName,
                        id: timeId
                    },
                    {}
                ],
                container:[],
            }

        */
        debugger;

        let data = sessionStorage.getItem('$$compHistoryList');
        if (data == null) {
            throw new Error(`no historyList data`);
        }
        data = JSON.parse(d);

        let containerId = (typeof (container) == 'string' ? container : container.uid);

        let hisList = data[containerId];

        if (hisList == null) {
            throw new Error(`no historyList data`);
        }

        let index;
        for (let i = hisList.length; i > 0; i--) {

            let j = i - 1;
            let h_data = hisList[j];
            if (h_data.comp == compName) {
                index = j;
                break;
            }
        }

        if (index == null) {
            throw new Error(`comp(${compName}) no exists in historyList`);
        }

        let res = hisList.split(index, 1);

        data = JSON.stringify(data);
        sessionStorage.setItem('$$compHistoryList', data);

        return res[0];
    }
    //-----------------------------------------------------
    static hasHistory(container, compName) {
        /*
            {
                conatiner: [
                    {
                        comp: compName,
                        id: timeId
                    },
                    {}
                ],
                container:[],
            }

        */
        let res = EasyHistory.getHistory();

        res = (res == null) ? false : true;

        return res;
    }
    //-----------------------------------------------------
    static initReset() {
        sessionStorage.setItem('$$compHistoryList', JSON.stringify({}));
    }
}

export { EasyHistory };
export default EasyHistory;