
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const limits = {};

function today(){
  return new Date().toISOString().split("T")[0];
}

app.post("/ask", async (req,res)=>{
  const ip = req.ip;
  const date = today();
  const { question } = req.body;

  if(!limits[ip]) limits[ip] = {};
  if(!limits[ip][date]) limits[ip][date] = 0;

  if(limits[ip][date] >= 5){
    return res.json({answer:"Daily limit reached (5 questions). Come back tomorrow 💪"});
  }

  limits[ip][date]++;

  try{
    const response = await openai.responses.create({
      model:"gpt-4.1-mini",
      input:[
        {role:"system", content:"You are a professional fitness assistant. Only answer fitness related questions."},
        {role:"user", content:question}
      ]
    });

    res.json({answer:response.output[0].content[0].text});
  }catch(err){
    res.status(500).json({error:"Server error"});
  }
});

app.listen(5000, ()=> console.log("Server running on port 5000"));
