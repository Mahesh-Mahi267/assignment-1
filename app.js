const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const format = require("date-fns/format");
const isMatch = require("date-fns/isMatch");
var isValid = require("date-fns/isValid");
const app = express();
app.use(express.json());
let database;

const initializeDBAndServer = async () => {
try {
database = await open({
filename: path.join(__dirname, "todoApplication_db"),
driver: sqlite3.Database,
});

app.listen(3000, () =>
console.log("Server is running on http://localhost:3000/")
);
} catch (error) {
console.log(`DataBase error is ${error.message}`);
process.exit(1);
}
};

initializeDBAndServer();

const hasPriorityAndStatusProperties = (requestQuery) => {
    return {
        requestQuery.priority !== undefined && requestQuery.status !== undefined 
    };
};

const hasPriorityProperty = (requestQuery) => {
    return requestQuery.priority !== undefined;
};

const hasStatusProperty = (requestQuery) => {
    return requestQuery.status !== undefined;
};


const hasCategoryAndStatus = (requestQuery) => {
    return {
        requestQuery.category !== undefined && requestQuery.status !== undefined 
    };
};

const hasCategoryAndPriority = (requestQuery) => {
    return {
        requestQuery.category !== undefined && requestQuery.priority !== undefined 
    };
};

const hasSearchProperty = (requestQuery) => {
    return requestQuery.search_q !== undefined;
};

const hasCategoryProperty = (requestQuery) => {
    return requestQuery.category !== undefined;
};

const outPutResult = (dbObject) => {
    return {
        id: dbObject.id,
        todo: dbObject.todo,
        priority: dbObject.priority,
        category:dbObject.category,
        status:dbObject.status,
        dueDate: dbObject.due_date,
    };
};


const has

