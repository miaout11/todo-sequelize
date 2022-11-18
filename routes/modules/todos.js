const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// detail page
router.get('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({
    where: { id, UserId }
  })
    // 把資料轉換成 plain object 的方法，只需要直接在傳入樣板前加上 toJSON()
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

module.exports = router



// 查詢單筆資料：要在 res.render 時在物件實例 todo 後串上 todo.toJSON()。
// 查詢多筆資料：要在 findAll({ raw: true, nest: true}) 直接傳入參數