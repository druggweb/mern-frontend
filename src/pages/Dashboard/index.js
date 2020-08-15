import React, {useEffect, useState} from 'react'
import api from '../../services/api'
import moment from 'moment'
import './dashboard.css'
import { Button, ButtonGroup, Alert } from 'reactstrap';

export default function Dashboard({history}) {
  const [events, setEvents] = useState([])
  const user_id = localStorage.getItem('user')
  const [rSelected, setRSelected] = useState(null)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getEvents()
    // eslint-disable-next-line
  }, [])

  const filterHandler = (query) => {
    setRSelected(query)
    getEvents(query)
  }

  const myPartsHandler = async () => {
    setRSelected('myparts')
    const response = await api.get('/user/events', { headers: { user_id } })

    setEvents(response.data)
  }

  const getEvents = async (filter) => {
    const url = filter ? `/dashboard/${filter}` : '/dashboard'
    const response = await api.get(url, {headers: { user_id } })

    setEvents(response.data)
  }

  const deleteEventHandler = async (eventId) => {
    try {
      await api.delete(`/event/${eventId}`)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        filterHandler(null)
      }, 2500)

    } catch (error) {
      setError(true)
      setTimeout(() => {
        setError(false)
      }, 2000)
    }
  }

  return (
    <>
      <div className="filter-panel">
        <ButtonGroup>
          <Button color="primary" onClick={ () => filterHandler(null) } active={ rSelected === null }>All Machines</Button>
          <Button color="primary" onClick={myPartsHandler} active={ rSelected === 'myparts' }>My Parts</Button>
          <Button color="primary" onClick={ () => filterHandler("DBCS") } active={ rSelected === 'DBCS' }>DBCS</Button>
          <Button color="primary" onClick={ () => filterHandler("DBCS-6") } active={ rSelected === 'DBCS-6' }>DBCS-6</Button>
          <Button color="primary" onClick={ () => filterHandler("DIOSS-C") } active={ rSelected === 'DIOSS-C' }>DIOSS-C</Button>
          <Button color="primary" onClick={ () => filterHandler('DIOSS-B') } active={ rSelected === 'DIOSS-B' }>DIOSS-B</Button>
        </ButtonGroup>
        <Button color="info" onClick={ () => history.push('events') }>Add Part</Button>
      </div>
      <ul className="events-list">
        {events.map(event => (
          <li key={event._id}>
            <header style={{ backgroundImage: `url(${event.thumbnail_url})` }}>
              {event.user === user_id ? <div><Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}>
              Delete</Button></div> : ""}
            </header>
            <strong>{event.noun}</strong>
            <span>Machine: {event.machine}</span>
            <span>Stock Number: {event.stock}</span>
            <span>Location: {event.location}</span>
            <span>Description: {event.description}</span>
            <span>Updated: {moment(event.date).format('l')}</span>
          </li>
        )) }
      </ul>
      {error ? (
        <Alert className="event-validation" color="danger"> Error deleting event!</Alert>
      ) : ""}
      {success ? (
        <Alert className="event-validation" color="success"> The event was deleted successfully!</Alert>
      ) : ""}
    </>
  )
}
