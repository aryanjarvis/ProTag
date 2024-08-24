import { useParams } from "react-router-dom"
import { useDocument } from '../../hooks/useDocument'
import { React, useState, useEffect } from 'react';
import { Dialog, DialogType, DialogFooter, DefaultButton } from '@fluentui/react';
import { Panel, PanelType, Icon } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks'
import { useRef } from 'react';

import { Row, Col, Form, Input, Button, Space, notification } from 'antd';
import emailjs from 'emailjs-com';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  DatePicker,
  DayOfWeek,
  Dropdown,
  IDropdownOption,
  mergeStyles,
  defaultDatePickerStrings,
} from '@fluentui/react';

import { mergeStyleSets } from '@fluentui/react';
import { TimePicker } from '@fluentui/react';

import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

//icons in the card
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faExplosion } from '@fortawesome/free-solid-svg-icons';

import { faPen } from '@fortawesome/free-solid-svg-icons';
// ...

//componnents import

import Mentsummary from "./mentsummary"
import Mentorreview from "./mentorreview"

//styles insertion
import './mentorprofile.css'

import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';


import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useHistory } from 'react-router'
import { projectFirestore } from '../../firebase/config'



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



const SadFace = (
  <path d="M12.0000002,1.99896738 C17.523704,1.99896738 22.0015507,6.47681407 22.0015507,12.0005179 C22.0015507,17.5242217 17.523704,22.0020684 12.0000002,22.0020684 C6.47629639,22.0020684 1.99844971,17.5242217 1.99844971,12.0005179 C1.99844971,6.47681407 6.47629639,1.99896738 12.0000002,1.99896738 Z M12.0000002,3.49896738 C7.30472352,3.49896738 3.49844971,7.30524119 3.49844971,12.0005179 C3.49844971,16.6957946 7.30472352,20.5020684 12.0000002,20.5020684 C16.6952769,20.5020684 20.5015507,16.6957946 20.5015507,12.0005179 C20.5015507,7.30524119 16.6952769,3.49896738 12.0000002,3.49896738 Z M12.0000001,13.4979816 C13.6312483,13.4979816 15.1603686,14.1528953 16.2810488,15.2934358 C16.5713583,15.5888901 16.5671876,16.0637455 16.2717333,16.354055 C15.976279,16.6443646 15.5014236,16.6401939 15.211114,16.3447396 C14.3696444,15.4883577 13.2246935,14.9979816 12.0000001,14.9979816 C10.7726114,14.9979816 9.62535029,15.4905359 8.78347552,16.3502555 C8.49366985,16.6462041 8.01882223,16.6511839 7.72287367,16.3613782 C7.4269251,16.0715726 7.4219453,15.5967249 7.71175097,15.3007764 C8.83296242,14.155799 10.3651558,13.4979816 12.0000001,13.4979816 Z M9.00044779,8.75115873 C9.69041108,8.75115873 10.2497368,9.3104845 10.2497368,10.0004478 C10.2497368,10.6904111 9.69041108,11.2497368 9.00044779,11.2497368 C8.3104845,11.2497368 7.75115873,10.6904111 7.75115873,10.0004478 C7.75115873,9.3104845 8.3104845,8.75115873 9.00044779,8.75115873 Z M15.0004478,8.75115873 C15.6904111,8.75115873 16.2497368,9.3104845 16.2497368,10.0004478 C16.2497368,10.6904111 15.6904111,11.2497368 15.0004478,11.2497368 C14.3104845,11.2497368 13.7511587,10.6904111 13.7511587,10.0004478 C13.7511587,9.3104845 14.3104845,8.75115873 15.0004478,8.75115873 Z" />
);

