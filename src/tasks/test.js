const Mocha = require('mocha');
const glob = require('glob');
const commandLineArgs = require('command-line-args');
const helpers = require('./test-helpers');

require("source-map-support/register");
require("reflect-metadata");

/**
 * Global command argument definitions
 */
const globalArgumentDefinition = [
    { name: 'type', alias: 't', type: String, defaultValue: 'all' }
];

/**
 * Global command options after being parse
 */
const globalOptions = commandLineArgs(globalArgumentDefinition);

async function runMocha(files) {
    // Instantiate a Mocha instance.
    const mocha = new Mocha();
    
    // First add unit tests
    files.forEach(function(file) {
        mocha.addFile(file);
    });

    let runner = mocha.run(function(failures) {
        process.exitCode = failures ? 1 : 0;  // exit with non-zero status if there were failures
    });

    return new Promise((resolve, reject) => {
        runner.on('end', function() {
            if (process.exitCode === 0) {
                resolve();
            } else {
                reject();
            }
        });
    })
}

async function runEndpointTests() {
    console.log('=== API Tests Running ===');
    const files = glob.sync(__dirname + '/../../build/test/api/**/*.js');
    try {
        await runMocha(files);
    } catch(e) {
        throw e;
    } finally {
        console.log('=== API Tests Complete ===')
    }
}

async function runIntegrationtests(server) {
    console.log('=== Integration Tests Running ===');

    await helpers.loadNewFlightInformation('end');
    
    await helpers.tickNow(server);

    await helpers.wait(1000);

    const flightIsClosed = helpers.isFlightClosed(server);
    if (!flightIsClosed) {
        throw new Error('Last state of flight should be closed');
    } else {
        console.log('Tests complete, and flight now closed');
    }
    console.log('=== Integration Tests Complete ===');
}

Application = require('../../build/app/config/Application').Application;

(async () => {
    let files;
    if (globalOptions.type === 'all' || globalOptions.type === 'unit') {
        files = glob.sync(__dirname + '/../../build/test/unit/**/*.js');
        try {
            await runMocha(files);
        } catch(error) {
            if (error) {
                console.error(error);
            }
            process.exit(1);
        }
    }

    if (globalOptions.type === 'all' || globalOptions.type === 'api') {
        if (globalOptions.type === 'all') {
            console.log('=== Unit Tests Complete ===')
            console.log('Beginning Integration Tests...')
        }
        
        const hasMarketplace = await helpers.hasOpenMarketPlace();
        if (hasMarketplace) {
            console.log('integration test failed, no marketplace should be open');
            process.exit(1);
        }
        
        console.log('### Starting Application ###');
        server = new Application();

        // Wait for the application to startup
        console.log('### Waiting for onReady ###');

        // Poll every 2 seconds to wait for marketplace to open
        let waitForMarketplaceInterval = setInterval(async () => {
            const hasMarketplace = await helpers.hasOpenMarketPlace();
            if (hasMarketplace){
                clearInterval(waitForMarketplaceInterval);
                console.log('first integration test success');
                try {
                    await runEndpointTests();
                    await runIntegrationtests(server);
                } catch (error) {
                    console.error(error);
                    process.exit(1);
                } finally {
                    process.exit(0);
                }
            }
        }, 1000);

        server.onReady(async () => {
            const flightIsClosed = helpers.isFlightClosed(server);
            if (!flightIsClosed) {
                console.log('Initial state of flight should be closed');
                process.exit(1);
            } else {
                console.log('Tests can proceed, flight currently closed');
            }
            console.log('### server.onReady fired ###');
            /*
                manually tick the flight interval state
                as we don't want to wait the normal interval time
            */
            await helpers.tickNow(server);

            await helpers.wait(1000);

            const flightIsOpen = helpers.isFlightOpen(server);
            if (flightIsOpen) {
                console.log('Tests can proceed, flight has been opened');
            }else{
                console.log('Flight should be open after first tick');
                process.exit(1);
            }
        });
    } else {
        process.exit();
    }
})()
