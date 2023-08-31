import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/pastes", async (_req, res) => {
    const result = await client.query("select * from paste_list");
    res.json(result.rows);
});

app.get("/pastes/:pasteId/comments", async (req, res) => {
    const pasteId = req.params.pasteId;
    const result = await client.query(
        "select * from all_comments where paste_id = $1",
        [pasteId]
    );
    res.json(result.rows);
});

app.post("/pastes", async (req, res) => {
    const { title, description } = req.body;
    const newPaste = await client.query(
        "insert into paste_list (title, description) values ($1, $2) returning *",
        [title, description]
    );
    res.json(newPaste.rows);
});

// app.get("/health-check", async (_req, res) => {
//     try {
//         //For this to be successful, must connect to db
//         await client.query("select now()");
//         res.status(200).send("system ok");
//     } catch (error) {
//         //Recover from error rather than letting system halt
//         console.error(error);
//         res.status(500).send("An error occurred. Check server logs.");
//     }
// });

app.delete("/pastes/:id", async (req, res) => {
    const id = req.params.id;
    const queryResult = await client.query(
        "delete from paste_list where id = ($1) returning *",
        [id]
    );
    res.json(queryResult.rows);
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
