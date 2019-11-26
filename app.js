//imported files 
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');

//setup for express
const app = express();
const port = 3000;
app.engine('html', ejs.renderFile);
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.urlencoded());


class Comment {
    constructor(content, author) {
        this.content = content;
        this.time = Date(Date.now).toString();
        if (author)
            this.author = author;
        else
            this.author = "anonymous";
    }
}
class BlogPost {
    constructor(title, content, author) {
        this.id = 1;
        this.title = title;
        this.content = content;
        if (author)
            this.author = author;
        else
            this.author = "anonymous";
        this.comments = [];
        this.reactions = [0, 0, 0];
    }

    addComment(comment, author) {
        this.comments.push(new Comment(comment, author));
    }
}


//saves new json object to array
const saveJson = (jsonObj) => {
    fs.readFile('public/assets/blogs.json', (err, data) => {
        if (err) throw err;
        let jsonArray;
        try {
            jsonArray = JSON.parse(data);
        }
        catch (err) {
            console.log(err);
            //unexpected end of json input due to empty json file
            jsonArray = [];
        }
        jsonObj.id = jsonArray.length + 1;
        jsonArray.push(jsonObj);
        //convert array to form that can be saved in json file
        newJsonArray = JSON.stringify(jsonArray);
        fs.writeFile("public/assets/blogs.json", newJsonArray, () => {
        });
        
    });
    
    
}

//first page render
app.get('', (req, res) => {
    fs.readFile('public/assets/blogs.json', (err, data) => {
        let jsonArray;
        try {
            jsonArray = JSON.parse(data);
        }
        catch (err) {
            console.log(err);
            //unexpected end of json input due to empty json file
            jsonArray = [];
        
        }
        res.render('homepage.html',{blogs : jsonArray });
   
});
});

//blog creation render
app.get('/create', (req,res) => {
    res.render('form.html');
});


//gets and renders a specific blog post
app.get('/blog/:index', (req, res) => {
    let index = req.params.index;
    fs.readFile('public/assets/blogs.json', (err, data) => {
        if (err) throw err;
        //parses data from json file into a useable array format
        let jsonArray = JSON.parse(data);
        //checks input index is a valid one
        if (index > 0 && index <= jsonArray.length) {
            res.render("blogPage.html", jsonArray[index - 1]);
        }
        else {
            res.send(`Blog doesn't exist. Please choose an index between 1 and ${jsonArray.length}`);
        }
    });
});

//when form data is submitted
app.post('/submit', (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let newPost = new BlogPost(
        title,
        content,
        author
    );
   saveJson(newPost);
   
    
    res.redirect(`/`);
});

app.post('/comment', (req, res) => {
    //get the url of the post request
    let reqUrl = req.rawHeaders[25];
    //get the comment
    let content = req.body.comment;
    let author = req.body.author;
    //if the comment is not empty
    if(content !== "")
    {
    // get the index from the url of the post request
    let index = reqUrl.split('/')[4];

    //get our array of blogs
    fs.readFile('public/assets/blogs.json', (err, data) => {
        if (err) throw err;
        //parses data from json file into a useable array format
        let jsonArray = JSON.parse(data);
        //add comment to specific blog by id
        comment = new Comment(content,author);
        jsonArray[index -1].comments.push(comment);

        newJsonArray = JSON.stringify(jsonArray);
        //save the blogs back to file
        fs.writeFile("public/assets/blogs.json", newJsonArray, () => {});

        res.redirect(`/blog/${index}`);
    });
    }
    
});

app.listen(port, () => console.log(`Listening on ${port}`));

