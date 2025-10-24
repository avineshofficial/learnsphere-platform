import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt, faStar as faStarEmpty } from '@fortawesome/free-solid-svg-icons';
import './Rating.css';

function Rating({ value, text }) {
    return (
        <div className="rating">
            <span>
                <FontAwesomeIcon icon={value >= 1 ? faStar : value >= 0.5 ? faStarHalfAlt : faStarEmpty} />
            </span>
            <span>
                <FontAwesomeIcon icon={value >= 2 ? faStar : value >= 1.5 ? faStarHalfAlt : faStarEmpty} />
            </span>
            <span>
                <FontAwesomeIcon icon={value >= 3 ? faStar : value >= 2.5 ? faStarHalfAlt : faStarEmpty} />
            </span>
            <span>
                <FontAwesomeIcon icon={value >= 4 ? faStar : value >= 3.5 ? faStarHalfAlt : faStarEmpty} />
            </span>
            <span>
                <FontAwesomeIcon icon={value >= 5 ? faStar : value >= 4.5 ? faStarHalfAlt : faStarEmpty} />
            </span>
            <span className="rating-text">{text && text}</span>
        </div>
    );
}

export default Rating;