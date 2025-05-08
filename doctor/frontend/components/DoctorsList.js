import React, { useState } from 'react';
import { doctors } from '../data/doctors';
import AppointmentForm from './AppointmentForm';
import './DoctorsList.css';

function DoctorsList() {
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleBookAppointment = (appointment) => {
    alert(`Appointment booked with Dr. ${appointment.doctorName} on ${appointment.date} at ${appointment.time}`);
  };

  return (
    <div className="doctors-page">
      <div className="hero-section">
        <h1>Find & Book Your Doctor</h1>
        <p>Quality healthcare from the comfort of your home</p>
      </div>
      
      <div className="doctors-container">
        <h2 className="section-title">Our Specialists</h2>
        <p className="section-subtitle">Book an appointment with our expert doctors</p>
        
        <div className="doctors-grid">
          {doctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="card-image">
                <img src={doctor.image} alt={doctor.name} />
                <div className="specialty-badge">{doctor.specialty}</div>
              </div>
              <div className="card-content">
                <h3>Dr. {doctor.name}</h3>
                <p className="availability">{doctor.availability}</p>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                  <span className="rating-value">4.8</span>
                </div>
                <button 
                  className="book-btn"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowForm(true);
                  }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <AppointmentForm
          doctor={selectedDoctor}
          onClose={() => setShowForm(false)}
          onBook={handleBookAppointment}
        />
      )}
    </div>
  );
}

export default DoctorsList;