app.get("/todos/", async (request, response)=> {
let data = null;
let getTodosQuery = "";
const {search_q = "", priority, status, category } = request.query;
switch(true) {
case hasPriorityAndStatusProperties(request.query);
if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE"
) {
getTodosQuery = `SELECT * FROM todo WHERE status = '${status}' AND priority = '${priority}';`;
data = await database.all(getTodosQuery);
response.send(data.map((eachItem) => outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Todo Status");
}

} else {
response.status(400);
response.send("Invalid Todo Priority");
}

break;
case hasCategoryAndStatus(request.query);;
if (
category === "HIGH" ||
category === "HOME" ||
category === "LEARNING"
) {
if (
status === "TO DO" ||
status === "IN PROGRESS" ||
status === "DONE"
) {
getTodosQuery = `SELECT * FROM todo WHERE category = '${category}' and status = '${status}';`;
data = await database.all(getTodosQuery);
response.send(data.map((eachItem)=> outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Todo Status");
}

} else {
response.status(400);
response.send("Invalid Todo Category");
}
break;

case hasCategoryAndPriority(request.query);
if (
category === "WORK" ||
category === "HOME" ||
category === "LEARNING"
) {
if (
priority === "HIGH" ||
priority === "MEDIUM" ||
priority === "LOW"
) {
getTodosQuery = `SELECT * FROM todo WHERE category = '${category}' AND priority = '${priority}';`;
data = await database.all(getTodosQuery);
response.send(data.map((eachItem)=> outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Todo Priority");
}
} else {
response.status(400);
response.send("Invalid Todo Category");
}

break;

case hasPriorityProperty(request.query);
if (priority === "HIGH" || priority === "MEDIUM" priority === "LOW") {
getTodosQuery = `
SELECT * FROM todo WHERE priority = '${priority}';`;
data database.all(getTodosQuery);
response.send(data.map((eachItem) => outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Todo Priority");
}
break;

case hasStatusProperty(request.query);
if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
getTodosQuery = `SELECT * FROM todo WHERE status = '${status}';`;
data database.all(getTodosQuery);
response.send(data.map((eachItem) => outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Todo Status");
}
break;

case hasSearchProperty(request.query);
hetTodosQuery = `SELECT * FROM todo WHERE like '%${search_q};';`;
data = await database.all(getTodosQuery);
response.send(data.map((eachItem)=> outPutResult(eachItem)));
break;

case hasCategoryProperty(request.query);
if (
category === "WORK" ||
category === "HOME" ||
category === "LEARNING"
) {
getTodosQuery = `SELECT * FROM todo WHERE category = '${category}';`;
data = await database.all(getTodosQuery);
response.send(data.map((eachItem) => outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Todo Category");
}
break;

default:
getTodosQuery = `SELECT * FROM todo;`;
data = await database.all(getTodosQuery);
response.send(data.map((eachItem) => outPutResult(eachItem)));


}
});


app.get("/todos/:todoId/", async (request, response) => {
const {todoId} = request.params;
const getTodoQuery = `
SELECT
*
FROM
todo
WHERE
todoId = ${todoId};`;
const TodoArray = await database.get(getTodoQuery);
response.send(outPutResult(TodoArray));
});

app.get("/agenda/", async (request, response)=>{
const {date} = request.query;
console.log(isMatch(date, "yyyy-MM-dd"));

if (isMatch(date, "yyyy-MM-dd")) {
const newDate = format(new Date(date), "yyyy-MM-dd");
console.log(newDate);
const requestQuery = `
SELECT
*
FROM
todo
WHERE
due_date = '${newDate}';`;
const responseResult = await database.all(requestQuery);
response.send(responseResult.map((eachItem) =>outPutResult(eachItem)));
} else {
response.status(400);
response.send("Invalid Due Date");
}
});

app.post("/todos/", async (request, response) => {
const {id, todo, status, priority, category, dueDate} = request.body;
if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
if (
category === "WORK" ||
category === "HOME" ||
category === "LEARNING" 
) {
if (isMatch(dueDate, "yyyy-MM-dd")) {
const postNewDueDate = format(new Date(dueDate), "yyyy-MM-dd");
const postTodosQuery = `
INSERT INTO
todo (id, todo, priority, status, category, due_date)
VALUES
(${id}, '${todo}', '${priority}', '${status}', '${category}', '${postNewDueDate}');`;
await database.run(postTodosQuery);
response.send("Todo Successfully Added");
} else {
response.status(400);
response.send("Invalid Due Date");
}
} else {
response.status(400);
response.send("Invalid Todo Category");
}
} else {
response.status(400);
response.send("Invalid Todo Priority");
}
} else {
response.status(400);
response.send("Invalid Todo Status");
}



});

app.put("/todos/:todoId/", async (request, response) => {
const {todoId} = request.params;

let updateColumn "";
const requestQuery = request.body;
console.log(requestBody);

const previousTodoQuery = `SELECT * FROM todo WHERE id = ${todoId};`;
const previousTodo = await database.get(previousTodoQuery);

const {
todo = previousTodo.todo,
priority = previousTodo.priority,
status = previousTodo.status,
category = previousTodo.category,
dueDate = previousTodo.dueDate,
} = request.body;

let updateTodoQuery;
switch(true) {
case requestBody.status !== undefined:
if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
updateTodoQuery = `
UPDATE todo SET todo = '${todo}', priority = '${priority}', status = '${status}', category = '${category}',
due_date = '${dueDate}' WHERE id = ${todoId};`;
await database.run(updateTodoQuery);
response.send("Status Updated");
} else {
response.status(400);
response.send("Invalid Todo Status");
}

break;

const requestBody.priority !== undefined:
if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
updateTodoQuery = `
UPDATE todo SET todo = '${todo}', priority = '${priority}', status = '${status}', category = '${category}',
due_date = '${dueDate}' WHERE id = ${todoId};`;
await database.run(updateTodoQuery);
response.send(`Priority Updated`);
} else {
response.status(400);
response.send("Invalid Todo Priority");
}
break;

case requestBody.todo !== undefined:
updateTodoQuery = `
UPDATE todo SET todo = '${todo}', priority = '${priority}', status = '${status}', category = '${category}',
due_date = '${dueDate}' WHERE id = ${todoId};`;

await database.run(updateTodoQuery);
response.send("Todo Updated");
break;

case requestBody.category !== undefined:
if (
category === "WORK" ||
category === "HOME" ||
category === "LEARNING"
) {
updateTodoQuery = `
UPDATE todo SET todo = '${todo}', priority = '${priority}', status = '${status}', category = '${category}',
due_date = '${dueDate}' WHERE id = ${todo};`;

await database.run(updateTodoQuery);
response.send("Category Updated");

} else {
response.status(400);
response.send("Invalid Todo Category");
}
break;

case requestBody.dueDate !== undefined:
if (isMatch(dueDate, "yyyy-MM-dd")) {
const newDueDate = format(new Date(dueDate), "yyyy-MM-dd");
updateTodoQuery = `
UPDATE todo SET todo = '${todo}', priority = '${priority}', status = '${status}', category = '${category}',
due_date = '${newDueDate}' WHERE id = ${todoId};`;
await database.run(updateTodoQuery);
response.send("Due Date Updated");
} else {
response.status(400);
response.send("Invalid Due Date");
}
break;


}
});

app.delete("/todos/:todoId/", async (request, response) => {
const {todoId} = request.params;
const deleteTodosQuery = `
DELETE FROM
todo
WHERE
id = ${todoId};`;
await database.run(deleteTodosQuery);
response.send("Todo Deleted");
});

module.exports = app;