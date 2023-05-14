import { useState } from "react";
import Select from "react-select";
import Loader from "./components/Loader/Loader";
import { Configuration, OpenAIApi } from "openai";

import "./App.css";

const options = [
  { value: "MongoDB", label: "MongoDB" },
  { value: "SQL", label: "SQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MariaDB", label: "MariaDB" },
  { value: "Firebase", label: "Firebase" },
  { value: "Prisma", label: "Prisma" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "DynamoDB", label: "DynamoDB" },
];

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_Open_AI_Key,
});

const openai = new OpenAIApi(configuration);

function App() {

  const [DB, setDB] = useState({ label: "", value: "" });
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const [copySuccess, setCopySuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDB = (option) => {
    setCopySuccess(false);
    setDB({ label: option.label, value: option.value });
  };


  const getQuery = (e) => {
    setCopySuccess(false);
    setQuery(e.target.value);
  };


  const generateQuery = async () => {
    setCopySuccess(false);
    setLoading(true);
    let newQuery = `Create a ${DB.value} request to ${query.charAt(0).toLowerCase() + query.slice(1)
      }:`;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: newQuery,
      temperature: 0.3,
      max_tokens: 60,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    setLoading(false);
    setResult(response.data.choices[0].text || "");

  };
  return (
    <div className="App">
      <h1>Database Query Generator!</h1>
      <div className="app-inner">
        <Select
          placeholder="Select Your Database.."
          options={options}
          className="react-select"
          onChange={getDB}
        />

        <textarea
          rows={4}
          className="query-input"
          placeholder={`Enter your Database Query. \n\nFor Example, find all users who live in California and have over 1000 credits..`}
          onChange={getQuery}
        />

        <button
          disabled={loading}
          onClick={generateQuery}
          className="generate-query"
        >
          Generate Query
        </button>
        {!loading ? (
          result.length > 0 ? (
            <div className="result-text">
              <div className="clipboard">
                <p>Here is your Query!</p>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                    setCopySuccess(true);
                  }}
                >
                  {copySuccess ? "Copied" : "Copy"}
                </button>
              </div>
              <p>{result}</p>
            </div>
          ) : (
            <></>
          )
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}

export default App;