const HowToParticipate = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center ">
        How to Participate
      </h2>
      
      {/* Horizontal layout for mobile, vertical for desktop */}
{/* Always centered layout */}
<div className="flex justify-center items-center w-full">
  <div className="flex flex-row lg:flex-col gap-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 justify-center items-center">
    
    <div className="flex flex-col justify-center text-center min-w-[200px] lg:min-w-0">
      <div className="bg-green-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-xl lg:text-2xl font-bold text-green-600">1</span>
      </div>
      <p className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">Drag the Tree</p>
      <p className="text-gray-600 text-xs lg:text-sm">Drag the tree icon and drop it on your region in Algeria</p>
    </div>

    <div className="flex flex-col justify-center text-center min-w-[200px] lg:min-w-0">
      <div className="bg-blue-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-xl lg:text-2xl font-bold text-blue-600">2</span>
      </div>
      <p className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">Add Your Info</p>
      <p className="text-gray-600 text-xs lg:text-sm">Enter your name and upload a photo from your planting event</p>
    </div>

    <div className="flex flex-col justify-center text-center min-w-[200px] lg:min-w-0">
      <div className="bg-orange-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-xl lg:text-2xl font-bold text-orange-600">3</span>
      </div>
      <p className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">Inspire Others</p>
      <p className="text-gray-600 text-xs lg:text-sm">Hover over trees to see participants and their photos!</p>
    </div>

  </div>
</div>

    </div>
  );
};

export default HowToParticipate;
