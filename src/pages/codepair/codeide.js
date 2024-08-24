import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import Select from 'react-select'
import { useWindowSize } from 'react-use';
import { SpinnerLoading } from '../../components/spinner';
import { useHistory } from 'react-router';

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
// import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'
import Confetti from 'react-confetti'
import { Button, Icon } from 'semantic-ui-react'
import "semantic-ui-css/components/button.min.css";
import $ from 'jquery';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { faChevronRight, faRandom } from '@fortawesome/free-solid-svg-icons';

import { useTimer } from 'react-timer-hook';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/mode-c_cpp';
import './code.css'

const firebaseConfig = {
  apiKey: "AIzaSyB4DdltYjD_lfYmW5HuBOjdLUvPnI580DQ",
  authDomain: "protag-f9d58.firebaseapp.com",
  projectId: "protag-f9d58",
  storageBucket: "protag-f9d58.appspot.com",
  messagingSenderId: "824602613440",
  appId: "1:824602613440:web:c0c20f897491fd442abf25"
};

// init firebase
if (!firebase.apps.length) {
  // Initialize Firebase here
  firebase.initializeApp(firebaseConfig);
}

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') });


  return (
    <div style={{ textAlign: 'center', fontFamily: 'Poppins' }}>
      <p >Tick Tick!</p>
      <div style={{ fontSize: '40px', marginBottom: '20px', fontFamily: 'Poppins' }}>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

const codingQuestions = [
  {
    prompt: `    N people from 1 to N are standing in the queue at a movie ticket counter. It is a weird counter, as it distributes tickets to the 
    first K people and then the last K people and again first K people and so on, once a person gets a ticket moves out of the queue. 
    The task is to find the last person to get the ticket.`,
    solution: `function factorial(n) {
  if (n <= 1) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}`
  },
  {
    prompt: `    Given an array arr of distinct elements of size N, the task is to rearrange the elements of the array in a zig-zag fashion 
    so that the converted array should be in the below form: 

            arr[0] < arr[1]  > arr[2] < arr[3] > arr[4] < . . . . arr[n-2] < arr[n-1] > arr[n]. 
    
    NOTE: If your transformation is correct, the output will be 1 else the output will be 0. 
    Example 1:
      Input:
           N = 7
           Arr[] = {4, 3, 7, 8, 6, 2, 1}
           Output: 3 7 4 8 2 6 1
           Explanation: 3 < 7 > 4 < 8 > 2 < 6 > 1`,
    solution: `function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`
  },
  {
    prompt: `    Given an unsorted array A of size N that contains only positive integers, find a continuous sub-array that adds to a given number S and return the left and right 
    index(1-based indexing) of that subarray.In case of multiple subarrays, return the subarray indexes which come first on moving from left to right.
    Note:- You have to return an ArrayList consisting of two elements left and right. In case no such subarray exists return an array consisting of element -1.
    
    Example 1:
       Input:
         N = 5, S = 12
         A[] = {1,2,3,7,5}
         Output: 2 4
         Explanation: The sum of elements 
         from 2nd position to 4th position 
         is 12.`,
    solution: `function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`
  },
  // Add more coding questions here
];


const language = [
  { value: 'C', label: 'C' },
  { value: 'C++', label: 'C++' },
  { value: 'C#', label: 'C#' },
  { value: 'Java', label: 'Java' },
];

const CodeEditor = () => {
  const { user } = useAuthContext();
  const db = firebase.firestore();


  const time = new Date();
  time.setSeconds(time.getSeconds() + 2700);

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('Your Output will be seen here...');
  const history = useHistory();

  const [loading, setloading] = useState(true);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const { width, height } = useWindowSize()

  const [celebration, setcelebration] = useState(false);
  const selectRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * codingQuestions.length);
    const selectedQuestion = codingQuestions[randomIndex];
    setCurrentQuestion(selectedQuestion);
  };


  const [selectedLanguage, setSelectedLanguage] = useState(language[0]);



  useEffect(() => {
    console.log("Output:", output);
    selectRandomQuestion();
    setTimeout(() => {
      setloading(false);
    }, 2000);
  }, []);



  ///succefully submission
  const handleSubmit = () => {

    const firestore = firebase.firestore();
    //updating the points with 100EXP
    firestore
        .collection('users')
        .doc(user.uid)
        .update({
            points: firebase.firestore.FieldValue.increment(200)
        })
        .then(() => {
            console.log('User points updated successfully');
        })
        .catch((error) => {
            console.error('Error updating user points:', error);
        });
   
    //handling toast
    toast.success(
      <>
       
        <span>
          Congragulations ! As a token of our appreciation, we have credited your account with 200 EXP! 💰
        </span>
      </>,
      {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        
      }
    );
    
    console.log("Succesfully Submitted");
    setcelebration(true);
    setTimeout(() => {
      setcelebration(false);
      history.push('/codepair')
    }, 6000); // 6 seconds
    

    ///here firebase thing must startttt

  }

  const checkSolution = () => {
    if (currentQuestion && code.trim() !== '') {
      const expectedSolution = currentQuestion.solution;
      console.log("Solcueifea", expectedSolution)
      if (code === expectedSolution) {
        // User's solution is correct
        setOutput("Correct Answer");
      } else {
        // User's solution is incorrect
        setOutput("Incorrect Answer")
      }
    }
  };

  const executeCode = async () => {

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '200px', // Adjust the width to your desired size
    }),
    menu: (provided, state) => ({
      ...provided,
      fontSize: '14px', // Adjust the font size of the options
      width: '200px', // Adjust the width of the dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      width: '100%', // Adjust the width of the options (optional)
    }),
  };

  const settings = {
    async: true,
    crossDomain: true,
    url: 'https://ideas2it-hackerearth.p.rapidapi.com/compile/',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': 'b6b91bdf5fmshc9fe4bde67ab754p128db7jsndb022c31716c',
      'X-RapidAPI-Host': 'ideas2it-hackerearth.p.rapidapi.com'
    },
    data: {
      client_secret: 'ceaf93f10f7330318aecc742f76bda4fae74b12e',
      async: '0',
      source: 'int main() {   printf("Hel");   return 0; }',
      lang: 'C',
      time_limit: '10',
      memory_limit: '262144'
    }
  };

  console.log(selectedLanguage)

  return (
    <>

      {loading === true && (
        <div style={{ marginLeft: '750px', fontSize: '20px',marginTop:'300px',justifyContent: 'center', alignItems: 'center',}}>
          <SpinnerLoading />
        </div>
      )}
      {loading === false && (<><div>
        <MyTimer expiryTimestamp={time} />
      </div><label style={{ fontFamily: 'Poppins', paddingBottom: '10px', fontFamily: 'Poppins', justifyContent: 'center', alignContent: 'center', marginLeft: '1400px' }}>
          <span style={{ fontFamily: 'Poppins' }}>Language</span>
          <Select
            styles={customStyles}
            onChange={(option) => setSelectedLanguage(option)}
            options={language}
            value={selectedLanguage} />
        </label><div>
          <h3 style={{ fontFamily: 'Poppins' }}>Question:</h3>
          <div style={{ fontFamily: 'Poppins', background: 'lightgrey', padding: '20px', marginBottom: '20px', fontSize: '17px' }}>
            <pre>{currentQuestion?.prompt}</pre>
          </div>
        </div><div>
          <AceEditor
            mode="c_cpp"
            theme="github"
            value={code}
            onChange={(newCode) => setCode(newCode)}
            fontSize={17}
            width="100%"
            height="500px"
            name="code-editor"
            editorProps={{ $blockScrolling: true }} />

          <Button animated onClick={checkSolution} style={{ marginLeft: '1450px', margin: '20px' }}>
            <Button.Content visible style={{ fontFamily: 'Poppins' }}>E X E C U T E</Button.Content>
            <Button.Content hidden>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button.Content>
          </Button>

          {output === 'Correct Answer' && (
          <><Button animated onClick={handleSubmit} style={{ marginLeft: '1450px', margin: '20px' }}>
            
            <Button.Content visible style={{ fontFamily: 'Poppins' }}>S U B M I T</Button.Content>
            <Button.Content hidden>
              <FontAwesomeIcon icon={faChevronRight} />
            </Button.Content>
          </Button>
          <ToastContainer style={{ width: "1200px", fontFamily: 'Poppins' }} />
          {/* Toast Norification */}
              </>
          )}
          <div>
            <h3 style={{ fontFamily: 'Poppins' }}>Output:</h3>
            <div style={{ background: 'lightgrey', padding: '15px', marginTop: '10px', marginBottom: '70px', fontSize: '15px' }}>
              {code && (<pre style={{ fontFamily: 'Poppins' }}>{output}</pre>)}
              {code === '' && (
                <pre style={{ fontFamily: 'Poppins' }}>Output Comes Here</pre>
              )}
            </div>
          </div>
          {celebration && (
            <Confetti
              width={width}
              height={height}
            >
            </Confetti>
          )}

        </div></>
      )}
    </>
  );
};

export default CodeEditor;
