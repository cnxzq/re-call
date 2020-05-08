System.register([], function (exports_1, context_1) {
    "use strict";
    var errors, mylog;
    var __moduleName = context_1 && context_1.id;
    function calls(fn, option) {
        if (!fn) {
            throw "必须传入 fn";
        }
        var opt = {
            checkerr: (option && option.checkerr) || null,
            interval: (option && option.interval) || 3000,
            count: (option && option.count) || 3,
            log: (option && option.log) || null
        };
        console.log("\u914D\u7F6E\uFF1A" + JSON.stringify(opt, null, 4));
        var log = opt.log;
        var index = 0;
        var time;
        var timecha;
        function runerr() {
            index++;
            if (index >= opt.count) {
                log({
                    code: 1,
                    message: errors[1]
                }, index);
                return Promise.reject();
            }
            timecha = Date.now() - time;
            if (timecha < opt.interval) {
                console.log("\u54CD\u5E94\u65F6\u95F4\uFF1A" + timecha + " ms,\u5C11\u4E8E\u914D\u7F6E\u7684\uFF1A" + opt.interval + " ms,\u5C06\u5728" + (opt.interval - timecha) + "\u540E\u8FDB\u884C\u4E0B\u4E00\u6B21\u8C03\u7528");
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve(run());
                    }, opt.interval - timecha);
                });
            }
            console.log("\u54CD\u5E94\u65F6\u95F4\uFF1A" + timecha + " ms,\u8D85\u8FC7\u914D\u7F6E\u7684\uFF1A" + opt.interval + ",\u5C06\u76F4\u63A5\u8FDB\u884C\u4E0B\u4E00\u6B21\u8C03\u7528");
            return fn(index);
        }
        function run() {
            time = Date.now();
            console.log("\u5F00\u59CB\u8C03\u7528[" + (index + 1) + "/" + opt.count + "]");
            return fn(index)
                .then(function (d) {
                timecha = Date.now() - time;
                console.log("\u8017\u65F6:" + timecha + " ms,\u8FD4\u56DE\u7ED3\u679C[" + d + "]");
                if (opt.checkerr) {
                    console.log("\u5F00\u59CB\u9A8C\u8BC1\u8FD4\u56DE\u503C[" + d + "]");
                }
                else {
                    console.log("\u672A\u914D\u7F6E[checkerr],\u8C03\u7528\u5B8C\u6210,\u5171\u6267\u884C" + (index + 1) + "\u6B21");
                }
                return Promise.resolve((opt.checkerr ? opt.checkerr(d, index) : undefined))
                    .then(function (err) {
                    if (err) {
                        console.log("\u8FD4\u56DE\u503C\u672A\u901A\u8FC7\u9A8C\u8BC1\uFF0C[" + err + "],\u5F00\u59CB\u7B2C[" + (index + 2) + "/" + opt.count + "]\u6B21\u8C03\u7528");
                        return runerr();
                    }
                    else {
                        console.log("\u8FD4\u56DE\u503C\u901A\u8FC7\u9A8C\u8BC1\uFF0C\u5171\u8C03\u7528[" + (index + 1) + "]\u6B21\u3002");
                        return d;
                    }
                });
            })
                .catch(function (err) {
                console.log(err);
                return runerr();
            });
        }
        run();
    }
    exports_1("default", calls);
    return {
        setters: [],
        execute: function () {
            errors = {
                1: "调用次数过多",
                2: "调用报错",
                3: "返回值不满足",
            };
            mylog = function (msg) {
                console.log(msg);
            };
        }
    };
});
//# sourceMappingURL=index.js.map