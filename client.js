

var net = require('net');
var port = 3000;
var host = '127.0.0.1';

var client= new net.Socket();
client.setEncoding('utf8');


var readline = require('readline');
	var rl = readline.createInterface({
		  input: process.stdin,
		  output: process.stdout
	});

//连接到服务端
client.connect(port,host,function(){
	console.log('client ready!');
    
	
	
	
	//client.write('dubox');	//向服务器注册昵称
	
	rl.on('line', function(line) {		//监听用户输入的行 即\n
		
		line = line.trim();
		//if(line.substr(0,1) == '#')
		
		client.write(line);
		rl.prompt();
	});
});

client.on('data',function(data){
    console.log(data );
	rl.prompt();
	
});
client.on('error',function(error){

    console.log('error:'+error);
    client.destroy();

});
client.on('close',function(){

    console.log('Connection closed');


});

