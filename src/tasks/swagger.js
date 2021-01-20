const fs = require('fs');
const glob = require('glob');
const swaggerJSDoc = require('swagger-jsdoc');

const ctrls = glob.sync('./src/app/**/controllers/*.ts');
const models = glob.sync('./src/app/**/models/*.ts');
const app = glob.sync('./src/app/app.ts');
const {version, name, description} = require('../../package.json');

const options = {
    swaggerDefinition: {
        info: {
            title: name,
            version,
            description
        }
    },
    apis: [...models, ...ctrls, ...app]
};

const spec = swaggerJSDoc(options);
fs.writeFileSync('./spec.json', JSON.stringify(spec, null, '\t'));
