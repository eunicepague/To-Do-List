import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.scss';
import Delete from './assets/delete-icon.png';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [lastId, setLastId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const getTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      const data = await response.data;
      setTasks(data); // Pass the data to setTasks
      console.log(data);
      const maxId = Math.max(...data.map((task) => task.id));
      setLastId(isNaN(maxId) ? 0 : maxId); //set lastId to the highest id
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === '') {
      console.error('Input cannot bee empty');
      setErrorMessage('Input cannot be empty*');
      return;
    }
    setErrorMessage('');

    try {
      const newTask = {
        id: String(lastId + 1), //convert the id to string
        text: input,
      };

      const response = await axios.post(`http://localhost:3000/tasks`, newTask);
      setTasks([...tasks, response.data]); //add the new task to the state.
      setInput(''); //clear the input field.
      setLastId(lastId + 1); //update lastId
    } catch (error) {
      console.error('Error creating new task: ', error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id); // Add this line
    try {
      await axios.delete(`http://localhost:3000/tasks/${id}`);
      getTasks(); // Fetch the list of tasks again
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  //if we use await fetch, we need to use await response.json() to parse the response body as JSON
  //if we use axios.get, we dont ned to use the response.json() anymore, instead const data = await response.data; nalang.

  return (
    <main className="todo-container">
      <section className="todo-content">
        <div className="todo-box">
          <h1 id="todo-h1">To-Do list 📋📝</h1>

          <form onSubmit={handleSubmit}>
            <div className="todo-input-container">
              <input
                type="text"
                className="todo-input"
                value={input}
                onChange={handleInputChange}
              />
              <button type="submit" id="todo-add-btn">
                Add
              </button>
            </div>
          </form>

          {errorMessage && <p id="error-msg">{errorMessage}</p>}

          {tasks.length === 0 ? (
            <p>Looks like there's no list, try to add one. 😇</p>
          ) : (
            tasks.map((task, index) => (
              <div key={index} className="todo-list-container">
                <div className="todo-list-content">
                  <input type="checkbox" id="todo-checkbox" />
                  <p id="todo-list-text">{task.text}</p>
                </div>

                <div className="todo-list-delete">
                  <img
                    src={Delete}
                    onClick={() => handleDelete(task.id)}
                    id="todo-delete"
                  />
                </div>
              </div>
            ))
          )}

          <div className="copyright">
            <h5>Copyright &copy; 2024 Eunice Pague. 💁🏻</h5>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
