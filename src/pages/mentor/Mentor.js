import { useDocument } from '../../hooks/useDocument'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useCollection } from '../../hooks/useCollection'
import { SpinnerLoading } from '../../components/spinner';
import React, { useState, useEffect } from 'react';

import "semantic-ui-css/components/message.min.css";
import HashLoader from "react-spinners/HashLoader";
//Components
import PanelSide from './Panle.js'
import MentorList from '../../components/MentorList'

// styles
import './Mentor.css'


export default function Mentor() {

    //hooks
    const { user } = useAuthContext();
    const { document } = useDocument('users', user.uid);
    const { documents } = useCollection('Mentors')
    console.log(documents);
    const [loading, setloading] = useState(true);


    useEffect(() => {

        setTimeout(() => {
            setloading(false);
        }, 2100);
    }, []);

    const check = document?.mentor_ship;
    console.log("its is wahat it is")
    return (
        <>

            {loading === true && (
                <div style={{ marginLeft: '820px', fontSize: '20px',marginTop:'300px',justifyContent: 'center', alignItems: 'center', }}>
                    <HashLoader color="#8d69f1" aria-label="Loading Spinner" />
                </div>
            )}
            {loading === false && (
                <>
                    <h2 className="page-title" style={{ margin: '0 0 8px 0', paddingBottom: '20px', fontFamily: 'Poppins' }}>Mentors</h2>
                    <br ></br>
                    {!check && (
                        <PanelSide />
                    )}

                    {/* <div
                        style={{
                            width: '100%',//Line Detailssss
                            padding: '20px 20px',
                            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
                        }}
                    >

                    </div> */}
                    
                    <div class="ui message" style={{ marginBottom: '20px', fontFamily: 'Poppins', paddingBottom: '20px' }}>
                        <div class="header">
                            Disclamer
                        </div>
                        <ul class="list" style={{ fontFamily: 'Poppins' }}>
                            <li> <p >
ProTag is solely dedicated to enhancing your experience. We don't take commissions from any party.</p></li>
                        </ul>
                    </div>

                    {documents && <MentorList mentors={documents} />}
                </>
            )}

        </>
    )
}
