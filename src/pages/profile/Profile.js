import { Button, Card, Image } from 'semantic-ui-react';
import "semantic-ui-css/components/card.min.css";
import "semantic-ui-css/components/button.min.css";
import { Header } from 'semantic-ui-react';
import "semantic-ui-css/components/header.min.css";


import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { useAuthContext } from '../../hooks/useAuthContext';
import { useDocument } from '../../hooks/useDocument';
import { useHistory } from 'react-router';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faExplosion } from '@fortawesome/free-solid-svg-icons';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCardClip } from '@fortawesome/free-solid-svg-icons';

import { SpinnerLoading } from '../../components/spinner';
import { Comment } from 'react-loader-spinner';
import { LineWave } from 'react-loader-spinner';

import { Avatar } from 'antd';



import './Profile.css';

export default function Profile() {
    const { user } = useAuthContext();//current user fetching
    const expected = user.displayName;//which name must be there
    const [documents, setDocuments] = useState([]);
    const [userdetail, setuserdetail] = useState([]);
    const [loading, setloading] = useState(true);
    const history = useHistory();
    const { document, error } = useDocument('users', user.uid);


    ///user deatils getting extracted
    const username = document?.displayName;
    const points = document?.points;
    const projjoined = document?.project_joined;
    const mentor = document?.mentor_ship;
    const image = document?.photoURL;

    useEffect(() => {
        const fetchDocumentsByChallenge = async () => {
            try {
                const codeChallengeRef = firebase.firestore().collection('codechallenge');
                const querySnapshot = await codeChallengeRef.where('Challenge', '==', expected).get();
                const fetchedDocuments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setDocuments(fetchedDocuments);
                setTimeout(() => {
                    setloading(false);
                }, 2000);
            } catch (error) {
                console.log('Error fetching documents:', error);
            }
        };

        fetchDocumentsByChallenge();

    }, [expected]);

    const handleJoin = async (id, challenger) => {
        try {
            const codeChallengeRef = firebase.firestore().collection('codechallenge').doc(id);
            await codeChallengeRef.delete();

            history.push('/codeide');
        } catch (error) {
            console.log('Error deleting document:', error);
        }
    };

    const handleDeny = async (id, challenger) => {
        try {
            const codeChallengeRef = firebase.firestore().collection('codechallenge').doc(id);
            await codeChallengeRef.delete();

        } catch (error) {
            console.log('Error deleting document:', error);
        }
    }

    return (
        <>
            <Header as='h2' style={{ marginLeft: '20px', fontSize: '28px', marginBottom: '20px', fontFamily: 'Poppins' }}>
                <FontAwesomeIcon icon={faBell} style={{ marginRight: '20px' }} />
                <Header.Content>
                    Notifications
                    <Header.Subheader style={{ fontFamily: 'Poppins' }}>Manage your preferences..</Header.Subheader>
                </Header.Content>
            </Header>

            {loading === true && (
                <div style={{ fontSize: '80px', alignContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                    <Comment
                        visible={true}
                        height="60"
                        width="100"
                        ariaLabel="comment-loading"
                        wrapperStyle={{}}
                        wrapperClass="comment-wrapper"
                        color="#fff"
                        backgroundColor="#8d69f1"
                    />
                    <p style={{ fontSize: '22px' }} >Wait a Second !!</p>
                </div>
            )}
            {loading === false && documents.length > 0 && (
                <div style={{ fontFamily: 'Poppins', borderTop: '1px solid lightgrey', paddingTop: '28px', marginLeft: '90px', fontFamily: 'Poppins' }}>
                    <Card.Group>
                        {documents.map((document) => (
                            <Card key={document.id}>
                                <Avatar
                                    size={260}
                                    src={document.Challenger.photoURL}
                                    alt="Mentor"
                                    style={{ textdecoration: 'none', fontFamily: 'Poppins', margin: 'auto', marginTop: '18px', marginBottom: '3px', display: 'block', objectFit: 'cover' }}
                                    circle
                                />
                                <Card.Content>
                                    <Card.Header style={{ fontFamily: 'Poppins' }}>{document.Challenger.displayName}</Card.Header>
                                    <Card.Meta style={{ fontSize: '25px', fontFamily: 'Poppins' }}>
                                        {document.Challenger.points} <FontAwesomeIcon icon={faExplosion} style={{ fontSize: '25px', marginLeft: '5px' }} />
                                    </Card.Meta>
                                    <Card.Description style={{ fontFamily: 'Poppins' }}>
                                        {document.Challenger.displayName} is challenging you for <strong>" CODEPAIR "</strong>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                        <Button basic color='green' style={{ fontFamily: 'Poppins' }} onClick={() => handleJoin(document.id, document.Challenger)}>
                                            JOIN
                                        </Button>
                                        <Button basic color='red' style={{ fontFamily: 'Poppins' }} onClick={() => handleDeny(document.id, document.Challenger)}>
                                            DENY
                                        </Button>
                                    </div>
                                </Card.Content>
                            </Card>
                        ))}
                    </Card.Group>
                </div>
            )}
            {loading === false && documents.length === 0 && (
                <>

                    <p style={{ fontFamily: 'Poppins', marginLeft: '700px', color: 'grey', fontSize: '20px' }}>No Notifications ! !</p>
                </>
            )}

            {/* Details of the current user */}
            <div style={{ marginTop: '200px' }}>
                <Header as='h2' style={{ marginLeft: '20px', fontSize: '28px', marginBottom: '20px', fontFamily: 'Poppins' }}>
                <FontAwesomeIcon icon={faIdCardClip} style={{marginRight:'20px'}}/>

                    <Header.Content>
                        My Profile
                        <Header.Subheader style={{ fontFamily: 'Poppins' }}>View your Profile. .</Header.Subheader>
                    </Header.Content>
                </Header>
            </div>
            <div style={{ fontFamily: 'Poppins', borderTop: '1px solid lightgrey', paddingTop: '28px', marginLeft: '90px', fontFamily: 'Poppins' }}></div>
            {/* Expanding the details */}
            {loading === true && (
                
          <div style={{ fontSize: '80px', alignContent: 'center', textAlign: 'center', alignItems: 'center' }}>
                    <LineWave
                        height="160"
                        width="300"
                        color="#4fa94d"
                        ariaLabel="line-wave"
                        wrapperStyle={{marginLeft:'680px'}}
                        wrapperClass=""
                        visible={true}
                        
                        firstLineColor="#8d69f1"
                        middleLineColor="#8d69f1"
                        lastLineColor="#8d69f1"
                    />
                    <p style={{ fontSize: '22px' }} >Good Things Do Take Time ..</p>
                    </div>
                
            )}
            {loading === false && (<div style={{ background: '#ECF0F1', paddingBottom: '40px', paddingTop: '1px',borderRadius:'20px' ,marginBottom:'30px'}}>
                <h2 class="ui header" style={{ marginLeft: '150px', marginTop: '6px' }}>
                    <img src={image} class="ui circular image" />
                    {username}
                </h2>
               
                <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '22px', marginLeft: '180px', marginTop: '20px' }}>Email: {user.email}</p>
                <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '22px', marginLeft: '180px', marginTop: '20px' }}>Points: {points}</p>
                {projjoined !== '' && (
                    <>
                        <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '22px', marginLeft: '180px', marginTop: '20px' }}>Project Joined: {projjoined}</p>
                    </>
                )}
                {projjoined === '' && (
                    <>
                        <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '22px', marginLeft: '180px', marginTop: '20px' }}>Project Joined: Please Join a Project </p>
                    </>
                )}
                {mentor === true && (
                    <>
                        <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '22px', marginLeft: '180px', marginTop: '20px' }}> Mentor : Yes You are mentoring others </p>
                    </>
                )}
                {mentor === false && (
                    <>
                        <p style={{ color: 'grey', fontFamily: 'Poppins', fontSize: '22px', marginLeft: '180px', marginTop: '20px' }}> Mentor : You cannot mentor now </p>
                    </>
                )}
                <div style={{alignContent:'center',textAlign:'center',alignItems:'center'}}>
                <p style={{color: 'grey', fontFamily: 'Poppins', fontSize: '17px', marginTop: '32px'}}> Sorry! Currently we are not giving option to edit , Hope to get it in Future</p>
                 </div>
            </div>)}



        </>
    );
}
