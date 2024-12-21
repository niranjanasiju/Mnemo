import React, { useState, useEffect } from 'react';
import './StoryStyles.css';

const StoryCompletion = () => {
    const [story, setStory] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Fetch story data from an API or local JSON file
        fetch('/path/to/story-data')
            .then((res) => res.json())
            .then((data) => setStory(data));
    }, []);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setFeedback(option === story.correctOption ? 'Correct!' : 'Try again.');
    };

    return (
        <div className="story-completion-container">
            <h2>Complete the Story</h2>
            <p>{story.incompleteText}</p>
            <div className="options">
                {story.options?.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={option === selectedOption ? 'selected' : ''}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className="feedback">{feedback}</p>
        </div>
    );
};

export default StoryCompletion;