import React from 'react'
import Cookies from 'js-cookie';
import { EventResponse } from '@/interfaces/types';
import { useQuery } from 'react-query';
import EventCard from './event-card';

const getEvents = async (): Promise<EventResponse[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/comunicaciones/eventos/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${Cookies.get("token")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener los eventos");
  }
  return response.json();
};

const EventsSections = () => {
  const { data: events, isLoading } = useQuery(["events"], getEvents)

  return (
    <div>
      {events && events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

export default EventsSections;
