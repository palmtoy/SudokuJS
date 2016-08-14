var phpServer = require('node-php-server');
var port = 8086;

// Create a PHP Server
phpServer.createServer({
	port: port,
	hostname: '0.0.0.0',
	base: '.',
	keepalive: false,
	open: false,
	bin: 'php',
	router: __dirname + '/server.php'
});

console.log('PHP server is running on port ' + port + ' ...');

