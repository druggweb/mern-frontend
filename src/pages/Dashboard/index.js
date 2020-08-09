import React, {useEffect, useState} from 'react'
import api from '../../services/api'
import moment from 'moment'
import './dashboard.css'
import { Button, ButtonGroup } from 'reactstrap';

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const user_id = localStorage.getItem('user')
  //const [cSelected, setCSelected] = useState([]);
  const [rSelected, setRSelected] = useState(null);

  useEffect(() => {
    getEvents()
    // eslint-disable-next-line
  }, [])

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const getEvents = async (filter) => {
    const url = filter ? `/dashboard/${filter}` : '/dashboard'
    const response = await api.get(url, { headers: { user_id } })

    setEvents(response.data)
  }

  return (
    <>
      <div>Filter:
        <ButtonGroup>
          <Button color="primary" onClick={ () => filterHandler(null) } active={ rSelected === null }>All Machines</Button>
          <Button color="primary" onClick={ () => filterHandler("dbcs") } active={ rSelected === 'dbcs' }>DBCS</Button>
          <Button color="primary" onClick={ () => filterHandler("dbcs6") } active={ rSelected === 'dbcs6' }>DBCS-6</Button>
          <Button color="primary" onClick={ () => filterHandler("diossc") } active={ rSelected === 'diossc' }>DIOSS-C</Button>
          <Button color="primary" onClick={ () => filterHandler('diossb') } active={ rSelected === 'diossb' }>DIOSS-B</Button>
        </ButtonGroup>
        
      </div>
      <ul className="events-list">
        {events.map(event => (
          <li key={event._id}>
            <header style={ { backgroundImage: `url(${event.thumbnail_url})` } } />
            <strong>{event.noun}</strong>
            <span>Machine Type: {event.machine}</span>
            <span>Stock Number: {event.stock}</span>
            <span>Location: {event.location}</span>
            <span>Description: {event.description}</span>
            <span>Updated: { moment(event.date).startOf('day').fromNow()}</span>
          </li>
        )) }
      </ul>
    </>
  )
}
