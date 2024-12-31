import express from "express"; //simplifies building and managing web servers
import bodyParser from "body-parser"; //simplifies parsing body of incoming requests
import cors from "cors";
import OpenAI from 'openai';
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
 
const openai = new OpenAI({
    apiKey: ''
     //apiKey: process.env.OPENAI_API_KEY // This is the default when it stored as an environment variable
});
const app = express();  //create a new express app
const port = 3000; //

app.use(bodyParser.json());  //automatically parse incoming request bodies that are in JSON format
app.use(cors());  


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/hypnosisAudio", async (req, res) => {
  try {
    // Path to the previously saved audio file
    const audioFilePath = path.join(__dirname, "generated_audio.mp3");

    // Check if the file exists
    if (!fs.existsSync(audioFilePath)) {
      return res.status(404).json({ error: "Audio file not found" });
    }

    setTimeout(() => {
      const audioData = fs.readFileSync(audioFilePath);

      // Send the saved audio file
      res.set("Content-Type", "audio/mp3");
      res.send(Buffer.from(audioData));

      console.log("Saved audio file sent successfully:", audioFilePath);
    }, 4000); // 2000 ms = 2 seconds
    
  } catch (error) {
    console.error("Error sending audio file:", error);
    res.status(500).json({ error: "An error occurred while sending the audio file" });
  }
});


// app.post("/hypnosisAudio", async (req, res) => {
//   try {
//      const { messages } = req.body;

//     const response = await openai.chat.completions.create({
//       model: "gpt-4o-audio-preview",
//       modalities: ["text", "audio"],
//       audio: { voice: "onyx", format: "mp3" },
//         messages: [
//             {role: "user", content: "using the conversation generate a very short smoking cessation hypnotherapy script"}],
//     });

//     // Your existing code
//     const audioData = Buffer.from(response.choices[0].message.audio.data, "base64");

//     res.set("Content-Type", "audio/mp3");
//     res.send(audioData); // Send raw binary data
      
//   } catch (error) {
//     console.error("Error generating audio:", error);
//     res.status(500).json({ error: "An error occurred while generating audio" });
//   }
//    console.log("audio api sent result")

// });


app.post("/complexreflection", async (req, res) => {

    const { messages } = req.body;  //get the messages from the request body

    const completion = await openai.chat.completions.create({   //send the messages to GPT
    model: "gpt-4o-mini",
        messages: [
       {role: "system", content: "The following is an interaction between you and a user. You are a therapist and the user is someone having smoking issues. Give a SHORT reflection to the user's response. The reflection must be a plausible guess or assumption about the user's underlying emotions, values, or chain of thought. The reflection must be very short. The reflection must be a statement and not a question."},
            // {role: "user", content: `${message}`},
            ...messages 
    ]
    })

    res.json({  //send the completion back to the frontend
        completion: completion.choices[0].message.content
    })

    console.log("complex reflection api sent result");
    
});


app.post("/hypnosisscript", async (req, res) => {

    const { messages } = req.body;  //get the messages from the request body

    const completion = await openai.chat.completions.create({   //send the messages to GPT
    model: "gpt-4o-mini",
        messages: [
       {role: "system", content: "The following is an interaction between you and a user. Use this information to generate a hypnotherapy script to help the user quit smoking."},
            // {role: "user", content: `${message}`},
            ...messages 
    ]
    })

    res.json({  //send the completion back to the frontend
        completion: completion.choices[0].message.content
    })

    console.log("hypnotherapy api sent result");
    
});

app.listen(port, () => {  //start the server at port 3000
    console.log(`exammple app listening at http://localhost:${port}`);
}); 