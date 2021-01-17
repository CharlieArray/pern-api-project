const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./db");

//cant get nodemon to run

//middlewear
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a to-do item
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newToDo = await pool.query(
      "INSERT INTO todo(description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newToDo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all to-dos items
app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
  }
});

//get a specific to-do
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const specificTodo = await pool.query(
      "SELECT * FROM todo WHERE todo_id = $1",
      [id]
    );
    res.json(specificTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//update a to-do
app.put("/todos/:id", async(req,res)=>{
    try {
       const {id} = req.params; 
       const {description} = req.body;
       const updateTodo = await pool.query(
           "UPDATE todo SET description = $1 WHERE todo_id = $2",
           [description, id]
       );
        res.json("Todo was updated")

    } catch (error) {
        console.error(error.message)
    }
})

//delete a to-do
app.delete("/todos/:id", async(req,res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1",
        [id]
        )
        res.json("Todo was deleted")
    } catch (error) {
        console.log(error.message)
    }
})

app.listen(5000, () => {
  console.log(`Server has spun up on Port 5000`);
});
