import React from 'react'

const QuestionSection = ({
  section,
  sectionIndex,
  answers,
  onAnswerChange,
}) => {
  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F']

  const handleOptionChange = (childId, optionId) => {
    onAnswerChange(childId, optionId)
  }

  return (
    <div className="space-y-10 mb-2">
      {section?.title && (
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-300 pb-3">
          {section.title}
        </h2>
      )}

      <div
        key={section._id}
        className="border border-gray-200 rounded-lg shadow-md bg-white"
      >
        {section.parentQuestion && (
          <div className="bg-white text-black text-center px-6 py-4 text-md font-medium border-b border-gray-700 rounded-t-lg">
            <strong className="text-black">
              言語知識(文字・漢字・文法)- 読解
            </strong>
          </div>
        )}

        <div className="bg-gray-500 text-white px-6 py-3 text-sm border-b border-gray-700">
          問題{sectionIndex + 1}の文章を読んで、後の問いに対する答えとして最もよいものを、1・2・3・4から一つ選びなさい。
        </div>

        {section.paragraph && (
          <div className="bg-gray-50 px-6 py-4 text-base text-gray-900 border-b border-gray-200">
            {section.paragraph}
          </div>
        )}

        {(section.childQuestions || []).map((child, childIdx, arr) => {
            if (!child._id) {
            return null
          }

          return (
            <div
              key={child._id}
              id={`q-${child._id}`}
              className={`px-6 py-6 ${childIdx !== arr.length - 1
                ? 'border-b-2 border-dashed border-gray-200'
                : ''
                }`}
            >
              <div className="mb-4 text-base font-semibold text-gray-800">
                {childIdx + 1}. {child.content}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {child.options.map((opt, optIdx) => {
                  return (
                    <label
                      key={`${child._id}-${opt._id}`}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q-${child._id}`}
                        value={opt.id || opt._id}
                        checked={answers[child._id] === (opt.id || opt._id)}
                        onChange={() => handleOptionChange(child._id, opt.id || opt._id)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-300"
                      />
                      <span className="text-gray-800 text-base">
                        <strong className="mr-2">{optionLabels[optIdx]}.</strong> {opt.text}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionSection
