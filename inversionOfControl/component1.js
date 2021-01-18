'use strict';

const moduleName = {};

module.exports = moduleName;

const privateProperty = 'Privat variable value in Module1'
const privateFunction = (prop) => {
    console.log('Output form our private function Module1');
    console.log(`Call: ${prop}`);
};

privateFunction(privateProperty);

moduleName.publicProperty = 'Public property value in Module1';

moduleName.publicFunction = () => {
    console.log('Output from public function of Module1');
};


