
//Not Twerking!
$('#input_blog_post').keypress(event,() => {
    console.log($('.maxlength').append('#input_blog_post').val().length)
})

let query ="";
let key = "5u1gTu3XcLrgMWBSwrhb1uwYohwVMCNv";
let giphy = fetch(`http://api.giphy.com/v1/gifs/search?q=${query}&api_key=${key}`);

giphy.done((data) => {console.log(`Got data on ${data}`)});