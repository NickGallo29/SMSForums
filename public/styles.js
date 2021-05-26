const navSlide=()=>{
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks=document.querySelectorAll('.nav-links li');

    burger.addEventListener('click',()=>{
        nav.classList.toggle('nav-active');

        navLinks.forEach((link,index)=>{
            if(link.style.animation){
                link.style.animation='';
            }else{
                link.style.animation=`navLinkFade 0.5s ease forwards ${index/7}s`;
            }
        })
    });


}

navSlide();


var quill = new Quill('#editor',{
    modules:{
        toolbar:{
            container: [
                [{header:[1,2,3]}],
                ['bold','italic','underline'],
                ['image','link']
            ],
            handlers: {
                'image':imageHandler
            }
        }
    },
    placeholder:'Post Body...',
    theme:'snow'
});

function imageHandler() {
    var range = this.quill.getSelection();
    var value = prompt('What is the image URL');
    if(value){
        this.quill.insertEmbed(range.index, 'image', value, Quill.sources.USER);
    }
};

//Dismissing Flash Messages
const flash = document.getElementById('flash');

function dismissFlash(){
    flash.style.display="none";
};

const submitBtn = document.getElementById('submitPost');

submitBtn.addEventListener('click',()=>{
    var about = document.getElementById('quillText');
    about.value=JSON.stringify(quill.getContents());
});








