
import { Persona, PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import { useState } from 'react';


export default function PersonaDetails({ project }) {
  const [renderDetails] = useState(true);

  return (
    <Persona
      // {{PersonaPresence.user.online}}
      // d.online?PersonaPresence.online:PersonaPresence.offline
      imageUrl={project.projectOwner.photoURL}
      size={PersonaSize.size72}
      hidePersonaDetails={!renderDetails}
      presence={PersonaPresence.away}
      imageAlt="Annie Lindqvist, status is online"
      initialsColor='blue'
      text={project.projectOwner.displayName}
      secondaryText={`${project.industry.value} Expert`}
      // tertiaryText=""
      optionalText="Available at 4:00pm"
      imageInitials={{ text: 'AL' }}
    />
  )
}