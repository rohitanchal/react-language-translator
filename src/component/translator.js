import React, { useState } from "react";
import "./translator.css";
import languageList from "./language.json";

export default function Translator() {
    const [inputFormat, setInputFormat] = useState("en");
    const [outputFormat, setOutputFormat] = useState("hi");
    const [translatedText, setTranslatedText] = useState("Translation");
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReverseLanguage = () => {
        setInputFormat(outputFormat);
        setOutputFormat(inputFormat);
        setInputText("");
        setTranslatedText("Translation");
    };

    const handleRemoveInputText = () => {
        setInputText("");
        setTranslatedText("Translation");
    };

    const handleTranslate = async () => {
        if (!inputText.trim()) return;

        setLoading(true); 
        setTranslatedText("Translating...");

        const url = "https://microsoft-translator-text-api3.p.rapidapi.com/largetranslate?to=" + outputFormat + "&from=" + inputFormat;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-rapidapi-key": process.env.REACT_APP_API_KEY,
                "x-rapidapi-host": process.env.REACT_APP_API_HOST,
            },
            body: JSON.stringify({
                sep: "|",
                text: inputText,
            }),
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`API error: ${response.status}`);

            const result = await response.json();
            console.log("API Response:", result); // Debugging

            if (result && result.text) {
                setTranslatedText(result.text);
            } else {
                throw new Error("Invalid API response format");
            }
        } catch (error) {
            console.error("Translation Error:", error);
            alert("Translation failed. Please check your API key and try again.");
        }

        setLoading(false); 
    };

    return (
        <div className="container">
            <div className="row1">
                <select value={inputFormat} onChange={(e) => setInputFormat(e.target.value)}>
                    {Object.keys(languageList).map((key, index) => (
                        <option key={index} value={key}>
                            {languageList[key].name}
                        </option>
                    ))}
                </select>

                <svg className="reversesvg" onClick={handleReverseLanguage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"></path>
                </svg>

                <select
                    value={outputFormat}
                    onChange={(e) => {
                        setOutputFormat(e.target.value);
                        setTranslatedText("Translation");
                    }}
                >
                    {Object.keys(languageList).map((key, index) => (
                        <option key={index + 100} value={key}>
                            {languageList[key].name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="row2">
                <div className="inputText">
                    {inputText && (
                        <svg
                            className="removeinput"
                            onClick={handleRemoveInputText}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                        </svg>
                    )}
                    <textarea value={inputText} placeholder="Enter Text" onChange={(e) => setInputText(e.target.value)} />
                </div>
                <div className="outputText">{translatedText}</div>
            </div>

            <div className="row3">
                <button className="btn" onClick={handleTranslate} disabled={loading}>
                    {loading ? <i className="fa fa-spinner fa-spin"></i> : <span className="translate">Translate</span>}
                </button>
            </div>
        </div>
    );
}
