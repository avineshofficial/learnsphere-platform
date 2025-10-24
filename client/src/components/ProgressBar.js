import React from 'react';
import './ProgressBar.css';

function ProgressBar({ progress }) {
    // Ensure progress is a number between 0 and 100
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="progress-bar-container">
            <div 
                className="progress-bar-filler"
                style={{ width: `${clampedProgress}%` }}
            >
                <span className="progress-bar-label">{`${Math.round(clampedProgress)}%`}</span>
            </div>
        </div>
    );
}

export default ProgressBar;