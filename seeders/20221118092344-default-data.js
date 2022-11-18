'use strict'
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '1234'
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 用 queryInterface.bulkInsert 來做大量資料的寫入
    return queryInterface.bulkInsert('Users', [{
      name: SEED_USER.name,
      email: SEED_USER.email,
      // bcrypt.hashSync 是 bcrypt.hash 的同步版本
      password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {})
      .then(userId => queryInterface.bulkInsert('Todos',
        Array.from({ length: 10 }).map((_, i) => ({
          name: `name-${i}`,
          UserId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        ), {}))
  },

  down: (queryInterface, Sequelize) => {
    // ，用 queryInterface.bulkDelete 做多筆資料刪除
    return queryInterface.bulkDelete('Todos', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}))
  }
}

// 在這裡因為是用字串的方法直接把資料表名稱傳給 bulkInsert 方法，所以不需要在文件最上方引入 model。也因為是資料表名稱，在資料庫的習慣是寫複數 Todos/Users。