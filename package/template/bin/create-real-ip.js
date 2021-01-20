var config = require('config');
var fs = require('fs');

if (process.argv.length > 0) {
	var argv = process.argv.slice(2);
	var trustedProxyIpsConfig = config.get('system.trustedProxyIPs');
	var data = '';

	if (trustedProxyIpsConfig !== '') {
		var trustedProxyIPs = trustedProxyIpsConfig.split(',');

		data = trustedProxyIPs.map((ip) => {
			return 'set_real_ip_from ' + ip.trim() + ';' + '\n';
		});
	}

	// Create file containing 1 or more trusted IPs
	fs.writeFileSync(argv[0], data);
	fs.chmodSync(argv[0], 0o644);
} else {
	console.log("File not specified as argument")
}
