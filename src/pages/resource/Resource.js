import React, { useEffect, useState } from 'react';
import { Progress, Segment } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Image, Reveal } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react'
import { Dialog, DialogFooter, DefaultButton, PrimaryButton, getTheme, mergeStyles, DialogType } from '@fluentui/react';
import { Link, Text } from '@fluentui/react';
import { SpinnerLoading } from '../../components/spinner';
import HashLoader from "react-spinners/HashLoader";

import "semantic-ui-css/components/progress.min.css";
import "semantic-ui-css/components/segment.min.css";
import "semantic-ui-css/components/reveal.min.css";
import "semantic-ui-css/components/message.min.css";
import "semantic-ui-css/components/label.min.css";
import "semantic-ui-css/components/button.min.css";
import "semantic-ui-css/components/modal.min.css";


import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'


import './Resource.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFile } from '@fortawesome/free-regular-svg-icons';


import { faBook } from '@fortawesome/free-solid-svg-icons';

// Add the icon to the library
library.add(faBook);


library.add(faFile);

export default function GetResource() {

  const dialogStyles = mergeStyles({
    selectors: {
      '.ms-Dialog-main': {
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      '.ms-Dialog-title': {
        color: '#333',
        fontSize: '18px',
        fontWeight: 'bold',
      },
      '.ms-Dialog-subText': {
        color: '#666',
        fontSize: '14px',
      },
    },
  });

  const theme = getTheme();



  const { user } = useAuthContext();
  const { document } = useDocument('users', user.uid);

  const points = document?.points;

  const resource_face = [
    { image: 'https://media.tenor.com/5vxq18nPCNEAAAAM/scooby-doo-sleepy.gif', taunt: 'Get (or take) a rise out of' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY4ZcQgMRh-oWaxJ2tuMgdarLT2O8GoQfwjg', taunt: 'Extraterrestrial' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuPdOpNhC8igekeM-f-z7qlUxyoyhxNloT9g', taunt: 'Head-to-Head' },
    {image:'https://media.tenor.com/wX1WiAsbXr4AAAAM/cute-animated.gif',taunt:'Bored Enough ?'},
    {image:'https://media.tenor.com/Wyi2-E2xtDUAAAAM/bh187-minions.gif',taunt:'Time is Running !!'},
    {image:'https://media.tenor.com/nm8DdCPikb4AAAAM/confused-wat.gif',taunt:'Scooby Dooo ??'},
    {image:'https://media.tenor.com/31QXc6ZLh8sAAAAM/running-pikachu-pokemon.gif',taunt:'Come get it !'},
    {image:'https://media.tenor.com/6sJIZHNezgoAAAAM/mr-bean-pizza.gif',taunt:'LaLaLa'},
    {image:'https://64.media.tumblr.com/da9c4314ebe0a33b852f6c3f38d3ab2d/tumblr_o4rgh6Jz5N1vpkaido1_400.gif',taunt:'Okie Dokie!!'}
  ];

  const [resourcedata, setresourcedata] = useState([]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({});
  const [loading, setloading] = useState(true);

  //  const[todisplay,setdisplay]=useState({});//item to display
  const [ispopup, setpopup] = useState('');

  useEffect(() => {

    const fetchData = async () => {
      try {
        const resourcesRef = firebase.firestore().collection('resources');
        const querySnapshot = await resourcesRef.orderBy('Points').get();
        const data = querySnapshot.docs.map(doc => doc.data());
        setresourcedata(data);
        console.log("Resource Data:", data);
      } catch (error) {
        console.log('Error getting resources:', error);
      }
    };

    fetchData();
    setTimeout(() => {
      setloading(false);
    }, 4000);
  }, []);

  

  

  const handleClickresource = (item) => {
    console.log("Cliked", item);
    setDialogContent(item);
    setDialogOpen(true);
  }

  return (
    <>

{loading === true && (
        <div style={{ marginLeft: '820px', fontSize: '20px',marginTop:'300px',justifyContent: 'center', alignItems: 'center', }}>
         <HashLoader color="#8d69f1" aria-label="Loading Spinner" width="600px" height='200px'/>
        </div>
      )}
      {loading===false&&(
   <><h2 style={{ alignContent: 'center', fontFamily: 'Poppins', justifyContent: 'center', marginLeft: '700px', marginBottom: '17px' }}>
          Resources
          <FontAwesomeIcon icon={faLightbulb} size="0.5x" style={{ animation: 'wiggle 2s infinite', marginLeft: '8px' }} />
        </h2><div class="ui message" style={{ marginBottom: '20px', fontFamily: 'Poppins', paddingBottom: '20px' }}>
            <div class="header">
              Resources Rules

            </div>
            <ul class="list" style={{ fontFamily: 'Poppins' }}>
              <li>You can now have exclusive access to resource.</li>
              <li>Coins will automatically get deducted from Xp.</li>
            </ul>
          </div><div className="resource-container" style={{ marginBottom: '90px', fontFamily: 'Poppins' }}>
            {resourcedata.map((item, index) => {
              const randomIndex = Math.floor(Math.random() * (resource_face.length - 1 - 0 + 1)) + 0;
              const resource = resource_face[randomIndex];
              const marg = index % 2 === 0 ? '200px' : '400px';
              //setting progress percent
              const progressPercent = (points / item.Points) * 100;

              // Round the progress percentage to two decimal places
              const roundedProgressPercent = Math.round(progressPercent * 100) / 100;

              let barColor = '';

              if (roundedProgressPercent >= 95) {
                barColor = 'green';
              }
              else if (roundedProgressPercent > 85) { barColor = 'purple'; } else if (roundedProgressPercent >= 60) {
                barColor = 'orange';
              } else if (roundedProgressPercent >= 40) {
                barColor = 'yellow';
              } else if (roundedProgressPercent >= 20) {
                barColor = 'red';
              } else {
                barColor = '#9075D8';
              }
              return (
                <div className="ui segment" style={{ position: 'relative', marginLeft: marg }}>
                  <div className="ui top attached active progress">
                    <div className="bar" style={{ width: `${roundedProgressPercent}%`, backgroundColor: barColor, height: '200px' }}></div>
                  </div>
                  <Reveal animated='move right'>
                    <Reveal.Content visible>
                      <div class="ui two column grid">
                        <div class="column">
                          <div class="ui fluid image">
                            <div className={`ui ${barColor} ribbon label`}>
                              <FontAwesomeIcon icon={faGlobe} style={{ paddingLeft: '8px', fontSize: '15px' }} />
                            </div>
                            <img src={resource.image} alt="REsource " />
                          </div>
                        </div>
                      </div>
                    </Reveal.Content>
                    <Reveal.Content hidden>
                      <h4 style={{ marginLeft: '40px', marginBottom: '4px' }}>{resource.taunt}</h4>
                      <p style={{ color: '#999', alignContent: 'center', justifyContent: 'center', marginLeft: '0px' }}>{item.Description}</p>
                      {points >= item.Points && (
                        <Button animated
                          style={{ fontSize: '8px', marginTop: '25px', marginLeft: '90px' }}
                          onClick={() => handleClickresource(item)}
                          type="button"
                        >
                          <Button animated='vertical'>
                            <Button.Content hidden>R E V</Button.Content>
                            <Button.Content visible>
                              <FontAwesomeIcon icon={faShoppingBasket} />
                            </Button.Content>
                          </Button>
                        </Button>
                      )}
                    </Reveal.Content>
                  </Reveal>
                  <div className="ui bottom attached active progress">
                    <div className="bar" style={{ width: `${progressPercent}%`, backgroundColor: barColor, height: '200px' }}></div>
                  </div>
                </div>
              );
            })}
          </div><div style={{ border: '10px', color: 'grey' }}>
            <Dialog
              hidden={!isDialogOpen}
              onDismiss={() => setDialogOpen(false)}
              modalProps={{
                isBlocking: false,
                styles: {
                  main: {
                    maxWidth: '2000px',
                    background: '#CCCDC6',
                    fontFamily: 'Poppins'
                  }
                },
              }}
              dialogContentProps={{
                title: 'Requested Resource!!',
                type: DialogType.normal
              }}

            >
              {/* Add any additional content inside the dialog */}
              <div style={{ fontFamily: 'Poppins', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '4px', alignItems: 'center', background: '#f2f2f2', padding: '20px', borderRadius: '10px', boxShadow: '0px 5px 10px #ccc' }}>
                <p style={{ fontFamily: 'Poppins', color: '#AD794B', fontSize: '21px', marginBottom: '38px', fontWeight: '30px' }}>
                  " {dialogContent.Description} "
                </p>
                <div>
                  <Link
                    href={dialogContent.Link}
                    style={{
                      color: '#7F803E',
                      fontSize: '19px',
                      paddingRight: '35px',
                      marginBottom: '5px',
                      fontFamily: 'Poppins'
                    }}
                  >
                    <FontAwesomeIcon icon={['far', 'file']} style={{ marginRight: '12px' }} bounce />
                    DOC(s)
                  </Link>
                  <Link
                    href={dialogContent.File}
                    style={{
                      color: ' #2D5F6E',
                      fontSize: '19px',
                      paddingLeft: '22px',
                      marginBottom: '5px',
                      fontFamily: 'Poppins'
                    }}
                  >
                    <FontAwesomeIcon icon={faBook} style={{ marginRight: '12px' }} bounce />

                    BOOK
                  </Link>
                </div>
                <p style={{ fontFamily: 'Poppins', paddingTop: '16px', color: '#AD794B', fontStyle: 'bold', fontSize: '22px', whiteSpace: 'wrap' }}>
                  Hurray!! You have accumulated <b>{dialogContent.Points}</b> points.
                </p>

              </div>

              <DialogFooter>
                <PrimaryButton
                  onClick={() => setDialogOpen(false)}
                  styles={{
                    root: {
                      fontSize: '20px',
                      backgroundColor: 'grey',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '5px',
                      fontFamily: 'Poppins'
                    },
                    rootHovered: {
                      backgroundColor: 'lightgrey',
                    },
                    textContainer: {
                      fontWeight: 'bold',
                    },
                  }}
                  text="C L O S E" />
              </DialogFooter>
            </Dialog>

          </div></>

      )}
   
    </>
  );
}
