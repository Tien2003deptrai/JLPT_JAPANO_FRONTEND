import React from 'react'

const SubmitConfirmModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Xác nhận nộp bài</h2>
        <p className="mb-6 text-gray-600">Bạn có chắc chắn muốn nộp bài không?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmitConfirmModal
