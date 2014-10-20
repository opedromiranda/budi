/**
 * Created by Emanuelpinho on 08/10/14.
 */

var mongoose = require('mongoose');
var Meet = require('../models/meet.js');
var Budi = require('../models/budi.js');
var fs = require('fs');


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

    function handleMeetMessage(budiId, message) {

        return function(meet) {
            var result = new mongoose.Promise;

            if(meet.budies.indexOf(budiId) != -1) {

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
                result.err();
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
        return meet.chat;
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

        console.log("meet id " + messageObject.meet_id);

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

            publicPath = 'img/' + meetId + '/' + uploadedFileName;
            result.fulfill({
                meet_id : meetId,
                filePath : publicPath,
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
