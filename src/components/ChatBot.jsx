import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TbRobot, TbX, TbSparkles, TbChartBar, TbTarget } from 'react-icons/tb'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const {   
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      listening: '',
      reading: '',
      grammar: '',
      vocabulary: '',
      kanji: '',
      study_time: '',
      practice_jlpt: ''
    }
  })

  const onSubmit = async (data) => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const mockResult = {
        result: "Bạn cần cải thiện kỹ năng Listening và Vocabulary",
        plan: [
          "Dành 2 giờ mỗi ngày để luyện nghe",
          "Học thêm 20 từ vựng mới mỗi ngày",
          "Làm bài tập ngữ pháp 30 phút mỗi ngày",
          "Ôn tập kanji 15 phút mỗi ngày"
        ],
        links: [
          "Listening: https://www.youtube.com/watch?v=example1",
          "Vocabulary: https://www.youtube.com/watch?v=example2",
          "Grammar: https://www.youtube.com/watch?v=example3",
          "Kanji: https://www.youtube.com/watch?v=example4"
        ]
      }
      setAnalysisResult(mockResult)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleReset = () => {
    setAnalysisResult(null)
    reset()
  }

  const InputField = ({ label, name, placeholder, min = 0, max = 100, step = 1 }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        step={step}
        min={min}
        max={max}
        {...register(name, {
          required: 'Bắt buộc',
          min: { value: min, message: `Tối thiểu là ${min}` },
          max: { value: max, message: `Tối đa là ${max}` }
        })}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl text-sm bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[name] ? 'border-red-400' : 'border-gray-200'
          }`}
      />
      {errors[name] && (
        <p className="text-xs text-red-500">{errors[name].message}</p>
      )}
    </div>
  )

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-110"
        >
          <TbRobot size={28} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 max-h-[600px] z-40 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <TbRobot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">AI Sensei</h3>
                  <p className="text-xs text-gray-500">Tư vấn học tiếng Nhật</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
              >
                <TbX size={16} className="text-gray-600" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto" style={{ maxHeight: '500px' }}>
            {!analysisResult ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="bg-blue-100 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <TbChartBar className="text-blue-600" size={18} />
                    <span className="font-semibold text-blue-800 text-sm">Đánh giá năng lực</span>
                  </div>
                  <p className="text-sm text-gray-600">Nhập điểm số của bạn để AI phân tích và đưa ra lộ trình học tập phù hợp</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Listening" name="listening" placeholder="0-100" />
                  <InputField label="Reading" name="reading" placeholder="0-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Grammar" name="grammar" placeholder="0-100" />
                  <InputField label="Vocabulary" name="vocabulary" placeholder="0-100" />
                </div>

                <InputField label="Kanji" name="kanji" placeholder="0-100" />
                <InputField label="Study Time (giờ/ngày)" name="study_time" placeholder="1-24" max={24} step={0.5} />
                <InputField label="JLPT Practice Score" name="practice_jlpt" placeholder="0-180" max={180} />

                <button
                  type="submit"
                  disabled={isSubmitting || isAnalyzing}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                >
                  {isAnalyzing ? 'Đang phân tích...' : 'Phân tích ngay'}
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="bg-blue-100 p-5 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">Kết quả phân tích</h4>
                  <p className="text-gray-700">{analysisResult.result}</p>
                </div>

                <div className="bg-green-100 p-5 rounded-xl border border-green-200">
                  <h4 className="font-bold text-green-800 mb-3">Kế hoạch học tập</h4>
                  <ul className="space-y-2">
                    {analysisResult.plan.map((item, index) => (
                      <li key={index} className="text-gray-700 text-sm">
                        {index + 1}. {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-purple-100 p-5 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-purple-800 mb-3">Tài liệu gợi ý</h4>
                  <ul className="space-y-2">
                    {analysisResult.links.map((link, index) => {
                      const parts = link.split(':')
                      const label = parts[0]
                      const url = parts.slice(1).join(':').trim()
                      return (
                        <li key={index} className="flex justify-between items-center">
                          <span className="text-sm text-purple-700">{label}</span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-white bg-purple-500 px-3 py-1 rounded-full hover:bg-purple-600"
                          >
                            Xem
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button onClick={handleReset} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-xl">
                    Phân tích lại
                  </button>
                  <button onClick={() => setIsOpen(false)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl">
                    Hoàn thành
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBot
