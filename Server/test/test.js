var expect = require('chai').expect;
var assert = require("assert");
var chai = require('chai');
var sinon = require('sinon');

var Budi = require('../models/budi');
var Meet = require('../models/meet');

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

describe('Budi', function() {
    describe('findFriends', function () {
        it('should return budi\'s friends IDs', function () {
                var b = new Budi();
                b.old_budis = [{
                    id:1,
                    friend: true
                }, {
                    id:2,
                    friend: true
                }, {
                    id:3,
                    friend: false
                }];

                var friends = b.findFriends();
                assert.equal(friends[0], 1);
                assert.equal(friends[1], 2);
                assert.equal(friends.length, 2);
        });

        it('should query Meet to find a Meet for a budi', function () {
            var b = new Budi();
            Meet.find = sinon.spy();
            b.findMeet();
            expect(Meet.find.called);
        });
    });
});