const NeutralFace = (
  <>
    <path d="M9.00051 8.75122C9.69047 8.75122 10.2498 9.31055 10.2498 10.0005C10.2498 10.6905 9.69047 11.2498 9.00051 11.2498C8.31055 11.2498 7.75122 10.6905 7.75122 10.0005C7.75122 9.31055 8.31055 8.75122 9.00051 8.75122Z" />
    <path d="M15.0005 8.75122C15.6905 8.75122 16.2498 9.31055 16.2498 10.0005C16.2498 10.6905 15.6905 11.2498 15.0005 11.2498C14.3105 11.2498 13.7512 10.6905 13.7512 10.0005C13.7512 9.31055 14.3105 8.75122 15.0005 8.75122Z" />
    <path d="M8.25 15C7.83579 15 7.5 15.3358 7.5 15.75C7.5 16.1642 7.83579 16.5 8.25 16.5H15.75C16.1642 16.5 16.5 16.1642 16.5 15.75C16.5 15.3358 16.1642 15 15.75 15H8.25Z" />
    <path d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5Z" />
  </>
);

const SmilingFace = (
  <path d="M12.0000002,1.99896738 C17.523704,1.99896738 22.0015507,6.47681407 22.0015507,12.0005179 C22.0015507,17.5242217 17.523704,22.0020684 12.0000002,22.0020684 C6.47629639,22.0020684 1.99844971,17.5242217 1.99844971,12.0005179 C1.99844971,6.47681407 6.47629639,1.99896738 12.0000002,1.99896738 Z M12.0000002,3.49896738 C7.30472352,3.49896738 3.49844971,7.30524119 3.49844971,12.0005179 C3.49844971,16.6957946 7.30472352,20.5020684 12.0000002,20.5020684 C16.6952769,20.5020684 20.5015507,16.6957946 20.5015507,12.0005179 C20.5015507,7.30524119 16.6952769,3.49896738 12.0000002,3.49896738 Z M8.46174078,14.7838355 C9.31087697,15.8615555 10.6018926,16.5020843 11.9999849,16.5020843 C13.396209,16.5020843 14.6856803,15.8632816 15.5349376,14.7880078 C15.7916692,14.4629512 16.2633016,14.4075628 16.5883582,14.6642944 C16.9134148,14.9210259 16.9688032,15.3926584 16.7120717,15.717715 C15.5813083,17.1494133 13.8601276,18.0020843 11.9999849,18.0020843 C10.1373487,18.0020843 8.41411759,17.1471146 7.28351576,15.7121597 C7.02716611,15.3868018 7.08310832,14.9152347 7.40846617,14.6588851 C7.73382403,14.4025354 8.20539113,14.4584777 8.46174078,14.7838355 Z M9.00044779,8.75115873 C9.69041108,8.75115873 10.2497368,9.3104845 10.2497368,10.0004478 C10.2497368,10.6904111 9.69041108,11.2497368 9.00044779,11.2497368 C8.3104845,11.2497368 7.75115873,10.6904111 7.75115873,10.0004478 C7.75115873,9.3104845 8.3104845,8.75115873 9.00044779,8.75115873 Z M15.0004478,8.75115873 C15.6904111,8.75115873 16.2497368,9.3104845 16.2497368,10.0004478 C16.2497368,10.6904111 15.6904111,11.2497368 15.0004478,11.2497368 C14.3104845,11.2497368 13.7511587,10.6904111 13.7511587,10.0004478 C13.7511587,9.3104845 14.3104845,8.75115873 15.0004478,8.75115873 Z" />
);

