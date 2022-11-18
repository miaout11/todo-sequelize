const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// new page
router.get('/new', (req, res) => {
  return res.render('new')
})
// create todo
router.post('/', (req, res) => {
  const UserId = req.user.id  // 增加限制條件，只有登入者本人可以增刪找查到自己的資料
  const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name, UserId }) // call Todo 直接新增資料
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

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

// edit page
router.get('/:id/edit', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({
    where: { id, UserId }
  })
    .then(todo => res.render('edit', { todo: todo.toJSON() }))
    .catch(error => console.error(error))
})
// update todo
router.put('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  const { name, isDone } = req.body
  return Todo.findOne({
    where: { id, UserId }
  })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.error(error))
})

// delete todo
router.delete('/:id', (req, res) => {
  const UserId = req.user.id
  const id = req.params.id
  return Todo.findOne({
    where: { id, UserId }
  })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router



// 查詢單筆資料：要在 res.render 時在物件實例 todo 後串上 todo.toJSON()。
// 查詢多筆資料：要在 findAll({ raw: true, nest: true}) 直接傳入參數