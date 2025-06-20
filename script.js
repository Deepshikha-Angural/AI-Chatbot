let prompt=document.querySelector('#prompt');
let submitBtn=document.querySelector('#submit');
let chatContainer=document.querySelector('.chat-container');
let imageBtn=document.querySelector('#image');
let image=document.querySelector('#image .preview-img');
let closeIcon=document.querySelector('#image .close-icon');
let imageInput=document.querySelector('#image input');

const ApiUrl='https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_KEY';
let user={
    message:null,
    file:{
        mime_type:null,
        data:null
    }
}

document.addEventListener('keydown',(e)=>{ //user type a message and press enter
    if(e.key=='Enter'){
        if(prompt.value || user.file.data){
            handleChatResponse(prompt.value);
        }
    }
})

submitBtn.addEventListener('click',()=>{ //user click the send button
    if(prompt.value || user.file.data){
        handleChatResponse(prompt.value);
    }
})


function handleChatResponse(userMessage){
    user.message=userMessage;
    let html=`<img src="user.png" id="userImage" width="6%">
            <div class="user-chat-area">
                ${user.message}
                ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg">` : ''}
            </div>`;
    let userChatBox=createChatBox(html,'user-chat-box');
    prompt.value='';
    eraseimagePreview();
    chatContainer.appendChild(userChatBox);
    chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: 'smooth'}); //automatically scroll to the bottom of the chat container
    setTimeout(()=>{
        let html=`<img src="ai.png" id="aiImage" width="6%">
            <div class="ai-chat-area">
                <img src="loader.gif" width="50" class="load">
            </div>`;
        let aiChatBox=createChatBox(html,'ai-chat-box');
        chatContainer.appendChild(aiChatBox);
        generateResponse(aiChatBox);
    },200);
}

function createChatBox(html,classes){
    let div=document.createElement('div');
    div.innerHTML=html;
    div.classList.add(classes);
    return div;
}

async function generateResponse(aiChatBox){
    let text=aiChatBox.querySelector('.ai-chat-area');
    let requestOption={
        method:'POST',
        Headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(
            {
                "contents": [
                  {
                    "parts": [
                      {
                        "text": user.message
                      },
                      (user.file.data ? [{"inline_data": user.file}] : [])
                    ]
                  }
                ]
              }
        )
    }

    try{
        let response=await fetch(ApiUrl,requestOption);
        let data=await response.json();
        let apiResponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
        //console.log(apiResponse);
        text.innerHTML=apiResponse; //display the response from the API

    }catch(e){
        console.log(e);
    }
    finally{
        chatContainer.scrollTo({top: chatContainer.scrollHeight, behavior: 'smooth'}); //automatocally scroll to the bottom of the chat container
        image.src=`image.png`;
        closeIcon.style.display = "none";
        image.classList.remove('choose');
        user.file.data=null;
        user.file.mime_type=null;
        imageInput.value=''; //clear the input file
    }
    
}

imageBtn.addEventListener('click',(e)=>{
    if(user.file.data==null) {
        imageInput.click();
    }
});


// Prevent Enter key from triggering imageBtn click
imageBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // stops default "button click" behavior
    }
});

imageInput.addEventListener('change',()=>{
    const file=imageInput.files[0]; 
    if(!file) return
    let reader=new FileReader(); 
    reader.onload=(e)=>{
        // console.warn(e);
        let base64String=e.target.result.split(',')[1]; //get the base64 string from the data URL
        user.file={
            mime_type:file.type,
            data:base64String
        }
        image.src=`data:${user.file.mime_type};base64,${user.file.data}`;
        image.classList.add('choose');
        closeIcon.style.display = "block";
    }
    
    reader.readAsDataURL(file);
})

closeIcon.addEventListener('click',(e)=>{
        e.stopPropagation();
        closeIcon.style.display = "none";
        image.src=`image.png`;
        image.classList.remove('choose');
        user.file.data=null;
        user.file.mime_type=null;
        imageInput.value='';
})

function eraseimagePreview(){
    closeIcon.style.display = "none";
    image.src=`image.png`;
    image.classList.remove('choose');
}
