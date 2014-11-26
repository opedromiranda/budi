var expect = require('chai').expect;
var assert = require("assert");


expect(4+5).equal(9);
expect(4+5).to.not.equal(10);


describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});