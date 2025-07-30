import { useEffect, useRef, useState } from 'react'

const TimerDisplay = ({ initialTime, time_limit = 60, onTimeEnd = () => { } }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isValid, setIsValid] = useState(false)
  const [displayTime, setDisplayTime] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    if (!initialTime || !time_limit || time_limit <= 0) {
      setIsValid(false)
      setDisplayTime(`${time_limit || 60}:00`)
      return
    }

    try {
      const now = Date.now()
      const startTime = new Date(initialTime).getTime()

      if (isNaN(startTime)) {
        setIsValid(false)
        setDisplayTime(`${time_limit}:00`)
        return
      }

      const timeLimitMs = time_limit * 60 * 1000
      const elapsed = now - startTime
      const remaining = timeLimitMs - elapsed

      if (remaining <= 0) {
        setTimeLeft(0)
        setIsValid(false)
        setDisplayTime('00:00')
        return
      }

      setTimeLeft(remaining)
      setIsValid(true)

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1000) {
            clearInterval(timerRef.current)
            setIsValid(false)
            setDisplayTime('00:00')
            onTimeEnd()
            return 0
          }
          return prev - 1000
        })
      }, 1000)

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }
      }
    } catch (error) { 
      setIsValid(false)
      setDisplayTime(`${time_limit}:00`)
    }
  }, [initialTime, time_limit, onTimeEnd])

  useEffect(() => {
    if (isValid) {
      const safeRemainingMs = Math.max(0, timeLeft)
      const minutes = Math.floor(safeRemainingMs / 60000)
      const seconds = Math.floor((safeRemainingMs % 60000) / 1000)
      setDisplayTime(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }
  }, [timeLeft, isValid])

  if (!isValid) {
    return <span className="text-xl text-yellow-500">{displayTime}</span>
  }

  return (
    <span className="text-xl text-yellow-500">{displayTime}</span>
  )
}

export default TimerDisplay
