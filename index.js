const http =require("http");
const fs=require("fs");
var requests=require("requests");
const indexFile=fs.readFileSync("index.html","utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("%tempval%",(orgVal.main.temp-273).toFixed(2));
    temperature=temperature.replace("%tempmin%",(orgVal.main.temp_min-273).toFixed(2));
    temperature=temperature.replace("%tempmax%",(orgVal.main.temp_max-273).toFixed(2));
    temperature=temperature.replace("%location%",orgVal.name);
    temperature=temperature.replace("%country%",orgVal.sys.country);
    temperature=temperature.replace("%tempStatus%",orgVal.weather[0].main);
    return temperature;
}
const server=http.createServer((req,res)=>{
if(req.url=="/"){
    requests("http://api.openweathermap.org/data/2.5/weather?q=Jamshedpur&appid=af439cc4c32ba0db8affccd3790c71ff").on("data",(chunk)=>{
        const objdata=JSON.parse(chunk);
        const arrData=[objdata];
        // console.log(arrData);
        const realTimeData=arrData.map((val)=>replaceVal(indexFile,val)).join("");
        res.write(realTimeData);
        console.log(realTimeData);
        
    }).on("end",(err)=>{
        if(err)return console.log("Connection Closed Due to error");
       res.end();
});
}
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to the portnumber 8000");
  });
