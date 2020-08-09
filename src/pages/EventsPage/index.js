import React, { useState, useMemo } from 'react'
import api from '../../services/api'
import {Container, Form, FormGroup, Input, Label, Button, Alert, 
  DropdownItem, DropdownMenu, DropdownToggle, ButtonDropdown} from 'reactstrap'
import cameraIcon from '../../assets/camera.png'
import "./events.css"

export default function EventsPage({ history }) {
  const [machine, setMachine] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [noun, setNoun] = useState('')
  const [date, setDate] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dropdownOpen, setOpen] = useState(false)

  const toggle = () => setOpen(!dropdownOpen)

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  const submitHandler = async (evt) => {
    evt.preventDefault()
    const user_id = localStorage.getItem('user')

    const eventData = new FormData()

    eventData.append("machine", machine)
    eventData.append("stock", stock)
    eventData.append("description", description)
    eventData.append("location", location)
    eventData.append("thumbnail", thumbnail)
    eventData.append("noun", noun)
    eventData.append("date", date)

    try {
      if (machine !== "" &&
        stock !== "" &&
        description !== "" &&
        location !== "" &&
        noun !== "" &&
        date !== "" &&
        thumbnail !== null
      ) {
        await api.post("/event", eventData, { headers: { user_id } })
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
        }, 4000)

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

  return (
    <Container>
      <h3>Add a Part</h3>
      <Form onSubmit={submitHandler}>
        <div className="input-group">
          <FormGroup>
            <Label>Upload Image: </Label>
            <Label id='thumbnail' style={{backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
            <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
            <img src={ cameraIcon} style={{ maxWidth: "50px" }} alt="upload icon" />
            </Label>
          </FormGroup>
          <FormGroup>
            <Label>Machine: </Label>
            <Input id="machine" type="text" value={machine} placeholder={'machine type'} onChange={(evt) => setMachine(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Nomenclature: </Label>
            <Input id="noun" type="text" value={noun} placeholder={'name of part'} onChange={(evt) => setNoun(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Stock Number: </Label>
            <Input id="stock" type="text" value={stock} placeholder={'stock number'} onChange={ (evt) => setStock(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Location: </Label>
            <Input id="location" type="text" value={location} placeholder={'location'} onChange={ (evt) => setLocation(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Description: </Label>
            <Input id="description" type="text" value={description} placeholder={'description'} onChange={ (evt) => setDescription(evt.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label>Date: </Label>
            <Input id="date" type="date" value={date} onChange={ (evt) => setDate(evt.target.value)}/>
          </FormGroup>
        </div>
        <FormGroup>
          <Button className="submit-btn">
            Add Part
          </Button>
        </FormGroup>
        <FormGroup>
          <Button className="secondary-btn" onClick={ () => history.push("/dashboard") }>
            Dashboard
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
