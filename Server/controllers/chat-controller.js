/**
 * Created by Emanuelpinho on 08/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('../models/meet');
var Budi = require('../models/budi');
var fs = require('fs');
var moment = require('moment');


function ChatController () {

    /**
     * Object of the meet .l.
     */
    var meet;

    /**
     * Uses the response object to send a JSON object with error set to 1
     * @param res
     * @returns {err}
     */
    function handleError(res) {
        function err(e) {
            console.log(e);
            res.json({
                error: 1,
                error_object : e
            });
        }
        return err;
    }

    /**
     * Checks if a given budi ID is present in the budies array of a meet
     * @param meet
     * @param budiId
     * @return result
     */
    function isBudiInMeet(meet, budiId) {

        var result = false;
        meet.budies.forEach(function (el) {
            if(el.id == budiId) {
                result = true;
            }
        });

        return result;
    }

    function handleMeetMessage(budiId, message) {


        return function(meet) {
            var result = new mongoose.Promise;

            if(isBudiInMeet(meet, budiId)) {

                Meet.update(
                    { _id : meet._id },
                    { $push: {
                        chat: {
                            type: 'text',
                            message: message,
                            budiSending: budiId
                            }
                    } },
                    function(err) {
                        if(err) {
                            result.error(err);
                        }
                        result.fulfill({
                            error: 0
                            //meet: meet
                        });
                    }
                );

            } else {
                result.reject();
            }

            return result;
        }
    }

    function handleAnswer(res) {
        return function(answer) {
            res.json(answer);
        }
    }

    function getChat(meet){
        var result = new mongoose.Promise, budies = meet.budies, budi1 = [], budi2 = [], meetFinish = false, meetFull;

        if (moment().diff(meet.date, 'minutes') > 1440 ){
            meetFinish = true;
        }
        else if (budies.length > 1) {
            if (budies[0].friendReq && budies[1].friendReq) {
                Budi.findOne({_id : budies[0].id }, function(err, doc){
                    if(err){
                        result.error({
                            err : "budi not found"
                        });
                        return result;
                    }
                    budi1['id'] = doc._id;
                    budi1['name'] = doc.name;
                    budi1['fb_id'] = doc.fb_id;

                    Budi.findOne({_id : budies[1].id }, function(err, doc){
                        if(err){
                            result.error({
                                err : "budi not found"
                            });
                            return result;
                        }
                        budi2['id'] = doc._id;
                        budi2['name'] = doc.name;
                        budi2['fb_id'] = doc.fb_id;
                        meetFull = true;

                        result.fulfill({
                            chat: meet.chat,
                            budies: [budi1, budi2],
                            finish: meetFinish,
                            full: meetFull
                        });
                        return result;

                    });
                });
            }
        }
        else{
            meetFull = false;
        }

        result.fulfill({
            chat: meet.chat,
            budies: [budi1, budi2],
            finish: meetFinish,
            full: meetFull
        });

        return result;
    }

    this.sendMessage = function (req,res) {

        var budiId = req.body.budi_id,
            meetId = req.body.meet_id,
            message = req.body.message;

        if (!message || !meetId || !budiId) {
            res.json({
                error: 1
            });
            return;
        }

        Meet.findOne({_id : meetId}).exec()
            .then(handleMeetMessage(budiId, message))
            .then(handleAnswer(res))
            .onReject(handleError(res));
    };

    function updateDB(messageObject){
        var result = new mongoose.Promise;

        Meet.update(
            { _id : messageObject.meet_id },
            { $push: {
                chat: {
                    type: 'image',
                    message: messageObject.filePath,
                    budiSending: messageObject.budi_id
                }
            } },
            function(err) {
                if(err) {
                    result.error(err);
                    return;
                }
                result.fulfill({
                    error : 0
                });
            }
        );

        return result;
    }

    function handleFormData(req){
        var result = new mongoose.Promise,
            meetId = null,
            budiId = null,
            uploadedFile,
            uploadedFileName = null,
            uploadedFilePath,
            publicPath = null;

        req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {
            switch(key) {
                case 'meet_id':
                        meetId = value;
                        break;
                case 'budi_id':
                        budiId = value;
                        break;
            }
        });

        req.busboy.on('file', function (fieldname, file, filename) {
            uploadedFileName = filename;
            uploadedFilePath = __dirname + '/../public/img/';
            if (!fs.existsSync(uploadedFilePath)) {
                fs.mkdirSync(uploadedFilePath);
            }
            uploadedFilePath += filename;
            uploadedFile = file;
            //file.resume(); // upload is done on finish when meetId and budiId are available
            fstream = fs.createWriteStream(uploadedFilePath);
            uploadedFile.pipe(fstream);
        });

        req.busboy.on('finish', function() {
            if(!meetId || !budiId || !uploadedFileName) {
                result.error({
                    message : 'Missing parameters'
                });
            }

            publicPath = __dirname + '/../public/img/' + meetId + '/';
            if (!fs.existsSync(publicPath)) {
                fs.mkdirSync(publicPath);
            }
            publicPath += uploadedFileName;

            fs.rename(uploadedFilePath, publicPath);

            result.fulfill({
                meet_id : meetId,
                filePath : meetId + '/' + uploadedFileName,
                budi_id :budiId
            });
        });
        req.pipe(req.busboy);

        return result;
    }

    this.sendImage = function (req,res) {
        handleFormData(req)
            .then(updateDB)
            .then(function(data) {
                res.json(data);
            })
            .onReject(handleError(res));
    };

    this.get = function(req, res){

        var meetId = req.params.meetId;

        Meet.findOne({_id : meetId}).exec()
            .then(getChat)
            .then(handleAnswer(res))
            .onReject(handleError(res));
    }

}

module.exports = new ChatController();
