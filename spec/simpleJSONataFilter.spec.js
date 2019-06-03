/* eslint-env node, mocha */
'use strict';

const expect = require('chai').expect;
const action = require('../lib/actions/simpleJSONataFilter');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('Test filter', () => {
    const msg = {
        body: {
            hello: 'world'
        }
    };

    async function errorCondition(condition) {
        let Error;
        try {
            await action.process(msg, condition);
        } catch (error) {
            Error = error;
        }
        expect(Error.message).to.be.equal('Unable to cast value to a number: "world"');
    }

    async function filter(condition, passOrFail) {
        const spy = sinon.spy();
        await action.process.call({
            emit: spy
        }, msg, condition);
        expect(spy.calledOnce).to.equal(passOrFail);
    }


    const passCondition1 = {
        expression: 'true'
    };
    const passCondition2 = {
        expression: '$not(false)'
    };
    const passCondition3 = {
        expression: '20 > 5'
    };
    const passCondition4 = {
        expression: '20.4 > 2'
    };
    const passCondition5 = {
        expression: '20.4 > 20'
    };


    const failCondition1 = {
        expression: 'false'
    };
    const failCondition2 = {
        expression: '$not(true)'
    };
    const failCondition3 = {
        expression: '20 > 20'
    };
    const failCondition4 = {
        expression: '20.4 > 20.4'
    };
    const failCondition5 = {
        expression: 'null'
    };
    const failCondition6 = {
        expression: 'undefined'
    };


    const errorCondition1 = {
        expression: '$number(hello) > 5'
    };


    describe(' should fire event ', async () => {
        it(passCondition1.expression, async () => {await filter(passCondition1, true);});
        it(passCondition2.expression, async () => {await filter(passCondition2, true);});
        it(passCondition3.expression, async () => {await filter(passCondition3, true);});
        it(passCondition4.expression, async () => {await filter(passCondition4, true);});
        it(passCondition5.expression, async () => {await filter(passCondition5, true);});
    });

    describe(' should just log message to console ', async () => {
        it(passCondition1.expression, async () => {await filter(failCondition1, false);});
        it(failCondition2.expression, async () => {await filter(failCondition2, false);});
        it(failCondition3.expression, async () => {await filter(failCondition3, false);});
        it(failCondition4.expression, async () => {await filter(failCondition4, false);});
        it(failCondition5.expression, async () => {await filter(failCondition5, false);});
        it(failCondition6.expression, async () => {await filter(failCondition6, false);});
    });

    describe(' should throw error ', async () => {
        it(errorCondition1.expression, async () => {await errorCondition(errorCondition1);});
    });

});