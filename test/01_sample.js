var expect = chai.expect;

describe('nativeCall', function () {

    it('window test', function () {
        expect(window_stub.called).to.eql(true);
        expect(window_stub.args[0][1]).to.be.a('function');
    });

    it('template test', function() {
        var template_spy = sinon.spy(nativeCall.prototype,'template');
        window_stub.args[0][1]();
        expect(template_spy.called).to.eql(true);
        expect(template_spy.returnValues[0]).to.eql('cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback');
    });

    it('nativeCall test', function() {
        var spy = sinon.spy(window, 'nativeCall');
        window_stub.args[0][1]();
        expect(spy.called).to.eql(true);
    });
});
