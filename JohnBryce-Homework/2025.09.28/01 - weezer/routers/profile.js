const express = require('express')

const profileUser = [{
    id: 1,
    name: 'Dean'
}]

const getProfile = (req, res, next) => {
    res.json(profileUser)
}

const newPost = (req, res, next) => {
    console.log('adding post...', req.query.id)
    res.end(`post ${req.query.id} has been added`)
}

const removePost = (req, res, next) => {
    console.log('removing post...', req.query.id)
    res.end(`post ${req.query.id} has been removed`)
}

const updatePost = (req, res, next) => {
    console.log('updating post...', req.query.id)
    res.end(`post ${req.query.id} has been updated`)
}

const profileRouter = express.Router()

profileRouter.get('/', getProfile)
profileRouter.post('/', newPost)
profileRouter.patch('/', updatePost)
profileRouter.delete('/', removePost)

module.exports = profileRouter


