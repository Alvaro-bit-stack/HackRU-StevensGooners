import Image from 'next/image';

export default function HeroSection() {
  return (
    <section
      id="About_Me"
      className="flex flex-col md:flex-row items-stretch justify-between mx-81 my-16 gap-8 ">
      {/* ==== Left: Headshot ==== */}
      <div className="Headshot mb-8 md:mb-0 flex-shrink-0">
        <Image
          src="/IMG_9073.jpeg"
          alt="Headshot"
          width={600}
          height={600}
          className="rounded-xl shadow-2xl border border-gray-300 w-full h-full object-cover"
          priority
        />
      </div>

      {/* ==== Right: Text ==== */}
      <div className="flex-1 flex flex-col justify-between md:pl-20 py-10">
        <h1 className="text-4xl font-bold text-gray-800 text-center md:text-left mb-8">
          Class Student Canvas Assistant
        </h1>
        
        <div className="text-gray-700 text-2xl w-full flex-1">
          <p className="mb-8">
            A Canvas/AI-based tool designed to support students with:
          </p>
          <ul className="list-disc list-inside space-y-6 ml-2">
            <li>Calculating the grades needed to pass the class, based on current grades or hypothetical scenarios</li>
            <li>Identifying specific methods and approaches professors require for exams, especially when multiple problem-solving methods exist</li>
          </ul> 
        </div>
      </div>
    </section>
  );
}