const cl = console.log;
const postsContainer = document.getElementById("postsContainer");
const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

let baseUrl = `https://jsonplaceholder.typicode.com`

let postsUrl = `${baseUrl}/posts`

let postArray = [];
const onEdit = (ele)=>{
    cl(ele)

    let getId = ele.closest(".card").id;
    cl(getId);

    localStorage.setItem("editId",getId);   

    let getObjUrl = `${baseUrl}/posts/${getId}`

    let xhr = new XMLHttpRequest();

    xhr.open("GET",getObjUrl,true);

    xhr.send();

    xhr.onload = function(){
        
        if(xhr.status === 200){
            
            cl(xhr.response);

            let getObj = JSON.parse(xhr.response);
            titleControl.value = getObj.title;
            bodyControl.value = getObj.body;
            userIdControl.value = getObj.userId;

            updateBtn.classList.remove(`d-none`);
            submitBtn.classList.add(`d-none`);

        }
    }

}

const onDelete = (ele) =>{
    cl(ele)

    let getDeleteId = ele.closest(`.card`).id;
    cl(getDeleteId) 

    let deleteUrl = `${baseUrl}/posts/${getDeleteId}`;

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE",deleteUrl);

    xhr.send();

    xhr.onload = function(){  
        if(xhr.status === 200){

        let card = document.getElementById(getDeleteId);
        cl(card);
        card.remove();

        cl(xhr.response);
        }
    }
     confirm("Do You Really Want To Delete This?")
}

const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `<div class="card mb-4" id="${post.id}">
                   <div class="card-header">
                      <h2>${post.title}</h2>
                   </div>
                   <div class="card-body">
                     <p>
                           ${post.body} 
                     </p>
                  </div>
                 <div class="card-footer d-flex justify-content-between">
                     <button class="btn btn-outline-primary" onclick="onEdit(this)">
                        Edit
                     </button>
                     <button class="btn btn-outline-danger"
                     onclick = "onDelete(this)">
                        Delete
                     </button>
           
                </div>
                </div>  `
    });
    postsContainer.innerHTML = result;
}

const createCards = (postObj) =>{
    let card = document.createElement(`div`);
    card.className = "card mb-4";
    card.id = postObj.id;
    card.innerHTML = `<div class="card-header">
                        <h2>${postObj.title}</h2>
                    </div>
                    <div class="card-body">
                    <p>
                            ${postObj.body} 
                    </p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                    <button class="btn btn-outline-primary" onclick="onEdit(this)">
                        Edit
                    </button>
                    <button class="btn btn-outline-danger"
                    onclick = "onDelete(this)">
                        Delete
                    </button>

                    </div>`

    postsContainer.append(card);
    cl(card);
}
const createPost = (postObj)=>{
    let xhr = new XMLHttpRequest();

    xhr.open("POST",postsUrl,true);

    xhr.send(JSON.stringify(postObj));

    xhr.onload = function(){
        if(xhr.status === 200 || xhr.status === 201){
            cl(xhr.response) 
     
            postObj.id= JSON.parse(xhr.response).id;
            postArray.push(postObj);
            //templating(postArray);

            createCards(postObj);
       
        }

    }
}

const onSubmitPost = (eve) =>{
    eve.preventDefault();
    let newPost = {
        title : titleControl.value,
        body : bodyControl.value,
        userId : userIdControl.value
    }
    cl(newPost);
    postForm.reset();
    createPost(newPost);

}


const getAllPosts = () => {
//1.create a instance/object XMLHttpRequest

let xhr = new XMLHttpRequest();

//2.configuration of API call

xhr.open("GET", postsUrl,true);

//3.
xhr.send();

//4.
xhr.onload = function(){
     if(xhr.status === 200){
       // cl(xhr.response)

       postArray= JSON.parse(xhr.response)
   // cl(data)
    templating(postArray);
     }else{
        alert("something went wrong !!!")
     }
 }
}
getAllPosts();

const onPostUpdate = () => {
    let updatedObj = {
        title : titleControl.value,
        body : bodyControl.value,
        uderId : userIdControl.value
    }
    cl(updatedObj); 
    let getEditId = localStorage.getItem("editId");
    cl(getEditId);
    
    let updatedUrl = `${baseUrl}/posts/${getEditId}`
    
    let xhr = new XMLHttpRequest();
    
    xhr.open("PATCH",updatedUrl,true);

    xhr.send(JSON.stringify(updatedObj));
    
    xhr.onload = function(){
        if (xhr.status === 200){
        cl(xhr.response);
        let getIndexOfObj = postArray.findIndex(post=>{
            return post.id == getEditId
        })
        cl(getIndexOfObj)

        postArray[getIndexOfObj].title = updatedObj.title;
        postArray[getIndexOfObj].body = updatedObj.body;
        postArray[getIndexOfObj].userId = updatedObj.userId;
        
        templating(postArray);
        }
        postForm.reset();
    }
}
postForm.addEventListener("submit",onSubmitPost);
updateBtn.addEventListener("click",onPostUpdate);
 