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

let isTitleVisible;
let mainTitleText = $("#main-title").text();
let splitText = mainTitleText.split(" ");

$("#main-title").text('');

splitText.map((item, index)=>{
    $("#main-title").append(`
        <span class="main-title-span">${item}</span>
    `);
})

function showTitle(){
    $('.main-title').hide().fadeIn(1500);

    let char = 0;
    let timer = setInterval(()=>{
        $($("#main-title").find($('span'))[char]).addClass(`fade`);
        char++;
        if(char == splitText.length){
            complete(timer);
            isTitleVisible = true;
            return;
        }
    }, 150);
}

function complete(timer) {
    clearInterval(timer);
    timer = null;
}

$(()=>{
    showTitle();
})

$("#main-section").scroll(()=> {
    if ($("#projects-section-anchor").position().top <= 0) {
        $(".navbar").addClass("navbar-secondary");
    } else {
        $(".navbar").removeClass("navbar-secondary");
    }

    if  ($(".main-title").position().top <= 0) {
        if(isTitleVisible == true){
            $('.main-title').animate({opacity: 0}, 500);
            isTitleVisible = false;
        }
    }
    
    if  ($(".main-title").position().top >= 0) {
        if(isTitleVisible == false){
            $('.main-title').animate({opacity: 1}, 500);
            isTitleVisible = true;
        }
    }
});

$("#submitConnectForm").on('click', ()=> {
    submitConnectForm();
});

$('.navbar-nav>li>a').on('click', ()=> {
    $('.navbar-collapse').collapse('hide');
});

$('.navbar').on('show.bs.collapse', ()=> {
    $(".navbar").addClass("navbar-secondary");
}).on('hide.bs.collapse', ()=> {
    if ($("#projects-section-anchor").position().top >= window.innerHeight) {
        $(".navbar").removeClass("navbar-secondary");
        console.log($("#projects-section-anchor").position().top <= window.innerHeight);
    }
});

function submitConnectForm(){
    window.event.preventDefault;
    let connectObj = validateForm();

    if(connectObj){
        $("#submitConnectForm").html(`
            <div class="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        `);
        $.ajax({
            type : 'POST',
            url : 'https://us-central1-portfolio-website-359822.cloudfunctions.net/app/send',
            data: connectObj,
            dataType : 'json',
            encode: true
        }).done((results) => {
            if(results.Success){
                grecaptcha.reset();
                $("#name, #email, #subject, #message").val('').removeClass('is-valid is-invalid');
                $("#success-message").html(`Your message has been successfully delivered, a confirmation email has been sent to ${connectObj.email}`).fadeIn("slow");
                setTimeout(()=>{
                    $("#success-message").fadeOut("slow").html('');
                }, 15000)
                $("#submitConnectForm").html(`Send`);
            }else{
                grecaptcha.reset();
                $("#captcha-failed").fadeIn("slow");
                setTimeout(()=>{
                    $("#captcha-failed").fadeOut("fast");
                }, 30000);
                $("#submitConnectForm").html(`Send`);
            }
        });
    }
}

function validateForm(){
    $("#name, #email, #subject, #message").removeClass('is-valid is-invalid');
    $("#captcha-info, #captcha-error, #captcha-expired, #success-message").hide();

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
    $("#captcha-info, #captcha-error, #captcha-expired, #captcha-failed, #success-message").hide();
    console.log('captcha network error');
    setTimeout(()=>{
        grecaptcha.reset();
        $("#captcha-error").fadeIn('slow');
    }, 30000)
}

function captchaExpired(){
    $("#captcha-info, #captcha-error, #captcha-expired, #captcha-failed, #success-message").hide();
    console.log('captcha expired');
    grecaptcha.reset();
    $("#captcha-expired").fadeIn('slow');
}

function captchaComplete(){
    console.log('captcha complete');
    $("#captcha-info, #captcha-error, #captcha-expired, #captcha-failed, #success-message").fadeOut('fast');
}
