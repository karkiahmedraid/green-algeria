const HowToParticipate = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full" dir="rtl">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
        كيفية المشاركة
      </h2>

      {/* Horizontal layout for mobile, vertical for desktop */}
      {/* Always centered layout */}
      <div className="flex justify-start lg:justify-center items-center w-full overflow-x-auto lg:overflow-x-visible">
        <div className="flex flex-row lg:flex-col gap-6 pb-4 lg:pb-0 px-4 lg:px-0">
          <div className="flex flex-col justify-center text-center min-w-[200px] lg:min-w-0 flex-shrink-0">
            <div className="bg-green-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl lg:text-2xl font-bold text-green-600">
                1
              </span>
            </div>
            <p className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">
              اسحب الشجرة
            </p>
            <p className="text-gray-600 text-xs lg:text-sm">
              اسحب أيقونة الشجرة وضعها على منطقتك في الجزائر
            </p>
          </div>

          <div className="flex flex-col justify-center text-center min-w-[200px] lg:min-w-0">
            <div className="bg-blue-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl lg:text-2xl font-bold text-blue-600">
                2
              </span>
            </div>
            <p className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">
              أضف معلوماتك
            </p>
            <p className="text-gray-600 text-xs lg:text-sm">
              أدخل اسمك وارفع صورة من حدث الغرس الخاص بك
            </p>
          </div>

          <div className="flex flex-col justify-center text-center min-w-[200px] lg:min-w-0">
            <div className="bg-orange-100 w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl lg:text-2xl font-bold text-orange-600">
                3
              </span>
            </div>
            <p className="font-semibold text-gray-700 mb-2 text-sm lg:text-base">
              ألهم الآخرين
            </p>
            <p className="text-gray-600 text-xs lg:text-sm">
              مرر فوق الأشجار لرؤية المشاركين وصورهم!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToParticipate;
