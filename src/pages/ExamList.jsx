import { useExamList } from '../hooks/useExam'
import { useNavigate } from 'react-router-dom'

const ExamList = () => {
  const { data: exams, isLoading: isExamLoading } = useExamList()
  const navigate = useNavigate()

  if (isExamLoading)
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-lg">Đang tải danh sách bài thi...</p>
      </div>
    )

  if (!exams || exams.length === 0)
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-gray-600 font-semibold mb-2">
          Chưa có bài thi nào
        </h2>
        <p className="text-gray-500">Vui lòng quay lại sau hoặc liên hệ quản trị viên.</p>
      </div>
    )

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={() => navigate(`/exam/doing/${exam.id}`)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate(`/exam/doing/${exam.id}`)
              }
            }}
            role="button"
            aria-label={`Bắt đầu làm bài thi ${exam.title}`}
          >
            <div>
              <h3 className="text-lg font-bold text-gray-600 mb-2">{exam.title}</h3>
              <p className="text-gray-600 text-sm mb-4 min-h-[60px]">{exam.description}</p>
              <div className="flex justify-between text-gray-500 text-sm font-medium">
                <span>🕒 Thời gian: {exam.timeLimit} phút</span>
                <span>🏁 Level: {exam.level}</span>
              </div>
            </div>
            <button
              className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/exam/doing/${exam.id}`)
              }}
              aria-label={`Bắt đầu làm bài thi ${exam.title}`}
            >
              Bắt đầu thi
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExamList
