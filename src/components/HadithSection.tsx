const HadithSection = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full" dir="rtl">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
        فضل غرس الأشجار في الإسلام 🌳
      </h2>

      <div className="space-y-6 text-right">
        {/* First Hadith */}
        <div className="bg-green-50 rounded-xl p-4 border-r-4 border-green-600">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-2">
            🔹عن أنس بن مالك رضي الله عنه قال 🎙️: قال رسول الله ﷺ ✍️
          </p>
          <p className="text-base md:text-lg font-semibold text-gray-800 leading-relaxed mb-2">
            "ما من مسـلم يغرس غرسا، أو يزرع زرعا، فيأكل منه طير أو إنسان أو بهيمة، إلا كان له به صدقة"
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            رواه البخاري 2320📒
          </p>
        </div>

        {/* Second Hadith */}
        <div className="bg-blue-50 rounded-xl p-4 border-r-4 border-blue-600">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-2">
            🔹وِعن أنس بن مالك رضي الله عنه، عن النبي صلى الله عليه وسلم قال:
          </p>
          <p className="text-base md:text-lg font-semibold text-gray-800 leading-relaxed mb-2">
            "إن قامت الساعة وفي يد أحدكم فسيلة فليغرسها"
          </p>
          <p className="text-xs md:text-sm text-gray-600">
            رواه الإمام أحمد.📒
          </p>
        </div>

        {/* Explanation */}
        <div className="bg-orange-50 rounded-xl p-4 border-r-4 border-orange-600">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            ⬅️هذا الحديث يبين فضل غرس الأشجار والزرع، وأن كل من يستفيد منها له أجر صدقة، فبادر إلى ماينفعك من صدقات جاريات قبل فوات الاوان ..✅
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 text-center">
          <p className="text-sm md:text-base font-semibold text-gray-800 leading-relaxed">
            ✅ساهموا في هذه المبادرة بارك الله فيكم جميعا وجزاكم الله كل خير ورزقكم الجنة .. 🌹
          </p>
        </div>
      </div>
    </div>
  );
};

export default HadithSection;
