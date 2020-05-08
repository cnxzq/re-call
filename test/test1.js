const recall = require("../index")



recall(function(index){
    return (new Promise(function(resolve,reject){
        setTimeout(function(){
            if(index<6){
                reject("失败了");
                return;
            }
            if(index==6){
                resolve("失败了");
                return;
            }
            resolve("return value");
        },Math.round(Math.random()*2000)+1000);
    })).catch(function(err){
        throw err;
    })
},{
    count:10,
    checkerr:function(rev,index){
        if(rev==="失败了"){
            return "校验失败"
        }else{
            return;
        }
    }
})