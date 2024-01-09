import React from "react";

export const Contact = () => {
  const teamMembers = [
    { name: 'Melaany Anandanadeswaran', email: 'manandanadeswaran@torontomu.ca' },
    { name: 'Graham Roebuck', email: 'groebuck@torontomu.ca' },
    { name: 'Sakshi Shah', email: 'sakshi.shah@torontomu.ca' },
    { name: 'Hunter Shiells', email: 'hshiells@torontomu.ca' },
    { name: 'Ariba Siddiqi', email: 'ariba.siddiqi@torontomu.ca' },
  ];

  return (
    <div class="card bg-secondary">
      <div class="card-body">
        <h3>Contact Us</h3>
        <ul>
          {teamMembers.map((member, index) => (
            <li key={index}>
              {member.name}:<br></br> <a href={`mailto:${member.email}`}>{member.email}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
}



