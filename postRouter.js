const express = require('express');

const Hubs = require('./data/db.js');

const router = express.Router();

//1. post request of post
router.post('/', (req, res) => {
    const postData = req.body;

    Hubs.insert(postData)
        .then(post => {
            if(!postData.title || !postData.contents) {
                res.status(400).json({message: "please fill in title and contents"})
            } else {
                res.status(201).json(postData)
            }
        })
        .catch(err => {
            res.status(500).json({message: "server error adding post"})
        })
});

//2. post request of comment
router.post('/:id/comments', (req, res) => {
    const comment = req.body;
    const {id} = req.params;

    Hubs.insertComment(comment) 
        .then(comm => {
            if (comment.id === !id) {
                res.status(404).json({message: "the post with that id does not exist"})
            } else if (!comment.text) {
                res.status(400).json({message: "please include text property"})
            } else {
                res.status(201).json(comment)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: "server error adding comment"})
        })
});

//3. get request of posts:
router.get('/', (req, res) => {
    Hubs.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            res.status(500).json({message: "error finding posts"})
        })
});

//4. get post by id:

router.get('/:id', (req, res) => {
    const {id} = req.params;

    Hubs.findById(id)
        .then(post => {
            if(!post) {
                res.status(404).json({message: "post with that id does not exist"})
            } else {
                res.status(200).json(post);
            }
        })
        .catch(err => {
            res.status(500).json({message: "server error getting post"})
        })
})

//5. get comments on post

router.get('/:id/comments', (req, res) => {
    const {id} = req.params;

    Hubs.findPostComments(id)
        .then(comments => {
            if(!comments) {
                res.status(404).json({message: "post with that id doesn't exist"})
            } else {
                res.status(200).json(comments)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err: "server error"})
        })
})

//6. delete post 

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    Hubs.remove(id)
        .then(deleted => {
            if(deleted.id === !id) {
                res.status(404).json({err: "post with given id does not exist"})
            } else {
                res.status(200).json(deleted)
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({err: "server error deleting post"})
        })
 });

 //7. put request on a post

 router.put('/:id', (req, res) => {
     const {id} = req.params;
     const edit = req.body;

     Hubs.update(id, edit)
        .then(updated => {
            if(updated.id != id){
                res.status(404).json({err: "post with that id is not found"})
            } else if(!edit.title || !edit.contents) {
                res.status(400).json({err: "missing title and contents"})
            } else {
                res.status(200).json(edit);
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({err: "server error editing post"})
        })
 })




module.exports = router;