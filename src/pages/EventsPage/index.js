import React, { useState, useMemo } from 'react'
import api from '../../services/api'
import { Container, Form, FormGroup, Input, Label, Button, Alert } from 'reactstrap'
import cameraIcon from '../../assets/camera.png'
import "./events.css"

// EventsPage will show all the events
export default function EventsPage() {
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [noun, setNoun] = useState('')
  const [date, setDate] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail])

  // console.log(noun, stock, location, description)

  const submitHandler = async (evt) => {
    evt.preventDefault()
    const user_id = localStorage.getItem('user')

    const eventData = new FormData()

    eventData.append("stock", stock)
    eventData.append("description", description)
    eventData.append("location", location)
    eventData.append("thumbnail", thumbnail)
    eventData.append("noun", noun)
    eventData.append("date", date)

    try {
      if (stock !== "" &&
        description !== "" &&
        location !== "" &&
        noun !== "" &&
        date !== "" &&
        thumbnail !== null
      ) {
        console.log("Part has been sent")
        await api.post("/event", eventData, { headers: { user_id } })
        console.log(eventData)
        console.log("Part has been saved")
      } else {
        setErrorMessage(true)
        setTimeout(() => {
          setErrorMessage(false)
        }, 2000)

        console.log("Missing required data")
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
      <FormGroup>
        <Label>Upload Image: </Label>
        <Label id='thumbnail' style={{backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''}>
        <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])} />
        <img src={ cameraIcon} style={{ maxWidth: "50px" }} alt="upload icon" />
        </Label>
      </FormGroup>
      <FormGroup>
        <Label>Nomenclature: </Label>
        <Input id="noun" type="text" value={noun} placeholder={'enter name of part'} onChange={(evt) => setNoun(evt.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>Stock Number: </Label>
        <Input id="stock" type="text" value={stock} placeholder={'enter part stock number'} onChange={ (evt) => setStock(evt.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>Location: </Label>
        <Input id="location" type="text" value={location} placeholder={'enter part location'} onChange={ (evt) => setLocation(evt.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>Description: </Label>
        <Input id="description" type="text" value={description} placeholder={'enter part description'} onChange={ (evt) => setDescription(evt.target.value)}/>
      </FormGroup>
      <FormGroup>
        <Label>Date: </Label>
        <Input id="date" type="date" value={date} onChange={ (evt) => setDate(evt.target.value)}/>
      </FormGroup>
      <Button type="submit">
        Add Part
      </Button>
      </Form>
      { errorMessage ? (
        <Alert className="event-validation" color="danger"> Missing required information</Alert>
      ) : "" }
    </Container>
  )
}
