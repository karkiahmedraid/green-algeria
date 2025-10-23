const HowToParticipate = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">How to Participate</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div>
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-green-600">1</span>
          </div>
          <p className="font-semibold text-gray-700 mb-2">Drag the Tree</p>
          <p className="text-gray-600 text-sm">Drag the tree icon below and drop it on your region in Algeria</p>
        </div>
        <div>
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-blue-600">2</span>
          </div>
          <p className="font-semibold text-gray-700 mb-2">Add Your Info</p>
          <p className="text-gray-600 text-sm">Enter your name and upload a photo from your planting event</p>
        </div>
        <div>
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl font-bold text-orange-600">3</span>
          </div>
          <p className="font-semibold text-gray-700 mb-2">Inspire Others</p>
          <p className="text-gray-600 text-sm">Hover over trees to see participants and their photos!</p>
        </div>
      </div>
    </div>
  );
};

export default HowToParticipate;
