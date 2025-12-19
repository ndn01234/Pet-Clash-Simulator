const express = require("express")
const sequelize = require("./config/database")
const Pet = require("./models/Pet")

const app = express()
app.set("view engine", "ejs")

app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.get("/", async (req, res) => {
  const pets = await Pet.findAll()
  res.render("index", { pets })
})

app.post("/pets", async (req, res) => {
  const { name, type } = req.body

  const imageMap = {
    Dog: "https://png.pngtree.com/png-clipart/20231021/original/pngtree-cute-cartoon-dog-png-file-png-image_13395067.png",
  Cat: "https://png.pngtree.com/png-clipart/20231002/original/pngtree-cute-cartoon-cat-png-image_13060428.png",
  Bird: "https://static.vecteezy.com/system/resources/thumbnails/048/880/982/small/happy-cute-bird-image-cartoon-style-png.png",
  Tiger: "https://i.pinimg.com/736x/89/b1/85/89b185ef3514d04cea0bd812f9fef8a4.jpg",
  Snake: "https://static.vecteezy.com/system/resources/previews/049/159/620/non_2x/smiling-snake-3d-cartoon-image-png.png",
  Chipmunk: "https://c7.uihere.com/files/389/376/868/chipmunk-cartoon-eastern-gray-squirrel-clip-art-cute-squirrel-cartoon-png-clipart-image.jpg",
  Elephant: "https://png.pngtree.com/png-clipart/20241026/original/pngtree-cute-cartoon-baby-elephant-clipart-illustration-perfect-for-childrens-books-and-png-image_16511956.png"
}

  await Pet.create({
    name,
    type,
    image: imageMap[type],
    hunger: 50,
    happiness: 50,
    energy: 50
  })

  res.redirect("/")
})

app.get("/battle/:id", async (req, res) => {
  const petA = await Pet.findByPk(req.params.id)
  const pets = await Pet.findAll()

  if (pets.length < 2) {
    return res.json({ result: "Not enough pets to battle" })
  }

  let petB
  do {
    petB = pets[Math.floor(Math.random() * pets.length)]
  } while (petB.id === petA.id)

  const powerA = Math.floor(
    petA.energy * 0.4 + petA.happiness * 0.4 - petA.hunger * 0.2
  )
  const powerB = Math.floor(
    petB.energy * 0.4 + petB.happiness * 0.4 - petB.hunger * 0.2
  )

  const result =
    powerA > powerB
      ? `${petA.name} wins against ${petB.name}!`
      : `${petB.name} wins against ${petA.name}!`

  res.json({ result })
})

sequelize.sync().then(() => {
  app.listen(3000, () =>
    console.log("Server running on http://localhost:3000")
  )
})

app.post('/pets/delete/:id', async (req, res) => {
  await Pet.destroy({ where: { id: req.params.id } })
  res.redirect('/')
})

app.post("/pets/action/:id", async (req, res) => {
  const { action } = req.body
  const pet = await Pet.findByPk(req.params.id)

  if (!pet) return res.redirect("/")

  switch (action) {
    case "eat":
      pet.hunger = Math.max(0, pet.hunger - 20)
      pet.energy = Math.min(100, pet.energy + 10)
      pet.happiness = Math.min(100, pet.happiness + 5)
      break

    case "play":
      pet.happiness = Math.min(100, pet.happiness + 15)
      pet.energy = Math.max(0, pet.energy - 10)
      break

    case "sleep":
      pet.energy = Math.min(100, pet.energy + 25)
      pet.happiness = Math.min(100, pet.happiness + 5)
      break

    case "hunt":
      pet.hunger = Math.max(0, pet.hunger - 10)
      pet.energy = Math.max(0, pet.energy - 15)
      break

    case "toilet":
      pet.happiness = Math.min(100, pet.happiness + 5)
      break
  }

  await pet.save()
  res.redirect("/")
})
