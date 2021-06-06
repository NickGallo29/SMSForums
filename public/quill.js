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

const submitBtn = document.getElementById('submitPost');

submitBtn.addEventListener('click',()=>{
    var about = document.getElementById('quillText');
    console.log(about);
    about.value=JSON.stringify(quill.getContents());
});