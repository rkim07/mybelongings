Typescript file location changes
    
A. Modify package.json
* Line 7: "build": "webpack-cli ./src/frontend/js/app.tsx

B. Modify webpack-config.js
* Line 3: "entry": "./src/frontend/js/app.tsx" 

C. Modify tsconfig.json
* Line 14 ~ 16: 
"files": [
    "./src/frontend/js/app.tsx"
]

Main server file location changes

A. Modify package.json
* Line 5: "main": "./src/app/server.js"
* Line 8: "debug": "yarn build && node --inspect-brk=57645
