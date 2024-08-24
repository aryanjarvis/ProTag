import React, { useEffect, useState } from 'react';
import { Message } from 'semantic-ui-react';
import { SpinnerLoading } from '../../components/spinner';
import "semantic-ui-css/components/card.min.css";
import "semantic-ui-css/components/step.min.css";
import "semantic-ui-css/components/button.min.css";
import "semantic-ui-css/components/message.min.css";
import './code.css'
import { Avatar } from 'antd';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CodeEditor from './codeide';
import Select from 'react-select'
import { Button, Icon } from 'semantic-ui-react'
import { Card } from 'semantic-ui-react'
import { Link } from 'react-router-dom';

import firebase from 'firebase/app';
import 'firebase/firestore';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faRandom } from '@fortawesome/free-solid-svg-icons';
import { faCat } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useDocument } from '../../hooks/useDocument';

import { MagnifyingGlass } from 'react-loader-spinner';

export default function Code() {

  const history = useHistory();

  const { user } = useAuthContext();

  const { document, error } = useDocument('users', user.uid);

  const username = document?.displayName;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '500px', // Adjust the width to your desired size
    }),
    menu: (provided, state) => ({
      ...provided,
      fontSize: '21px', // Adjust the font size of the options
      width: '500px', // Adjust the width of the dropdown menu
    }),
    option: (provided, state) => ({
      ...provided,
      width: '100%', // Adjust the width of the options (optional)
    }),
  };


  const categories = [
    { value: 'easy', label: 'Easy' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'challenging', label: 'Challenging' },
    { value: 'spoonfeed', label: 'Spoonfeed' },
  ];

  const [loading, setloading] = useState(false);
  const [randomMembers, setRandomMembers] = useState([]);
  const [level, setLevel] = useState('');
  const [currentStep, setCurrentStep] = useState('Bane');


  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const steps = [
    { title: 'Bane', description: 'Choose your opponents' },
    { title: 'Level', description: 'Tell how newbie you are' },
    { title: 'Provoke', description: 'Verify mentioned details' },
  ];

  const dees = [
    "Coding is second life",
    "CodePair is What I do",
    "Come get what you want!!",
  ];

  const getRandomMembers = async () => {
    try {
      setloading(true);
      setTimeout(async () => {
        const usersRef = firebase.firestore().collection('users');
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
          const snapshot = await usersRef.where(firebase.firestore.FieldPath.documentId(), '!=', currentUser.uid).get();
          const totalMembers = snapshot.docs.length;

          // Generate an array of unique random indices
          const randomIndices = [];
          while (randomIndices.length < 3) {
            const randomIndex = Math.floor(Math.random() * totalMembers);
            if (!randomIndices.includes(randomIndex)) {
              randomIndices.push(randomIndex);
            }
          }

          // Fetch the random members using the random indices
          const randomMembersData = randomIndices.map((index) => snapshot.docs[index].data());
          setRandomMembers(randomMembersData);
        }

        setloading(false);
      }, 2000);
    } catch (error) {
      console.log('Error getting random members:', error);
    }
  };


  const handleNextClick = () => {
    const currentIndex = steps.findIndex((step) => step.title === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].title);
    }
  };

  const pushtoide = () => {
    toast.info('You will be taken to Arena!', {
      position: toast.POSITION.TOP_CENTER,
      className: 'toast-message'
  });
    setTimeout(async () => {
    history.push('/codeide')
    },5900);
  }


  ///final click in step 3
  const handlebattle = async () => {
    try {


      // Store each random member as an individual document in the 'codechallenge' collection
      for (const member of randomMembers) {
        const code_data = {
          Challenger: document,
          Challenge: member.displayName
        }
        await firebase.firestore().collection('codechallenge').add(code_data);
      }

      // Navigate to the '/codeide' route after storing the documents
      history.push('/codeide');
    } catch (error) {
      console.log('Error storing random members:', error);
    }
  };

  return (

    <div style={{ paddingTop: '80px', paddingBottom: '20px', fontFamily: 'Poppins' }}>
      <div className="ui ordered steps" style={{ fontSize: '28px', width: '90%', marginLeft: '90px', fontFamily: 'Poppins' }}>
        {steps.map((step, index) => (
          <div
            key={step.title}
            className={`step ${step.title === currentStep ? 'active' : ''} ${index < steps.findIndex((s) => s.title === currentStep) ? 'completed' : ''}`}
            onClick={() => handleStepClick(step.title)}
          >
            <div className="content">
              <div className="title" style={{ fontSize: '22px', fontFamily: 'Poppins' }}>{step.title}</div>
              <div className="description" style={{ fontSize: '18px', fontFamily: 'Poppins' }}>{step.description}</div>
            </div>
          </div>
        ))}
      </div>

      {currentStep === 'Bane' && (
        <>
          {loading === true && (
            <>
            <div style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', height: '9vh', fontSize: '20px', fontFamily: 'Poppins' }}>
              <MagnifyingGlass
                visible={true}
                height="200"
                width="120"
                ariaLabel="MagnifyingGlass-loading"
                wrapperStyle={{}}
                wrapperClass="MagnifyingGlass-wrapper"
                glassColor='#c0efff'
                color='#e15b64'
              />
              </div>
              <p style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', marginTop:'10px',fontSize: '20px', fontFamily: 'Poppins' }}>LET ME SEE. . .</p>
            
            </>
          )}
          {loading === false && (<div class="ui link cards" style={{ marginLeft: '400px', marginTop: '4px', fontFamily: 'Poppins' }}>
            {randomMembers.map((member, index) => (
              <div class="card">
                <div class="image">
                  <Avatar
                    size={260}
                    src={member.photoURL}
                    alt="Competiion"
                    style={{ textdecoration: 'none', margin: 'auto', marginTop: '18px', marginBottom: '10px', display: 'block', objectFit: 'cover' }}
                    circle
                  />
                </div>
                <div class="content">
                  <div class="header" style={{ fontFamily: 'Poppins' }}>{member.displayName}</div>
                  <div class="meta">
                    <a style={{ fontFamily: 'Poppins' }}>Friends</a>
                  </div>
                  <div class="description" style={{ fontFamily: 'Poppins' }}>
                    {dees[index]}
                  </div>
                </div>
                <div class="extra content">
                  <span class="right floated" style={{ fontFamily: 'Poppins' }}>
                    Joined in 2023
                  </span>
                  <span style={{ fontFamily: 'Poppins' }}>
                    <i class="user icon" style={{ fontFamily: 'Poppins' }}></i>
                    {member.points} Points
                  </span>
                </div>
              </div>
            ))}
          </div>)}


          <div style={{ marginTop: '50px', fontFamily: 'Poppins' }}>
            {randomMembers.length === 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '5vh' }}>
                  <Button animated onClick={getRandomMembers} >
                    <Button.Content visible style={{ fontFamily: 'Poppins' }}>TAKE OFF</Button.Content>
                    <Button.Content hidden>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Button.Content>
                  </Button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                  <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '23px', textAlign: 'center' }}>(OR)</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '6vh' }}>
                  <Button animated onClick={pushtoide} >
                    <Button.Content visible style={{ fontFamily: 'Poppins' }}>LONE WOLF</Button.Content>
                    <Button.Content hidden>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Button.Content>
                  </Button>
                  <ToastContainer />
                </div>

              </>

            )}

            {randomMembers.length > 0 && loading === false && (
              <Button animated onClick={getRandomMembers} style={{ marginLeft: '720px' }}>
                <Button.Content visible style={{ fontFamily: 'Poppins' }}>S H U F</Button.Content>
                <Button.Content hidden>
                  <FontAwesomeIcon icon={faRandom} />
                </Button.Content>
              </Button>
            )}

            {randomMembers.length > 0 && loading === false && (
              <Button animated onClick={handleNextClick} style={{ marginLeft: '70px' }}>
                <Button.Content visible style={{ fontFamily: 'Poppins' }}>N E X T</Button.Content>
                <Button.Content hidden>
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button.Content>
              </Button>
            )}
          </div>
        </>
      )}

      {currentStep === 'Level' && (
        <>
          <label style={{ display: 'flex', alignItems: 'center', marginLeft: '550px', fontFamily: 'Poppins' }}>
            <span style={{ fontSize: '21px', marginRight: '15px', fontFamily: 'Poppins' }}>
              Level :
            </span>
            <Select
              onChange={(option) => setLevel(option)}
              styles={customStyles}
              options={categories}
              value={level}
            />
          </label>


          {level !== '' && (
            <Button animated onClick={handleNextClick} style={{ marginLeft: '790px', marginTop: '200px', fontFamily: 'Poppins' }}>
              <Button.Content visible style={{ fontFamily: 'Poppins' }}>N E X T</Button.Content>
              <Button.Content hidden>
                <FontAwesomeIcon icon={faChevronRight} />
              </Button.Content>
            </Button>
          )}
        </>
      )}

      {currentStep === 'Provoke' && randomMembers.length === 0 && (
        <>
          <Message compact style={{ marginLeft: '560px', fontFamily: 'Poppins' }}>
            <FontAwesomeIcon icon={faCat} style={{ marginRight: '8px', fontFamily: 'Poppins' }} />
            Oh, look at me, I'm the only one without any competition.
          </Message>
        </>
      )}

      {currentStep === 'Provoke' && randomMembers.length > 0 && (

        <div style={{ paddingLeft: '650px', paddingTop: '20px', fontFamily: 'Poppins' }}>

          <div class="ui card">
            <div class="content">
              <div class="header" style={{ fontFamily: 'Poppins' }}>CodePair Selects</div>
            </div>
            <div class="content">
              <h4 class="ui sub header" style={{ fontFamily: 'Poppins' }}>All The Best !!</h4>
              <br></br>
              <div class="ui small feed">
                <Message>
                  <Message.Header style={{ fontFamily: 'Poppins' }}>Competitors</Message.Header>
                  <Message.List style={{ width: '3300px', fontSize: '16px', fontFamily: 'Poppins' }}>
                    {randomMembers.map((members, index) => (
                      <Message.Item><Link>{members.displayName}</Link> is ready for battle.</Message.Item>
                    ))}
                  </Message.List>
                </Message>
              </div>
            </div>
            <div class="extra content">
              <Link onClick={handlebattle} className="ui button" style={{ fontFamily: 'Poppins' }}>
                S T A R T
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
