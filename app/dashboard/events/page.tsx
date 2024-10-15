import MyCalendar from '@/components/calendar/calendar'
import { Button } from '@/components/ui/servicios/button'
import React from 'react'

export default function page() {
  return (
    <div>
      <MyCalendar />
      {/* <div className='justify-center align-middle flex'>
        <Button children={'Ver Eventos'} onClick={() => console.log('click')} />
      </div> */}
    </div>
  )
}