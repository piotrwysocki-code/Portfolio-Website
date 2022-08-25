window.captchaComplete = captchaComplete;
window.captchaError = captchaError;
window.captchaExpired = captchaExpired;

class Connect {
    constructor(name, email, subject, message, captcha){
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.captcha = captcha
    }
}

$("#submitConnectForm").on('click', ()=>{   
    submitConnectForm();
});

function submitConnectForm(){
    window.event.preventDefault;
    console.log("hello from submit function");

    let connectObj = validateForm();

    if(connectObj){
        $.ajax({
            type : 'POST',
            url : 'http://127.0.0.1:4000/send',
            data: connectObj,
            dataType : 'json',
            encode: true
        }).done((results) => {
                console.log(results);
                grecaptcha.reset();
        });
    }
}

function validateForm(){
    $("#name, #email, #subject, #message").removeClass('is-valid is-invalid');
    $("#captcha-info, #captcha-error, #captcha-expired").hide();

    let connectObj = new Connect(
        $("#name").val() || '',
        $("#email").val() || '',
        $("#subject").val() || '',
        $("#message").val() || '',
        grecaptcha.getResponse() || '');

    let validFields = [];

    if(connectObj.name != ''){
        $("#name").addClass('is-valid');
        validFields.push(true);
    }else{
        $("#name").addClass('is-invalid');
        validFields.push(false);
    }

    if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(connectObj.email)){
        $("#email").addClass('is-valid');
        validFields.push(true);
    }else{
        $("#email").addClass('is-invalid');
        validFields.push(false);
    }

    if(connectObj.subject != ''){
        $("#subject").addClass('is-valid');
        validFields.push(true);
    }else{
        $("#subject").addClass('is-invalid');
        validFields.push(false);
    }

    if(connectObj.message != ''){
        $("#message").addClass('is-valid');
        validFields.push(true);
    }else{
        $("#message").addClass('is-invalid');
        validFields.push(false);
    }

    if(connectObj.captcha != ''){
        validFields.push(true);
    }else{
        $("#captcha-info").fadeIn('slow');
        validFields.push(false);
    }

    if(validFields.includes(false)){
        connectObj = null;
    }

    return connectObj;
}

function captchaError(){
    console.log('captcha network error');
    grecaptcha.reset();
    $("#captcha-error").fadeIn('slow');
}

function captchaExpired(){
    console.log('captcha expired');
    grecaptcha.reset();
    $("#captcha-expired").fadeIn('slow');
}

function captchaComplete(){
    console.log('captcha complete');
    $("#captcha-info, #captcha-error, #captcha-expired").fadeOut('fast');
}