const HappyFace = (
  <>
    <path d="M6.74927 12C6.53852 12 6.33749 12.0887 6.19539 12.2443C6.05329 12.4 5.98323 12.6082 6.00237 12.8181C6.28259 15.8916 8.55224 18.5 12 18.5C15.4478 18.5 17.7174 15.8916 17.9977 12.8181C18.0168 12.6082 17.9468 12.4 17.8047 12.2443C17.6626 12.0887 17.4616 12 17.2508 12H6.74927ZM12 17C9.74286 17 8.12852 15.5205 7.63237 13.5H16.3677C15.8715 15.5205 14.2571 17 12 17Z" />
    <path d="M15.2501 8.75C14.8416 8.75 14.5398 9.03719 14.492 9.35982C14.4314 9.76957 14.05 10.0526 13.6403 9.99192C13.2305 9.93126 12.9475 9.54993 13.0082 9.14018C13.1696 8.0495 14.1313 7.25 15.2501 7.25C16.3689 7.25 17.3306 8.0495 17.492 9.14018C17.5527 9.54993 17.2697 9.93126 16.8599 9.99192C16.4502 10.0526 16.0688 9.76957 16.0082 9.35982C15.9604 9.03719 15.6586 8.75 15.2501 8.75Z" />
    <path d="M7.99202 9.35982C8.03977 9.03719 8.34157 8.75 8.7501 8.75C9.15863 8.75 9.46043 9.03719 9.50818 9.35982C9.56884 9.76957 9.95017 10.0526 10.3599 9.99192C10.7697 9.93126 11.0527 9.54993 10.992 9.14018C10.8306 8.0495 9.86892 7.25 8.7501 7.25C7.63128 7.25 6.66963 8.0495 6.50818 9.14018C6.44753 9.54993 6.73053 9.93126 7.14028 9.99192C7.55003 10.0526 7.93136 9.76957 7.99202 9.35982Z" />
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM3.5 12C3.5 7.30558 7.30558 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C7.30558 20.5 3.5 16.6944 3.5 12Z" />
  </>
);

const customStyles = {
  itemShapes: [SadFace, NeutralFace, SmilingFace, HappyFace],
  activeFillColor: ['#da1600', '#dcb000', '#61bb00', '#009664'],
  inactiveFillColor: '#a8a8a8',
};

