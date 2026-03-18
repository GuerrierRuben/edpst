"use client";

export default function EventCard({ date, title, time, description, image, category }) {
  const displayImage = (image && image.length > 0) ? image : "/images/1.png";
  const displayCategory = category || "Événement";

  return (
    <div className="bg-white rounded-2xl overflow-hidden card-hover border border-gray-100" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            if (e.target.src !== window.location.origin + "/images/1.png") {
              e.target.src = "/images/1.png";
            }
          }}
        />
        {/* Category badge over image */}
        <div className="absolute bottom-3 left-3">
          <span className="badge-category">{displayCategory}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date */}
        <p className="text-xs text-gray-400 font-medium mb-2 tracking-wide">
          {date?.day && date?.month ? `${new Date().getFullYear()}-${date.month}-${String(date.day).padStart(2, '0')}` : time || ''}
        </p>

        {/* Title */}
        <h3 className="text-[1.05rem] font-bold text-[#1a1a2e] mb-3 leading-snug hover:text-[#7B2FBE] transition-colors duration-200">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-[#7B2FBE] flex-shrink-0">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
          </svg>
          <span className="truncate">{description ? description.substring(0, 40) + '...' : 'Lieu à confirmer'}</span>
        </div>
      </div>
    </div>
  );
}