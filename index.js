const express = require('express')
const fs = require('fs')

const app = express()

const filePath = 'users.json'

app.use(express.json())
app.use(express.static(__dirname + '/public'))

// Получение всех пользователей
app.get('/users', (req, res) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const users = JSON.parse(content)
  res.json(users)
})

// Получение одного пользователя
app.get('/users/:id', (req, res) => {
  const id = req.params.id

  const content = fs.readFileSync(filePath, 'utf8')
  const users = JSON.parse(content)
  let userGet = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id == id) {
      userGet = users[i]
      break
    }
  }
  
  userGet ? res.json(userGet) : res.status(404).send('Пользователь не найден!')
})

// Добавление пользователя в список
app.post('/users', (req, res) => {
  if (!req.body) return res.status(404).send('Введите данные!')

  const {name, age} = req.body
  
  let data = fs.readFileSync(filePath, 'utf8')
  let users = JSON.parse(data)

  let id = Math.max.apply(Math, users.map(o => o.id))

  const user = { id: ++id, name, age }

  users.push(user)
  data = JSON.stringify(users)

  fs.writeFileSync(filePath, data)
  
  res.json(user)
})

// Удаление пользователя из списка
app.delete('/users/:id', (req, res) => {
  const id = req.params.id

  let data = fs.readFileSync(filePath, 'utf8')
  let users = JSON.parse(data)
  let index = -1

  for (let i = 0 ; i < users.length; i++){
    if (users[i] == id) {
      index = i
      break
    }
  }

  if (index > -1) {
    const user = users.splice(index, 1) // [0]
    data = JSON.stringify(users)
    fs.writeFileSync(filePath, data)
    res.json(user)
  } else {
    res.status(404).send('Ошибка...')
  }
})

// Изменяем пользователя
app.put("/users", (req, res) => {
    if(!req.body) return res.sendStatus(400)
      
    const userId = req.body.id
    const userName = req.body.name
    const userAge = req.body.age
      
    let data = fs.readFileSync(filePath, "utf8")
    const users = JSON.parse(data)
    let user
    for (let i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
            user = users[i]
            break
        }
    }

    if( user ) {
        user.age = userAge
        user.name = userName
        data = JSON.stringify(users)
        fs.writeFileSync("users.json", data)
        res.json(user)
    }
    else {
        res.status(404).send(user)
    }
})

app.listen(3000, () => console.log('Start!'))