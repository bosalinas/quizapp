import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Navigate} from 'react-router-dom';

import { QUERY_QUIZ } from '../../utils/queries';
import { UPDATE_SCORE } from '../../utils/mutations';
import { QUERY_USER } from '../../utils/queries';
import { QUERY_ME } from '../../utils/queries';
import { useQuery } from '@apollo/client';

import Auth from '../../utils/auth';
import "./Quiz.css";




const Quiz = () => {

    const username = Auth.loggedIn() ? Auth.getProfile().data.username : '';
    const { loading, data, error } = useQuery(QUERY_QUIZ);
    const { load, userData, err } = useQuery(username ? QUERY_USER : QUERY_ME, {
        variables: { username: username },
      });
    const quizzes = data?.quizzes || [];
    console.log(data)

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isQuizComplete, setIsQuizComplete] = useState(false);
    const [answer, setAnswer] = useState(null);
    const [result, setResult] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        console.error("Error fetching quiz data:", error);
        return <p>Error fetching quiz data.</p>;
    }


    const { question, answers, correct_answer } = quizzes[currentQuestion];

    // Quiz Logic ------------>

    const handleNextQuestion = () => {
        
        if (currentQuestion === quizzes.length - 1) {
            setIsQuizComplete(true);
            setInterval(()=>{
                window.location.href = "/me"
            })
            console.log("quiz is set to complete")
            setIsButtonDisabled(true);
        }
        if (currentQuestion < quizzes.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        }
        setSelectedAnswer(null);
        setResult((answer ? result + 1 : result));
        localStorage.setItem("scores", JSON.stringify(result + 1));
        console.log("result:", result);
        console.log("answer", answer);
    };

    const handleAnswerSelection = (answer, answerIndex) => {
        setSelectedAnswer(answerIndex);
        if (answer === correct_answer) {
            setAnswer(true);
        } else {
            setAnswer(false);
        }
    };

    // TODO:: SAVE SCORE ----------->

    const handleSavedScore = () => { 
      if (currentQuestion === quizzes.length - 1) {
            setIsQuizComplete(true);
            console.log("quiz is set to complete")
            console.log("this is the score")
            return <Navigate to="/me" />
            ;
            
        }
    
  }

    return (
        <div className='quizCard'>
            {Auth.loggedIn() ? (
                <div >
                    <div className='quiz'>
                        <div className='numbers'>
                            <span className='questionNum'>{currentQuestion + 1}</span> /
                            <span className='totalNum'>{quizzes.length}</span>
                        </div>
                        <h3>{question}</h3>
                        <ul className='quizChoices'>
                            {answers.map((answer, answerIndex) => (
                                <li key={answerIndex} className={`quizChoice ${selectedAnswer === answerIndex ? 'selected' : ''}`}
                                    onClick={() => handleAnswerSelection(answer, answerIndex)}>
                                    {answer}
                                </li>
                            ))}
                        </ul>
                        <div className='btn'>
                            {currentQuestion < quizzes.length - 1 ? (
                                <button onClick={handleNextQuestion}>Next</button>
                            ) : (

                                // TODO: REDIRECT TO PROFILE PAGE TO SEE SCORE? 
                                <button onClick={handleSavedScore} >Quiz complete! Go to Profile </button>
                            )} 
                        </div>
                        {isQuizComplete && (
                            <div className='results'>
                                <div>
                                    <p>Quiz is complete!</p>
                                    <p>Score:{result}</p>
                                    
                                </div>
                            </div>
                            
                        )}
                    </div>
                </div>
            ) : (   
            <div className='row'>
              <div className='Welcome'>
                <h1 className='welcomeType'>Welcome!</h1>
              </div>
            <img className="heroImage" src={require('../../assets/Frogboy.png')} alt="lilGuy" />
          </div>)
            }
        </div>
    );
};

//result is the user's score after completing the quiz. 
//totalScore is defined in the schema for User.
//TODO: how do we update User schema information with the results from the quiz


export default Quiz;