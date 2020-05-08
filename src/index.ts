

const errors = {
    1:"调用次数过多",
    2:"调用报错",
    3:"返回值不满足",
}

const mylog = function(msg:string){
    console.log(msg);
};

export default function calls(fn:Function,option:any){
    if(!fn){throw "必须传入 fn"}
    var opt = {
        checkerr:(option&&option.checkerr)||null,
        interval:(option&&option.interval)||3000,
        count:(option&&option.count)||3,
        log:(option&&option.log)||null
    }
    
    console.log(`配置：${JSON.stringify(opt,null,4)}`);
    let log = opt.log;
    let index = 0;
    var time:number;
    var timecha:number;
    function runerr():Promise<any>{
        index++;
        if(index>=opt.count){
            log({
                code:1,
                message:errors[1]
            },index);
            return Promise.reject();
        }
        timecha = Date.now()-time;
        if(timecha<opt.interval){
            console.log(`响应时间：${timecha} ms,少于配置的：${opt.interval} ms,将在${opt.interval-timecha}后进行下一次调用`);
            return new Promise(function(resolve){
                setTimeout(function(){
                    resolve(run());
                },opt.interval-timecha)
            })
        }
        console.log(`响应时间：${timecha} ms,超过配置的：${opt.interval},将直接进行下一次调用`);
        return fn(index);
    }
    function run(){
        time = Date.now()
        console.log(`开始调用[${index+1}/${opt.count}]`);
        return fn(index)
        .then((d:any)=>{
            timecha = Date.now()-time;
            console.log(`耗时:${timecha} ms,返回结果[${d}]`);
            if(opt.checkerr){
                console.log(`开始验证返回值[${d}]`);
            }else{
                console.log(`未配置[checkerr],调用完成,共执行${index+1}次`);
            }
            return Promise.resolve((opt.checkerr?opt.checkerr(d,index):undefined))
            .then(err=>{
                if(err){
                    console.log(`返回值未通过验证，[${err}],开始第[${index+2}/${opt.count}]次调用`);
                    return runerr();
                }else{
                    console.log(`返回值通过验证，共调用[${index+1}]次。`);
                    return d;
                }
            })
        })
        .catch((err:any)=>{
            console.log(err);
            return runerr();
        })
    }
    run();
}