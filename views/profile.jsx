import React, { useState, useEffect } from 'react';

const MemberInfo = ({ title, memberID }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [dietType, setDietType] = useState('');
    const [dietitian, setDietitian] = useState('');

    useEffect(() => {
        // Using template literals for dynamic memberID
        fetch(`/members/${memberID}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Assuming data is the object containing member information
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setGender(data.gender);
                setDietType(data.dietType);
                setDietitian(data.dietitian);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [memberID]); // Adding memberID to the dependency array to refetch when it changes

    return (
        <div>
            <h1>{title}</h1>
            <h2>Member Information</h2>
            <p>First Name: {firstName}</p>
            <p>Last Name: {lastName}</p>
            <p>Gender: {gender}</p>
            <p>Diet Type: {dietType}</p>
            <p>Dietitian: {dietitian}</p>
        </div>
    );
};

export default MemberInfo;