const Card = ({ icon, price, description, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="card"
      style={{ ...styles.card, backgroundColor: isHovered ? '#ebebeb' : '#f2f2f2' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <div className="icon" style={styles.icon}>{icon}</div>
      <div className="price" style={styles.price}>{price}</div>
      <div className="description" style={styles.description}>{description}</div>
    </div>
  );
};

const styles = {
  card: {
    width: '180px',
    height: '200px',
    borderRadius: '10px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    margin: '10px',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '36px',
    marginBottom: '16px',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  description: {
    fontSize: '22px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  app: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
};

const dialogContent = [
  {
    title: 'Mock Interview',
    description: 'Content for mock interview dialog',
  },
  {
    title: 'Career Counseling',
    description: 'Content for career counseling dialog',
  },
  {
    title: 'Resume Review',
    description: 'Content for resume review dialog',
  },
  {
    title: '1:1 Call',
    description: 'Content for 1:1 call dialog',
  },
];

const customdate = mergeStyleSets({
  root: {
    selectors: {
      '& .ms-DatePicker-input': {
        color: 'red',
        fontWeight: 'bold',
        fontSize: '500px',
      },
    },
  },
});


export default function Mentorprofile() {


  const [selectedCard, setSelectedCard] = useState(null);
  const [ratings, setRating] = useState(0);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [isDialogOpen, setDialogOpen] = useState(false);//for dialog main open
  const [currentuser, setcurrentuser] = useState('');
  const [currentusermail, setcurrentusermail] = useState('');
  const [coins, setcoins] = useState(0);
  const [cost, setcost] = useState(0);
  const [borderColor, setBorderColor] = useState('#ddd');
  const [check, setcheck] = useState(false);
  const [process, setprocess] = useState(true);
  const [success, setsucess] = useState(false);

  const [mentoremail, setmentoremail] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setBorderColor(getRandomColor());
    }, 800);



    return () => clearInterval(interval);
  }, []);

  const { user } = useAuthContext();
  const history = useHistory()
  const db = firebase.firestore();


  //current user details

  db.collection('users')
    .doc(user.uid)
    .get()
    .then((doc) => {

      if (doc.exists) {
        // Document data is available in doc.data()
        const data = doc.data();
        console.log(data)
        setcurrentuser(data.displayName);
        setcurrentusermail(user.email);
        setcoins(data.points)
        console.log('current user', currentuser, currentusermail, coins);
      } else {
        console.log('Document not found');
      }
    })
    .catch((error) => {
      console.error('Error retrieving document:', error);
    });



  //extracting params
  const { id } = useParams()
  console.log("INSIDE DOCUMENT OF MENTOR PROFILE")
  console.log(id)
  const { document, error } = useDocument('Mentors', id)
  const rating_stored = document?.rating;
  let d = '';

  if (typeof rating_stored !== 'undefined') {
    d = rating_stored.toString().charAt(0);
  }
  console.log(defaultDatePickerStrings)

  //setting email of mentor






  const [date, setdate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);

  //handling a time chaange
  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };


  //handling a date change
  const handleDateChange = (date) => {
    // Access the selected date here
    setdate(date);
  };

  //hadnling card click
  const handleCardClick = (cardIndex) => {
    const cardselected = cardIndex;
    console.log(`Card ${cardselected} clicked!`);
    setSelectedCard(cardselected);
    setDialogOpen(true);
    console.log("set")
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const getRandomColor = () => {
    const colors = ['#F9DED7', '#CCE1F2', '#fefae0', '#dda15e', '#E2BEF1'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  //reload after giving popup
  const handleschedule = () => {

    ///checking for suffecient coins


    if (selectedCard === 0 && coins > 99) {
      setcheck(true);
      setcost(100);

    }
    if (selectedCard === 1 && coins > 79) {
      setcheck(true);
      setcost(80);

    } if (selectedCard === 2 && coins > 89) {
      setcheck(true);
      setcost(90);

    } if (selectedCard === 3 && coins > 199) {
      setcheck(true);
      setcost(200);
    }

    if (check) {
      //sending mail if coin is suffecient
      const formData = {
        from_name: `${document.name}`,
        to_name: `${currentuser}`,//user name
        message: `Further communication will be transferred for Date - ${date.toLocaleString().slice(0, 7)} `,
        reply_to: `${currentusermail}`,//user mail id
      };
      const form1Data = {
        from_name: `${currentuser}`,
        to_name: `${document.name}`,//mentor name
        message: `Further communication will be transferred for Date - ${date.toLocaleString().slice(0, 7)} with ${currentusermail}, It is requested to send 
        the user Comfirmed Time `,
        reply_to: `${document.original_user.email}`,//mentor mail id here error is coming
      };

      // emailjs.init('0jDoGohZ_N0OnO7Kp');
      emailjs.send('service_94ovqse', 'template_75golqb', formData, '0jDoGohZ_N0OnO7Kp')
        .then((result) => {
          // show the user a success message
          console.log("SUccsdsadESSS MAIL for user");
        }, (error) => {
          // show the user an error
          console.log(error);
        });

      emailjs.send('service_94ovqse', 'template_75golqb', form1Data, '0jDoGohZ_N0OnO7Kp')
        .then((result) => {
          // show the user a success message
          console.log("SUccsdsadESSS MAIL for mentor");
        }, (error) => {
          // show the user an error
          console.log(error);
        });


      ///updating the user coins
      const documentRef = db.collection('users').doc(user.uid);
      documentRef.update({
        points: firebase.firestore.FieldValue.increment(-cost),
      });

      setsucess(true);
      toast.success(
        <>
         
          <span style={{fontFamily:'Poppins',fontSize:'16px'}}>
            Your Meeting has been scheduled with the mentor, Check your Mail !
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
      setTimeout(() => {
        setsucess(false);
        history.push('/')
      }, 6500); // 6 seconds


    }
    else {
      setprocess(false);

      setTimeout(() => {
        setprocess(true);
      }, 5000);
      console.log("error");
    }

  }

  //rating mentor hadnle
  const handlerating = () => {

    const documentRef = db.collection('Mentors').doc(id);
    documentRef.get()
      .then((doc) => {
        if (doc.exists) {
          const currentRating = doc.data().rating;
          const updatedRating = (currentRating + ratings) / 2;
          documentRef.update({
            rating: updatedRating,
          });
        } else {
          console.log("Documtne doesnt exists");
        }
      })
      .catch((error) => {

        console.log("Error inside updating reating", error);
      });

    setRating(0);

    
    const firestore = firebase.firestore();
    //updating the points with 40EXP
    firestore
        .collection('users')
        .doc(user.uid)
        .update({
            points: firebase.firestore.FieldValue.increment(40)
        })
        .then(() => {
            console.log('User points updated successfully');
        })
        .catch((error) => {
            console.error('Error updating user points:', error);
        });

        toast(
          <>
            <FontAwesomeIcon icon={faUserGraduate} style={{ marginRight: '10px' }} />
            <span>
              Thanks For your feedback ! As a token of our appreciation, we have credited your account with 40 EXP! 💰
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

  }





  if (error) {
    return <div className="error">{error}</div>
  }
  if (!document) {
    return <div className="loading">Loading...</div>
  }

  return (
    <>

      {/* //overall  */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '10px'
      }}>

        {/* Mentor Summary Component */}
        <Mentsummary mentor={document} />

        <div className="app" style={styles.app}>
          <div className="row" style={styles.row}>
            <Card
              icon={<FontAwesomeIcon icon={faRocket} bounce />}
              price="100 Xp"
              description="Mock Interview"
              onClick={() => handleCardClick(0)}
            />
            <Card
              icon={<FontAwesomeIcon icon={faQuestionCircle} fade />}
              price="80 Xp"
              description="Career Counseling"
              onClick={() => handleCardClick(1)}

            />
          </div>
          <div className="row" style={styles.row}>
            <Card
              icon={<FontAwesomeIcon icon={faUser} beatFade />}
              price="90 Xp"
              description="Resume Review"
              onClick={() => handleCardClick(2)}

            />
            <Card
              icon={<FontAwesomeIcon icon={faHeadset} beat />}
              price="200 Xp"
              description="1:1 Call"
              onClick={() => handleCardClick(3)}

            />
          </div>
        </div>
        {/* ///review THING COMPONENT */}
        <Mentorreview mentor={document} />
      </div>


      {/* //Rating a mentor */}
      <div style={{
        justifyContent: 'center', alignItems: 'center', textAlign: 'center'
        , paddingBottom: '30px', display: 'flex', paddingRight: '60px'
      }}>
        <p style={{ padding: '20px', fontSize: '30px' }}>Want to Add Rating?</p>
        <Rating
          style={{ maxWidth: 300 }}
          value={ratings}
          onChange={setRating}
          itemStyles={customStyles}
          items={4}
          highlightOnlySelected
          spaceBetween="medium"
          transition="zoom"
        />
        {ratings !== 0 && id !== user.uid && (
          <button className="btn" style={{ fontSize: '20px', padding: '10px', marginLeft: '10px' }} onClick={handlerating}>Appraise</button>
        )}
      </div>
      <ToastContainer style={{ width: "1000px", fontFamily: 'Poppins' }} />


      {/* //dialog popup when card clicked */}
      {selectedCard !== null && (
        <Dialog
          hidden={!isDialogOpen}
          onDismiss={handleCloseDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: dialogContent[selectedCard].title,
            styles: {
              title: { fontSize: '24px', fontWeight: 'bold' },
              subText: { fontSize: '16px' },
            },
          }}
          modalProps={{
            isBlocking: false,
            styles: {
              main: { maxWidth: '1200px', maxHeight: '1200px', borderRadius: '8px' },
            },
          }}
          styles={{
            content: { padding: '20px' },
          }}
        >
          {/* Content goes here */}
          {selectedCard === 0 && (
            <>
              <div style={{ backgroundColor: '#EDECF2', padding: '14px', borderRadius: '10px', fontFamily: 'Poppins' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', fontFamily: 'Poppins' }}>
                  Yes, You are right!!, {document.name} has good experience in this
                </p>
                <p style={{ fontSize: '18px', marginBottom: '10px', fontFamily: 'Poppins' }}>
                  A mock interview is a simulated interview experience designed to help individuals prepare for real job interviews.
                  It involves practicing interview questions, receiving feedback, and refining one's interview skills.
                  Mock interviews provide an opportunity to enhance confidence, improve communication,
                  and identify areas for improvement in order to perform better in actual job interviews.
                </p>
                <p style={{ paddingTop: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
                  {document.name} has a rating of {d}
                  <FontAwesomeIcon icon={faStar} style={{ marginLeft: '5px' }} />
                </p>
              </div>
            </>
          )}
          {selectedCard === 1 && (
            <>
              <div style={{ backgroundColor: '#EDECF2', padding: '14px', borderRadius: '10px', fontFamily: 'Poppins' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', fontFamily: 'Poppins' }}>
                  Yes, You are right!!, {document.name} has good experience in this
                </p>
                <p style={{ fontSize: '18px', marginBottom: '10px', fontFamily: 'Poppins' }}>
                  Career counseling is a process that aims to help individuals make informed decisions
                  about their career paths and achieve their professional goals.
                  It involves working with a trained career counselor who provides guidance, support,
                  and resources to explore various career options, assess skills and interests, and develop
                  a career plan. During career counseling sessions, individuals may engage
                  in activities such as self-assessment, exploring different occupations.
                </p>
                <p style={{ paddingTop: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
                  {document.name} has a rating of {d}
                  <FontAwesomeIcon icon={faStar} style={{ marginLeft: '5px' }} />
                </p>
              </div>
            </>
          )}
          {selectedCard === 2 && (
            <>
              <div style={{ backgroundColor: '#EDECF2', padding: '14px', borderRadius: '10px', fontFamily: 'Poppins' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', fontFamily: 'Poppins' }}>
                  Yes, You are right!!, {document.name} has good experience in this
                </p>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                  Resume review is a valuable service offered by professionals to help individuals
                  improve the quality and effectiveness of their resumes.
                  A resume is a document that presents a summary of a person's education,
                  work experience, skills, and achievements. It serves as a crucial tool in the job
                  application process, as it showcases an individual's
                  qualifications and suitability for a particular job.
                </p>
                <p style={{ paddingTop: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
                  {document.name} has a rating of {d}
                  <FontAwesomeIcon icon={faStar} style={{ marginLeft: '5px' }} />
                </p>
              </div>
            </>
          )}
          {selectedCard === 3 && (
            <>
              <div style={{ backgroundColor: '#EDECF2', padding: '14px', borderRadius: '10px', fontFamily: 'Poppins' }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', fontFamily: 'Poppins' }}>
                  Yes, You are right!!, {document.name} has good experience in this
                </p>
                <p style={{ fontSize: '18px', marginBottom: '10px', fontFamily: 'Poppins' }}>
                  During a 1:1 call, the career professional or mentor engages
                  in a direct conversation with the individual to understand their
                  specific career aspirations, challenges, and areas of focus. They may discuss various
                  aspects such as career planning, job search strategies, professional growth opportunities, networking,
                  skill development, and overcoming obstacles in the career journey.
                </p>
                <p style={{ paddingTop: '16px', fontSize: '15px', display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
                  {document.name} has a rating of {d}
                  <FontAwesomeIcon icon={faStar} style={{ marginLeft: '5px' }} />
                </p>
              </div>
            </>
          )}

          <DialogFooter>

            {id !== user.uid && (<DefaultButton text="Schedule" style={{ borderRadius: '4px', fontFamily: 'Poppins', border: '1px solid #8d69f1', fontSize: '20px', color: '#8d69f1', paddingRight: '20px' }} onClick={openPanel} />)}
            <DefaultButton text="Close" style={{ borderRadius: '4px', fontFamily: 'Poppins', border: '1px solid #8d69f1', fontSize: '20px', color: '#8d69f1' }} onClick={handleCloseDialog} />
          </DialogFooter>
        </Dialog>
      )}

      {/* opening a panel onclick of schedule */}
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel="Close"
      >
        <div style={{ paddingBottom: '5px', borderBottom: '1px solid lightgrey', paddingTop: '0px', fontFamily: 'Poppins' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', paddingLeft: '50px', fontFamily: 'Poppins' }}>
            Book A Schedule <FontAwesomeIcon icon={faPen} style={{ paddingTop: '10px', paddingLeft: '5px', fontFamily: 'Poppins' }} />
          </span>
        </div>

        <p style={{ fontSize: '20px', paddingBottom: '10px', paddingTop: '60px', fontWeight: '14px', fontFamily: 'Poppins' }}>When are you available:</p>

        <div style={{ fontFamily: 'Poppins' }}>
          <DatePicker
            placeholder="Select a date..."
            label="Select a date"
            strings={defaultDatePickerStrings}
            value={date}
            onSelectDate={handleDateChange}
            styles={customdate}
          />
        </div>
        <div style={{ paddingTop: '10px', fontFamily: 'Poppins' }}>
          <TimePicker
            placeholder="Give Time in 24 Hr.."
            label="Select a time"
            allowFreeform
            value={selectedTime}
            onChange={handleTimeChange}
            styles={customdate}
          />
        </div>

        {/* not ready button */}
        <button className="btn" style={{ marginTop: '40px', fontFamily: 'Poppins', fontSize: '15px', marginLeft: '160px' }} onClick={dismissPanel}>Not Ready !!</button>

        {/* date display */}
        {date !== 0 && (<p style={{ paddingTop: ' 100px', fontFamily: 'Poppins', paddingLeft: '20px', margin: '2px', color: '#999', fontSize: '15px' }}>You have selected the Date {date ? date.toLocaleString().slice(0, 7) : 'N/A'}</p>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Poppins' }}>
          <FontAwesomeIcon icon={faExplosion} style={{ fontSize: '40px', fontFamily: 'Poppins', margin: '20px', paddingTop: '20px' }} flip />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Poppins', fontWeight: '20px', fontSize: '30px' }}>
          {selectedCard === 0 && (
            <p style={{ fontFamily: 'Poppins' }}>100 Xp </p>
          )}
          {selectedCard === 1 && (
            <p style={{ fontFamily: 'Poppins' }}>80 Xp</p>
          )}
          {selectedCard === 2 && (
            <p style={{ fontFamily: 'Poppins' }}>90 Xp</p>
          )}
          {selectedCard === 3 && (
            <p style={{ fontFamily: 'Poppins' }}>200 Xp</p>
          )}
        </div>

        {date === 0 ? (
          <p style={{ paddingTop: '20px', fontFamily: 'Poppins', marginLeft: '54px', color: '#999', fontSize: '19px' }}>Select a proper date</p>
        ) : (
          <button
            className="btn"
            style={{ marginTop: '40px', fontSize: '15px', marginLeft: '100px', fontFamily: 'Poppins' }}
            onClick={handleschedule}
          >
            Ready !!
          </button>
        )}

        {process === false && check == false && (
          <div
            style={{
              backgroundColor: `${borderColor}`,
              border: `1px solid black`,
              borderRadius: '4px',
              padding: '10px',
              width: '200px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '25px',
              marginLeft: '20px',
              fontFamily: 'Poppins'
            }}
          >
            <span style={{ marginRight: '10px' }}>
              <span role="img" aria-label="Failure Emoji" style={{ color: 'black', fontFamily: 'Poppins' }}>
                👮‍♂️
              </span>
            </span>
            <p style={{ margin: '2px', fontSize: '14px', fontWeight: 'bold', fontFamily: 'Poppins' }}>Nah!, more coins needed</p>
          </div>
        )}
       
                 <ToastContainer style={{ width: "1000px", fontFamily: 'Poppins' }} />

         
        <p style={{ paddingTop: ' 260px', margin: '2px', color: '#999', fontSize: '15px', fontFamily: 'Poppins' }}>
          Once You're ready, the points will automatically get deducted from your account
        </p>

      </Panel>
    </>
  )
}




