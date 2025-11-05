import Image from 'next/image';

const ProjectCard = ({ title, description, image, imageOnLeft = true, className = '' }) => {
  const imageSection = image ? (
    <div className="relative w-[290px] h-full overflow-hidden rounded-2xl">
      <Image
        src={image}
        alt={title}
        fill
        sizes="290px"
        className="object-cover"
      />
    </div>
  ) : null;

  const contentSection = (
    <div className="flex flex-col justify-center gap-2 flex-1">
      <h3 className="text-2xl font-bold leading-tight">
        {title}
      </h3>
      <p className="text-xl leading-relaxed text-gray-600">
        {description}
      </p>
    </div>
  );

  return (
    <div className={`bg-white rounded-[32px] p-6 flex items-center gap-6 w-full ${className}`}>
      {imageOnLeft && imageSection}
      {contentSection}
      {!imageOnLeft && imageSection}
    </div>
  );
};

export default ProjectCard;

