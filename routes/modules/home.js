const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

router.get('/', (req, res) => {
  // 查詢多筆資料是 findAll()，如果不帶參數，會預設撈出整張表的資料
  return Todo.findAll({
    // 把資料轉換成單純 JS 物件，需要將這包參數{ raw: true, nest: true}傳給 findAll()，才能在樣板裡使用資料
    raw: true,
    nest: true
  })
    .then((todos) => { return res.render('index', { todos: todos }) })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router