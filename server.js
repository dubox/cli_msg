

var net = require('net');
var timeout = 20000;//超时
var listenPort = 3000;//监听端口
var socketList = [];//连接池

var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('connect: ' +
        socket.remoteAddress + ':' + socket.remotePort);
    socket.setEncoding('utf8');

    //超时事件
    socket.setTimeout(timeout,function(){
        console.log('连接超时');
        socket.end();
    });
	
    //接收到数据
    socket.on('data',function(data){
		//if(!data.trim()){
			//return false;
		//}
		//data = data.trim();
        console.log('re:' + data);
		
		if(!socketList[socket.remoteAddress]){
			add(socket);
		}
		/**/
		//处理接收到的数据
		if((typeof socketList[socket.remoteAddress]['name']) == 'undefined'){
			//注册客户端昵称
			socketList[socket.remoteAddress]['name'] = data;
			socket.write('server: hello,'+data);
		}else{
			//发送消息
			send(data,socket);
		}
		
		//socket.write('hello too');
    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);

    });


}).listen(listenPort);


//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});

//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
}); 

//连接
server.on('connection', function (socket) {
        socket.setTimeout(0);
        socket.setNoDelay(true);
        socket.setKeepAlive(true, 0);
		socket.write('server: hello,'+socket.remoteAddress+'\r\n');//服务器问候语 连接时发送一次
		
        //放入连接池
        add(socket, function () {
            //触发绑定事件
            //events.emit('connect', socket.remoteAddress);
			for(var i in socketList){
				console.log(i);
			}
        });
		
});

//将连接加入连接池
function add(socket, fun) {
    if (!socketList[socket.remoteAddress]) {
		socketList[socket.remoteAddress] = [];
        socketList[socket.remoteAddress]['socket'] = socket;
        (fun || function () { })();
    }
}

function remove(socket, fun) {
    var i = indexOf(socket);
    if (i != -1) {
        socketList = socketList.slice(0, i).concat(socketList.slice(i + 1));
        (fun || function () { })();
    }
}

//发消息
function send(data,socket) {

	var msgarr = data.split(':',2);
	if(msgarr.length < 2){	//群发消息
		for (var i in socketList) {
			if(i != socket.remoteAddress)	//排除信息发出者
			socketList[i]['socket'].write('['+socketList[socket.remoteAddress]['name']+']: '+msgarr[0]);
		}
	}else{
		for (var i in socketList) {
			if(socketList[i]['name'] == msgarr[0]){//对指定目标发送消息
				socketList[i]['socket'].write('['+socketList[socket.remoteAddress]['name']+']: '+msgarr[1]);
				return false;
			}
		}
		socket.write('server: No such person!');
	}

    
}
