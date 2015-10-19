var nodemailer = require("nodemailer");

/**Generate random string**/
exports.sendEmail = function(towhom, subject, text, html, callback)
{
    var smtpTransport = nodemailer.createTransport("SMTP", {
        host: "smtp.163.com", // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        auth: {
            user: "yincharm@163.com",
            pass: "ydeseanefkhxksjz"
        }
    });

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "yincharm@163.com", // sender address
        to: towhom, // list of receivers
        subject: subject, // Subject line
        text: text, // plaintext body
        html: html // html body
    }
    

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        smtpTransport.close(); // shut down the connection pool, no more messages
        if(error){
            console.log(error);
            callback(error)
        }else{
            console.log("Message sent: " + response.message);
             callback(null)
        }
        // if you don't want to use this transport object anymore, uncomment following line
        
    });

}