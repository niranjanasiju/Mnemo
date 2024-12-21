import React, { useState, useEffect } from 'react';
import './StoryStyles.css';

const StoryCompletion = () => {
    const sampleStory = {
        incompleteText: "Once upon a time in a land far away, there lived a dragon who loved to...",
        options: ["fly", "swim", "dance", "sing"],
        correctOption: "sing"
    };
    const [story, setStory] = useState(sampleStory);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [fontSize, setFontSize] = useState(24);

    
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setFeedback(option === story.correctOption ? 'Correct!' : 'Try again.');
    };

    const handleQuit = () => {
        setSelectedOption(null);
        setFeedback('');
    };

    const handleFontSizeChange = (event) => {
        setFontSize(event.target.value);
    };

    return (
        <>
            <div className="font-size-slider">
                <label htmlFor="fontSize">Font Size: {fontSize}px</label>
                <input
                    type="range"
                    id="fontSize"
                    min="16"
                    max="36"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                />
            </div>
            <h2 style={{ fontSize: `${fontSize}px` }}>Complete the Story</h2>
            <p style={{ fontSize: `${fontSize}px` }}>{story.incompleteText}</p>
            <div className="options">
                {story.options?.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={option === selectedOption ? 'selected' : ''}
                        style={{ fontSize: `${fontSize}px` }}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className="feedback" style={{ fontSize: `${fontSize}px` }}>{feedback}</p>
            <button className="quit-button" onClick={handleQuit} style={{ fontSize: `${fontSize}px` }}>
                Quit
            </button>
        </>
    );
};

export default StoryCompletion;