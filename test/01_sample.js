var expect = chai.expect;

describe('nativeCall', function () {

    before(function() {
        console.log('before');
    });

    beforeEach(function() {
        console.log('beforeEach');
    });

    afterEach(function() {
        console.log('afterEach');
    });

    after(function() {
        console.log('after');
    });

    it('window test', function () {
        expect(window_stub.called).to.eql(true);
        expect(window_stub.args[0][1]).to.be.a('function');
    });

    it('template test', function() {
        var spy = sinon.spy(nativeCall.prototype,'template');
        window_stub.args[0][1]();
        expect(spy.called).to.eql(true);
        expect(spy.args[0][0]).to.be.a('string');
        expect(spy.args[0][1]).to.be.a('object');
        expect(spy.returnValues[0]).to.eql('cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback');
    });

    it('nativeCall test', function() {
        var spy = sinon.spy(window, 'nativeCall');
        window_stub.args[0][1]();
        expect(spy.called).to.eql(true);
        expect(spy.args[0][0]).to.be.a('string');
        expect(spy.args[0][1]).to.be.a('object');
        expect(spy.args[0][2]).to.be.a('string');
    });

});
