var express = require('express');

var server = express();
//server.use(bodyParser.json({limit: '50mb'}));
//server.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

server.use(express.static(__dirname+'/src/www'));
try {
    // 监听端口
    server.listen(8090,function () {
        //if (process.env.NODE_ENV === 'development') {
        console.log('%s listening at %s', server.name, server.url);
        //}
        //console.log(avConfig);
    });
} catch (e) {
    console.err("请输入有效端口！");
}
