const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(newRepository);

  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  console.log(title)

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: "project not found" })
  }

  const newRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes,
  }

  repositories[repoIndex] = newRepository;

  return response.json(newRepository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if(repoIndex < 0) {
    return response.status(400).json({ error: "repository not found" })
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send(); 
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const isRepositoryExists = repositories.find(repository => repository.id == id);

  if(!isRepositoryExists) {
    return response.status(400).json({ error: "repository not found" })
  }

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  const newRepository = {
    ...repositories[repoIndex], 
    likes: repositories[repoIndex].likes + 1,
  }

  repositories[repoIndex] = newRepository;

  return response.json(newRepository);
});

module.exports = app;