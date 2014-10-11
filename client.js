

var net = require('net');
var port = 3000;
var host = '192.168.2.22';

var client= new net.Socket();
client.setEncoding('utf8');

//连接到服务端
client.connect(port,host,function(){
	console.log('client ready!');
    client.write('dubox');	//向服务器注册昵称
	
	var readline = require('readline');
	var rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
	});
	
	rl.on('line', function(line) {		//监听用户输入的行 即\n
	  
		client.write(line.trim());
		rl.prompt();
	});
});

client.on('data',function(data){
    console.log(data);
	
});
client.on('error',function(error){

    console.log('error:'+error);
    client.destroy();

});
client.on('close',function(){

    console.log('Connection closed');


});

