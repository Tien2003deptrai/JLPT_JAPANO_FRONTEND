import TimerDisplay from './TimerDisplay'

const QuestionNavigator = ({
  groupedQuestions = [],
  answers = {},
  startTime,
  time_limit,
  onTimeEnd = () => { },
}) => {
  const validTimeLimit = time_limit && time_limit > 0 ? time_limit : 60
  const validStartTime = startTime || new Date().toISOString()

  return (
    <div className="bg-white border border-gray-200 p-5 rounded-lg w-full lg:w-60 shadow-lg sticky top-6 max-h-[90vh] overflow-y-auto">
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center gap-2 border-2 border-yellow-500 text-yellow-500 px-10 py-1 rounded-3xl font-medium text-xl shadow-md">
          <TimerDisplay
            initialTime={validStartTime}
            time_limit={validTimeLimit}
            onTimeEnd={onTimeEnd}
          />
        </div>
      </div>

      {groupedQuestions.map((group, groupIdx) => (
        <div key={groupIdx} className="mb-6">
          <div className="text-gray-800 font-bold mb-3 text-base">
            問題{groupIdx + 1}:
          </div>
          <div className="grid grid-cols-4 gap-3">
            {group.map((q, idx) => (
              <div
                key={q._id}
                onClick={() => {
                  const el = document.getElementById(
                    `q-${q._id}`
                  )
                  if (el)
                    el.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                }}
                className={`cursor-pointer w-10 h-10 rounded-full text-base font-semibold flex items-center justify-center border-2 transition select-none shadow-sm
                                ${answers[q._id]
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'text-blue-700 border-blue-400 hover:bg-blue-50'
                  }`}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuestionNavigator
