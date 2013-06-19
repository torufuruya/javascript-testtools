var expect = chai.expect;

describe('nativeCall', function () {

    describe('DOMContentLoaded', function() {
        it('addEventListerが呼ばれること', function () {
            expect(window_stub.called).to.eql(true);
        });
        it('addEventListerの第2引数が関数であること', function () {
            expect(window_stub.args[0][1]).to.be.a('function');
        });
    });

    describe('template', function() {
        before(function() {
            spy = sinon.spy(nativeCall.prototype,'template');
            window_stub.args[0][1]();
        });

        it('templateメソッドが呼ばれること', function() {
            expect(spy.called).to.eql(true);
        });
        it('templateメソッドの引数の型が正しいこと', function() {
            expect(spy.args[0][0]).to.be.a('string');
            expect(spy.args[0][1]).to.be.a('object');
        });
        it('templateメソッドの結果が正しいこと', function() {
            expect(spy.returnValues[0])
              .to.eql('cobit-sdk:call/apiName?param={"param_key":"param_value"}&sessionId=nnn&callback=callback');
        });
    });

    describe('nativeCall', function() {
        before(function() {
            spy = sinon.spy(window, 'nativeCall');
            window_stub.args[0][1]();
        });

        it('nativeCallの引数が正しいこと', function() {
            expect(spy.args[0][0]).to.be.a('string');
            expect(spy.args[0][1]).to.be.a('object');
            expect(spy.args[0][2]).to.be.a('string');
        });
    });

});
