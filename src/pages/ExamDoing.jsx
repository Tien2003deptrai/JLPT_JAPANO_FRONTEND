import QuestionNavigator from '../components/practice/question/QuestionNavigator'
import SubmitConfirmModal from '../components/practice/question/SubmitConfirmModal'
import QuestionSection from '../components/practice/question/QuestionSection'
import { useExamTake, useSubmitExam, useExamById, useExamHistory, useStartExam } from '../hooks/useExam'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'

const ExamDoing = () => {
  const { exam_id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const attemptIdFromState = location.state?.attemptId || null
  const [attemptId, setAttemptId] = useState(attemptIdFromState)
  const [examStarted, setExamStarted] = useState(false)
  const [error, setError] = useState(null)

  const { data: examDetail, isLoading: isExamDetailLoading } = useExamById(exam_id)
  const { data: history, isLoading: isHistoryLoading } = useExamHistory(exam_id)
  const { mutateAsync: startExam, isLoading: isStarting } = useStartExam()

  const { data, isLoading: isExamTakingLoading, error: examError } = useExamTake(exam_id)
  const { mutate: submitExam, isLoading: isSubmitting } = useSubmitExam()

  const [exam, setExam] = useState(null)
  const [startExamData, setStartExamData] = useState(null)
  const [answers, setAnswers] = useState({})
  const answersRef = useRef({})
  const [groupedQuestions, setGroupedQuestions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const questionRefs = useRef({})

  const handleStartExam = async () => {
    if (!examDetail?.id) {
      setError('Không tìm thấy ID bài thi')
      return
    }

    if (!examDetail.questions || examDetail.questions.length === 0) {
      setError('Bài thi này hiện không có câu hỏi nào. Vui lòng liên hệ giáo viên.')
      return
    }

    const existingAttempt = history?.find(
      (attempt) => attempt.status !== 'completed'
    )
    if (existingAttempt) {
      setAttemptId(existingAttempt._id)
      setExamStarted(true)
      return
    }

    if (history?.some((h) => h.status === 'completed')) {
      setError('Bạn đã hoàn thành bài thi này và không thể làm lại.')
      return
    }

    try {
      const res = await startExam(examDetail.id)
      setAttemptId(res.attemptId)
      setStartExamData(res)
      setExamStarted(true)
    } catch (error) {
      console.error('Lỗi khi startExam:', error)
      setError(error?.response?.data?.message || 'Không thể bắt đầu bài thi')
    }
  }

  useEffect(() => {
    if (isExamDetailLoading || isHistoryLoading) return

    if (attemptIdFromState) {
      setExamStarted(true)
      return
    }

    const existingAttempt = history?.find(
      (attempt) => attempt.status !== 'completed'
    )

    if (existingAttempt) {
      setAttemptId(existingAttempt._id)
      setExamStarted(true)
      return
    }

    if (history?.some((h) => h.status === 'completed')) {
      setError('Bạn đã hoàn thành bài thi này và không thể làm lại.')
      return
    }

    if (examDetail && !examStarted && history?.length === 0) {
      handleStartExam()
    }
  }, [examDetail, history, isExamDetailLoading, isHistoryLoading, attemptIdFromState, examStarted])

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      const currentAnswers = answersRef.current

      if (!attemptId) {
        setErrorMessage('Không tìm thấy ID lần thi. Vui lòng thử lại.')
        return
      }

      if (!exam?.questions) {
        setErrorMessage('Không tìm thấy câu hỏi trong bài thi.')
        return
      }

      const allQuestionIds = exam.questions
        .flatMap((section) => section.childQuestions || [])
        .map((child) => child._id)

      const unansweredQuestionId = allQuestionIds.find(
        (questionId) => !currentAnswers[questionId]
      )

      if (unansweredQuestionId && !isAutoSubmit) {
        setErrorMessage(
          'Bạn cần trả lời đầy đủ tất cả câu hỏi trước khi nộp bài.'
        )
        return
      }

      const getAnswerValue = (questionId, answer) => {
        const question = exam.questions
          .flatMap((section) => section.childQuestions || [])
          .find((child) => child._id === questionId)

        if (!question) return answer
        return String(answer || '').toLowerCase()
      }

      const formattedAnswers = exam.questions.map((section) => {

        return {
          parentQuestionId: section._id,
          childAnswers: (section.childQuestions || []).map((child) => {
            const answer = getAnswerValue(
              child._id,
              currentAnswers[child._id] ?? ''
            )

            return {
              id: child._id,
              userAnswer: answer,
            }
          }),
        }
      })

      try {
        submitExam(
          { attemptId, answers: formattedAnswers },
          {
            onSuccess: (res) => {
              if (res?.attemptId) {
                setTimeout(() => {
                  navigate(
                    `/exam/result/${res.attemptId}`,
                    { state: { res } }
                  )
                }, 500)
                toast.success('Nộp bài thành công!')
              } else {
                setErrorMessage(
                  'Không nhận được ID bài thi. Vui lòng thử lại.'
                )
                toast.error('Có lỗi khi nộp bài thi.')
              }
            },
            onError: (err) => {
              const message =
                err?.response?.data?.message ||
                err.message ||
                'Lỗi không xác định'
              setErrorMessage(
                isAutoSubmit
                  ? `Hết thời gian! Bài thi đã được gửi nhưng có lỗi: ${message}`
                  : `Lỗi khi nộp bài: ${message}`
              )
              toast.error(`Lỗi khi nộp bài: ${message}`)

              // Sử dụng attemptId thay vì exam._id
              if (attemptId) {
                navigate(`/exam/result/${attemptId}`, {
                  replace: true,
                })
              } else {
                navigate('/exam', { replace: true })
              }
            },
          }
        )
      } catch (error) {
        setErrorMessage('Lỗi hệ thống khi nộp bài: ' + error.message)
        toast.error('Lỗi hệ thống khi nộp bài.')
      }
    },
    [attemptId, exam, navigate, submitExam]
  )

  useEffect(() => {
    if (!examStarted || isExamTakingLoading || !data) return

    const { exam: examData, attemptId: fetchedAttemptId } = data
    if (!examData) {
      setErrorMessage('Không thể tải thông tin bài thi')
      return
    }

    const finalAttemptId = attemptId || fetchedAttemptId
    setAttemptId(finalAttemptId)
    setExam(examData)
    setErrorMessage('')

    const grouped = examData.questions.map((q) => [
      ...(q.childQuestions || []),
    ])
    setGroupedQuestions(grouped)

    const refs = {}
    examData.questions.forEach((q) => {
      q.childQuestions?.forEach((child) => {
        refs[child._id] = React.createRef()
      })
    })
    questionRefs.current = refs

    const savedAnswers = localStorage.getItem(`answers_${finalAttemptId}`)

    if (savedAnswers) {
      try {
        const parsed = JSON.parse(savedAnswers)
        setAnswers(parsed)
        answersRef.current = parsed
      } catch (err) {
        console.error('Lỗi khi parse đáp án từ localStorage:', err)
      }
    } else {
      setAnswers({})
      answersRef.current = {}
    }
  }, [data, isExamTakingLoading, attemptId, examStarted])

  const handleAnswerChange = (qid, val) => {

    setAnswers((prev) => {
      const updated = { ...prev, [qid]: val }
      answersRef.current = updated
      localStorage.setItem(
        `answers_${attemptId}`,
        JSON.stringify(updated)
      )
      return updated
    })
  }

  if (isExamDetailLoading || isHistoryLoading || isStarting) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-lg text-gray-600">
          Đang tải thông tin bài thi...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {examDetail?.title || 'Bài thi'}
          </h1>
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
            {error}
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-300"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    )
  }

  if (isExamTakingLoading) {
    return <div className="text-center p-8">Đang tải đề thi...</div>
  }

  if (examError) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi!',
      text: `"${examError?.response.data.message}".`,
      confirmButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/exam')
      }
    })
  }

  if (!exam) {
    return (
      <div className="text-center p-8 text-red-600">
        {errorMessage || 'Không tìm thấy bài thi'}
      </div>
    )
  }

  return (
    <div className="max-h-full mx-auto">
      <div className="flex justify-between items-center px-6 py-4 bg-gray-500 text-white rounded-b">
        <h1 className="text-3xl font-bold pl-20"> {exam.title}</h1>
        <div className="flex justify-between items-center pr-20 gap-4">
          <h1 className="text-xs px-3 border-2 border-white rounded-2xl py-2 font-bold">Cấp độ: {exam.level}</h1>
          <h1 className="text-xs px-3 border-2 border-white rounded-2xl py-2 font-bold">Thời gian: {exam.time_limit} phút</h1>
          <h1 className="text-xs px-3 border-2 border-white rounded-2xl py-2 font-bold">Tổng điểm: {exam.totalPoints || 0} điểm</h1>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-4 rounded mt-4 mx-6">
          {errorMessage}
        </div>
      )}

      <div className="flex px-6 h-[calc(100vh-100px)] overflow-hidden gap-6 mt-6 ">
        <div className="w-60 bg-white shadow rounded-lg overflow-y-auto sticky top-6 max-h-[calc(100vh-120px)]">
          <QuestionNavigator
            groupedQuestions={groupedQuestions}
            answers={answers}
            startTime={startExamData?.startTime || data?.startTime}
            time_limit={startExamData?.time_limit || data?.time_limit || exam?.time_limit || 60}
            onTimeEnd={() => {
              handleSubmit(true)
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-4">
          {(exam.questions || []).map((q, idx) => (
            <div key={q._id}>
              <QuestionSection
                section={q}
                sectionIndex={idx}
                answers={answers}
                onAnswerChange={handleAnswerChange}
                refs={questionRefs.current}
              />
            </div>
          ))}

          <div className="mt-8 text-right mb-24">
            <button
              onClick={() => setShowModal(true)}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 font-semibold disabled:bg-gray-400"
            >
              {isSubmitting ? 'Đang nộp bài...' : 'Nộp bài'}
            </button>
          </div>
        </div>
      </div>

      <SubmitConfirmModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false)
          handleSubmit()
        }}
      />
    </div>
  )
}

export default ExamDoing
