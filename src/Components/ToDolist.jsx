import {
    TextField,
    Button,
    Typography,
    Checkbox,
    List,
    ListItem,
    Container,
    ButtonGroup,
    Box,
  } from "@mui/material";
  import { useEffect, useState } from "react";
  
  function App() {
    const [inputVal, setInputVal] = useState("");
    const [todos, setTodos] = useState([]);
    const [isEdited, setIsEdited] = useState(false);
    const [editedId, setEditedId] = useState(null);
    const [filter, setFilter] = useState("all");
  
    useEffect(() => {
      const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
      setTodos(savedTodos);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);
  
    const handleInputChange = (e) => setInputVal(e.target.value);
  
    const handleClick = () => {
      if (inputVal.trim() === "") return;
  
      if (isEdited) {
        setTodos((prev) =>
          prev.map((todo) =>
            todo.id === editedId ? { ...todo, val: inputVal } : todo
          )
        );
      } else {
        setTodos((prev) => [
          ...prev,
          { val: inputVal, isDone: false, id: Date.now() },
        ]);
      }
  
      setInputVal("");
      setIsEdited(false);
      setEditedId(null);
    };
  
    const handleDelete = (id) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };
  
    const handleToggleDone = (id) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
        )
      );
    };
  
    const handleEdit = (id) => {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      setInputVal(todo.val);
      setEditedId(id);
      setIsEdited(true);
    };
  
    const filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.isDone;
      if (filter === "completed") return todo.isDone;
      return true;
    });
  
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <TextField
          variant="outlined"
          onChange={handleInputChange}
          label="Type your task"
          value={inputVal}
          sx={{ width: "70%", mb: 3 }}
        />
        <Button
          size="large"
          variant={isEdited ? "outlined" : "contained"}
          color="primary"
          onClick={handleClick}
          sx={{ height: 55, mb: 3, ml: 2 }}
          disabled={!inputVal.trim()}
        >
          {isEdited ? "Edit Task" : "Add Task"}
        </Button>
  
        <Box sx={{ mb: 2 }}>
          <ButtonGroup variant="text" color="primary">
            <Button onClick={() => setFilter("all")} disabled={filter === "all"}>
              All
            </Button>
            <Button
              onClick={() => setFilter("active")}
              disabled={filter === "active"}
            >
              Active
            </Button>
            <Button
              onClick={() => setFilter("completed")}
              disabled={filter === "completed"}
            >
              Completed
            </Button>
          </ButtonGroup>
        </Box>
  
        <List>
          {filteredTodos.map((todo) => (
            <ListItem
              key={todo.id}
              divider
              sx={{
                width: "80%",
                mx: "auto",
                display: "flex",
                justifyContent: "space-between",
                border: "1px solid lightgray",
                alignItems: "center",
                py: 1,
              }}
            >
              <Checkbox
                onClick={() => handleToggleDone(todo.id)}
                checked={todo.isDone}
              />
              <Typography
                sx={{
                  width: "70%",
                  wordWrap: "break-word",
                  color: todo.isDone ? "green" : "black",
                }}
              >
                {todo.val}
              </Typography>
              <Box>
                <Button
                  onClick={() => handleEdit(todo.id)}
                  variant="contained"
                  sx={{ ml: 1 }}
                  disabled={todo.isDone}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(todo.id)}
                  color="secondary"
                  variant="contained"
                  sx={{ ml: 1 }}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Container>
    );
  }
  
  export default App;
  