
class Connect {
    constructor(name, email, subject, message){
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }
}

$("#submitConnectForm").on('click', ()=>{   
    submitConnectForm();
})

function submitConnectForm() {
    let connectMsg = new Connect($("#name").val(), $("#email").val(), $("#subject").val(), $("#message").val());
    
    /*
    $.ajax({
        type : 'POST',
        url : 'http://localhost:4000/send',
        data: connectMsg,
        dataType : 'json',
        encode: true
    }).done((results) => {
            console.log(results);
    });*/
}




