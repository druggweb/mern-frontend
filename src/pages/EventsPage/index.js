import React, { useState, useEffect } from 'react'
import api from '../../services/api'
import {Container, Form, FormGroup, Input, Button, Alert, 
  DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown} from 'reactstrap'
import "./events.css"

export default function EventsPage({ history }) {
  const [machine, setMachine] = useState('Machine')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [noun, setNoun] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dropdownOpen, setOpen] = useState(false)
  const user = localStorage.getItem('user')

  useEffect(() => {
    if (!user) history.push('/login')
    // eslint-disable-next-line
  }, [])

  const toggle = () => setOpen(!dropdownOpen)

  const submitHandler = async (evt) => {
    evt.preventDefault()

    const eventData = new FormData()

    eventData.append("machine", machine)
    eventData.append("stock", stock)
    eventData.append("description", description)
    eventData.append("location", location)
    eventData.append("noun", noun)
    eventData.append("date", date)

    try {
      if (machine !== "Machine" &&
        stock !== "" &&
        description !== "" &&
        location !== "" &&
        noun !== "" &&
        date !== null
      ) {
        await api.post("/event", eventData, { headers: { user } })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          history.push("/")
        }, 2000)

      } else {
        setError(true)
        setTimeout(() => {
          setError(false)
        }, 4000)
      }
    } catch (error) {
      Promise.reject(error);
      console.log(error);
    }  
  }

  const machineEventHandler = (machine) => setMachine(machine)
  //console.log(machine)

  return (
    <Container>
      <h3>Add a Part</h3>
      <Form onSubmit={submitHandler}>
        <div className="input-group">
          
          <FormGroup>
            <Input id="noun" type="text" value={noun} placeholder={'name of part'} onChange={(evt) => setNoun(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Input id="stock" type="text" value={stock} placeholder={'stock number'} onChange={(evt) => setStock(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Input id="location" type="text" value={location} placeholder={'location'} onChange={(evt) => setLocation(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Input id="description" type="text" value={description} placeholder={'description'} onChange={(evt) => setDescription(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Input id="date" type="date" value={date} onChange={ (evt) => setDate(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
              <Button id="caret" value={machine} disabled>{machine}</Button>
              <DropdownToggle caret />
              <DropdownMenu>
                <DropdownItem onClick={() => machineEventHandler('DBCS')}>DBCS</DropdownItem>
                <DropdownItem onClick={() => machineEventHandler('DBCS-6')}>DBCS-6</DropdownItem>
                <DropdownItem onClick={() => machineEventHandler('DIOSS-C')}>DIOSS-C</DropdownItem>
                <DropdownItem onClick={() => machineEventHandler('DIOSS-B')}>DIOSS-B</DropdownItem>
                <DropdownItem onClick={() => machineEventHandler('AFSM-100')}>AFSM-100</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
          </FormGroup>
        </div>
        <FormGroup>
          <Button className="submit-btn">
            Add Part
          </Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={() => history.push("/")}>
            Cancel
          </Button>
        </FormGroup>
      </Form>
      { error ? (
        <Alert className="event-validation" color="danger"> Missing required information</Alert>
      ) : "" }
      { success ? (
        <Alert className="event-validation" color="success"> Part added successfully!</Alert>
      ) : "" }
    </Container>
  )
}
