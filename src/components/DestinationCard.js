import AEMImage from "./AEMImage";
import "./Destinations.css"

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";

function DestinationCard({ data }) {
  const imagePath = data.heroImage?._path;

  return (
    <div className="card">
      <div className="imageWrapper">
        {imagePath ? (
          <AEMImage
            src={`${AEM_HOST}${imagePath}`}
            alt={data.destinationName}
          />
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <div className="overlay">
        <div className="cardTitle">{data.destinationName}</div>
        <div className="cardTagline">{data.tagLine}</div>
      </div>
    </div>
  );
}

export default DestinationCard;